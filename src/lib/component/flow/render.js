import { config } from '../../config/index'
import nextTick from '../../core/tick'

const COLUMNWIDTH = Xut.style.columnWidth
const COLUMNTAP = Xut.style.columnGap

console.log(COLUMNWIDTH)

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
    const columnGap = `${COLUMNTAP}:20px`
    const transform = 'translate3d(0, 0, 0)'

    const $container = $(`
            <section id="flow-${chapterId}" style="overflow:hidden;">
                <div id="scroller" style="position:absolute;">
                    <div style="${columnWidth};${columnHeight};${columnGap}">${dataNode.html()}</div>
                </div>
            </section>`)

    nextTick({
        container: rootNode,
        content: $container
    }, () => callback($container, $container.children('div')))
}
