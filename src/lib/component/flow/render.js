
/**
 * dom...
 */
export default function render({
    $containsNode,
    dataNode,
    chapterId,
    callback
} = {}) {
    const $container = $(dataNode.html())
    Xut.nextTick({
        container: $containsNode,
        content: $container
    }, () => callback($container))
}
