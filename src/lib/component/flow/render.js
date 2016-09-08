import { config } from '../../config/index'
import nextTick from '../../core/tick'

const prefix = Xut.plat.prefixStyle
const COLUMNWIDTH = prefix('column-width')
const COLUMNTAP = prefix('column-gap')
const TRANSFORM = prefix('transform')

/**
 * dom...
 */
export default function render({
    rootNode,
    dataNode,
    chapterId,
    callback
} = {}) {

    //可视区域
    const vWidth = config.viewSize.width
    const vHeight = config.viewSize.height

    const columnWidth = `${COLUMNWIDTH}:${vWidth}px`
    const columnHeight = `height:${vHeight}px`
    const columnGap = `${COLUMNTAP}:50px`
    const transform = 'translate3d(0, 0, 0);'

    const $container = $(`
            <section id="flow-${chapterId}" style="width:100%;height:100%;overflow:hidden;">
                <div style="${columnWidth};${columnHeight};${columnGap};${TRANSFORM}:${transform};">${dataNode.html()}</div>
            </section>`)

    nextTick({
        container: rootNode,
        content: $container
    }, () => callback($container, $container.children('div')))
}
