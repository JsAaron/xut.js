/*
内部调试配置
 */
const DEFAULT = undefined

export default {

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
    main: DEFAULT, //主场景，系统工具栏
    deputy: DEFAULT, //副场景，函数工具栏
    number: DEFAULT //独立配置，默认会启动页面，针对分栏处理
  },

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
  deBugHistory: DEFAULT,

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
  pageMode: DEFAULT //默认不设置，待数据库填充。如设置,数据库设置忽略

}
