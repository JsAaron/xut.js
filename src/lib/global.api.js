/**
 *
 * 杂志全局API
 *
 *  *** 有方法体的是全局接口，不会被重载***
 *  *** 无方法体的是场景接口，总会切换到当前可视区域场景***
 *
 * 1.   Xut.Application
 *          a)  整个应用程序的接口，执行应用级别的操作，例如退出应用之类。
 * 2.   Xut.DocumentWindow
 *          a)  窗口的接口。窗口就是电子杂志的展示区域，可以操作诸如宽度、高度、长宽比之类。
 * 3.   Xut.View
 *          a)  视图接口。视图是窗口的展示方式，和页面相关的接口，都在这里。
 * 4.   Xut.Presentation
 *          a)  数据接口。和电子杂志的数据相关的接口，都在这里。
 * 5.   Xut.Slides
 *          a)  所有页面的集合
 * 6.   Xut.Slide
 *          a)  单个页面
 * 7.   Xut.Master
 *          a)  页面的母版
 *
 *
 * @return {[type]} [description]
 */

import { config } from './config/index'
import { SceneFactory } from './scenario/scenario'
import { sceneController } from './scenario/controller'
import globalDestroy from './global.destroy'
import Observer from './observer/index'

import {
    ShowBusy,
    HideBusy,
    ShowTextBusy
} from './initialize/busy.cursor'

import {
    $$autoRun,
    $$original,
    $$suspend,
    $$stop
} from './command/index'

import {
    $$set,
    $$get,
    $$remove,
    hash,
    toNumber,
    $$extend,
    $$warn
}
from './util/index'

const plat = Xut.plat
const Presentation = Xut.Presentation = {}
const View = Xut.View = {}
const Contents = Xut.Contents = {}
const Application = Xut.Application = {}

Xut.Assist = {}

/**
 * 获取缓存
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
const getStorage = (name) => parseInt($$get(name))


/**
 * 忙碌光标
 * */
$$extend(View, {
    ShowBusy,
    HideBusy,
    ShowTextBusy
})

//重复点击
let repeatClick = false;

/**
 * 场景
 * */
