/**
 * 页面模块
 * @param  {[type]}
 * @return {[type]}
 */
import { injectScript, extend } from '../util/index'
import { Abstract } from './abstract'
import { Page } from '../pagebase/page'
import { translation } from '../pagebase/translation'
//epub使用
import { addEdges } from '../util/edge'
//动作热热点派发 
import { suspend as _suspend, original as _original, autoRun as _autoRun } from '../scheduler/index'


function PageMgr(vm) {

    this.pageType = 'page';

    /**
     * 页面根节点
     * @type {[type]}
     */
    this.rootNode = vm.options.rootPage;

    /**
     * 抽象方法
     * 创建合集容器
     */
    this.abstractCreateCollection();
};



let PageMgrProto = PageMgr.prototype;


/****************************************************************
 *
 *                 对外接口
 *
 ***************************************************************/

//====================页面结构处理===========================

//创建页新的页面
PageMgrProto.create = function(dataOpts, pageIndex) {

    //生成指定页面对象
    var pageObjs = new Page(
        _.extend(dataOpts, {
            'pageType': this.pageType, //创建页面的类型
            'root': this.rootNode //根元素
        })
    )

    //增加页面管理
    this.abstractAddCollection(pageIndex, pageObjs);

    return pageObjs;
}

/**
 * 清理视频
 * @return {[type]} [description]
 */
function removeVideo(clearPageIndex) {
    //处理视频
    var pageId = Xut.Presentation.GetPageId(clearPageIndex);
    Xut.VideoManager.removeVideo(pageId);
}

//清理其中的一个页面
PageMgrProto.clearPage = function(clearPageIndex) {
    var pageObj;
    //清理视频
    // removeVideo(clearPageIndex);
    //销毁页面对象事件
    if (pageObj = this.abstractGetPageObj(clearPageIndex)) {
        //移除事件
        pageObj.baseDestroy();
        //移除列表
        this.abstractRemoveCollection(clearPageIndex);
    }
}

//销毁整个页面管理对象
PageMgrProto.destroy = function() {
    //清理视频
    removeVideo(Xut.Presentation.GetPageIndex());
    //清理对象
    this.abstractDestroyCollection();
    //清理节点
    this.rootNode = null;
}


/**
 * 检测脚本注入
 * @return {[type]} [description]
 */
function checkInjectScript(pageObject, type) {
    var code;
    if (code = pageObject.chapterDas[type]) {
        injectScript(code, type)
    }
}

/****************************************************************
 *
 *                 多线程任务片段调用
 *
 ***************************************************************/

/**
 * 设置中断正在创建的页面对象任务
 * @param {[type]}   currIndex [description]
 * @param {Function} callback  [description]
 */
PageMgrProto.suspendInnerCreateTasks = function(pointers) {
    var pageObj,
        self = this;
    [pointers.leftIndex, pointers.currIndex, pointers.rightIndex].forEach(function(pointer) {
        if (pageObj = self.abstractGetPageObj(pointer)) {
            pageObj.setTaskSuspend();
        }
    })
}

/**
 * 检测活动窗口任务
 * @return {[type]} [description]
 */
PageMgrProto.checkTaskCompleted = function(currIndex, callback) {
    var currPageObj,
        self = this;
    // console.log('激活活动任务',currIndex)
    if (currPageObj = self.abstractGetPageObj(currIndex)) {
        currPageObj.checkThreadTask(function() {
            // console.log('11111111111当前页面创建完毕',currIndex+1)
            callback(currPageObj)
        })
    }
}

/**
 * 检测后台预创建任务
 * @return {[type]} [description]
 */
PageMgrProto.checkPreforkTasks = function(resumePointer, preCreateTask) {
    var resumeObj, resumeCount;
    if (!resumePointer.length) {
        resumePointer = [resumePointer];
    }
    resumeCount = resumePointer.length;
    while (resumeCount--) {
        if (resumeObj = this.abstractGetPageObj(resumePointer[resumeCount])) {
            resumeObj.createPreforkTasks(function() {
                // console.log('后台处理完毕')
            }, preCreateTask)
        }
    }
}


/************************************************************
 *
 *                       页面滑动
 *
 * **********************************************************/
