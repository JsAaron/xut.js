/*******************************************
 *   文本类
 *     处理:
 *       1 异步转同步deferred处理
 *       2 dom结循环创建
 *       创建的四种行为
 *          1 默认创建结构绑定事件
 *          2 用于预先创建activityMode模式,分发动画与事件
 *          3 递归创建,关联子热点
 *          4 ppt文字动画,不创建主体结构,递归子热点
 *                  A 递归处理PPT动画
 *                  B 处理同步音频
 *                                      *
 ******************************************/


//content自对象
import { Content } from './content'
//dom事件
import { destroyEvents }from './event/event'
//任务
import { createNextTask } from './nexttask'
//扩展
import {extendEvent} from './event/related'
import {extendPrivate} from './util'
import {extendTextBox} from './textbox/index'
import {extendBookMark} from './bookmark/index'
import {extendSearchBar} from './searchbar/index'


/**
 * activity触发器类
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function activityClass(data) {

    _.extend(this, data);

    /**
     * 2016.4.11
     * 检测是所有的子任务必须完成
     * 因为canvas模式导致
     * 任务必须等待context上下创建
     * context就是pixi的直接对象，精灵..都是异步的
     */
    this.nextTask = createNextTask(this.noticeComplete)

    /**
     * 填充事件数据
     */
    this.fillEventData();

    /**
     * 保存子对象content
     * @type {Array}
     */
    this.abstractContents = Content(this);

    /**
     * 处理html文本框
     * 2016.1.6
     */
    this.htmlTextBox();

    /**
     * 绑定事件
     */
    this.bindEventBehavior();

    /**
     * 初始化content行为
     */
    this.initContents();

    /**
     * 2016.2.26
     * 修复妙妙学
     * 妙妙客户端处理
     * 点击效果的音频处理
     * @type {Array}
     */
    this._fixAudio = [];

    /**
     * 如果存在content
     * 等待创建执行
     * @param  {[type]} this.nextTask.context.length()
     * @return {[type]}
     */
    if (this.nextTask.context.length()) {
        this.nextTask.context.wait = true;
        return this;
    }

    /**
     * 如果没有pixi的异步创建
     * 同步代码直接完成
     */
    this.noticeComplete();
}



var activitProto = activityClass.prototype;

extendEvent(activitProto)
extendPrivate(activitProto)
extendTextBox(activitProto)
extendBookMark(activitProto)
extendSearchBar(activitProto)

/**
 * 保证正确遍历
 * @return {[type]} [description]
 */
activitProto.eachAssistContents = function (callback) {
    _.each(this.abstractContents, function (scope) {
        callback.call(this, scope)
    }, this)
}


/**
 * 初始化content行为
 * @return {[type]} [description]
 */
activitProto.initContents = function () {

    var pageId = this.relatedData.pageId,
        rootNode = this.rootNode,
        collectorHooks = this.relatedCallback.contentsHooks,
        pageType = this.pageType;

    this.eachAssistContents(function (scope) {

        var context, id, isRreRun, parameter;

        //针对必须创建
        if (!(context = scope.$contentProcess)) {
            console.log('$contentProcess不存在')
            return
        }

        //如果是视觉差对象，也需要实现收集器
        if (scope.processType === 'parallax') {
            collectorHooks(scope.pid, scope.id, scope);
            return;
        }

        //如果是动画才处理
        id = scope.id
        isRreRun = scope.isRreRun
        parameter = scope.getParameter();


        //如果不是预生成,注册动画事件
        if (isRreRun === undefined) {
            //初始化动画
            scope.init(id, context, rootNode, pageId, parameter, pageType);
        }

        //绑定DOM一些属性
        this.toRepeatBind(id, context, isRreRun, scope, collectorHooks);
    });

}


/**
 * dom节点去重绑定
 * 在每一次构建activity对象中，不重复处理content一些特性
 * 1 翻页特性
 * 2 注册钩子
 * 3 预显示
 * @return {[type]} [description]
 */
activitProto.toRepeatBind = function (id, context, isRreRun, scope, collectorHooks) {
    var indexOf
    var relatedData = this.relatedData
    //过滤重复关系
    //每个元素只绑定一次
    if (-1 !== (indexOf = relatedData.createContentIds.indexOf(id))) {
        //删除,去重
        relatedData.createContentIds.splice(indexOf, 1);
        //收集每一个content注册
        collectorHooks(scope.pid, id, scope);
        //增加翻页特性
        this.addIScroll(scope, context);
        //直接复位状态,针对出现动画 show/hide
        if (isRreRun) {
            //直接改变元素状态
            context.css({
                'visibility': isRreRun
            })
        }
    }
}


