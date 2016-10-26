/*********************************************************************
 *              场景容器构造器
 *          1 构件页面级容器
 *          2 翻页全局事件
 *
 **********************************************************************/

import Observer from '../observer/index'
import Dispatcher from './dispatcher/index'
import delegateHooks from './delegate/hooks'
import closestProcessor from './delegate/closest'

import {
    defProtected as def,
    defAccess
} from '../util/index'

import GlobalEvent from '../swipe/index.js'
import setDynamicApi from '../dynamic.api'

/**
 * 配置多页面参数
 * @return {[type]} [description]
 */
const configMultiple = (options) => {
    //如果是epub,强制转换为单页面
    if (Xut.IBooks.Enabled) {
        options.multiplePages = false
    } else {
        //判断多页面情况
        //1 数据库定义
        //2 系统优化
        options.multiplePages =
            options.flipMode ?
            options.flipMode :
            options.pageMode ? true : false
    }
}


/**
 * 判断处理那个页面层次
 * 找到pageType类型
 * 项目分4个层
 * page mater page浮动 mater浮动
 * 通过
 * 因为冒泡的元素，可能是页面层，也可能是母板上的
 * @return {Boolean} [description]
 */
const isBelong = (target) => {
    var pageType = 'page';
    if (target.dataset && target.dataset.belong) {
        pageType = target.dataset.belong;
    }
    return pageType
}


/**
 * 阻止元素的默认行为
 * 在火狐下面image带有href的行为
 * 会自动触发另存为
 * @return {[type]} [description]
 *
 * 2016.3.18
 * 妙妙学 滚动插件默认行为被阻止
 *
 * 2016.7.26
 * 读库强制PC模式了
 */
const preventDefault = (evtObj, target) => {
    //var tagName = target.nodeName.toLowerCase();
    if (Xut.plat.isBrowser && !Xut.IBooks.Enabled && !window.MMXCONFIG && !window.DUKUCONFIG) {
        evtObj.preventDefault && evtObj.preventDefault();
    }
}


export default class Mediator extends Observer {

    constructor(parameter) {

        super()

        const vm = this

        //配置文件
        const options = vm.options = _.extend({
            //是否多场景加载
            //单页场景 false
            //多场景   true
            'multiScenario': false,
            //是否为连续页面
            //通过pageMode的参数定义
            'multiplePages': false
        }, parameter, {
            flipMode: Xut.config.flipMode
        })


        //配置多页面参数
        configMultiple(options)

        const $globalEvent = vm.$globalEvent = new GlobalEvent(options)
        const $dispatcher = vm.$dispatcher = new Dispatcher(vm)

        //如果是主场景,才能切换系统工具栏
        if (options.multiplePages) {
            this.addTools(vm)
        }

        //事件句柄对象
        let handlerObj = null;

        /**
         * 过滤器.全局控制函数
         * return true 阻止页面滑动
         */
        $globalEvent.$watch('onFilter', (hookCallback, point, evtObj) => {
            let target = point.target;
            //阻止默认行为
            preventDefault(evtObj, target);
            //页面类型
            let pageType = isBelong(target);
            //冒泡的ul根节点
            let parentNode = $globalEvent.findBubbleRootNode(point, pageType);
            //执行过滤处理
            handlerObj = closestProcessor.call(parentNode, point, pageType);
            //停止翻页,针对content对象可以拖动,滑动的情况处理
            if (!handlerObj || handlerObj.attribute === 'disable') {
                hookCallback();
            }
        });


        /**
         * 触屏滑动,通知pageMgr处理页面移动
         * @return {[type]} [description]
         */
        $globalEvent.$watch('onMove', (data) => {
            $dispatcher.movePageBase(data)
        });


        /**
         * 触屏松手点击
         * 无滑动
         */
        $globalEvent.$watch('onTap', (pageIndex, hookCallback) => {
            if (handlerObj) {
                if (handlerObj.handlers) {
                    handlerObj.handlers(handlerObj.elem, handlerObj.attribute, handlerObj.rootNode, pageIndex)
                } else {
                    if (!Xut.Contents.Canvas.getIsTap()) {
                        vm.$emit('change:toggleToolbar')
                    }
                }
                handlerObj = null;
                hookCallback();
            }
        });


        /**
         * 触屏滑动,通知ProcessMgr关闭所有激活的热点
         * @return {[type]}          [description]
         */
        $globalEvent.$watch('onUpSlider', (pointers) => {
            $dispatcher.suspendPageBase(pointers)
        });


        /**
         * 翻页动画完成回调
         * @return {[type]}              [description]
         */
        $globalEvent.$watch('onComplete', (...arg) => {
            $dispatcher.completePageBase(...arg)
        });


        /**
         * 切换页面
         * @return {[type]}      [description]
         */
        $globalEvent.$watch('onJumpPage', (data) => {
            $dispatcher.gotoPageBase(data);
        });


        /**
         * 退出应用
         * @return {[type]}      [description]
         */
        $globalEvent.$watch('onDropApp', (data) => {
            window.GLOBALIFRAME && Xut.publish('magazine:dropApp');
        });


        /**
         * 母板移动反馈
         * 只有存在data-parallaxProcessed
         * 才需要重新激活对象
         * 删除parallaxProcessed
         */
        $globalEvent.$watch('onMasterMove', (hindex, target) => {
            if (/Content/i.test(target.id) && target.getAttribute('data-parallaxProcessed')) {
                $dispatcher.masterMgr && $dispatcher.masterMgr.reactivation(target);
            }
        });

        /**
         * 销毁接口api
         * @type {[type]}
         */
        this.destoryDynamicApi = setDynamicApi(this)
    }