$$extend(View, {

    /**
     * 关闭场景
     */
    CloseScenario() {
        if (repeatClick) return;
        repeatClick = true;
        var serial = sceneController.takeOutPrevChainId();
        View.LoadScenario({
            'scenarioId': serial.scenarioId,
            'chapterId': serial.chapterId,
            'createMode': 'sysClose'
        }, () => {
            repeatClick = false;
        })
    },

    /**
     * 加载一个新的场景
     * 1 节与节跳
     *    单场景情况
     *    多场景情况
     * 2 章与章跳
     * useUnlockCallBack 用来解锁回调,重复判断
     * isInApp 是否跳转到提示页面
     */
    LoadScenario(options, useUnlockCallBack) {

        var seasonId = toNumber(options.scenarioId),
            chapterId = toNumber(options.chapterId),
            pageIndex = toNumber(options.pageIndex),
            createMode = options.createMode,
            isInApp = options.isInApp;


        //ibooks模式下的跳转
        //全部转化成超链接
        if (!options.main && Xut.IBooks.Enabled && Xut.IBooks.runMode()) {
            location.href = chapterId + ".xhtml";
            return
        }

        //用户指定的跳转入口，而不是通过内部关闭按钮处理的
        var userAssign = createMode === 'sysClose' ? false : true,
            //当前活动场景容器对象
            current = sceneController.containerObj('current');

        //获取到当前的页面对象
        //用于跳转去重复
        if (current && current.vm) {
            var curVmPage;
            if (curVmPage = current.vm.$curVmPage) {
                if (curVmPage.scenarioId == seasonId && curVmPage.chapterId == chapterId) {
                    $$warn(`重复触发页面加载:seasonId:${seasonId},chapterId:${chapterId}`)
                    return
                }
            }
        }

        /**
         * 场景内部跳转
         * 节相同，章与章的跳转
         * 用户指定跳转模式,如果目标对象是当前应用页面，按内部跳转处理
         * @return {[type]}            [description]
         */
        if (userAssign && current && current.scenarioId === seasonId) {
            View.GotoSlide(seasonId, chapterId)
            return
        }

        /**
         * 场景外部跳转
         * 节与节的跳转,需要对场景的处理
         */
        //清理热点动作
        current && current.vm.$suspend();

        //通过内部关闭按钮加载新场景处理
        if (current && userAssign) {
            //检测是不是往回跳转,重复处理
            sceneController.checkToRepeat(seasonId);
        }


        /**
         * 加载新的场景
         */

        //读酷启动时不需要忙碌光标
        if (window.DUKUCONFIG && options.main) {
            View.HideBusy();
        } else {
            View.ShowBusy();
        }


        /**
         * 跳出去
         * $multiScenario
         * 场景模式
         * $multiScenario
         *      true  多场景
         *      false 单场景模式
         * 如果当前是从主场景加载副场景
         * 关闭系统工具栏
         */
        if (current && !current.vm.$multiScenario) {
            View.HideToolBar();
        }


        /**
         * 重写场景的顺序编号
         * 用于记录场景最后记录
         */
        var pageId;
        if (current && (pageId = Xut.Presentation.GetPageId())) {
            sceneController.rewrite(current.scenarioId, pageId);
        }


        /**
         * 场景信息
         * @type {[type]}
         */
        var sectionRang = Xut.data.query('sectionRelated', seasonId)
        var barInfo = sectionRang.toolbar //场景工具栏配置信息
        var pageTotal = sectionRang.length

        /**
         * 通过chapterId转化为实际页码指标
         * season 2 {
         *     chapterId : 1  => 0
         *     chpaterId : 2  => 1
         *  }
         * [description]
         * @return {[type]} [description]
         */
        var parseInitIndex = () => {
            return chapterId ? (() => {
                //如果节点内部跳转方式加载,无需转化页码
                if (createMode === 'GotoSlide') {
                    return chapterId;
                }
                //初始页从0开始，减去下标1
                return chapterId - sectionRang.start - 1;
            })() : 0;
        }

        /**
         * 传递的参数
         * seasonId    节ID
         * chapterId   页面ID
         * pageIndex   指定页码
         * isInApp     是否跳到收费提示页
         * pageTotal   页面总数
         * barInfo     工具栏配置文件
         * history     历史记录
         * sectionRang 节信息
         * complete    构件完毕回调
         * @type {Object}
         */
        var data = {
            seasonId: seasonId,
            chapterId: chapterId,
            pageIndex: pageIndex || parseInitIndex(),
            isInApp: isInApp,
            pageTotal: pageTotal,
            barInfo: barInfo,
            history: options.history,
            sectionRang: sectionRang,
            //制作场景切换后处理
            complete(nextBack) {
                //销毁多余场景
                current && current.destroy()
                    //下一个任务存在,执行切换回调后,在执行页面任务
                nextBack && nextBack();
                //去掉忙碌
                View.HideBusy();
                //解锁回调
                useUnlockCallBack && useUnlockCallBack();
            }
        }

        //主场景判断（第一个节,因为工具栏的配置不同）
        if (options.main || sceneController.mianId === seasonId) {
            //清理缓存
            $$remove("history");
            //确定主场景
            sceneController.mianId = seasonId;
            //是否主场景
            data.isMain = true;
        }

        new SceneFactory(data);

    }
})


/**
 * 行为
 * */
$$extend(View, {
    /**
     * 通过插件打开一个新view窗口
     */
    Open(pageUrl, width, height, left, top) {
        Xut.Plugin.WebView.open(pageUrl, left, top, height, width, 1);
    },

    //关闭view窗口
    Close() {
        Xut.Plugin.WebView.close();
    }
})


/**
 * content
 * */
