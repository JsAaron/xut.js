
import nextTick from '../../util/nexttick'

/**
 * dom...
 */
export default function render({
    rootNode,
    dataNode,
    chapterId,
    callback
} = {}) {
    const $container = $(dataNode.html())
    nextTick({
        container: rootNode,
        content: $container
    }, () => callback($container))
}