/**
 * 运行动画
 * @param  {[type]} outComplete [动画回调]
 * @return {[type]}             [description]
 * evenyClick 每次都算有效点击
 */
activitProto.runEffects = function (outComplete, evenyClick) {

    var self = this;
    var pageId = this.relatedData.pageId;

    if (evenyClick) {
        self.preventRepeat = false;
    }

    //防止重复点击
    if (self.preventRepeat) {
        return false;
    }

    self.preventRepeat = true;

    //如果没有运行动画
    if (!self.seed.animation) {
        self.preventRepeat = false;
        self.relevantOperation();
        return;
    }

    //创建的无行为content
    var partContentRelated = self.relatedData.partContentRelated;
    var closeAnim;

    //制作作用于内动画完成
    //等待动画完毕后执行动作or场景切换
    var captureAnimComplete = self.captureAnimComplete = function (counts) {
        return function (scope) {
            //动画结束,删除这个hack
            scope
                && scope.$contentProcess && scope.$contentProcess.removeProp && scope.$contentProcess.removeProp('animOffset')

            //如果快速翻页
            //运行动画的时候，发现不是可视页面
            //需要关闭这些动画  
            closeAnim = (pageId != Xut.Presentation.GetPageId());

            if (closeAnim && scope) {
                scope.stop && scope.stop(pageId);
                scope.reset && scope.reset();
            }

            //捕获动画状态
            if (counts === 1) {
                if (closeAnim) {
                    //复位动画
                    self.resetAloneAnim();
                }
                self.preventRepeat = false;
                self.relevantOperation();
                outComplete && outComplete();
                self.captureAnimComplete = null;
            } else {
                --counts;
            }

        }
    } (this.abstractContents.length);


    /**
     * 如果是preRun处理
     * @return {Boolean} [description]
     */
    function isRreRunPocess(scope) {
        //针对空跳过处理
        if (partContentRelated && partContentRelated.length && (-1 !== partContentRelated.indexOf(scope.id))) {
            captureAnimComplete()
        } else {
            //必须要修改
            if (scope.$contentProcess) {
                if (scope.canvasMode) {
                    console.log('canvsa isRreRunPocess')
                    //直接改变元素状态
                    //scope.$contentProcess.view.style.visible = scope.isRreRun === 'visible' ? true : false;
                } else {
                    //因为执行的顺序问题，动画与页面零件
                    //isscroll标记控制
                    if (!scope.$contentProcess.attr('isscroll')) {
                        scope.$contentProcess.css({
                            'visibility': scope.isRreRun
                        })
                    }
                }
            }
            captureAnimComplete()
        }
    }

    //执行动画
    this.eachAssistContents(function (scope) {
        if (scope.isRreRun) {
            isRreRunPocess(scope);
        } else {

            //标记动画正在运行
            scope.$contentProcess && scope.$contentProcess.prop && scope.$contentProcess.prop({
                'animOffset': scope.$contentProcess.offset()
            })

            //ppt动画
            //ppt音频
            scope.run(function () {
                captureAnimComplete(scope);
            });
        }
    })
    this.runState = true;
}


/**
 * 停止动画
 * @return {[type]} [description]
 */
activitProto.stopEffects = function () {
    var pageId = this.relatedData.pageId;
    this.runState = false;
    this.eachAssistContents(function (scope) {
        !scope.isRreRun && scope.stop && scope.stop(pageId);
    })

}


/**
 * 处理拖动对象
 * @return {[type]} [description]
 */
function accessDrop(eventData, callback) {
    if (eventData && eventData.dragDrop) {
        callback(eventData.dragDrop)
    }
}


/**
 * 复位独立动画
 * 提供快速翻页复用
 * @return {[type]} [description]
 */
activitProto.resetAloneAnim = function () {
    //复位拖动对象
    accessDrop(this.eventData, function (drop) {
        drop.reset();
    })
}


/**
 * 复位状态
 * @return {[type]} [description]
 */
activitProto.resetAnimation = function () {
    this.eachAssistContents(function (scope) {
        !scope.isRreRun && scope.reset && scope.reset(); //ppt动画
    })

    this.resetAloneAnim();
}


