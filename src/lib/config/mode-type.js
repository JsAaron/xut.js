/**
 * 模式配置
 */
export default {

    /**
     * 页面可视模式
     * 2016.9.19
     * 4种分辨率显示模式:
     * 默认全屏缩放
     *
     * 0：永远100%屏幕尺寸自适应
     *
     * 1：按照宽度正比缩放,高度正比缩放，居中(适应画轴拼接模式)
     *
     * 2：宽度100% 正比自适应高度
     *     横版PPT：
     *        1：横板显示(充满全屏。第1种模式)
     *        2：竖版显示(宽度100%。上下自适应，显示居中小块)
     *     竖版PPT:
     *        1: 竖版显示(宽度100%。上下空白，显示居中，整体缩短, 整理变化不大)
     *        2: 在横版显示(高度100%，缩放宽度，左右留边)
     *
     * 3：高度100% 正比自适应宽度
     *     横版：
     *        1：横板显示(充满全屏。第1种模式)
     *        2：竖版显示(宽度100%。上下自适应，显示居中小块)
     *     竖版:
     *        1: 竖版ppt竖版显示(高度100%。宽度溢出，只显示中间部分，整体拉长)
     *        2: 竖版ppt在横版显示(高度100%，显示居中，左右空白，整体缩短)
     * @type {Number}
     */
    visualMode: 0,

    /**
     * 双页面模式，竖版ppt在横版显示
     * 一个view中，显示2个page
     * 一个页面宽度50%，拼接2个页面100%
     * 高度正比，这样高度不溢出，中间布局留空白
     */
    doublePageMode: false,

    /**
     * 画轴模式
     * 在不同分辨率下，按照正比缩放拼接
     * 在一个可视区中，可以看到3个li拼接后的效果
     * [scrollPaintingMode description]
     * @type {Boolean}
     */
    scrollPaintingMode: false,

    /**
     * 虚拟模式
     * 采用word排版，如果是横屏的布局放到竖版的手机上
     * 就需要分割排版布局
     * 1:画轴模式默认横版ppt,竖版默认启动虚拟模式分栏
     * @type {Boolean}
     */
    virtualMode: false,

    /**
     * 全局翻页模式
     * 数据库定义的翻页模式
     * 用来兼容客户端的制作模式
     * 妙妙学模式处理，多页面下翻页切换
     * 0 通过滑动翻页
     * 1 (锁掉滑动),直接快速切换页面(通过左右按键快速切换页面)
     * @type {Number}
     */
    flipMode: 0,

    /**
     * 是否启动页面缩放
     * @type {Number}
     * 1 true 启动
     * 2 false 禁止
     */
    saleMode: false,

    /**
     * 调试模式
     * 如果启动桌面调试模式,自动打开缓存加载,就是每次都打开都回到最后看到的一页
     * [debugMode description]
     * @type {Boolean}
     */
    debugMode: false,

    /**
     * 独立canvas模式处理
     * 为了测试方便
     * 可以直接切换到dom模式
     * @type {Boolean}
     */
    onlyDomMode: false,

    /**
     * 直接通过数据库的历史记录定位到指定的页面
     * Xut.View.LoadScenario({
     *     'scenarioId' : scenarioInfo[0],
     *     'chapterId'  : scenarioInfo[1],
     *     'pageIndex'  : scenarioInfo[2]
     *  })
     *  {
     *     'scenarioId' : 7,
     *     'chapterId'  : 9
     *  }
     * @type {Boolean}
     */
    deBugHistory: false
}