$$extend(Contents, {

    //存在文档碎片
    //针对音频字幕增加的快捷查找
    contentsFragment: {},

    /**
     * 是否为canvas元素
     * 用来判断事件冒泡
     * 判断当前元素是否支持滑动
     * 默认任何元素都支持滑动
     * @type {Boolean}
     */
    Canvas: {

        /**
         * 是否允许滑动
         * @type {Boolean}
         */
        SupportSwipe: true,

        /**
         * 对象是否滑动
         * @type {Boolean}
         */
        isSwipe: false,

        /**
         * 对象是否点击
         */
        isTap: false,

        /**
         * 复位标记
         */
        Reset() {
            Contents.Canvas.SupportSwipe = true;
            Contents.Canvas.isSwipe = false;
        },

        /**
         * 判断是否可以滑动
         * @return {[type]} [description]
         */
        getSupportState() {
            var state;
            if (Contents.Canvas.SupportSwipe) {
                state = true;
            } else {
                state = false;
            }
            //清空状态
            Contents.Canvas.Reset();
            return state
        },

        /**
         * 判断是否绑定了滑动事件
         * @return {Boolean} [description]
         */
        getIsSwipe() {
            var state;
            if (Contents.Canvas.isSwipe) {
                state = true;
            } else {
                state = false;
            }
            //清空状态
            Contents.Canvas.Reset();
            return state;
        },

        /**
         * 是否绑定了点击事件
         */
        getIsTap() {
            var state = Contents.Canvas.isTap;
            Contents.Canvas.isTap = false;
            return state;
        }
    },


    /**
     * 恢复节点的默认控制
     * 默认是系统接管
     * 如果'drag', 'dragTag', 'swipeleft', 'swiperight', 'swipeup', 'swipedown'等事件会重写
     * 还需要考虑第三方调用，所以需要给一个重写的接口
     * @return {[type]} [description]
     * Content_1_3
     * [Content_1_3,Content_1_4,Content_1_5]
     */
    ResetDefaultControl(pageType, id, value) {
        if (!id) return;
        var elements
        var handle = (ele) => {
            if (value) {
                ele.attr('data-behavior', value);
            } else {
                ele.attr('data-behavior', 'disable');
            }
        }
        if ((elements = Contents.Get(pageType, id)) && elements.$contentNode) {
            handle(elements.$contentNode)
        } else {
            elements = $("#" + id);
            elements.length && handle(elements)
        }
    },

    /**
     * 针对SVG无节点操作
     * 关闭控制
     */
    DisableControl(callback) {
        return {
            behavior: 'data-behavior',
            value: 'disable'
        }
    },

    /**
     * 针对SVG无节点操作
     * 启动控制
     */
    EnableControl(Value) {
        return {
            behavior: 'data-behavior',
            value: Value || 'click-swipe'
        }
    }
})


/**
 * 应用事件监听
 * 1 完成
 * Xut.Application.Watch('complete',fn)
 */
const __app__ = new Observer()
Application.Watch = function(event, callback) {
    __app__.$watch(`app:${event}`, function() {
        callback.apply(__app__, arguments)
    })
}
Application.Notify = function(event, options) {
    __app__.$emit(`app:${event}`, options)
}

/**
 * 后台运行
 * @type {Number}
 */
let backstage = 0

/**
 * 应用加载状态
 * false未加载
 * true 已加载
 * @type {Boolean}
 */
let appState = false


