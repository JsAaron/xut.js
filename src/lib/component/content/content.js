/**
 * 创建执行对象
 * 1 动画作用域
 * 2 视觉差作用域
 * @type {Array}
 */

import { Animation } from './animation'
import { Parallax } from './parallax'

import { Container } from '../pixi/container'


/**
 * 预运行动作
 * 自动 && 出现 && 无时间 && 无音乐
 *  && 不是精灵动画 && 没有脚本代码 && 并且不能是收费
 * @return {[type]}         [description]
 */
function preRunAction(data, eventName) {
    var para, scopem,
        parameter = data.getParameter();
    //过滤预生成动画
    if (parameter.length === 1) {
        para = parameter[0];
        if (para.animationName === 'EffectAppear' && eventName === 'auto' && !para.videoId && !para.delay && data.contentDas.category !== 'Sprite' && !para.preCode //动画前脚本
            && !para.postCode //动画后脚本
            && !/"inapp"/i.test(para.parameter)) { //并且不能是收费处理

            /***********************************************
             *      针对预处理动作,并且没有卷滚的不注册
             *      满足是静态动画
             * **********************************************/
            //true是显示,false隐藏
            return data.isRreRun = /"exit":"False"/i.test(para.parameter) === true ? 'visible' : 'hidden';
        }
    }
}


/**
 * 构建动画
 * @return {[type]} [description]
 */
function createScope(base, contentId, pid, actName, contentDas, parameter, hasParallax) {
    //默认启动dom模式
    var data = {
            type: 'dom',
            canvasMode: false,
            domMode: true
        },
        $contentProcess,
        pageType = base.pageType;


    //如果启动了canvas模式
    //改成作用域的一些数据
    if (base.canvasRelated.enable) {
        //如果找到对应的canvas对象
        if (-1 !== base.canvasRelated.cid.indexOf(contentId)) {
            //创建canvas容器
            $contentProcess = Container(contentDas,base.rootNode)
            data.type = 'canvas';
            data.canvasMode = true;
            data.domMode = false;
        }
    }

    //如果是dom模式
    if (!$contentProcess) {
        /**
         * 确保节点存在
         * @type {[type]}
         */
        if (!($contentProcess = base._findContentElement(actName))) {
            return;
        };
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
        $contentProcess: $contentProcess,
        pageType: pageType,
        pageIndex: base.pageIndex,
        canvasRelated: base.canvasRelated,
        nextTask: base.nextTask
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
        data.processType = 'parallax';
    } else {
        data.processType = 'animation';
    }


    //生成查询方法
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
     * 生成视觉差作用域
     * @type {[type]}
     */
    if (data.processType === 'parallax') {
        //初始化视觉差对象的坐标偏移量
        data.transformOffset = base.relatedData.transformOffset(data.id);
        return Parallax.call(base, data);
    }

    /**
     *  优化机制,预生成处理
     *  过滤自动热点并且是出现动作，没有时间，用于提升体验
     */
    preRunAction(data, base.eventData.eventName)
 

    /**
     * 生成子作用域对象，用于抽象处理动画,行为
     */
    return new Animation(data);
}


/**
 * 分解每个子作用域
 * 1 生成临时占位作用域,用于分段动画
 * 2 生成所有动画子作用域
 * @param  {[type]} parameter [description]
 * @return {[type]}           [description]
 */
function createHandlers(base, parameter, waitCreate) {
    /**
     * 如果是动态分段创建
     * 混入新的作用域
     */
    if (waitCreate) {
        return createScope.apply(base, parameter);
    }

    //dom对象
    var para = parameter[0],
        contentId = para['contentId'], //可能有多个动画数据 [Object,Object,Object]
        pid = base.pid,
        actName = base._makePrefix('Content', pid, contentId),
        contentDas = base.relatedData.contentDas[contentId];

    /**
     * 客户端未实现
     * 针对分段创建优化
     * 初始化必要加载数据
     * 临时占位数据
     */
    // if(contentDas && 1==contentDas.visible){
    //  //记录分段标记,用户合并创建节点
    //  base.waitCreateContent.push(contentId)
    //  return [contentId, pid, actName, contentDas, parameter];
    // }

    /**
     * 构建子作用域
     */
    return createScope(base, contentId, pid, actName, contentDas, parameter, para.masterId);
}



/**
 * 构建作用域
 * @return {[type]} [description]
 */
function fnCreate(base) {
    return function(data, callback) {
        var para, handlers;
        if (data && data.length) {
            //生成动画作用域对象
            while (para = data.shift()) {
                if (handlers = createHandlers(base, para)) {
                    callback(handlers);
                }
            }
        }
    }
}


/**
 * 源对象复制到目标对象
 */
function innerExtend(target, source) {
    for (property in source) {
        if (target[property] === undefined) {
            target[property] = source[property];
        }
    }
}


//处理itemArray绑定的动画对象
//注入动画
//绑定用户事件
export function Content(base) {
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
                        var id = target.id,
                            source;
                        if (source = tempParallaxScope[id]) { //如果能找到就需要合并
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
