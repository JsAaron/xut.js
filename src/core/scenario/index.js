import { config } from '../config/index'
import Mediator from './mediator/index'
import { getColumnCount, getColumnChapterCount } from '../component/column/api'

import MainBar from '../toolbar/ppt/main-iosbar/index'
import DeputyBar from '../toolbar/ppt/deputy-fnbar'
import BookBar from '../toolbar/ppt/word-bookbar/index'
import MiniBar from '../toolbar/mini/index'
import GlobalBar from '../toolbar/mmx/index'

import { getMainBar, getDeputyBar } from './config/set-bar'
import { mainScene, deputyScene } from './config/layout'
import { sceneController } from './control'
import { removeCover } from '../expand/root-node'

/**
 * 找到对应容器
 */
function findContainer($context, id, isMain) {
  return function(pane, parallax) {
    var node;
    if (isMain) {
      node = '#' + pane;
    } else {
      node = '#' + parallax + id;
    }
    return $context.find(node)[0];
  }
}


/**
 * 如果启动了缓存记录
 * 加载新的场景
 */
function checkHistory(history, callback) {

  //直接启用快捷调试模式
  if (config.debug.locationPage) {
    console.log('启动了debug.locationPage,如果进不去，需要检测定位的坐标')
    Xut.View.LoadScenario(config.debug.locationPage, callback)
    return
  }

  //如果有历史记录
  if (history) {
    let scenarioInfo = sceneController.seqReverse(history)
    if (scenarioInfo) {
      scenarioInfo = scenarioInfo.split('-');
      Xut.View.LoadScenario({
        'seasonId': scenarioInfo[0],
        'chapterId': scenarioInfo[1],
        'pageIndex': scenarioInfo[2]
      }, callback)
      return
    }
  }

  //正常模式
  callback()
}


/**
 * 场景创建类
 */
export class SceneFactory {

  constructor(data) {
    const options = _.extend(this, data);
    //创建主场景
    this._createHTML(options, () => {
      if (!Xut.IBooks.Enabled) {
        this._initToolBar()
      }
      this._createMediator();

      //主场景有历史记录，并且没有chapterId的时候
      //主动赋值，因为没有读取数据
      if (data.isMain && data.history && !data.chapterId) {
        data.chapterId = 1
      }

      sceneController.add(data.seasonId, data.chapterId, this);
    })
  }

  /**
   * 创建场景
   * @return {[type]} [description]
   */
  _createHTML(options, callback) {
    //如果是静态文件执行期
    //支持Xut.IBooks模式
    //都不需要创建节点
    if (Xut.IBooks.runMode()) {
      this.$sceneNode = $('#xut-main-scene')
      callback()
      return;
    }
    this.$sceneNode = $(options.isMain ? mainScene() : deputyScene(this.seasonId))
    Xut.nextTick({
      'container': $('.xut-scene-container'),
      'content': this.$sceneNode
    }, callback)
  }


  /**
   * 初始化工具栏
   * @return {[type]} [description]
   */
  _initToolBar() {
    const {
      seasonId,
      pageTotal,
      pageIndex,
      $sceneNode
    } = this

    _.extend(
      this,
      this._initDefaultBar(pageIndex, pageTotal, $sceneNode, seasonId)
    )

    this._initMiniBar(pageIndex, pageTotal, $sceneNode)
    this._initGlobalbar(pageIndex, pageTotal, $sceneNode)
  }


  /**
   * 初始化传统工具栏
   * 1 主场景，系统工具栏
   * 2 副场景，函数工具栏
   */
  _initDefaultBar(pageIndex, pageTotal, $sceneNode, seasonId) {

    //配置文件
    let barConfig = {}

    ///////////////////
    /// 主场景工具栏设置
    //////////////////
    if (this.isMain) {

      barConfig = getMainBar(seasonId, pageTotal)

      //word模式，自动启动工具条
      //秒秒学中会使用
      // if (config.launch.visualMode === 1) {
      //   this.mainToolbar = new BookBar({
      //     $sceneNode: $sceneNode,
      //     arrowButton: barConfig.pageMode === 2
      //   })
      // }
      //如果工具栏提供可配置选项
      //或者pageMode带有翻页按钮
      if (_.some(barConfig.toolType)) {
        this.mainToolbar = new MainBar({
          $sceneNode: $sceneNode,
          pageTotal: pageTotal,
          currentPage: pageIndex + 1,
          toolType: barConfig.toolType,
          arrowButton: barConfig.pageMode === 2
        })
      }
    } else {
      ///////////////////
      /// 副场工具栏配置
      //////////////////
      barConfig = getDeputyBar(this.barInfo, pageTotal)
      if (_.some(barConfig.toolType)) {
        this.deputyToolbar = new DeputyBar({
          $sceneNode: $sceneNode,
          toolType: barConfig.toolType,
          pageTotal: pageTotal,
          currentPage: pageIndex,
          arrowButton: barConfig.pageMode === 2
        })
      }
    }

    return barConfig
  }

