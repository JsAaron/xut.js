/**
 * 页面模块
 * @param  {[type]}
 * @return {[type]}
 */
import { Abstract } from './abstract'
import { Pagebase } from '../../pagebase/pagebase'
import { addEdges } from '../../util/edge'
import { removeVideo } from '../../component/video/manager'
import { execScript } from '../../util/index'

import {
    $$suspend,
    $$original,
    $$autoRun
} from '../../command/index'


/**
 * 检测脚本注入
 * @return {[type]} [description]
 */
const runScript = (pageObject, type) => {
    const code = pageObject.chapterData[type]
    if (code) {
        execScript(code, type)
    }
}


export default class PageMgr extends Abstract {

    constructor(vm) {
        super()

        this.pageType = 'page';

        //页面根节点
        this.pagesNode = vm.options.rootPage;

        //创建合集容器
        this.abstractCreateCollection();
    }


    /**
     * 创建页新的页面
     * @param  {[type]} dataOpts  [description]
     * @param  {[type]} pageIndex [description]
     * @return {[type]}           [description]
     */
    create(dataOpts, pageIndex) {

        //生成指定页面对象
        const pageObjs = new Pagebase(
            _.extend(dataOpts, {
                'pageType': this.pageType, //创建页面的类型
                'rootNode': this.pagesNode //根元素
            })
        )

        //增加页面管理
        this.abstractAddCollection(pageIndex, pageObjs);

        return pageObjs;
    }


    /**
     * 移动页面
     * @return {[type]}
     */
    move({
        nodes,
        speed,
        action,
        moveDist,
        leftIndex,
        currIndex,
        rightIndex,
        direction
    }) {
        _.each([
            this.abstractGetPageObj(leftIndex),
            this.abstractGetPageObj(currIndex),
            this.abstractGetPageObj(rightIndex)
        ], function(pageObj, index) {
            if (pageObj) {
                let distance = moveDist[index]
                pageObj.movePageBaseContainer(action, distance, speed, moveDist[3])
            }
        })
    }


    /**
     * 触屏翻页开始
     * 1 中断所有任务
     * 2 停止热点对象运行
     *     停止动画,视频音频等等
     */
    suspend(pointers) {
        var stopPointer = pointers.stopPointer,
            suspendPageObj = this.abstractGetPageObj(stopPointer),
            prveChpterId = suspendPageObj.baseGetPageId(stopPointer);

        //翻页结束脚本
        runScript(suspendPageObj, 'postCode');

        //中断节点创建任务
        this.$$suspendInnerCreateTasks(pointers);

        //停止活动对象活动
        suspendPageObj.destroyPageAction()
        suspendPageObj.resetSwipeSequence()

        $$suspend(suspendPageObj, prveChpterId);
    }


    /**
     * 复位初始状态
     * @return {[type]} [description]
     */
    resetOriginal(pageIndex) {
        var originalPageObj, floatNode;
        if (originalPageObj = this.abstractGetPageObj(pageIndex)) {
            if (floatNode = originalPageObj.floatContents.PageContainer) {
                //floatPages设置的content溢出后处理
                //在非视区增加overflow:hidden
                //可视区域overflow:''
                floatNode.css({
                    'zIndex': 2000,
                    'overflow': 'hidden'
                })
            }
            $$original(originalPageObj);
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
    autoRun(data) {

        var self = this;

        /**
         * 预执行背景创建
         * 支持多线程快速翻页
         * 1 初始化,或者快速翻页补全前后页面
         * 2 正常翻页创建前后
         */
        const preCreate = function(preCreateTask) {
            var resumePointer;
            if (data.isQuickTurn || !data.direction) {
                resumePointer = [data.prevIndex, data.nextIndex];
            } else {
                resumePointer = data.createPointer || data.nextIndex || data.prevIndex
            }
            self._checkPreforkTasks(resumePointer, preCreateTask);
        };


        //激活自动运行对象
        const startAutoRun = function(currPageObj, data) {

            //结束通知
            function complete() {
                data.processComplete();
                preCreate();
            }

            //如果页面容器存在,才处理自动运行
            var currpagesNode = currPageObj.getContainsNode()
            if (!currpagesNode) {
                return complete()
            }

            //运行动作
            function startRun() {
                $$autoRun(currPageObj, data.currIndex, complete);
            }

            //运行如果被中断,则等待
            if (data.suspendCallback) {
                data.suspendCallback(startRun)
            } else {
                startRun();
            }
        }

        //检测当前页面构建任务的情况
        //如果任务没有完成，则等待任务完成
        this._checkTaskCompleted(data.currIndex, function(currPageObj) {

            currPageObj.createPageAction()

            //提升当前页面浮动对象的层级
            //因为浮动对象可以是并联的
            var floatNode;
            if (floatNode = currPageObj.floatContents.PageContainer) {
                floatNode.css({
                    'zIndex': 2001,
                    'overflow': ''
                })
            }

            //IE上不支持蒙版效果的处理
            if (Xut.style.noMaskBoxImage) {
                addEdges();
            }

            //构件完成通知
            data.buildComplete(currPageObj.scenarioId);

            //执行自动动作之前的脚本
            runScript(currPageObj, 'preCode');

            //热点状态复位
            self.resetOriginal(data.suspendIndex)

            //预构建背景
            preCreate('background');

            //等待动画结束后构建
            startAutoRun(currPageObj, data);
        })

    }


    /**
     * 销毁整个页面管理对象
     * @param  {[type]} clearPageIndex [description]
     * @return {[type]}                [description]
     */
    clearPage(clearPageIndex) {
        const pageObj = this.abstractGetPageObj(clearPageIndex)
            //销毁页面对象事件
        if (pageObj) {
            //移除事件
            pageObj.baseDestroy();
            //移除列表
            this.abstractRemoveCollection(clearPageIndex);
        }
    }


    /**
     * 销毁整个页面管理对象
     * @return {[type]} [description]
     */
    destroy() {
        //清理视频
        var pageId = Xut.Presentation.GetPageId(Xut.Presentation.GetPageIndex())

        removeVideo(pageId)

        //清理对象
        this.abstractDestroyCollection();
        //清理节点
        this.pagesNode = null;
    }


    /**
     * 设置中断正在创建的页面对象任务
     * @param {[type]}   currIndex [description]
     * @param {Function} callback  [description]
     */
    $$suspendInnerCreateTasks(pointers) {
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
    _checkTaskCompleted(currIndex, callback) {
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
    _checkPreforkTasks(resumePointer, preCreateTask) {
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

}
