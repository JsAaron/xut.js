import { SceneFactory } from '../../scenario/index'
import { sceneController } from '../../scenario/control'
import { showBusy, hideBusy, showTextBusy } from '../../expand/cursor'
import { toNumber, $removeStorage, $extend, $warn } from '../../util/index'
import { requestInterrupt } from 'preload/index'
import { config } from '../../config/index'

export function initView() {

  //重复点击
  let repeatClick = false;

  /**
   * 忙碌光标
   * */
  $extend(Xut.View, {
    'ShowBusy': showBusy,
    'HideBusy': hideBusy,
    'ShowTextBusy': showTextBusy
  })

  /**
   * 关闭场景
   */
  Xut.View.CloseScenario = function() {
    if (repeatClick) return;
    repeatClick = true;
    var serial = sceneController.takeOutPrevChainId();
    Xut.View.LoadScenario({
      'seasonId': serial.seasonId,
      'chapterId': serial.chapterId,
      'createMode': 'sysClose'
    }, () => {
      repeatClick = false;
    })
  }


  /**
   * 'main': true, //主场景入口
   * 'seasonId': seasonId,
   * 'pageIndex': options.pageIndex,
   * 'chapterId'
   * 'history': options.history
   */
  Xut.View.LoadScenario = function(options, callback) {

    /**
     * 如果启动了预加载模式
     * 需要处理跳转的页面预加载逻辑
     */
    let chapterId = toNumber(options.chapterId)
    if (!options.main && chapterId && config.launch.preload) {
      const status = requestInterrupt({
        chapterId,
        type: 'nolinear',
        processed() {
          loadScenario(options, callback)
          Xut.View.HideBusy()
        }
      })

      //如果还在预加载，禁止新进场的处理
      if (status) {
        Xut.View.ShowBusy()
        return
      }
    }

    //正常加载
    loadScenario(options, callback)
  }



  /**
   * 页面跳转拦截
   */
  Xut.View.Intercept = function(chapterId) {
    //有map链接表
    //用于动态插入页面
    if (chapterId) {
      const linkMap = Xut.View.linkMap[chapterId]
      if (linkMap) {
        linkMap()
        return true
      }
    }
  }


  /**
   * 加载一个新的场景
   * 1 节与节跳
   *    单场景情况
   *    多场景情况
   * 2 章与章跳
   * useUnlockCallBack 用来解锁回调,重复判断
   * isInApp 是否跳转到提示页面
   */
  function loadScenario(options, callback) {

    let seasonId = toNumber(options.seasonId)
    let chapterId = toNumber(options.chapterId)
    let pageIndex = toNumber(options.pageIndex)
    let createMode = options.createMode

    //ibooks模式下的跳转
    //全部转化成超链接
    if (!options.main && Xut.IBooks.Enabled && Xut.IBooks.runMode()) {
      location.href = chapterId + ".xhtml";
      return
    }

    //当前活动场景容器对象
    const current = sceneController.containerObj('current')

    //获取到当前的页面对象,用于跳转去重复
    const visualPageBase = current && current.$$mediator && current.$$mediator.$visualPageBase

    //如果下一页被拦截了
    if (visualPageBase && Xut.View.Intercept(visualPageBase.chapterId)) {
      return
    }

    if (visualPageBase && visualPageBase.seasonId == seasonId && visualPageBase.chapterId == chapterId) {
      $warn({
        type: 'api',
        content: `拦截:重复触发Xut.View.LoadScenario,seasonId:${seasonId},chapterId:${chapterId}`,
        color: 'red'
      })
      return
    }

    //用户指定的跳转入口，而不是通过内部关闭按钮处理的
    const userAssign = createMode === 'sysClose' ? false : true

    /**
     * 场景内部跳转
     * 节相同，章与章的跳转
     * 用户指定跳转模式,如果目标对象是当前应用页面，按内部跳转处理
     */
    if (userAssign && current && current.seasonId === seasonId) {
      Xut.View.GotoSlide(seasonId, chapterId, pageIndex, callback)
      return
    }


    //////////////////////////////////////
    ///
    ///  以下代码是加载一个新场景处理
    ///
    /////////////////////////////////////

    /*读酷启动时不需要忙碌光标*/
    if (options.main && window.DUKUCONFIG) {
      Xut.View.HideBusy()
    } else {
      Xut.View.ShowBusy()
    }

    if (current) {

      //清理热点动作,场景外部跳转,需要对场景的处理
      current.$$mediator.$suspend()

      //通过内部关闭按钮加载新场景处理，检测是不是往回跳转,重复处理
      if (userAssign) {
        sceneController.checkToRepeat(seasonId)
      }

      /**
       * 跳出去
       * $hasMultiScene
       * 场景模式
       * $hasMultiScene
       *      true  多场景
       *      false 单场景模式
       * 如果当前是从主场景加载副场景
       * 关闭系统工具栏
       */
      if (!current.$$mediator.$hasMultiScene) {
        Xut.View.HideToolBar()
      }

      //重写场景的顺序编号,用于记录场景最后记录
      const pageId = Xut.Presentation.GetPageId()
      if (pageId) {
        sceneController.rewrite(current.seasonId, pageId);
      }
    }


    /*场景信息*/
    const sectionRang = Xut.data.query('sectionRelated', seasonId)

    /**
     * 通过chapterId转化为实际页码指标
     * season 2 {
     *     chapterId : 1  => 0
     *     chpaterId : 2  => 1
     *  }
     * [description]
     * @return {[type]} [description]
     */
    const getInitIndex = () => {
      return chapterId ? (() => {
        //如果节点内部跳转方式加载,无需转化页码
        if (createMode === 'GotoSlide') {
          return chapterId;
        }
        //初始页从0开始，减去下标1
        return chapterId - sectionRang.start - 1;
      })() : 0;
    }

    /*传递的参数*/
    const data = {
      seasonId, //节ID
      chapterId, //页面ID
      sectionRang, //节信息
      isInApp: options.isInApp, //是否跳到收费提示页
      history: options.history, // 历史记录
      barInfo: sectionRang.toolbar, //工具栏配置文件
      pageIndex: pageIndex || getInitIndex(), //指定页码
      pageTotal: sectionRang.length, //页面总数
      complete(nextBack) { //构件完毕回调
        //第一次加载的外部回调
        callback && callback();
        //销毁旧场景
        current && current.destroy();
        //下一个任务存在,执行切换回调后,在执行页面任务
        nextBack && nextBack();
        //去掉忙碌
        Xut.View.HideBusy();
      }
    }

    //主场景判断（第一个节,因为工具栏的配置不同）
    if (options.main || sceneController.mianId === seasonId) {
      //清理缓存
      $removeStorage("history");
      //确定主场景
      sceneController.mianId = seasonId;
      //是否主场景
      data.isMain = true;
    }

    new SceneFactory(data);
  }


  /**
   * 通过插件打开一个新view窗口
   */
  Xut.View.Open = function(pageUrl, width, height, left, top) {
    Xut.Plugin.WebView.open(pageUrl, left, top, height, width, 1);
  }

  /**
   * 关闭view窗口
   */
  Xut.View.Close = function() {
    Xut.Plugin.WebView.close();
  }

}
