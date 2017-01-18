/* @flow */

/**
 * 默认值，未定义
 * @type {[type]}
 */
const DEFAULT: void = undefined

export type Config = {
    platform: void;
    quickFlip: boolean;
    silent: boolean;
    supportQR: boolean;
    visualHeight: ? number | void;
    visualTop: number;
    hqUrlSuffix: void;
    lauchMode: ? number | void;
}

const config: Config = {

    /**
     * 适配平台
     * mini //迷你杂志
     * @type {[type]}
     */
    platform: DEFAULT,

    /**
     * 是否支持快速翻页
     * 这个为超星处理，可以配置关闭快速翻页，必须要等页面创建完毕后才能翻页
     */
    quickFlip: true, //默认是支持

    /**
     * 支持调试模式
     * @type {[type]}
     */
    devtools: process.env.NODE_ENV !== 'production',

    /**
     * 是否支持错误日志打印
     * @type {Boolean}
     */
    silent: process.env.NODE_ENV !== 'production',

    /**
     * 支持二维码图片
     * 如果有二维码针对img元素放开默认行为的阻止
     * @type {Boolean}
     */
    supportQR: false,

    /**
     * 控制可视区的高度
     * 给mini杂志的客户端使用
     * 因为有工具栏挤压的问题
     */
    visualHeight: DEFAULT,
    visualTop: 0, //根据高度内部算出的top提供给缩放图片的全屏放大使用

    /**
     * 忙碌光标
     * cursor: {
     *   url: 'images/icons/showNote.png',
     *   time: 500
     * },
     * @type {[type]}
     */
    cursor: {
        delayTime: DEFAULT, //延时间显示时间
        url: DEFAULT //url
    },

    /**
     * 配置高清图的标记
     * 为flow提供高清图片接口"
     *  if (config.hqUrlSuffix) {
     *      src = src.replace('.', `.${config.hqUrlSuffix}.`)
     *  }
     */
    hqUrlSuffix: DEFAULT,

    /**
     * 页面可视模式
     * 2016.9.19
     * 4种分辨率显示模式:
     * 默认全屏缩放
     * 1：永远100%屏幕尺寸自适应
     * 2：宽度100% 正比自适应高度
     *     横版PPT：
     *        1：横板显示(充满全屏。第1种模式)
     *        2：竖版显示(宽度100%。上下自适应，显示居中小块)
     *     竖版PPT:
     *        1: 竖版显示(宽度100%。上下空白，显示居中，整体缩短, 整理变化不大)
     *        2: 在横版显示(高度100%，缩放宽度，左右留边)
     *
     * 3: 高度100%,宽度溢出可视区隐藏
     * 4：高度100% 正比自适应宽度
     *     横版：
     *        1：横板显示(充满全屏。第1种模式)
     *        2：竖版显示(宽度100%。上下自适应，显示居中小块)
     *     竖版:
     *        1: 竖版ppt竖版显示(高度100%。宽度溢出，只显示中间部分，整体拉长)
     *        2: 竖版ppt在横版显示(高度100%，显示居中，左右空白，整体缩短)
     *
     *
     * @type {Number}
     */
    visualMode: 1,

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
     * 是否允许图片缩放
     */
    salePicture: true, //默认启动图片缩放的
    salePictureMultiples: 4, //默认缩放的倍数4倍

    /**
     * 是否允许页面缩放页面
     * 默认情况下页面是不允许被缩放的
     * @type {[type]}
     * salePageType:'flow' / 'page' / 'all'
     * 可选项，缩放流式页面
     *        缩放page页面
     *        all全部支持
     */
    salePageType: DEFAULT, //默认页面是不允许被缩放的，这里可以单独启动页面缩放

    /**
     * 是否需要保存记录加载
     * 1 true 启动缓存
     * 2 false 关闭缓存
     * @type {[type]}
     */
    historyMode: DEFAULT, //默认不配置，这里需要数据库填充， 如果指定了false，跳过数据库填充

    /**
     * 滑动事件委托
     * 这个东东是针对mini开发的
     * 左右翻页手势提升到全局响应
     * 相应的对象形成形成事件队列
     * [content1,content2,...,翻页]
     * 1 true 启动
     * 2 false 禁止
     */
    swipeDelegate: DEFAULT, //默认关闭，min杂志自动启用

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

export default config
