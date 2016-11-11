V869.2

针对flow页面增加母版视觉差

1：限制母版页面只能有绑定一个page页面
2：因为flow的页面数，只能根据不同设备的分辨率才能确定
3：数据关于视觉差的数据都需要依赖flow的分页数确定

思路：
初始化
Component/activity/content/parallax.js
视觉差处理中，需要获取page层的flow数，如果有要根据flow数确定
1 总数pageRange
2 开始数，因为初始化的位置，前后页面布局处理currPageOffset
//如果是flow页面，拿到分页数
let pageRange = hasFlow() && getFlowFange(data.pageIndex)

if (pageRange) {
    let visualIndex = Xut.Presentation.GetPageIndex()
    if (data.pageIndex == visualIndex || data.pageIndex > visualIndex) {
        currPageOffset = 1
    } else {
        currPageOffset = pageRange
    }

切换
component/flow/flow.js
因为是视觉差，所以flow应该是在内部切换的时候调用接口处理
masterObj.movePageBaseParallax({
    action,
    direction,
    moveDist: viewBeHideDistance,
    speed: speed,
    nodes: nodes[this._hindex]
        // parallaxProcessedContetns: this.parallaxProcessedContetns
})

2点
1：moveDist的滑动距离的取值，是每次的页面的0开始值，而不是叠加值
因为nodes是叠加的，所以moveDist不能叠加

2：nodes 是根据页面总数计算出来的叠加值
    //pagesCount = 5
    // =>
    //   0.25
    //   0.5
    //   0.75
    //   1
    //   0
    _makeNodes(count) {
        let nodes = []
        let nodeProportion = 1 / (count - 1) //比值
        for (let i = 1; i < count; i++) {
            nodes.push(i * nodeProportion)
        }
        nodes.push(0)
        return nodes
    }