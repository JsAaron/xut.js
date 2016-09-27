
import nextTick from '../../util/nexttick'

/**
 * dom...
 */
export default function render({
    containsNode,
    dataNode,
    chapterId,
    callback
} = {}) {
    const $container = $(dataNode.html())
    nextTick({
        container: containsNode,
        content: $container
    }, () => callback($container))
}
