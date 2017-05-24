import { config } from '../config/index'
import Mediator from './mediator/index'
import { getColumnCount, getColumnChapterCount } from '../component/column/api'

import MainBar from '../toolbar/ppt/main-iosbar/index'
import DeputyBar from '../toolbar/ppt/deputy-fnbar'
import MiniBar from '../toolbar/mini/index'

import { mainScene, deputyScene } from './factory/layout'
import { getMainBar, getDeputyBar } from './factory/parse-bar'
import { sceneController } from './factory/control'

/**
 * 找到对应容器
 * @return {[type]}            [description]
 */
const findContainer = ($context, id, isMain) => {
  return function (pane, parallax) {
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
 * @return {[type]} [description]
 */
const checkHistory = (history) => {
  //直接启用快捷调试模式
  if (config.debug.deBugHistory) {
    Xut.View.LoadScenario(config.debug.deBugHistory)
    return true;
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
      })
      return true;
    } else {
      return false;
    }
  }
}


/**
 * 场景创建类
 */
export class SceneFactory {

  constructor(data) {
    const options = _.extend(this, data)
      //创建主场景
    this._createHTML(options, () => {
      if (!Xut.IBooks.Enabled) {
        this._initToolBar()
      }
      this._createMediator();
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
  }


  /**
   * 初始化传统工具栏
   * 1 主场景，系统工具栏
   * 2 副场景，函数工具栏
   */
  _initDefaultBar(pageIndex, pageTotal, $sceneNode, seasonId) {

    //配置文件
    let barConfig = {}

    //主场景工具栏设置
    if (this.isMain) {
      barConfig = getMainBar(seasonId, pageTotal)
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
      //副场工具栏配置
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
    if (config.launch.platform === 'mini' || (config.debug.toolType.number !== false && columnCounts)) {

      /*获取页面总数*/
      const getPageTotal = again => {
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

      /*页面总数改变*/
      if (config.launch.columnCheck) {
        Xut.Application.Watch('change:number:total', () => {
          this._eachMiniBar(function () {
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

    //场景容器对象
    const $$mediator = this.$$mediator = new Mediator({
      scenePageNode,
      sceneMasterNode,
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
      this._eachMiniBar(function () {
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
     * 设置显示滚动工具栏]
     */
    $$mediator.$bind('showScrollBar', () => {
      this._eachMiniBar(function () {
        this.showBar && this.showBar()
      })
    })


    /**
     * 切换工具栏
     * state, pointer
     */
    $$mediator.$bind('toggleToolbar', (...arg) => {
      pptBar && pptBar.toggle(...arg)
      this._eachMiniBar(function () {
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
     * 监听创建完成
     * @return {[type]} [description]
     */
    $$mediator.$bind('createComplete', (nextAction) => {
      this.complete && setTimeout(() => {
        if (isMain) {
          this.complete(() => {
            Xut.View.HideBusy()
              //检测是不是有缓存加载
            if (!checkHistory(this.history)) {
              //指定自动运行的动作
              nextAction && nextAction();
            }
          })
        } else {
          this.complete(nextAction)
        }
      }, 200);
    })


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

    //销毁当前场景
    this.$$mediator.$destroy();

    //销毁工具栏
    if (this.pptBar) {
      this.pptBar.destroy()
      this.pptBar = null
    }

    this._eachMiniBar(function () {
      this.destroy()
    })

    //销毁节点
    this.$sceneNode.off()
    this.$sceneNode.remove()
    this.$sceneNode = null

    //销毁引用
    sceneController.remove(this.seasonId)
  }
}
