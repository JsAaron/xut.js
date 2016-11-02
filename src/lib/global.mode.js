/**
 * 默认值，未定义
 * @type {[type]}
 */
const DEFAULT = undefined

/**
 * 模式配置
 */
export default {

    /**
     * 是否支持错误日志打印
     * @type {Boolean}
     */
    silent: process.env.NODE_ENV !== 'production',

    /**
     * 页面可视模式
     * 2016.9.19
     * 4种分辨率显示模式:
     * 默认全屏缩放
     *
     * 0：永远100%屏幕尺寸自适应
     *
     * 1：画轴模式：
     *    在不同分辨率下，按照正比缩放拼接
     *    在一个可视区中，可以看到3个li拼接后的效果
     *    按照宽度正比缩放,高度正比缩放，居中(适应画轴拼接模式)
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
     * 全局翻页模式
     * 给妙妙单独开的一个模式
     * 一个novel对应多个season表 所以这里其实不能算全局设置，可以存在多个novel
     * novel表定义，数据库定义的翻页模式
     * 用来兼容客户端的制作模式
     * 妙妙学模式处理，多页面下翻页切换
     *
     * 0 通过滑动翻页
     * 1 禁止滑动,直接快速切换页面(通过左右按键快速切换页面)
     * @type {Number}
     */
    flipMode: 0, //默认0，待数据库填充

    /**
     * 应用的加载模式
     * 0： 应用自行启动
     * 1： 应用通过接口启动
     *     Xut.Application.Launch
     *     提供全局可配置参数
     * @type {Number}
     */
    lauchMode: 0,

    /**
     * 应用横竖自适应切换
     * 默认在浏览器端打开
     * 这里可以定义打开关闭
     * 打开：1
     * 默认：0
     * [orientate description]
     * @type {[type]}
     */
    orientateMode: Xut.plat.isBrowser ? true : false,

    /**
     * 是否启动页面缩放，mini排版处理
     * 默认自动，根据是否存在flow数据处理
     * 如果强行介入，这里设置
     * 1 true 启动
     * 2 false 禁止
     */
    saleMode: false, //默认关闭

    /**
     *  仅做测试处理，因为每个section都可以对应配置pageMode参数
     *  翻页模式（数据库section指定）
     *
     *  每个场景对应自己的模式
     *  所以如果这里配置了，那么所有的场景全部统一配置了
     *  这里其实是不合理的，所以仅作为测试
     *
     *  pageMode：(如果用户没有选择任何处理，pageMode字段就为空)
     *   0 禁止滑动
     *   1 允许滑动无翻页按钮
     *   2 允许滑动带翻页按钮
     *
     *  主场景工具栏配置：默认2
     *  副场景工具栏配置：默认 0
     */
    pageMode: DEFAULT, //默认不设置，待数据库填充。如设置,数据库设置忽略

    /**
     * 仅做测试处理，因为每个section都可以对应配置tpType参数
     * 配置工具栏行为
     *
     *  工具栏类型
     *  toolType：(如果用户没有选择任何工具栏信息处理，tbType字段就为空)
     *   0  禁止工具栏
     *   1  系统工具栏   - 显示IOS系统工具栏
     *   2  场景工具栏   - 显示关闭按钮
     *   3  场景工具栏   - 显示返回按钮
     *   4  场景工具栏   - 显示顶部小圆点式标示
     *   填充数组格式，可以多项选择[1,2,3,4]
     */
    toolType: { //默认不设置，待数据库填充。如设置,数据库设置忽略
        mian: DEFAULT, //主场景，系统工具栏
        deputy: DEFAULT, //副场景，函数工具栏
        number: DEFAULT //独立配置，默认会启动页面，针对分栏处理
    },

    /**
     * 双页面模式，竖版ppt在横版显示
     * 一个view中，显示2个page
     * 一个页面宽度50%，拼接2个页面100%
     * 高度正比，这样高度不溢出，中间布局留空白
     * 默认禁止：
     * 1 true 启动
     * 2 false 禁止
     */
    doublePageMode: false,

    /**
     * 调试模式
     * 如果启动桌面调试模式,自动打开缓存加载,就是每次都打开都回到最后看到的一页
     *
     * 默认禁止：
     * 1 true 启动
     * 2 false 禁止
     * @type {Boolean}
     */
    debugMode: false,

    /**
     * 独立canvas模式处理
     * 为了测试方便
     * 可以直接切换到dom模式
     *
     * 默认禁止：
     * 1 true 启动
     * 2 false 禁止
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
    deBugHistory: DEFAULT
}