$$extend(Application, {

    /**
     * 后台运行
     * @type {Number}
     */
    IsBackStage() {
        return backstage
    },

    /**
     * home隐藏
     * 后台运行的时候,恢复到初始化状态
     * 用于进来的时候激活Activate
     */
    Original() {
        backstage = 1

        //传递一个完全关闭的参数
        $$suspend('', '', true);
        $$original();
    },

    /**
     * home显示
     * 后台弹回来
     * 激活应用行为
     */
    Activate() {
        backstage = 0
        $$autoRun()
    },

    /**
     * 销毁应用
     */
    Destroy() {
        if (window.DYNAMICCONFIGT) {
            globalDestroy('destroy')
            window.DYNAMICCONFIGT = null
        }
    },

    /**
     * 2016.10.11
     * 刷新程序
     * 这个与销毁有点区别
     * 比如外联的数据，不需要删除
     */
    Refresh() {
        globalDestroy('refresh')
    },

    /**
     * 退出app
     * 提供给iframe方式加载后退出app处理接口
     */
    DropApp() {

        /**
         * iframe模式,退出处理
         * @return {[type]} [description]
         */
        const destroy = () => {
            __app__.$off()
                //退出应用
            globalDestroy('exit')
            window.GLOBALCONTEXT = null;
        }

        /**
         * 动态配置
         * @param  {[type]} window.DYNAMICCONFIGT [description]
         * @return {[type]}                       [description]
         */
        if (window.DYNAMICCONFIGT) {
            destroy()
            return
        }

        //如果读酷
        if (window.DUKUCONFIG) {
            //外部回调通知
            if (window.DUKUCONFIG.iframeDrop) {
                var appId = $$get('appId');
                window.DUKUCONFIG.iframeDrop(['appId-' + appId, 'novelId-' + appId, 'pageIndex-' + appId]);
            }
            window.DUKUCONFIG = null;
            destroy();
            return;
        }

        //客户端模式
        if (window.CLIENTCONFIGT) {
            //外部回调通知
            if (window.CLIENTCONFIGT.iframeDrop) {
                window.CLIENTCONFIGT.iframeDrop();
            }
            window.CLIENTCONFIGT = null;
            destroy();
            return;
        }

        //妙妙学客户端
        if (window.MMXCONFIG) {
            //外部回调通知
            if (window.MMXCONFIG.iframeDrop) {
                window.MMXCONFIG.iframeDrop();
            }
            window.MMXCONFIG = null;
            destroy();
            return;
        }
    },

    /**
     * 停止应用
     * skipMedia 跳过音频你处理(跨页面)
     * dispose   成功处理回调
     * processed 处理完毕回调
     */
    Suspend({
        skipAudio,
        dispose,
        processed
    }) {
        $$stop(skipAudio)
        processed && processed()
    }

})



$$extend(Application, {

    /**
     * 启动应用
     */
    Launch() {},

    /**
     * 设置应用状态
     */
    setAppState() {
        appState = true;
    },

    /**
     * 删除应用状态
     * @return {[type]} [description]
     */
    delAppState() {
        appState = false;
    },

    /**
     * 获取应用加载状态
     * @return {[type]} [description]
     */
    getAppState() {
        return appState;
    },

    /**
     * 延时APP运用
     * 一般是在等待视频先加载完毕
     * @return {[type]} [description]
     */
    delayAppRun() {
        Application.setAppState();
    },

    /**
     * 启动app
     * 重载启动方法
     * 如果调用在重载之前，就删除，
     * 否则被启动方法重载
     * @type {[type]}
     */
    LaunchApp() {
        Application.delAppState();
    },

    /**
     * 应用加载完毕
     */
    AddEventListener() {}
})


/**
 * u3d接口
 */
Xut.U3d = {
    /**
     * 跳转接口
     * @param {[type]} seasonId  [description]
     * @param {[type]} chapterId [description]
     */
    View(seasonId, chapterId) {
        View.LoadScenario({
            'scenarioId': seasonId,
            'chapterId': chapterId
        })
    }
}


/**
 * 脚本注入接口
 * @type {Object}
 */
window.XXTAPI = {

    /**
     *读取系统中保存的变量的值。
     *如果变量不存在，则新建这个全局变量
     *如果系统中没有保存的值，用默认值进行赋值
     *这个函数，将是创建全局变量的默认函数。
     */
    ReadVar(variable, defaultValue) {
        var temp;
        if (temp = $$get(variable)) {
            return temp;
        } else {
            $$set(variable, defaultValue);
            return defaultValue;
        }
    },

    /**
     * 将变量的值保存起来
     */
    SaveVar(variable, value) {
        $$set(variable, value)
    },

    /*
     *对变量赋值，然后保存变量的值
     *对于全局变量，这个函数将是主要使用的，替代简单的“=”赋值
     */
    SetVar(variable, value) {
        $$set(variable, value)
    }

}
