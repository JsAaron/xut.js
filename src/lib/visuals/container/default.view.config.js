/**
 * 设置默认的视图尺寸
 * @return {[type]} [description]
 */
export default function(config) {
    const viewSize = config.viewSize
    return {
        viewWidth: viewSize.width,
        viewHeight: viewSize.height,
        viewTop: viewSize.top,
        viewLeft: 0
    }
}
