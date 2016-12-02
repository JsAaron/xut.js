/**
 * 创建执行对象
 * 1 动画作用域
 * 2 视觉差作用域
 * @type {Array}
 */
import Animation from './animation'
import Parallax from './parallax/init'

//2016.7.15废弃
//pixi暂时不使用
// import { Context } from '../pixi/context'

/**
 * 预运行动作
 * 自动 && 出现 && 无时间 && 无音乐
 *  && 不是精灵动画 && 没有脚本代码 && 并且不能是收费
 * @return {[type]}         [description]
 */
const preRunAction = function(data, eventName) {
    var parameter = data.getParameter()
    //过滤预生成动画
    if (parameter && parameter.length === 1) {
        var category = data.contentDas.category
        var para = parameter[0];
        if (para.animationName === 'EffectAppear'
            && data.domMode //并且只有dom模式才可以，canvas排除
            && eventName === 'auto'
            && !para.videoId
            && !para.delay
            && category !== 'Sprite'
            && category !== 'AutoCompSprite'
            && !para.preCode //动画前脚本
            && !para.postCode //动画后脚本
            && !/"inapp"/i.test(para.parameter)) { //并且不能是收费处理
            /**
             *针对预处理动作,并且没有卷滚的不注册
             *满足是静态动画
             *true是显示,false隐藏å
             */
            return data.isRreRun = /"exit":"False"/i.test(para.parameter) === true ? 'visible' : 'hidden';
        }
    }
}


/**
 * 构建动画
 * @return {[type]} [description]
 */
const createScope = function(base, contentId, pid, actName, parameter, hasParallax) {

    //默认启动dom模式
    var data = {
        type: 'dom',
        canvasMode: false,
        domMode: true
    }
    var $contentNode
    var pageType = base.pageType
    var contentName
    var canvasDom
    var contentDas = base.relatedData.contentDas[contentId]

    //如果启动了canvas模式
    //改成作用域的一些数据
    if (base.canvasRelated.enable) {
        //如果找到对应的canvas对象
        if (-1 !== base.canvasRelated.cid.indexOf(contentId)) {
            contentName = "canvas_" + pid + "_" + contentId
            canvasDom = base.getContextNode(contentName)[0]

            //创建上下文pixi
            if (contentDas.$contentNode) {
                $contentNode = contentDas.$contentNode
            } else {
                // $contentNode = Context(contentDas, canvasDom, base.pageIndex)
                //保存canvas pixi的上下文引用
                // base.relatedData.contentDas[contentId].$contentNode = $contentNode
            }
            data.type = 'canvas';
            data.canvasMode = true;
            data.domMode = false;
        }
    }

    //如果是dom模式
    if (!$contentNode) {
        /**
         * 确保节点存在
         * @type {[type]}
         */
        if (!($contentNode = base.getContextNode(actName))) {
            return;
        }
    }

    /**
     * 制作公共数据
     * @type {Object}
     */
    _.extend(data, {
        base: base,
        id: contentId,
        pid: pid,
        actName: actName,
        contentDas: contentDas,
        $contentNode: $contentNode,
        pageType: pageType,
        pageIndex: base.pageIndex,
        canvasRelated: base.canvasRelated,
        nextTask: base.nextTask,
        canvasDom: canvasDom
    })


    /**
     * 如果是母版层理,视觉差处理
     * processType 三种情况
     *          parallax
     *          animation
     *          both(parallax,animation)
     * @type {[type]}
     */
    if (hasParallax && pageType === 'master') {
        data.processType = 'parallax'
    } else {
        data.processType = 'animation'
    }


    /**
     * 生成查询方法
     * @return {[type]} [description]
     */
    data.getParameter = function() {
        //分区母版与页面的数据结构
        //parameter-master-parallax
        //parameter-master-animation
        //parameter-page-animation
        var fix = 'parameter-' + pageType + '-' + data.processType;
        data[fix] = parameter;
        return function() {
            return data[fix];
        }
    }();


    /**
     * 生成视觉差对象
     * @type {[type]}
     */
    if (data.processType === 'parallax') {
        return Parallax(data, base.relatedData)
    }

    /**
     *  优化机制,预生成处理
     *  过滤自动热点并且是出现动作，没有时间，用于提升体验
     */
    preRunAction(data, base.eventData.eventName)


    /**
     * 生成子作用域对象，用于抽象处理动画,行为
     */
    return new Animation(data)
}


/**
 * 分解每个子作用域
 * 1 生成临时占位作用域,用于分段动画
 * 2 生成所有动画子作用域
 * @param  {[type]} parameter [description]
 * @return {[type]}           [description]
 */
const createHandlers = function(base, parameter) {

    //dom对象
    var para = parameter[0],
        contentId = para['contentId'], //可能有多个动画数据 [Object,Object,Object]
        pid = base.pid,
        actName = base.makePrefix('Content', pid, contentId)

    /**
     * 构建子作用域
     */
    return createScope(base, contentId, pid, actName, parameter, para.masterId);
}


/**
 * 构建作用域
 * @return {[type]} [description]
 */
const fnCreate = function(base) {
    return function(data, callback) {
        var para, handlers;
        if (data && data.length) {
            //生成动画作用域对象
            while (para = data.shift()) {
                if (handlers = createHandlers(base, para)) {
                    callback(handlers)
                }
            }
        }
    }
}


/**
 * 源对象复制到目标对象
 */
const innerExtend = function(target, source) {
    var property
    for (property in source) {
        if (target[property] === undefined) {
            target[property] = source[property];
        }
    }
}


//处理itemArray绑定的动画对象
//注入动画
//绑定用户事件
export default function(base) {
    var animation = base.seed.animation,
        parallax = base.seed.parallax,
        //抽出content对象
        abstractContents = [],
        //创建引用
        batcheCreate = fnCreate(base);

    switch (base.pageType) {
        case 'page':
            batcheCreate(animation, function(handlers) {
                abstractContents.push(handlers)
            });
            break;
        case 'master':
            //母版层的处理
            var tempParallaxScope = {},
                tempAnimationScope = {},
                tempAssistContents = [];
            //视觉差处理
            batcheCreate(parallax, function(handlers) {
                tempParallaxScope[handlers.id] = handlers;
            });

            batcheCreate(animation, function(handlers) {
                tempAnimationScope[handlers.id] = handlers;
            });

            var hasParallax = _.keys(tempParallaxScope).length,
                hasAnimation = _.keys(tempAnimationScope).length;

            //动画为主
            //合并，同一个对象可能具有动画+视觉差行为
            if (hasParallax && hasAnimation) {
                _.each(tempAnimationScope, function(target) {
                        var id = target.id
                        var source = tempParallaxScope[id]
                        if (source) { //如果能找到就需要合并
                            innerExtend(target, source); //复制方法
                            target.processType = 'both'; //标记新组合
                            delete tempParallaxScope[id]; //删除引用
                        }
                    })
                    //剩余的处理
                if (_.keys(tempParallaxScope).length) {
                    _.extend(tempAnimationScope, tempParallaxScope);
                }
                tempParallaxScope = null;
            }
            //转化成数组
            _.each(hasAnimation ? tempAnimationScope : tempParallaxScope, function(target) {
                tempAssistContents.push(target);
            })
            abstractContents = tempAssistContents;
            break
    }

    batcheCreate = null;

    return abstractContents;
}