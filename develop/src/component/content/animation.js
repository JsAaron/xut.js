/*********************************************************************
 *
 * content的动画类对象
 * 1 ppt 动画
 * 2 精灵动画
 * 3 show/hide接口
 * 4 canvas动画
 * @return {[type]} [description]
 *
 ********************************************************************/
// define('conBehavior', [
//     'Config',
//     'Sprite',
//     'pixiSpirit'
// ], function(Config, Sprite, pixiSpirit) {


//dom精灵动画
import {
    Sprite as domSprite
}
from './plug/sprite'
//pixi普通精灵动画
import {
    Sprite as pixiSpirit
}
from '../pixi/sprite'

/**
 * 销毁动画音频
 * @param  {[type]} videoIds  [description]
 * @param  {[type]} chapterId [description]
 * @return {[type]}           [description]
 */
function destroyContentAudio(videoIds, chapterId) {
    var isExist = false;
    //如果有音频存在
    videoIds && _.each(videoIds, function(data, index) {
        //如果存在对象音频
        if (data.videoId) {
            isExist = true;
            return 'breaker';
        }
    })
    if (isExist) {
        Xut.AudioManager.clearContentAudio(chapterId)
    }
}

/**
 * 判断是否存在
 * @return {Boolean} [description]
 */
function bind(instance, success, fail) {
    if (instance) {
        success.call(instance, instance)
    } else {
        fail && fail()
    }
}


var uid = 0

/**
 * 依赖订阅
 */
function Dep() {
    this.id = uid++;
    this.subs = []
}
Dep.prototype.addSub = function(sub) {
    this.subs.push(sub)
}
Dep.prototype.removeSub = function(sub) {
    this.subs = [];
}
Dep.prototype.notify = function() {
    if (this.subs.length) {
        console.log('依赖队列')
    }
}


/**
 * 动画对象控制
 * @param {[type]} options [description]
 */
var Animation = function(options) {
    //mix参数
    _.extend(this, options);
}


var animProto = Animation.prototype;


/**
 * 绑定动画
 * 为了向上兼容API
 * element 
 *  1 dom动画
 *  2 canvas动画
 * @param  {[type]} context   [description]
 * @param  {[type]} rootNode  [description]
 * @param  {[type]} chapterId [description]
 * @param  {[type]} parameter [description]
 * @param  {[type]} pageType  [description]
 * @return {[type]}           [description]
 */
animProto.init = function(id, context, rootNode, chapterId, parameter, pageType) {

    var canvasRelated = this.canvasRelated;
    var pageIndex = this.pageIndex;
    var self = this;
    var actionTypes;
    var create = function(constructor, newContext) {
        return new constructor(pageIndex, pageType, chapterId, newContext || context, parameter, rootNode);
    }

    //dom模式
    if (this.domMode) {
        //ppt动画
        this.pptObj = create(PptAnimation);
        //普通精灵动画
        this.domSprites = this.contentDas.category === 'Sprite' ? true : false;
    }

    //canvas模式
    //比较复杂
    //1 普通与ppt组合
    //2 高级与ppt组合
    //3 ppt独立
    //4 普通精灵动画
    //  其中 高级精灵动画是widget创建，需要等待
    if (this.canvasMode) {

        //动作类型
        //可能是组合动画
        actionTypes = this.contentDas.actionTypes

        //精灵动画
        if (actionTypes.spiritId) {
            //加入任务队列
            this.nextTask.context.add(id)
            this.pixiSpriteObj = new pixiSpirit(this.contentDas, canvasRelated);
            //ppt动画
            if (actionTypes.pptId) {
                //构建精灵动画完毕后
                //构建ppt对象
                this.pixiSpriteObj.$once('load', function() {
                    //content=>MovieClip
                    self.pptObj = create(CanvasAnimation, this.movie);
                    //任务完成
                    self.nextTask.context.remove(id)
                })
            }
        }

        //高级精灵动画
        //这个比较麻烦
        //因为精灵动画是widget创建类型
        //所以代码需要延后，等待高级content先创建
        if (actionTypes.widgetId) {
            this.linker = function() {
                return function widgetppt(context) {
                    self.pptObj = create(CanvasAnimation, context.sprObjs[0].advSprite);
                    self.linker.dep.notify(self.pptObj)
                }
            }();
            // 收集依赖
            this.linker.dep = new Dep()
        }
    }

};

/**
 * 运行动画
 * @param  {[type]} scopeComplete   [动画回调]
 * @param  {[type]} canvasContainer [description]
 * @return {[type]}                 [description]
 */
animProto.run = function(scopeComplete) {

    var self = this,
        defaultIndex,
        element = this.$contentProcess;

    var pptRun = function(animObj) {
            //优化处理,只针对互斥的情况下
            //处理层级关系
            if (element.prop && element.prop("mutex")) {
                element.css({ //强制提升层级
                    'display': 'block'
                })
            }
            //指定动画
            animObj.runAnimation(scopeComplete);
        }
        //ppt动画
    bind(this.pptObj, pptRun)

    //canvas精灵动画
    bind(this.pixiSpriteObj, function(animObj) {
        animObj.playPixi(scopeComplete);
    })

    //dom精灵动画
    if (this.domSprites && element) {
        //存在动画
        if (this.spriteObj) {
            this.spriteObj.playSprites();
            return;
        }
        element = this.$contentProcess.find('.sprite').show();
        this.spriteObj = domSprite({
            element: element,
            data: this.contentDas,
            id: this.id,
            mode: 'css'
        });
    }
}


/**
 * 停止动画
 * @param  {[type]} chapterId [description]
 * @return {[type]}           [description]
 */
animProto.stop = function(chapterId) {

    //ppt动画
    bind(this.pptObj, function(animObj) {
        //销毁ppt音频
        destroyContentAudio(animObj.options, chapterId);
        //停止PPT动画
        animObj.stopAnimation();
    })

    //canvas精灵
    bind(this.pixiSpriteObj, function(animObj) {
            animObj.stopPixi();
        })
        //dom精灵
    bind(this.spriteObj, function(sprObj) {
        sprObj.pauseSprites();
    });
}


/**
 * 翻页结束，复位上一页动画
 * @return {[type]} [description]
 */
animProto.reset = function() {
    bind(this.pptObj, function(animObj) {
        animObj.resetAnimation();
    })
}


/**
 * 销毁动画
 * @return {[type]} [description]
 */
animProto.destroy = function() {

    //canvas
    bind(this.pixiSpriteObj, function(animObj) {
        animObj.destroyPixi();
    })

    //dom ppt
    bind(this.pptObj, function(animObj) {
        animObj.destroyAnimation();
    })

    //dom 精灵
    bind(this.spriteObj, function(sprObj) {
        sprObj.stopSprites();
    });

    this.pptObj = null;
    this.spriteObj = null;
    this.getParameter = null;
    this.pixiSpriteObj = null;
}

export {
    Animation
}

