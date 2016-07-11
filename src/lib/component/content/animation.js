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

import { PPT } from './extension/ppt/index'
import { ComSpirit } from './extension/comspirit'
import { AdvSpirit } from './extension/advSpirit'
import { Sprite as pixiSpirit } from '../pixi/sprite/index'
import { specialSprite as pixiSpecial } from '../pixi/special/index'
import { clearContentAudio } from '../audio/manager'


/**
 * 销毁动画音频
 * @param  {[type]} videoIds  [description]
 * @param  {[type]} chapterId [description]
 * @return {[type]}           [description]
 */
let destroyContentAudio = (videoIds, chapterId) => {
    let isExist = false;
    //如果有音频存在
    videoIds && _.each(videoIds, (data) => {
        //如果存在对象音频
        if (data.videoId) {
            isExist = true;
            return 'breaker'
        }
    })
    if (isExist) {
        clearContentAudio(chapterId)
    }
}

/**
 * 判断是否存在
 * @return {Boolean} [description]
 */
let bind = (instance, success, fail) => {
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
export class Animation {

    constructor(options) {
        //mix参数
        _.extend(this, options);
    }

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
    init(id, context, rootNode, chapterId, parameter, pageType) {

        let pageIndex, self, actionTypes, makeOpts, initstate, create, createPixiPPT, $veiw, setState, category

        self = this
        category = this.contentDas.category
        pageIndex = this.pageIndex

        create = (constructor, newContext) => {
            let element = newContext || context
            if (element.length) {
                return new constructor(pageIndex, pageType, chapterId, element, parameter, rootNode);
            } else {
                console.log(id, this)
            }
        }

        //dom模式
        if (this.domMode) {
            //ppt动画
            this.pptObj = create(PPT);

            //type choose
            switch (category) {
                //普通精灵动画
                case "Sprite":
                    this.domSprites = true
                    break
                case "AdvSprite":
                    this.advSpiritObj = new AdvSpirit({
                        element: this.$contentProcess.find('.sprite').show(),
                        data: this.contentDas,
                        id: this.id
                    })
                    this.advSpiritObj.play()
                    break
            }
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
            createPixiPPT = () => {
                //parameter存在就是ppt动画
                if ((parameter || actionTypes.pptId) && this.$contentProcess.view) {
                    this.pptObj = create(PPT, $(this.$contentProcess.view));
                    this.pptObj.contentId = id
                }
            }

            $veiw = this.$contentProcess.view
            if ($veiw) {
                initstate = $veiw.getAttribute('data-init')
            }

            setState = () => {
                $veiw.setAttribute('data-init', true)
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
                    this.pixiObj.$once('load', () => {
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
    }


    /**
     * 运行动画
     * @param  {[type]} scopeComplete   [动画回调]
     * @param  {[type]} canvasContainer [description]
     * @return {[type]}                 [description]
     */
    run(scopeComplete) {

        var element = this.$contentProcess
            //canvas
        if (element && element.view) {
            element = this.$contentProcess.view
        }

        //ppt动画
        //dom与canvas
        bind(this.pptObj, (ppt) => {
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
        bind(this.pixiObj, (pixi) => {
            pixi.playAnim(scopeComplete);
        })

        //dom精灵动画
        if (this.domSprites && element) {
            //存在动画
            if (this.spriteObj) {
                this.spriteObj.playSprites();
                return;
            }
            this.spriteObj = ComSpirit({
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
    stop(chapterId) {

        //ppt动画
        bind(this.pptObj, (ppt) => {
            //销毁ppt音频
            destroyContentAudio(ppt.options, chapterId);
            //停止PPT动画
            ppt.stopAnimation();
        })

        //pixi动画
        bind(this.pixiObj, (pixi) => {
            pixi.stopAnim()
        })

        //dom精灵
        bind(this.spriteObj, (sprObj) => {
            sprObj.pauseSprites();
        });
    }


    /**
     * 翻页结束，复位上一页动画
     * @return {[type]} [description]
     */
    reset() {
        bind(this.pptObj, (ppt) => {
            ppt.resetAnimation();
        })
        bind(this.pixiObj, (ppt) => {
            ppt.resetAnim();
        })
    }


    /**
     * 销毁动画
     * @return {[type]} [description]
     */
    destroy() {

        //ppt
        bind(this.pptObj, (ppt) => {
            ppt.destroyAnimation();
        })

        //canvas
        bind(this.pixiObj, (pixi) => {
            pixi.destroyAnim();
        })

        //dom 精灵
        bind(this.spriteObj, (sprObj) => {
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

}