  /**
   * 初始化全局工具栏，秒秒学
   * 2017.12.4
   * @return {[type]} [description]
   */
  _initGlobalbar(pageIndex, pageTotal, $sceneNode) {
    if (config.launch.pageBar && config.launch.pageBar.type === 'globalBar') {
      this.globalToolbar = new GlobalBar({
        $sceneNode: $sceneNode,
        pageTotal: pageTotal,
        currentPage: pageIndex + 1
      })
    }
  }

  /**
   * 初始化迷你工具栏
   * 1 全场景，页码显示（右下角）
   * 2 星星显示
   * 3 滚动条
   * @return {[type]} [description]
   */
  _initMiniBar(pageIndex, pageTotal, $sceneNode) {

    //2016.9.29
    //新增页码显示
    //如果有分栏
    let columnCounts = getColumnCount(this.seasonId)

    //如果是min平台强制启动
    if (config.launch.platform === 'mini' ||
      (config.debug.toolType.number !== false && columnCounts)) {

      //获取页面总数
      let getPageTotal = again => {
        if (again) {
          //高度变化后，重新获取
          columnCounts = getColumnCount(this.seasonId)
        }
        let columnChapterCount = 0
        if (columnCounts) {
          columnChapterCount = getColumnChapterCount(this.seasonId)
        }
        return columnCounts ? (pageTotal + columnCounts - columnChapterCount) : pageTotal
      }

      this.miniBar = MiniBar(config.launch.pageBar, {
        $sceneNode: $sceneNode,
        visualIndex: pageIndex,
        pageTotal: getPageTotal()
      })

      //页面总数改变
      if (config.launch.columnCheck) {
        Xut.Application.Watch('change:number:total', () => {
          this._eachMiniBar(function() {
            this.updateTotal(getPageTotal(true))
          })
        })
      }
    }
  }

  /**
   * minibar可能是一个合集对象
   * 可以同时存在的可能
   */
  _eachMiniBar(callback) {
    if (this.miniBar) {
      this.miniBar.forEach((bar) => {
        callback.call(bar)
      })
    }
  }

