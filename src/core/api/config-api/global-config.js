/**
 * 全局配置文件
 * 2种使用方式
 *   1：Xut.Application.setConfig
 *   2：Xut.Application.Launch
 * @type {[type]}
 */

const DEFAULT = undefined

export default {

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
   * 5: 竖版显示横版PPT：高度100%，双页面模式
   *
      1 全屏自适应
      2 宽度100%，自适应高度
      3 高度100%, 自适应宽度
      4 画轴模式
      5 虚拟页面模式

      用户接口设定> PPT数据库设定 > 默认取1
   */
  visualMode: DEFAULT, //等填充


  /**
   * 全局翻页模式
   * 给妙妙单独开的一个模式
   * 一个novel对应多个season表 所以这里其实不能算全局设置，可以存在多个novel
   * novel表定义，数据库定义的翻页模式
   * 用来兼容客户端的制作模式
   * 妙妙学模式处理，多页面下翻页切换
   *
   * 后期增加竖版模式修正接口
   *
   * scrollMode
   *   横版翻页 horizontal  h
   *   竖版翻页 vertical    v
   *
   */
  scrollMode: 'h',

  /**
   * 切换切换模式
   * 多模式判断
   * 如果
   *   缓存存在
   *   否则数据库解析
         数据库filpMode全局翻页模式
         0 滑动翻页 =》true
         1 直接换  =》 false
   * 所以pageFlip只有在左面的情况下
   * @type {Boolean}
   */
  gestureSwipe: DEFAULT, //等之后全局设置，或者数据库填充，这里可以全局优先

  /**
   * 是否预加载资源
   * 每次翻页必须等待资源加载完毕后才可以
  //2017.9.1
  //如果不是浏览器模式
  //强制关闭预加载模式
   * @type {Boolean}
   */
  preload: DEFAULT, //可以填数量，预加载的数量限制

  /*
  跨域处理资源
  资源转化处理，默认资源可能是svg，在跨域的情况下没办法访问
  比如，mini客户端
  所以svg的资源会强制转化成js
   */
  crossDomain: DEFAULT, //默认不处理svg转化  参数 'svg'

  /**
   * 是否关闭启动动画，默认是true启动，false为关闭
   * 加快进入的速度
   */
  launchAnim: true,

  /**
   * 双页面模式，竖版ppt在横版显示
   * 一个view中，显示2个page
   * 一个页面宽度50%，拼接2个页面100%
   * 默认禁止：
   * 1 true 启动
   * 2 false 禁止
   */
  doublePageMode: false,

  /**
   * 监听代码追踪
   * type:类型
   *   keepAppTime //应用运行时间
   *   keepPageTime //每个页面运行时间
   *   action => (包含，content的事件，action,audio,video,widget零件触发的事件)
   *
   *  options:参数
   *    keepAppTime => time 运行时间
   *    keepPageTime => time 运行时间
   *
   *    action => {
   *      appId  应用的id
   *      appName 应用标题
   *      id 元素的id
   *      type  触发的类型
   *      pageId 页面的id,对应数据库chapter ID
   *      eventName 事件名
   *    }
   *
    Xut.Application.Watch('trackCode', function(type, options) {
        console.log(type, options)
        switch (type) {
            case 'launch':
                break;
            case 'init':
                break;
            case 'exit':
                break;
            ...........
        }
    }
    launch    应用启动后触发
    init      初始化加载完毕，能显示正常页面后触发
    exit      应用关闭触发
    flip      翻页触发
    content   点击有事件对象触发(content类型)
    hot       点击没有绑定事件,但是又能触发的对象(除了content的其余对象)
    swipe     垂直滑动触发

    ['launch', 'init', 'exit', 'flip', 'content', 'hot'，'swipe']

    特别注意，配置中有'content' 'hot'
    但是实际返回的数据中改成了统一接口 action然后type带类型

   */
  trackCode: null,

  /**
  * 图片模式webp
     0：旧版本
     1：自适应
     2：Ios
     3：Android
、
     brMode === 0，则什么都不变

     brMode === 1/2/3，
       在线版：
         brMode为ios或android，获取了数据库的文件名之后，去掉扩展名。
         如果是ios，则文件名之后加上_i
         Android，则文件名之后，加上_a

       本地版：
         brMode为ios或android，后缀不改变，用数据库定义的文件名

       图像带有蒙板
         首先，忽略蒙板设置
         然后按照上面的规则，合成新的文件名即

    2017.8.4
      如果有perload那么就会自适应 webp/apng
      如果没有就强制为0，只支持png,jpng
  */
  brMode: 0,

  /**
   * 是否启动分栏高度检测
   * 变更依赖
   * 如果检测到有column数据，会自动启动
   */
  columnCheck: DEFAULT, //如果强制false了就是永远关闭，如果DEFAULT就让其默认处理

  /**
   * 迷你杂志页码显示配置
   * 1 数字 digital (默认)
   * 2 原点 circular {
   *            mode: 1/2/3/4/5/6
   *            position:
   *        }
   * 3 滚动工具栏 scrollbar
   *             direction 滚动方向 'v' / 'h'
   *
   * 组合模式['digital','circular','scrollbar']
   * @type {Object}
   *
   * 2017.12.4
   * 新增秒秒学全局工具栏
   *
   * pageBar：{
   *   type:'globalBar'
   *   mode:1/2/3/4/5/6
   *   float:true //是否全局浮动
   *   button:{
   *     keepLearn  继续学习
   *     commitWork 提交作业
   *     forum
   *   }
   *   hasNextSection:是否有下一个ppt  这个给苗苗学使用，是否用来显示原点
   * }
   *
   *
   */
  pageBar: {
    type: 'digital',
    mode: DEFAULT,
    position: DEFAULT
  },

  /**
   * 是否支持鼠标滑动
   * @type {Boolean}
   * false 关闭
   */
  mouseWheel: DEFAULT, //默认根据横竖屏幕自定义

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
   * 1 cursor:false 关闭
   * 2 可配置
   *   cursor: {
   *      url: 'images/icons/showNote.png',
   *      time: 500
   *   },
   * @type {[type]}
   */
  cursor: {
    delayTime: DEFAULT, //延时间显示时间
    url: DEFAULT //url
  },

  /**
   * 启动自适应图片分辨率
   * iphone的750*1334，android的720*1280及以下的设备，用标准的
   * iphone plus的1080*1920，android的1080*1920，用mi后缀的
   * android的1440*2560用hi后缀的
   *{
   *   750: '', //0-750
   *   1080: '', //mi:751-1080
   *   1440: '' //hi:1081->
   *}
   */
  imageSuffix: null,

  /**
   * @私有方法
   * 基础图片后缀
   * content类型
   * flow类型
   * @type {String}
   * 通过imageSuffix方法填充
   */
  baseImageSuffix: '',

  /**
   * 不使用高清图片
   * false
   * true
   */
  useHDImageZoom: true,

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
  historyMode: DEFAULT, //不处理，因为有调试的方式

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
   * 存储模式
   * 0 APK应用本身
   * 1 外置SD卡
   */
  storageMode: 0
}
