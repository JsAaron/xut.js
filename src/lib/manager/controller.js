/*********************************************************************
 *              场景容器构造器
 *          1 构件页面级容器
 *          2 翻页全局事件
 *
 **********************************************************************/

// 定义访问器
import {
    defProtected as def,
    defAccess
} from '../util/index'
// 观察
import { Observer } from '../observer/index'
//全部交互通知
import { GlobalEvent } from './globalevent.js'
//动态api
import { overrideApi } from './overrideapi'
//调度任务
import { Scheduler } from './schedule'
//事件钩子
import { delegateHooks } from './hooks'
//委托处理器
import { filterProcessor } from './filter'


/**
 * 部分配置文件
 */
let optConf = {
    //数据库定义的翻页模式
    //用来兼容客户端的制作模式
    //妙妙学模式处理，多页面下翻页切换
    //0 翻页滑动
    //1 没有滑动过程,直接切换页面
    'pageFlip': 0,

    //翻页模式
    //根据页码数决定,主要是优化一些代码
    //true  是多页面模式,支持翻页滑动
    //false 单页面模式,不能翻页，只能跳转
    'pageMode': false,

    //是否多场景加载
    //单页场景 false
    //多场景   true
    'multiScenario': false,

    //是否为连续页面
    //通过pageMode的参数定义
    'multiplePages': false
}

/**
 * 配置多页面参数
 * @return {[type]} [description]
 */
let configMultiple = (options) => {
    //如果是epub,强制转换为单页面
    if (Xut.IBooks.Enabled) {
        options.multiplePages = false
    } else {
        //判断多页面情况
        //1 数据库定义
        //2 系统优化
        options.multiplePages =
            options.pageFlip ? options.pageFlip : options.pageMode ? true : false
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
let isBelong = (target) => {
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
 */
let preventDefault = (evtObj, target) => {
    //var tagName = target.nodeName.toLowerCase();
    if (Xut.plat.isBrowser && !Xut.IBooks.Enabled && !window.MMXCONFIG) {
        evtObj.preventDefault && evtObj.preventDefault();
    }
}


class Controller extends Observer {

    constructor(parameter) {
        super()

        let config = Xut.config
        let vm = this;

        //配置文件
        let options = vm.options = _.extend(optConf, parameter, {
            pageFlip: config.pageFlip
        })

        //配置多页面参数
        configMultiple(options)

        //创建翻页滑动
        let $globalEvent = vm.$globalEvent = new GlobalEvent(options, config);
        //创建page页面管理
        let $scheduler = vm.$scheduler = new Scheduler(vm);

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
        $globalEvent.$watch('filter', (hookCallback, point, evtObj) => {
            let target, pageType, parentNode;
            target = point.target;
            //阻止默认行为
            preventDefault(evtObj, target);
            //页面类型
            pageType = isBelong(target);
            //根节点
            parentNode = $globalEvent.findRootElement(point, pageType);
            //执行过滤处理
            handlerObj = filterProcessor.call(parentNode, point, pageType);
            if (!handlerObj || handlerObj.attribute === 'disable') {
                //停止翻页,针对content对象可以拖动,滑动的情况处理
                hookCallback();
            }
        });


        /**
         * 触屏滑动,通知pageMgr处理页面移动
         * @return {[type]} [description]
         */
        $globalEvent.$watch('onSwipeMove', (data) => {
            $scheduler.move(data)
        });


        /**
         * 触屏松手点击
         * 无滑动
         */
        $globalEvent.$watch('onSwipeUp', (pageIndex, hookCallback) => {
            if (handlerObj) {
                if (handlerObj.handlers) {
                    handlerObj.handlers(handlerObj.elem, handlerObj.attribute, handlerObj.rootNode, pageIndex);
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
        $globalEvent.$watch('onSwipeUpSlider', (pointers) => {
            $scheduler.suspend(pointers)
        });


        /**
         * 翻页动画完成回调
         * @return {[type]}              [description]
         */
        $globalEvent.$watch('onAnimComplete', (direction, pagePointer, unfliplock, isQuickTurn) => {
            $scheduler.complete(direction, pagePointer, unfliplock, isQuickTurn)
        });


        /**
         * 切换页面
         * @return {[type]}      [description]
         */
        $globalEvent.$watch('onJumpPage', (data) => {
            $scheduler.jumpPage(data);
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
                $scheduler.masterMgr && $scheduler.masterMgr.reactivation(target);
            }
        });

        vm.$overrideApi();
    }


    /**
     * 系统工具栏
     */
    addTools(vm) {
        _.extend(delegateHooks, {
            //li节点,多线程创建的时候处理滑动
            'data-container': () => {
                vm.$emit('change:toggleToolbar')
            },
            //是背景层
            'data-multilayer': () => {
                //改变工具条状态
                vm.$emit('change:toggleToolbar')
            },
            //默认content元素可以翻页
            'data-behavior': (target, attribute, rootNode, pageIndex) => {
                //没有事件的元素,即可翻页又可点击切换工具栏
                if (attribute == 'click-swipe') {
                    vm.$emit('change:toggleToolbar')
                }
            }
        })
    }

}


var VMProto = Controller.prototype


/**
 * 是否多场景模式
 */
defAccess(VMProto, '$multiScenario', {
    get: function() {
        return this.options.multiScenario
    }
});


/**
 * 动态注入对象接口
 * 注入对象管理,注册所有widget组件对象
 *  content类型  创建时注册
 *  widget类型   执行时注册
 *  widget 包括 视频 音频 Action 子文档 弹出口 类型
 *  这种类型是冒泡处理，无法传递钩子，直接用这个接口与场景对接
 */
defAccess(VMProto, '$injectionComponent', {
    set: function(regData) {
        var injection;
        if (injection = this.$scheduler[regData.pageType + 'Mgr']) {
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
defAccess(VMProto, '$curVmPage', {
    get: function() {
        return this.$scheduler.pageMgr.abstractGetPageObj(this.$globalEvent.hindex);
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
def(VMProto, '$bind', function(key, callback) {
    var vm = this
    vm.$watch('change:' + key, function() {
        callback.apply(vm, arguments)
    })
})


/**
 * 创建页面
 * @return {[type]} [description]
 */
def(VMProto, '$init', function() {
    this.$scheduler.initCreate();
});


/**
 * 运动动画
 * @return {[type]} [description]
 */
def(VMProto, '$run', function() {
    var vm = this;
    vm.$scheduler.pageMgr.activateAutoRuns(
        vm.$globalEvent.hindex, Xut.Presentation.GetPageObj()
    )
});


/**
 * 复位对象
 * @return {[type]} [description]
 */
def(VMProto, '$reset', function() {
    return this.$scheduler.pageMgr.resetOriginal(this.$globalEvent.hindex);
});


/**
 * 停止所有任务
 * @return {[type]} [description]
 */
def(VMProto, '$suspend', function() {
    Xut.Application.Suspend({
        skipMedia: true //跨页面不处理
    })
});


/**
 * 销毁场景内部对象
 * @return {[type]} [description]
 */
def(VMProto, '$destroy', function() {
    this.$off();
    this.$globalEvent.destroy();
    this.$scheduler.destroy();
    this.$scheduler = null;
    this.$globalEvent = null;
});


/**
 * 设置所有API接口
 * @return {[type]} [description]
 */
def(VMProto, '$overrideApi', function() {
    overrideApi(this)
})


export {
    Controller 
}