PageMgrProto.move = function(leftIndex, currIndex, rightIndex, direction, speed, action, moveDistance) {

    //////////////
    //找到需要滑动的页面 //
    //////////////
    function findPage() {
        return [
            this.abstractGetPageObj(leftIndex),
            this.abstractGetPageObj(currIndex),
            this.abstractGetPageObj(rightIndex)
        ];
    }

    ///////////
    //开始移动页面 //
    ///////////
    _.each(findPage.call(this), function(pageObj, index) {
        if (pageObj) {
            //移动浮动页面容器
            var flaotElement;
            if (flaotElement = pageObj.floatContents.PageContainer) {
                translation[action].call(pageObj, moveDistance[index], speed, flaotElement)
            }
            //正常页面
            translation[action].call(pageObj, moveDistance[index], speed)
        }
    })
}


/****************************************************************
 *
 *                  流程状态控制
 *
 ***************************************************************/

/**
 * 触屏翻页开始
 * 1 中断所有任务
 * 2 停止热点对象运行
 *     停止动画,视频音频等等
 */
PageMgrProto.suspend = function(pointers) {
    var stopPointer = pointers.stopPointer,
        suspendPageObj = this.abstractGetPageObj(stopPointer),
        prveChpterId = suspendPageObj.baseGetPageId(stopPointer);

    //翻页结束脚本
    checkInjectScript(suspendPageObj, 'postCode');

    //中断节点创建任务
    this.suspendInnerCreateTasks(pointers);

    //停止活动对象活动
    _suspend(suspendPageObj, prveChpterId);
}

/**
 * 复位初始状态
 * @return {[type]} [description]
 */
PageMgrProto.resetOriginal = function(pageIndex) {
    var originalPageObj, flaotElement;
    if (originalPageObj = this.abstractGetPageObj(pageIndex)) {
        if (flaotElement = originalPageObj.floatContents.PageContainer) {
            //floatPages设置的content溢出后处理
            //在非视区增加overflow:hidden
            //可视区域overflow:''
            flaotElement.css({
                'zIndex': 2000,
                'overflow': 'hidden'
            })
        }
        _original(originalPageObj);
    }
}

/**
 * 触屏翻页完成
 * 1 停止热点动作
 * 2 触发新的页面动作
 * @param  {[type]} prevPageIndex [上一页面]
 * @param  {[type]} currPageIndex [当前页码]
 * @param  {[type]} nextPageIndex [下一页页码]
 * @param  {[type]} suspendIndex  [停止动作的页码]因为要区分滑动的方向
 * @param  {[type]} createPointer [正在创建的页面]
 * @param  {[type]} direction     [滑动方向]
 */
PageMgrProto.autoRun = function(data) {

    var self = this;

    //检测当前页面构建任务的情况
    //如果任务没有完成，则等待任务完成
    this.checkTaskCompleted(data.currIndex, function(currPageObj) {

        //提升当前页面浮动对象的层级
        //因为浮动对象可以是并联的
        var flaotElement;
        if (flaotElement = currPageObj.floatContents.PageContainer) {
            flaotElement.css({
                'zIndex': 2001,
                'overflow': ''
            })
        }

        //IE上不支持蒙版效果的处理
        if (Xut.plat.noMaskBoxImage) {
            addEdges();
        }

        //构件完成通知
        data.buildComplete(currPageObj.scenarioId);

        //执行自动动作之前的脚本
        checkInjectScript(currPageObj, 'preCode');

        //热点状态复位
        self.resetOriginal(data.suspendIndex)

        //预构建背景
        preCreate('background');

        //等待动画结束后构建
        startAutoRun(currPageObj, data);
    });

    /**
     * 预执行背景创建
     * 支持多线程快速翻页
     * 1 初始化,或者快速翻页补全前后页面
     * 2 正常翻页创建前后
     */
    function preCreate(preCreateTask) {
        var resumePointer;
        if (data.isQuickTurn || !data.direction) {
            resumePointer = [data.prevIndex, data.nextIndex];
        } else {
            resumePointer = data.createPointer || data.nextIndex || data.prevIndex
        }
        self.checkPreforkTasks(resumePointer, preCreateTask);
    };


    //激活自动运行对象
    function startAutoRun(currPageObj, data) {

        //结束通知
        function complete() {
            data.processComplete();
            preCreate();
        }

        //如果页面容器存在,才处理自动运行
        var currRootNode = currPageObj.element
        if (!currRootNode) {
            return complete();
        }

        //运行动作
        function startRun() {
            _autoRun(currPageObj, data.currIndex, complete);
        }

        //运行如果被中断,则等待
        if (data.suspendCallback) {
            data.suspendCallback(startRun)
        } else {
            startRun();
        }
    }
}

//混入抽象接口方法
extend(PageMgr, Abstract)


export { PageMgr }