  /**
   * 构建创建对象
   * @return {[type]} [description]
   */
  _createMediator() {

    const {
      isMain,
      $sceneNode,
      seasonId,
      pageTotal,
      pageIndex
    } = this

    const tempfind = findContainer($sceneNode, seasonId, isMain);
    const scenePageNode = tempfind('xut-page-container', 'scenarioPage-');
    const sceneMasterNode = tempfind('xut-master-container', 'scenarioMaster-');

    Xut.$warn({
      type: 'create',
      content: `创建新场景,
      seasonId:${seasonId},
      chapterId:${this.chapterId},
      pageIndex:${pageIndex},
      pageTotal:${pageTotal}`
    })


    //场景容器对象
    const $$mediator = this.$$mediator = new Mediator({
      scenePageNode,
      sceneMasterNode,
      isMain, //是否为主场景
      'hasHistory': this.history, //有历史记录
      'pageMode': this.pageMode,
      'sceneNode': this.$sceneNode[0],
      'hasMultiScene': !isMain,
      'initIndex': pageIndex, //保存索引从0开始
      'pageTotal': pageTotal,
      'sectionRang': this.sectionRang,
      'seasonId': seasonId,
      'chapterId': this.chapterId,
      'isInApp': this.isInApp //提示页面
    });

    $$mediator.miniBar = this.miniBar

    /**
     * 配置选项
     */
    const pptBar = this.pptBar = this.deputyToolbar ? this.deputyToolbar : this.mainToolbar;


    /**
     * 监听翻页
     * 用于更新页码
     *   parentIndex  父索引
     *   subIndex     子索引
     * @return {[type]} [description]
     */
    $$mediator.$bind('updatePage', (...arg) => {
      pptBar && pptBar.updatePointer(...arg)
      this.globalToolbar && this.globalToolbar.updatePointer(...arg)
      this._eachMiniBar(function() {
        this.updatePointer(...arg)
      })
    })

    /**
     * 显示下一页按钮
     */
    $$mediator.$bind('showNext', () => {
      pptBar && pptBar.showNext();
    })

    /**
     * 隐藏下一页按钮
     */
    $$mediator.$bind('hideNext', () => {
      pptBar && pptBar.hideNext();
    })

    /**
     * 显示上一页按钮
     */
    $$mediator.$bind('showPrev', () => {
      pptBar && pptBar.showPrev();
    })

    /**
     * 隐藏上一页按钮
     */
    $$mediator.$bind('hidePrev', () => {
      pptBar && pptBar.hidePrev();
    })


    /**
     * 切换工具栏
     * state, pointer
     */
    $$mediator.$bind('toggleToolbar', (...arg) => {
      pptBar && pptBar.toggle(...arg)
      this._eachMiniBar(function() {
        this.toggle(...arg)
      })
    })

    /**
     * 复位工具栏
     */
    $$mediator.$bind('resetToolbar', () => {
      if (this.mainToolbar) {
        this.mainToolbar.resetArrow() //左右翻页按钮
        this.mainToolbar.hideNavbar() //导航栏
      }
    })

    /**
     * 获取滚动条对象
     */
    $$mediator.$bind('getMiniBar', () => {
      return this.miniBar
    })

    /**
     * 监听内部管理页面创建完成
     */
    $$mediator.$bind('createPageComplete', (nextAction) => {

      Xut.$warn({
        type: 'create',
        content: `创建新场景完成,seasonId:${seasonId}`
      })

      //主场景
      if (isMain) {
        //1 回到SceneFactory处理完成，历史记录
        //2 回调View接口处理销毁
        //3 回调main入口处理回调
        this.complete(() => {
          Xut.View.HideBusy()
          //检测是不是有缓存加载
          checkHistory(this.history, function() {
            //第一次加载应用
            if (window.GLOBALIFRAME) {
              removeCover(nextAction)
              return
            }
            //获取应用的状态
            if (Xut.Application.getAppState()) {
              //保留启动方法
              var pre = Xut.Application.LaunchApp;
              Xut.Application.LaunchApp = function() {
                pre()
                removeCover(nextAction)
              };
            } else {
              removeCover(nextAction)
            }
          })
        })
        return
      }
      //副场景切换
      this.complete(nextAction)
    })


    /**
     * 必须要延时下，让this加入对象管理器
     */
    setTimeout(() => {
      //如果是读酷端加载
      if (window.DUKUCONFIG && isMain && window.DUKUCONFIG.success) {
        window.DUKUCONFIG.success();
        $$mediator.$init();
        //如果是客户端加载
      } else if (window.CLIENTCONFIGT && isMain && window.CLIENTCONFIGT.success) {
        window.CLIENTCONFIGT.success();
        $$mediator.$init();
      } else {
        //正常加载
        $$mediator.$init();
      }
    }, 100)

  }

  /**
   * 获取场景根节点
   * @return {[type]} [description]
   */
  getSceneNode() {
    return this.$sceneNode
  }

  /**
   * 销毁场景对象
   * @return {[type]} [description]
   */
  destroy() {

    if (config.launch.columnCheck) {
      Xut.Application.unWatch('change:number:total')
    }

    //销毁工具栏
    if (this.pptBar) {
      this.pptBar.destroy()
      this.pptBar = null
    }
    this._eachMiniBar(function() {
      this.destroy()
    })
    if (this.globalToolbar) {
      this.globalToolbar.destroy()
      this.globalToolbar = null
    }

    this.$$mediator.miniBar = null

    //销毁当前场景
    this.$$mediator.$destroy();

    //销毁节点
    this.$sceneNode.off()
    this.$sceneNode.remove()
    this.$sceneNode = null

    //销毁引用
    sceneController.remove(this.seasonId)
  }
}
