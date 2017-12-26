import { config } from '../../../config/index'
import { create } from '../depend/multievent'
import Collection from '../depend/collection'
import initTasks from '../multithread/index'
import Factory from '../depend/factory'
import { watchColumn } from '../watch'

export default function(baseProto) {

  /**
   * 初始化多线程任务
   */
  baseProto.init = function(options) {

    const instance = this

    _.extend(instance, options)

    /**
     * 数据缓存容器
     * @type {Object}
     */
    this.dataActionGroup = {}
    this.seasonId = this.chapterData.seasonId
    this.chapterId = this.chapterData._id

    /**
     * 是否开启多线程,默认开启
     * 如果是非线性，则关闭多线程创建
     * 启动 true
     * 关闭 false
     * @type {[type]}
     */
    this.hasMultithread = this.hasMultiPage ? true : false;

    //母版处理
    if (instance.pageType === 'master') {
      this.isMaster = true;
    }

    //canvas模式
    this.canvasRelated = new Factory();

    /*有流式排版数据*/
    if (instance.chapterData.note === 'flow') {
      this.hasColumnData = true
    }

    ///////////////////////////////////////
    ///
    /// 内部钩子相关
    /// 监听状态的钩子
    /// 注册所有content对象管理
    /// 收集所有content对象
    /// 构建li主结构后,即可翻页
    /// 构建所有对象完毕后处理
    ///
    ////////////////////////////////////////

    /**
     * 缓存所有的content对象引用
     * 1对1的关系
     */
    this.contentGroup = {}

    /**
     * 抽象activtiys合集,用于关联各自的content
     * 划分各自的子作用域
     * 1对多的关系
     */
    this.activityGroup = new Collection();

    /**
     * widget热点处理类
     * 只存在当前页面
     * 1 iframe零件
     * 2 页面零件
     */
    this.componentGroup = new Collection();


    /**
     * 2016.9.7
     * column热点对象
     */
    this.columnGroup = new Collection()

    /**
     * 为mini杂志新功能
     * 动画的调用序列
     * 收集滑动委托对象，针对事件合集触发处理
     * 2016.11.8
     */
    if (config.launch.swipeDelegate) {
      this.swipeSequence = {
        swipeleft: [],
        swiperight: [],
        swipeleftTotal: 0,
        swiperightTotal: 0,
        swipeleftIndex: 0,
        swiperightIndex: 0
      }
    }

    /**
     * 页面中是最高的
     * 浮动对象分组
     * 1 母版
     * 2 页面
     */
    const floatGroup = this.floatGroup = {

      /**
       * 页面浮动对象容器
       */
      pageContainer: null,

      /**
       * 浮动页面对象
       */
      pageGroup: {},

      /**
       * 浮动母版容器
       */
      masterContainer: null,

      /**
       * 浮动母版的content对象
       * 用于边界切换,自动加上移动
       *     1：Object {}      //空对象,零件
       *     2: PPTeffect  {}  //行为对象
       */
      masterGroup: {}
    }

    /**
     * 对象的处理情况的内部钩子方法
     * 收集内部的一些状态与对象
     */
    this.divertorHooks = {

      /**
       * 多线程任务完成后
       * createTasksComplete方法中
       * 开始column观察器
       */
      threadtaskComplete() {
        watchColumn(instance, config)
      },

      /**
       * 保存Activity类实例
       */
      cacheActivity(activityInstance) {
        instance.activityGroup.add(activityInstance)
      },

      /**
       * 搜集所有的content(每一个content对象)
       * 因为content多页面共享的,所以content的合集需要保存在pageMgr中（特殊处理）
       */
      contents(chapterIndex, id, contentScope) {
        const scope = instance.baseGetContentObject[id];
        //特殊处理,如果注册了事件ID,上面还有动画,需要覆盖
        if (scope && scope.isBindEventHooks) {
          instance.contentGroup[id] = contentScope;
        }
        if (!scope) {
          instance.contentGroup[id] = contentScope;
        }
      },

      /**
       * 2014.11.7
       * 新概念，浮动页面对象
       * 用于是最顶层的，比母版浮动对象还要高
       * 所以这个浮动对象需要跟随页面动
       */
      floatPages(divertor) {

        /*component与activity共享了一个Container，所以只能处理一次*/
        if (divertor && floatGroup.pageContainer) {
          Xut.$warn({
            type: 'pagebase',
            content: 'floatPages重复pageContainer'
          })
        } else {
          floatGroup.pageContainer = divertor.container;
        }

        if (divertor.ids.length) {
          let contentObj
          _.each(divertor.ids, function(id) {
            if (contentObj = instance.baseGetContentObject(id)) {
              //初始视察坐标
              if (contentObj.parallax) {
                contentObj.parallaxOffset = contentObj.parallax.parallaxOffset;
              }
              floatGroup.pageGroup[id] = contentObj
            } else {
              Xut.$warn({
                type: 'pagebase',
                content: '页面浮动对象找不到'
              })
            }
          })
        }
      },

      /**
       * 浮动母版对象
       * 1 浮动的对象是有动画数据或者视觉差数据
       * 2 浮动的对象是用于零件类型,这边只提供创建
       *  所以需要制造一个空的容器，用于母版交界动
       */
      floatMasters(divertor) {

        /*component与activity共享了一个Container，所以只能处理一次*/
        if (divertor && floatGroup.masterContainer) {
          Xut.$warn({
            type: 'pagebase',
            content: 'floatMasters重复masterContainer'
          })
        } else {
          floatGroup.masterContainer = divertor.container;
        }

        if (divertor.ids.length) {
          let contentObj
          let contentNode
          //浮动对象
          _.each(divertor.ids, function(id) {
            //转化成实际操作的浮动对象,保存
            if (contentObj = instance.baseGetContentObject(id)) {
              //初始视察坐标
              if (contentObj.parallax) {
                contentObj.parallaxOffset = contentObj.parallax.parallaxOffset;
              }
              floatGroup.masterGroup[id] = contentObj
            } else {
              Xut.plat.isBrowser && console.log('浮动母版对象数据不存在原始对象,制作伪对象母版移动', id)

              const activity = instance.threadTaskRelated['assgin-activity']
              const contentsFragment = activity.contentsFragment

              //获取DOM节点
              if (contentsFragment) {
                const prefix = 'Content_' + instance.chapterIndex + "_"
                _.each(contentsFragment, function(dom) {
                  let makePrefix = prefix + id;
                  if (dom.id == makePrefix) {
                    contentNode = dom;
                  }
                })
              }
              //制作一个伪数据
              //作为零件类型的空content处理
              floatGroup.masterGroup[id] = {
                id: id,
                chapterIndex: instance.chapterIndex,
                $contentNode: $(contentNode),
                'empty': true //空类型
              }
            }
          })
        }
      },

      /**
       * 多事件钩子
       * 执行多事件绑定
       */
      eventBinding(eventRelated) {
        create(instance, eventRelated);
      },

      /**
       * 2016.11.8
       * 收集滑动委托对象，针对事件合集触发处理
       */
      swipeDelegateContents(eventName, fn) {
        ++instance.swipeSequence[eventName + 'Total']
        instance.swipeSequence[eventName].push(fn)
      }
    }


    /**
     * 初始化任务
     * 等待状态初始化，比如_isFlows
     */
    initTasks(instance)

  }

}
