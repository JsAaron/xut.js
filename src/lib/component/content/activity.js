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

//卷滚
import { Iscroll } from './iscroll'

//事件
import {
    conversionEventType,
    destroyEvents,
    bindEvents as bindContentEvents
}
from './event'
//混入content
import { Mix } from './mix'
//content自对象
import { Child } from './child'
//搜索
import { SearchBar } from './searchbar'
//书签
import { BookMark } from './bookmark'
//文本框
import { HtmlBox } from './htmlbox'
//pixi事件
import { bindEvents as bindPixiEvents } from '../pixi/event'
//任务
import { createNextTask } from './nexttask'


/**
 * activity触发器类
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function activityClass(data) {

    var self = this;

    _.extend(this, data);

    /**
     * 2016.4.11
     * 检测是所有的子任务必须完成
     * 因为canvas模式导致
     * 任务必须等待context上下创建
     * context就是pixi的直接对象，精灵..都是异步的
     */
    this.nextTask = createNextTask(this.monitorComplete)

    /**
     * 初始化自定义事件
     */
    this.createEventRelated();

    /**
     * 为分段处理,记录需要加载的分段数据
     * @type {Array}
     */
    this.waitCreateContent = [];

    /**
     * 保存子对象（PPT辅助对象）
     * 1 动画作用域
     * 2 视觉差作用域
     * @type {Array}
     */
    this.abstractContents = Child(this);

    /**
     * 处理html文本框
     * 2016.1.6
     */
    this.htmlTextBox();

    /**
     * 注册用户自定义事件
     * dom
     * canvas
     */
    this.registerEvent();

    /**
     * 构建用户行为
     */
    this.createActions();

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
    this.monitorComplete();
}



var activitProto = activityClass.prototype;


/*********************************************************************
 *                 代码初始化
 *                初始基本参数
 *                构建动画关系作用域
 *                绑定基本事件
 **********************************************************************/


/**
 * 检测是HTML文本框处理
 * @return {[type]} [description]
 */
activitProto.htmlTextBox = function () {
    var self = this;
    var eventData = this.eventData;
    var relatedData = this.relatedData;
    var contentHtmlBoxIds = relatedData.contentHtmlBoxIds;
    var contentId;
    var contentName;
    var eventElement;
    //文本框实例对象
    //允许一个activity有多个
    this.htmlBoxInstance = [];
    //创建文本框对象
    if (contentHtmlBoxIds.length && relatedData.contentDas) {
        _.each(relatedData.contentDas, function (cds) {
            if (~contentHtmlBoxIds.indexOf(cds._id)) {
                contentId = cds._id;
                contentName = self._makePrefix('Content', self.pid, contentId);
                //找到对应绑定事件的元素
                eventElement = self._findContentElement(contentName)
                if (!eventElement.attr("data-htmlbox")) {
                    //构建html文本框对象
                    self.htmlBoxInstance.push(new HtmlBox(contentId, eventElement));
                    //增加htmlbox标志去重
                    //多个actictiy共享问题
                    eventElement.attr("data-htmlbox", "true")
                }
            }
        })
    }
}



/**
 * 保证正确遍历
 * @return {[type]} [description]
 */
activitProto.eachAssistContents = function (callback) {
    _.each(this.abstractContents, function (scope) {
        //保存只能处理动画
        //scope.processType === 'animation' || scope.processType === 'both')
        callback.call(this, scope)
    }, this)
}


/**
 * 初始化PPT动画与音频
 * @return {[type]} [description]
 */
activitProto.createActions = function () {

    var pageId = this.relatedData.pageId,
        rootNode = this.rootNode,
        collectorHooks = this.relatedCallback.contentsHooks,
        pageType = this.pageType;

    this.eachAssistContents(function (scope) {

        var context, type, id, isRreRun, parameter;

        //针对必须创建
        if (!(context = scope.$contentProcess)) {
            return
        };

        //如果是视觉差对象，也需要实现收集器
        if (scope.processType === 'parallax') {
            collectorHooks(scope.pid, scope.id, scope);
            return;
        }

        //如果是动画才处理
        id = scope.id,
            isRreRun = scope.isRreRun,
            parameter = scope.getParameter();


        //如果不是预生成
        //注册动画事件
        if (isRreRun === undefined) {
            scope.init(id, context, rootNode, pageId, parameter, pageType);
        }

        //绑定DOM一些属性
        this._repeatBind(id, context, isRreRun, scope, collectorHooks, scope.canvasMode);
    });

}


