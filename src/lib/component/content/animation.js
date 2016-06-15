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

//dom精灵动画
import { Sprite as domSprite } from './plug/domsprite'
//dom ppt动画
import { PptAnimation } from './plug/domppt/index'
//pixi普通精灵动画
import { Sprite as pixiSpirit } from '../pixi/sprite/index'
//pixi特殊高级动画
import { specialSprite as pixiSpecial } from '../pixi/special/index'

/**
 * 销毁动画音频
 * @param  {[type]} videoIds  [description]
 * @param  {[type]} chapterId [description]
 * @return {[type]}           [description]
 */
function destroyContentAudio(videoIds, chapterId) {
    var isExist = false;
    //如果有音频存在
    videoIds && _.each(videoIds, function (data) {
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



/**
 * 动画对象控制
 * @param {[type]} options [description]
 */
var Animation = function (options) {
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
animProto.init = function (id, context, rootNode, chapterId, parameter, pageType) {

    var pageIndex = this.pageIndex
    var self = this
    var actionTypes
    var makeOpts
    var initstate

    var create = function (constructor, newContext) {
        var element = newContext || context
        if (element.length) {
            return new constructor(pageIndex, pageType, chapterId, element, parameter, rootNode);
        } else {
            console.log(id, self)
        }

    }

    //dom模式
    if (this.domMode) {
        //ppt动画
        this.pptObj = create(PptAnimation);
        //普通精灵动画
        this.domSprites = this.contentDas.category === 'Sprite' ? true : false;
        return
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
        makeOpts = {
            data: this.contentDas,
            renderer: this.$contentProcess,
            pageIndex: this.pageIndex
        }


        //创建pixi上下文的ppt对象
        var createPixiPPT = function () {
            //parameter存在就是ppt动画
            if ((parameter || actionTypes.pptId) && self.$contentProcess.view) {
                self.pptObj = create(PptAnimation, $(self.$contentProcess.view));
                self.pptObj.contentId = id
            }
        }
        
        var $veiw = this.$contentProcess.view
        if($veiw){
            initstate =  $veiw.getAttribute('data-init')
        }

        var setState  = function () {
             $veiw.setAttribute('data-init',true)
        }
        
        //多个canvas对应多个ppt
        //容器不需要重复创建
        //精灵动画
        if (actionTypes.spiritId) {
            if (initstate) {
                createPixiPPT()
            } else {
                //加入任务队列
                this.nextTask.context.add(id)
                this.pixiObj = new pixiSpirit(makeOpts);
                //防止多条一样的数据绑多个动画
                //构建精灵动画完毕后
                //构建ppt对象
                this.pixiObj.$once('load', function () {
                    //ppt动画
                    createPixiPPT()
                    //任务完成
                    self.nextTask.context.remove(id)
                })
                setState()
            }
        }

        //特殊高级动画
        //必须是ppt与pixi绑定的
        if (actionTypes.compSpriteId) {
            
            // console.log(this,this.id,this.contentDas.initpixi)
            //这个dom已经创建了pixi了
            if (initstate) {
                 createPixiPPT()
            } else {
                this.pixiObj = new pixiSpecial(makeOpts);
                setState()
                //ppt动画
                createPixiPPT()
            }
            
        }
    }

};


/**
 * 运行动画
 * @param  {[type]} scopeComplete   [动画回调]
 * @param  {[type]} canvasContainer [description]
 * @return {[type]}                 [description]
 */
animProto.run = function (scopeComplete) {

    //div and canvas of nodes
    var element = this.$contentProcess.view
        ? this.$contentProcess.view
        : this.$contentProcess;


    //ppt动画
    //dom与canvas
    bind(this.pptObj, function (ppt) {
        //优化处理,只针对互斥的情况下
        //处理层级关系
        if (element.prop && element.prop("mutex")) {
            element.css({ //强制提升层级
                'display': 'block'
            })
        }

        //指定动画
        ppt.runAnimation(scopeComplete);
    })

    //pixi动画
    bind(this.pixiObj, function (pixi) {
        pixi.playAnim(scopeComplete);
    })

    //dom精灵动画
    if (this.domSprites && element) {
        //存在动画
        if (this.spriteObj) {
            this.spriteObj.playSprites();
            return;
        }
        this.spriteObj = domSprite({
            element: this.$contentProcess.find('.sprite').show(),
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
animProto.stop = function (chapterId) {

    //ppt动画
    bind(this.pptObj, function (ppt) {
        //销毁ppt音频
        destroyContentAudio(ppt.options, chapterId);
        //停止PPT动画
        ppt.stopAnimation();
    })

    //pixi动画
    bind(this.pixiObj, function (pixi) {
        pixi.stopAnim()
    })

    //dom精灵
    bind(this.spriteObj, function (sprObj) {
        sprObj.pauseSprites();
    });
}


/**
 * 翻页结束，复位上一页动画
 * @return {[type]} [description]
 */
animProto.reset = function () {
    bind(this.pptObj, function (ppt) {
        ppt.resetAnimation();
    })
    bind(this.pixiObj, function (ppt) {
        ppt.resetAnim();
    })
}


/**
 * 销毁动画
 * @return {[type]} [description]
 */
animProto.destroy = function () {

    //ppt
    bind(this.pptObj, function (ppt) {
        ppt.destroyAnimation();
    })

    //canvas
    bind(this.pixiObj, function (pixi) {
        pixi.destroyAnim();
    })

    //dom 精灵
    bind(this.spriteObj, function (sprObj) {
        sprObj.stopSprites();
    });

    //销毁renderer = new PIXI.WebGLRenderer
    if (this.canvasMode) {
        //rederer.destroy()
        this.$contentProcess.view && this.$contentProcess.destroy()
    }

    //销毁每一个数据上的canvas上下文引用
    if (this.contentDas.$contentProcess) {
        this.contentDas.$contentProcess = null;
    }
    
    this.pptObj = null;
    this.spriteObj = null;
    this.getParameter = null;
    this.pixiObj = null;
}

export {
Animation
}