/**
 * 销毁动画
 * @param  {[type]} elementCallback [description]
 * @return {[type]}                 [description]
 */
activitProto.destroyEffects = function (elementCallback) {
    //销毁拖动对象
    accessDrop(this.eventData, function (drop) {
        drop.destroy();
    })
    this.eachAssistContents(function (scope) {
        if (scope.destroy) {
            scope.destroy();
        }
        elementCallback && elementCallback(scope)
    })
}


/**
 * 动画运行之后
 * 1 创建一个新场景
 * 2 执行跳转到收费提示页面
 * 3 触发搜索工具栏
 * @return {[type]} [description]
 */
activitProto.relevantOperation = function () {

    var scenarioInfo,
        eventContentId;

    //触发事件的content id
    if (this.eventData) {
        eventContentId = this.eventData.eventContentId;
    }

    if (eventContentId) {

        //查找出当前节的所有信息
        if (scenarioInfo = this.relatedData.seasonRelated[eventContentId]) {

            //如果存在搜索栏触发
            if (scenarioInfo.SearchBar) {
                this.createSearchBar();
                return;
            }

            //如果存在书签
            if (scenarioInfo.BookMarks) {
                this.createBookMark();
                return;
            }

            //收费处理
            if (scenarioInfo.Inapp !== undefined) {
                if (scenarioInfo.Inapp == 1) {
                    Xut.Application.HasBuyGood(); //已收费
                } else {
                    Xut.Application.BuyGood(); //付费接口
                }
                return
            }

            //处理新的场景
            if (scenarioInfo.seasonId || scenarioInfo.chapterId) {
                setTimeout(function () {
                    Xut.View.LoadScenario({
                        'scenarioId': scenarioInfo.seasonId,
                        'chapterId': scenarioInfo.chapterId
                    })
                }, Xut.fix.audio ? 1000 : 0)
                return
            }

            // console.log('content跳转信息出错',scenarioInfo)
        }
    }
}


/*********************************************************************
 *
 *                      外部调用接口
 *                                                                    *
 **********************************************************************/

/**
 * 自动运行
 * @param  {[type]} outComplete [description]
 * @return {[type]}             [description]
 */
activitProto.autoPlay = function (outComplete) {
    var eventData = this.eventData;
    if (eventData && eventData.eventName === 'auto') {
        this.runEffects(outComplete);
    } else {
        outComplete();
    }
}


/**
 * 翻页开始
 * @return {[type]} [description]
 */
activitProto.flipOver = function () {
    if (this.runState) {
        this.stopEffects();
    }
    this.preventRepeat = false
    //复位盒子
    if (this.htmlBoxInstance.length) {
        _.each(this.htmlBoxInstance, function (instance) {
            instance.removeBox();
        })
    }
    //修复妙妙客户端
    //没有点击音频结束的回调
    //最多允许播放5秒
    if (this._fixAudio.length) {
        _.each(this._fixAudio, function (instance) {
            setTimeout(function () {
                instance.end();
            }, 5000)
        })
        this._fixAudio = [];
    }
}


/**
 * 翻页完成复位动画
 * @return {[type]} [description]
 */
activitProto.flipComplete = function () {
    this.resetAnimation();
}


//销毁
//提供一个删除回调
//用于处理浮动对象的销毁
activitProto.destroy = function (elementCallback) {

    //销毁绑定事件
    if (this.eventData.eventContext) {
        destroyEvents(this.eventData);
        this.eventData.eventContext = null;
    }

    //2016.1.7
    //如果有文本框事件
    //一个activity允许有多个文本框
    //所以是数组索引
    if (this.htmlBoxInstance.length) {
        _.each(this.htmlBoxInstance, function (instance) {
            instance.destroy();
        })
        this.htmlBoxInstance = null;
    }

    //销毁动画
    this.destroyEffects(elementCallback);

    //iscroll销毁
    if (this.iscroll) {
        this.iscroll.destroy();
        this.iscroll = null;
    }

    //销毁搜索框
    if (this.searchBar) {
        this.searchBar.destroy();
        this.searchBar = null;
    }

    //销毁书签
    if (this.bookMark) {
        this.bookMark.destroy();
        this.bookMark = null;
    }

    this.rootNode = null;

}


/**
 * 复位
 * @return {[type]} [description]
 */
activitProto.recovery = function () {
    if (this.runState) {
        this.stopEffects();
        return true
    }
    return false
}




export {
activityClass
}