/**
 * 检测创建完成度
 */
activitProto._checkCreate = function (callback) {
    var waitCreateContent = this.waitCreateContent;
    if (waitCreateContent && waitCreateContent.length) {
        Mix(this, waitCreateContent, callback);
    } else {
        callback();
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
                    //直接改变元素状态
                    scope.$contentProcess.visible = scope.isRreRun === 'visible' ? true : false;
                    self.canvasRelated.oneRender();
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

    /**
     * 检测创建完成度
     * 递归创建
     * @return {[type]}       [description]
     */
    self._checkCreate(function () {
        //执行动画
        self.eachAssistContents(function (scope) {
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
        self.runState = true;
    });
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
    //如果是运行canvas模式
    //停止绘制
    if (this.canvasRelated.stopRender) {
        setTimeout(function () {
            this.canvasRelated.stopRender();
        }.bind(this), 0)
    }
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


/**
 * 创建搜索框
 * @return {[type]} [description]
 */
activitProto.createSearchBar = function () {
    var options = {
        parent: this.rootNode
    }
    if (this.searchBar) {
        //如果上次只是隐藏则可以恢复
        this.searchBar.restore();
    } else {
        this.searchBar = new SearchBar(options);
    }
}


/**
 * 创建书签
 * @return {[type]} [description]
 */
activitProto.createBookMark = function () {
    var element, seasonId, pageId, pageData;
    if (this.pageType === 'master') {
        //模板取对应的页面上的数据
        pageData = Xut.Presentation.GetPageData();
        element = this.relatedData.floatMaters.container;
        pageId = pageData._id;
        seasonId = pageData.seasonId;
    } else {
        element = this.rootNode;
        seasonId = this.relatedData.seasonId
        pageId = this.pageId
    }
    var options = {
        parent: element,
        seasonId: seasonId,
        pageId: pageId
    }

    if (this.bookMark) {
        //如果上次只是隐藏则可以恢复
        this.bookMark.restore();
    } else {
        this.bookMark = new BookMark(options);
    }
}


/*********************************************************************
 *
 *                      用户自定义接口事件
 *                                                                    *
 **********************************************************************/

/**
 * 构建事件体系
 * @return {[type]} [description]
 */
activitProto.createEventRelated = function () {

    //配置事件节点
    var eventId,
        pid,
        contentName,
        //事件上下文对象
        eventContext,
        eventData = this.eventData;

    //如果存在imageIds才处理,单独绑定事件处理
    if (eventId = eventData.eventContentId) {

        //默认dom模式
        _.extend(eventData, {
            'type': 'dom',
            'domMode': true,
            'canvasMode': false
        })

        function domEvent() {
            pid = this.pid
            contentName = this._makePrefix('Content', pid, this.id)

            //找到对应绑定事件的元素
            eventContext = this._findContentElement(contentName)
        }

        function canvasEvent() {
            eventContext = {}
            eventData.type = 'canvas';
            eventData.canvasMode = true;
            eventData.domMode = false;
        }

        //canvas事件
        if (-1 !== this.canvasRelated.cid.indexOf(eventId)) {
            canvasEvent.call(this)
        } else {
            //dom事件
            domEvent.call(this)
        }

        eventData.eventContext = eventContext;

        if (eventContext) {
            //绑定事件加入到content钩子
            this.relatedCallback.contentsHooks(pid, eventId, {
                $contentProcess: eventContext,
                //增加外部判断
                isBindEventHooks: true,
                type: eventData.type
            })
        } else {
            /**
             * 针对动态事件处理
             * 快捷方式引用到父对象
             * @type {[type]}
             */
            eventData.parent = this;
        }
    }

    /**
     * 解析出事件类型
     */
    eventData.eventName = conversionEventType(eventData.eventType);

}


/**
 * 绑定事件行为
 * @return {[type]} [description]
 */
activitProto.bindEventBehavior = function (callback) {
    var self = this,
        eventData = this.eventData,
        eventName = eventData.eventName,
        eventContext = eventData.eventContext;

    /**
     * 运行动画
     * @return {[type]} [description]
     */
    function startRunAnim() {
        //当前事件对象没有动画的时候才能触发关联动作
        var animOffset,
            boundary = 5; //边界值

        if (eventData.domMode && (animOffset = eventContext.prop('animOffset'))) {
            var originalLeft = animOffset.left;
            var originalTop = animOffset.top;
            var newOffset = eventContext.offset();
            var newLeft = newOffset.left;
            var newTop = newOffset.top;
            //在合理的动画范围是允许点击的
            //比如对象只是一个小范围的内的改变
            //正负10px的移动是允许接受的
            if (originalLeft > (newLeft - boundary) && originalLeft < (newLeft + boundary) || originalTop > (newTop - boundary) && originalTop < (newTop + boundary)) {
                self.runEffects();
            }
        } else {
            self.runEffects();
        }
    }

    /**
     * 设置按钮的行为
     * 音频
     * 反弹
     */
    function setBehavior(feedbackBehavior) {

        var behaviorSound;
        //音频地址
        if (behaviorSound = feedbackBehavior.behaviorSound) {

            var createAuido = function () {
                return new Xut.Audio({
                    url: behaviorSound,
                    trackId: 9999,
                    complete: function () {
                        this.play()
                    }
                })
            }
            //妙妙学客户端强制删除
            if (MMXCONFIG && audioHandler) {
                self._fixAudio.push(createAuido())
            } else {
                createAuido();
            }
        }
        //反弹效果
        if (feedbackBehavior.isButton) {
            //div通过css实现反弹
            if (eventData.domMode) {
                eventContext.addClass('xut-behavior');
                setTimeout(function () {
                    eventContext.removeClass('xut-behavior');
                    startRunAnim();
                }, 500)
            } else {
                //canvas反弹
                var sx = eventContext.scale.x;
                var px = eventContext.position.x;

                eventContext.scale.x += 0.1;
                eventContext.position.x -= Math.round(px * 0.05);
                self.canvasRelated.oneRender();

                setTimeout(function () {
                    eventContext.scale.x = sx;
                    eventContext.position.x = px;
                    self.canvasRelated.oneRender();
                }, 200);
            }
        } else {
            startRunAnim();
        }
    }

    /**
     * 事件引用钩子
     * 用户注册与执行
     * @type {Object}
     */
    var eventDrop = {
        //保存引用,方便直接销毁
        init: function (drag) {
            eventData.dragDrop = drag;
        },
        //拖拽开始的处理
        startRun: function () {

        },
        //拖拽结束的处理
        stopRun: function (isEnter) {
            if (isEnter) { //为true表示拖拽进入目标对象区域
                self.runEffects();
            }
        }
    }


    /**
     * 正常动画执行
     * 除去拖动拖住外的所有事件
     * 点击,双击,滑动等等....
     * @return {[type]} [description]
     */
    var eventRun = function () {
        //如果存在反馈动作
        //优先于动画执行
        var feedbackBehavior;
        if (feedbackBehavior = eventData.feedbackBehavior[eventData.eventContentId]) {
            setBehavior(feedbackBehavior)
        } else {
            startRunAnim();
        }
    }


    /**
     * 事件对象引用
     * @return {[type]} [description]
     */
    var eventHandler = function (eventReference, eventHandler) {
        eventData.eventReference = eventReference;
        eventData.eventHandler = eventHandler;
    }


    //绑定用户自定义事件
    if (eventContext && eventName) {

        var domName, target,
            dragdropPara = eventData.dragdropPara;

        //获取拖拽目标对象
        if (eventName === 'dragTag') {
            domName = this._makePrefix('Content', this.pid, dragdropPara);
            target = this._findContentElement(domName);
        }

        //增加事件绑定标示
        //针对动态加载节点事件的行为过滤
        eventData.isBind = true;


        callback.call(this, {
            'eventDrop': eventDrop,
            'eventRun': eventRun,
            'eventHandler': eventHandler,
            'eventContext': eventContext,
            'eventName': eventName,
            'parameter': dragdropPara,
            'target': target,
            'domMode': eventData.domMode
        })
    }
}


/**
 * 注册事件
 * @return {[type]} [description]
 */
activitProto.registerEvent = function () {
    var eventData = this.eventData;
    /**
     * 2016.2.19
     * 绑定canvas事件
     * 由于canvas有异步加载
     * 这里content创建的时候不阻断加载
     * 所以canvas的事件体系
     * 放到所有异步文件加载后才执行
     */
    if (eventData.type === "canvas") {
        var makeFunction = function bind() {
            //找到对应的上下文pixi stoge
            eventData.eventContext = {}
            this.bindEventBehavior(function (eventData) {
                bindPixiEvents(eventData);
            })
        }
        console.log('content canvas事件')
        this.nextTask.event.push(makeFunction.bind(this))
    } else {
        //dom事件
        this.bindEventBehavior(function (eventData) {
            bindContentEvents(eventData);
        })
    }
}



/*********************************************************************
 *
 *                 私有方法
 *
 **********************************************************************/

/**
 * dom节点去重绑定
 * 在每一次构建activity对象中，不重复处理content一些特性
 * 1 翻页特性
 * 2 注册钩子
 * 3 预显示
 * @return {[type]} [description]
 */
activitProto._repeatBind = function (id, context, isRreRun, scope, collectorHooks, canvasMode) {
    var indexOf,
        relatedData = this.relatedData;

    //过滤重复关系
    if (-1 !== (indexOf = relatedData.createContentIds.indexOf(id))) {
        //删除,去重
        relatedData.createContentIds.splice(indexOf, 1);
        //收集每一个content注册
        collectorHooks(scope.pid, id, scope);
        //canvas模式
        if (canvasMode) {
            if (isRreRun) {
                // console.log(id,scope)
                //直接改变元素状态
                // context.visible = isRreRun === 'visible' ? true : false;
                this.nextTask.pre[id] = function () {
                    this.nextTask.pre.push(function pre(context) {
                        console.log('预执行', isRreRun)
                        //this.canvasRelated.oneRender();
                    })
                }
            }
        } else {
            //dom模式
            //增加翻页特性
            this._addIScroll(scope, context);
            //直接复位状态,针对出现动画 show/hide
            if (isRreRun) {
                //直接改变元素状态
                context.css({
                    'visibility': isRreRun
                })
            }
        }
    }
}


/**
 * 增加翻页特性
 * 可能有多个引用关系
 * @return {[type]}         [description]
 */
activitProto._addIScroll = function (scope, element) {
    var self = this,
        elementName,
        contentDas = scope.contentDas;

    //给外部调用处理
    function makeUseFunction(element) {

        var prePocess = self._makePrefix('Content', scope.pid, scope.id),
            preEle = self._findContentElement(prePocess)

        //重置元素的翻页处理
        // defaultBehavior(preEle);

        //ios or pc
        if (!Xut.plat.isAndroid) {
            return function () {
                self.iscroll = Iscroll(element);
            }
        }

        //在安卓上滚动文本的互斥不显示做一个补丁处理
        //如果是隐藏的,需要强制显示,待邦定滚动之后再还原
        //如果是显示的,则不需要处理,
        var visible = preEle.css('visibility'),
            restore = function () { };

        if (visible == 'hidden') {
            var opacity = preEle.css('opacity');
            //如果设置了不透明,则简单设为可见的
            //否则先设为不透明,再设为可见
            if (opacity == 0) {
                preEle.css({
                    'visibility': 'visible'
                })
                restore = function () {
                    preEle.css({
                        'visibility': visible
                    })
                }
            } else {
                preEle.css({
                    'opacity': 0
                }).css({
                    'visibility': 'visible'
                })
                restore = function () {
                    preEle.css({
                        'opacity': opacity
                    }).css({
                        'visibility': visible
                    })
                }
            }
        }

        return function () {
            self.iscroll = Iscroll(element);
            restore();
            preEle = null;
            restore = null;
        }
    }

    //增加卷滚条
    if (contentDas.isScroll) {
        //去掉高度，因为有滚动文本框
        element.find(">").css("height", "")

        // elementName = this._makePrefix('contentWrapper', scope.pid, scope.id);
        this.relatedCallback.iscrollHooks.push(makeUseFunction(element[0]));
    }

    //如果是图片则补尝允许范围内的高度
    if (!contentDas.mask || !contentDas.isGif) {
        element.find && element.find('img').css({
            'height': contentDas.scaleHeight
        });
    }
}


/**
 * 制作一个查找标示
 * @return {[type]}
 */
activitProto._makePrefix = function (name, pid, id) {
    return name + "_" + pid + "_" + id;
}


/**
 * 从文档碎片中找到对应的dom节点
 * 查找的范围
 * 1 文档根节点
 * 2 文档容器节点
 * @param  {[type]} prefix [description]
 * @return {[type]}        [description]
 */
activitProto._findContentElement = function (prefix) {
    var element, containerPrefix,
        contentsFragment = this.relatedData.contentsFragment;

    if (element = (contentsFragment[prefix])) {
        element = $(element)
    } else {
        //容器处理
        if (containerPrefix = this.relatedData.containerPrefix) {
            _.each(containerPrefix, function (containerName, index) {
                element = contentsFragment[containerName];
                element = $(element).find('#' + prefix);
                if (element.length) {
                    return;
                }
            })
        }
    }
    return element;
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
