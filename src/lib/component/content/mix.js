/**
 * 填充缺少的content对象
 * @return {[type]} [description]
 */

/**
 * 按照shift取出执行代码
 * @return {[type]} [description]
 */
function segmentation(delayBind) {
    var exetBind;
    while (exetBind = delayBind.shift()) {
        exetBind();
    }
}


export function Mix(base, waitCreateContent, exitCallback) {
    var abstractContents = base.abstractContents,
        contentsFragment = base.relatedData.contentsFragment,
        pid = base.pid,
        pageType = base.pageType,
        //因为要dom去重,要处理创建的内容
        execWaitCreateContent = function() {
            var willCreate = [],
                prefix;
            _.each(waitCreateContent, function(contentId) {
                prefix = base.makePrefix('Content', base.pid, contentId)
                if (!contentsFragment[prefix]) { //如果dom不存在,则创建
                    willCreate.push(contentId)
                }
            })
            return willCreate;
        }


    /**
     * 合并创建节点
     **/
    function fillStructure(callback) {
        conStructure({
            'dydCreate': true,
            createContentIds: execWaitCreateContent,
            pid: pid,
            pageType: pageType
        }, function(contentDas, cachedContentStr, containerPrefix) {
            callback(contentDas, $(cachedContentStr), containerPrefix)
        })
    }

    /**
     * 填充空节点数据
     * contentsFragment临时文档碎片
     * @return {[type]}       [description]
     */
    function fillFragment(cachedContentStr) {
        _.each(cachedContentStr, function(ele, index) {
            contentsFragment[ele.id] = ele;
        })
    }

    /**
     * 填充作用域对象
     * @return {[type]} [description]
     */
    function fillAssistContents() {
        _.each(abstractContents, function(scope, index) {
            var scopeObj;
            if (!scope.$contentProcess) {
                scopeObj = base.createHandlers(scope, 'waitCreate');
                abstractContents.splice(index, 1, scopeObj) //替换作用域对象
            }
        })
    }

    /**
     * 重构动态事件
     * 需要跳到不同的作用域对象
     * @return {[type]}           [description]
     */
    function fillEvent() {
        var collectEventRelated = base.relatedData.collectEventRelated,
            eventObj, parent,
            delayBind = []; //延时绑定
        _.each(waitCreateContent, function(contentId) {
            eventObj = collectEventRelated[contentId]
                //事件对象存在,并且没有绑定事件
            if (eventObj && !eventObj.isBind) {
                parent = eventObj.parent;
                parent.createEvent.call(parent)
                delayBind.push(function() {
                    parent.bindEvent.call(parent)
                })
            }
        })
        return delayBind;
    }

    /**
     * 清理
     * @return {[type]} [description]
     */
    function clean() {
        base.waitCreateContent = null;
    }

    /**
     * 绘制显示
     * @return {[type]} [description]
     */
    function toRedraw(cachedContentStr) {
        Xut.nextTick({
            'container': base.rootNode,
            'content': cachedContentStr
        }, function() {
            clean();
            //绑定滑动isScroll
            segmentation(base.relatedCallback.iScrollHooks)
            exitCallback();
        });
    }


    function pocessContent(contentDas, cachedContentStr, containerPrefix) {

        //填充数据
        cachedContentStr && fillFragment(cachedContentStr)

        // 填充动画对象
        fillAssistContents();

        /**
         * 填充事件
         * 执行后绑定
         * 跨作用域
         */
        segmentation(fillEvent());

        /**
         * 开始初始化构建
         */
        self.initEffects();

        /**
         * 绘制页面
         */
        if (cachedContentStr) {
            toRedraw(cachedContentStr)
        } else {
            clean();
            exitCallback();
        }
    }

    /**
     * 需要创建节点
     */
    if (execWaitCreateContent && execWaitCreateContent.length) {
        fillStructure(pocessContent)
    } else {
        //不需要创建节点
        pocessContent();
    }
}