    /**
     * 系统工具栏
     */
    addTools(vm) {

        _.extend(delegateHooks, {

            /**
             * li节点,多线程创建的时候处理滑动
             */
            'data-container' () {
                vm.$emit('change:toggleToolbar')
            },

            /**
             * 是背景层
             */
            'data-multilayer' () {
                //改变工具条状态
                vm.$emit('change:toggleToolbar')
            },

            /**
             * 默认content元素可以翻页
             */
            'data-behavior' (target, attribute, rootNode, pageIndex) {
                //没有事件的元素,即可翻页又可点击切换工具栏
                if (attribute == 'click-swipe') {
                    vm.$emit('change:toggleToolbar')
                }
            }
        })

    }

}


/**
 * 是否多场景模式
 */
defAccess(Mediator.prototype, '$multiScenario', {
    get: function() {
        return this.options.multiScenario
    }
})


/**
 * 动态注入对象接口
 * 注入对象管理,注册所有widget组件对象
 *  content类型  创建时注册
 *  widget类型   执行时注册
 *  widget 包括 视频 音频 Action 子文档 弹出口 类型
 *  这种类型是冒泡处理，无法传递钩子，直接用这个接口与场景对接
 */
defAccess(Mediator.prototype, '$injectionComponent', {
    set: function(regData) {
        var injection;
        if (injection = this.$dispatcher[regData.pageType + 'Mgr']) {
            injection.abstractAssistPocess(regData.pageIndex, function(pageObj) {
                pageObj.baseRegisterComponent.call(pageObj, regData.widget);
            })
        } else {
            console.log('注册injection失败,regData=' + regData)
        }
    }
});

/**
 * 得到当前的视图页面
 * @return {[type]}   [description]
 */
defAccess(Mediator.prototype, '$curVmPage', {
    get: function() {
        return this.$dispatcher.pageMgr.abstractGetPageObj(this.$globalEvent.getHindex());
    }
});


/**
 *  监听viewmodel内部的状态的改变,触发后传入值
 *
 *  与状态有关的change:
 *      翻页
 *          'flipOver' : function(pageIndex) {},
 *
 *      切换工具栏
 *          'toggleToolbar' : function(state, pointer) {},
 *
 *      复位工具栏
 *          'resetToolbar'  : function() {},
 *
 *      隐藏下一页按钮
 *          'hideNext'   : function(state) {},
 *
 *      显示下一页按钮
 *          'showNext'   : function() {}
 *
 *  与创建相关
 *      创建完毕回调
 *          'createComplete': null,
 *      创建后中断自动运行回调
 *          'suspendAutoCallback': null
 *
 */
def(Mediator.prototype, '$bind', function(key, callback) {
    var vm = this
    vm.$watch('change:' + key, function() {
        callback.apply(vm, arguments)
    })
})


/**
 * 创建页面
 * @return {[type]} [description]
 */
def(Mediator.prototype, '$init', function() {
    this.$dispatcher.initCreate();
});


/**
 * 运动动画
 * @return {[type]} [description]
 */
def(Mediator.prototype, '$run', function() {
    var vm = this;
    vm.$dispatcher.pageMgr.activateAutoRuns(
        vm.$globalEvent.getHindex(), Xut.Presentation.GetPageObj()
    )
});


/**
 * 复位对象
 * @return {[type]} [description]
 */
def(Mediator.prototype, '$reset', function() {
    return this.$dispatcher.pageMgr.resetOriginal(this.$globalEvent.getHindex());
});


/**
 * 停止所有任务
 * @return {[type]} [description]
 */
def(Mediator.prototype, '$suspend', function() {
    Xut.Application.Suspend({
        skipMedia: true //跨页面不处理
    })
})

/**
 * 销毁场景内部对象
 * @return {[type]} [description]
 */
def(Mediator.prototype, '$destroy', function() {
    this.$off(); //观察事件
    this.$globalEvent.destroy(); //全局事件
    this.$dispatcher.destroyPageBase(); //派发器
    this.$dispatcher = null;
    this.$globalEvent = null;
    this.destoryDynamicApi() //动态api
})
