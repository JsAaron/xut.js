/**
 *
 *  动作对象
 *      1 跳转页面
 *      2 打开系统程序
 *      3 加载子文档
 *
 */
export class ActionClass {

    constructor(data) {
        _.extend(this, data);
        this.id = parseInt(this.id);
        this.actType = this.type;
        var results = Xut.data.query('Action', this.id, 'activityId')
        this.init(results)
    }


    init(results) {
        var para1, dbId
        para1 = results.para1 //跳转参数
            // para2 = results.para2 //ppt
        dbId = results._id


        var actionType = parseInt(results.actionType);

        //跳转或打开本地程序
        switch (actionType) {
            case 0:
                this.toPage(para1);
                break;
            case 1:
                if (Xut.plat.isBrowser) return;
                //打开插件
                Xut.Plugin.OpenApp.openAppAction(para1, function() {}, function() {});
                break;
            case 2:
                //子文档处理
                this.loadSubdoc(para1, dbId);
                break;
        }

        this.state = true;
    }


    open() {
        // this.state = true;
        //打开插件
        // Xut.Plugin.OpenApp.openAppAction(para1, function() {}, function() {});
    }

    //跳转页面
    toPage(para1) {
        para1 = JSON.parse(para1);
        if (para1.seasonId) {
            Xut.View.GotoSlide(para1.seasonId, para1.chapterId);
        } else {
            //向下兼容
            Xut.View.GotoSlide(para1);
        }
    }

    //加载子文档
    loadSubdoc(path, dbId) {
        var self = this,
            wapper;

        //配置子文档加载路径
        window.XXTSUbDOC = {
            'path': path,
            'dbId': dbId
        }

        this.subPath = path;

        //构建子文档的容器
        wapper = this.$wapper = this.createWapper();

        Xut.nextTick({
            'container': $(this.rootNode),
            'content': wapper
        }, function() {
            self.destroyCache();
        });
    }

    //iframe加载完毕
    iframeComplete() {
        var self = this;
        //关闭事件
        Xut.one('subdoc:dropApp', function() {
            self.destroyCache('iframe', self.iframe[0].contentWindow);
        });
        //隐藏全局工具栏
        Xut.View.HideToolbar();
        Xut.isRunSubDoc = true;
        self.$wapper.css({
            'opacity': '1'
        });
    }

    //获取iframe颞部window上下文
    destroyCache(contentWindow) {
        var self = this,
            iframe;
        if (contentWindow) {
            iframe = true;
        } else {
            contentWindow = window
        }

        function clear() {
            Xut.View.ShowToolbar()
            self.$wapper.remove();
            self.$wapper = null;
            self.iframe = null;
            self.rootNode = null;
            Xut.isRunSubDoc = false;
        }
        try {
            contentWindow.require("Dispatcher", function(c) {
                if (iframe) {
                    //子文档操作
                    if (c.stopHandles()) {
                        c.promptMessage('再按一次将退出子目录！')
                    } else {
                        clear();
                    }
                } else {
                    //父级操作
                    c.stopHandles()
                }
            })
        } catch (err) {
            clear();
        }
    }

    createWapper() {
        var zIndex,
            str,
            dom,
            ifr;
        //层级设定
        if (this.zIndex === 0) {
            zIndex = this.zIndex;
        } else {
            zIndex = this.zIndex || Xut.zIndexlevel();
        }
        this.zIndex = zIndex;
        str = '<div id="Subdoc_{0}" style="z-index:{1};width:{2}px;height:{3}px;top:{4}px;left:{5}px;position:absolute;opacity:0" >' +
            '</div>';
        dom = String.format(str,
            this.id, zIndex, this.screenSize.width, this.screenSize.height, 0, 0
        );
        ifr = this.iframe = this.createIframe();
        return $(dom).append(ifr);
    }

    /**
     * 加载iframe
     * @return {[type]} [description]
     */
    createIframe() {
        var me = this,
            path = 'content/subdoc/' + this.subPath + '/index.html?xxtParaIn=' + this.key,
            ifr = document.createElement('iframe');
        ifr.id = 'iframe_' + this.id;
        ifr.src = path;
        ifr.style.width = '100%';
        ifr.style.height = '100%';
        ifr.sandbox = "allow-scripts allow-same-origin";
        ifr.frameborder = 0;
        if (ifr.attachEvent) {
            ifr.attachEvent('onload', function() {
                me.iframeComplete();
            });
        } else {
            ifr.onload = function() {
                me.iframeComplete();
            };
        }
        return $(ifr);
    }
}