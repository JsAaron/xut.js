import { config } from '../../config/index'
import render from './render'

/**
 * 2017.9.7
 * 流式排版
 */
export default class Flow {

    constructor(base, callback) {

        const self = this
        this.callback = callback
        this.base = base

        const rootNode = base.element
        const chapterId = base.chapterId
        const domId = 'chapter-' + chapterId
        const dataNode = $("#" + domId)

        render({
            rootNode,
            dataNode,
            chapterId,
            callback($container, $content) {
                self._init($container, $content)
            }
        })
    }


    _init($container, $content) {

        //分段数
        const pagesCount = this._resolveHeight($content)

        this.callback()

        console.log(pagesCount)

    }


    /**
     * parse height
     * @return {[type]} [description]
     */
    _resolveHeight($content) {
        const theChildren = $content.children()
        let paraHeight = 0
        for (let i = 0; i < theChildren.length; i++) {
            paraHeight += $(theChildren[i]).height()
        }
        return Math.floor(paraHeight / config.viewSize.height)
    }




}
