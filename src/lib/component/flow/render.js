
/**
 * dom...
 */
export default function render({
    $pinchNode,
    dataNode,
    chapterId,
    callback
} = {}) {
    const $container = $(dataNode.html())
    Xut.nextTick({
        container: $pinchNode,
        content: $container
    }, () => callback($container))
}
