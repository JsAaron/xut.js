import { SceneFactory } from '../scenario/scene-factory'
import { sceneController } from '../scenario/scene-control'
import { ShowBusy, HideBusy, ShowTextBusy } from '../initial/cursor'
import { toNumber, $$remove, $$extend, $$warn } from '../util/index'


export function initView() {

  //重复点击
  let repeatClick = false;

  /**
   * 忙碌光标
   * */
  $$extend(Xut.View, {
    ShowBusy,
    HideBusy,
    ShowTextBusy
  })

  /**
   * 关闭场景
   */
  Xut.View.CloseScenario = function() {
    if(repeatClick) return;
    repeatClick = true;
    var serial = sceneController.takeOutPrevChainId();
    Xut.View.LoadScenario({
      'scenarioId': serial.scenarioId,
      'chapterId': serial.chapterId,
      'createMode': 'sysClose'
    }, () => {
      repeatClick = false;
    })
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
  Xut.View.LoadScenario = function(options, useUnlockCallBack) {

    var seasonId = toNumber(options.scenarioId),
      chapterId = toNumber(options.chapterId),
      pageIndex = toNumber(options.pageIndex),
      createMode = options.createMode,
      isInApp = options.isInApp;


    //ibooks模式下的跳转
    //全部转化成超链接
    if(!options.main && Xut.IBooks.Enabled && Xut.IBooks.runMode()) {
      location.href = chapterId + ".xhtml";
      return
    }

    //用户指定的跳转入口，而不是通过内部关闭按钮处理的
    var userAssign = createMode === 'sysClose' ? false : true,
      //当前活动场景容器对象
      current = sceneController.containerObj('current');

    //获取到当前的页面对象
    //用于跳转去重复
    if(current && current.vm) {
      var curVmPage;
      if(curVmPage = current.vm.$curVmPage) {
        if(curVmPage.scenarioId == seasonId && curVmPage.chapterId == chapterId) {
          $$warn(`重复触发页面加载:seasonId:${seasonId},chapterId:${chapterId}`)
          return
        }
      }
    }

    /**
     * 场景内部跳转
     * 节相同，章与章的跳转
     * 用户指定跳转模式,如果目标对象是当前应用页面，按内部跳转处理
     * @return {[type]}            [description]
     */
    if(userAssign && current && current.scenarioId === seasonId) {
      Xut.View.GotoSlide(seasonId, chapterId)
      return
    }

    /**
     * 场景外部跳转
     * 节与节的跳转,需要对场景的处理
     */
    //清理热点动作
    current && current.vm.$suspend();

    //通过内部关闭按钮加载新场景处理
    if(current && userAssign) {
      //检测是不是往回跳转,重复处理
      sceneController.checkToRepeat(seasonId);
    }


    /**
     * 加载新的场景
     */

    //读酷启动时不需要忙碌光标
    if(window.DUKUCONFIG && options.main) {
      Xut.View.HideBusy();
    } else {
      Xut.View.ShowBusy();
    }


    /**
     * 跳出去
     * $multiScenario
     * 场景模式
     * $multiScenario
     *      true  多场景
     *      false 单场景模式
     * 如果当前是从主场景加载副场景
     * 关闭系统工具栏
     */
    if(current && !current.vm.$multiScenario) {
      Xut.View.HideToolBar();
    }


    /**
     * 重写场景的顺序编号
     * 用于记录场景最后记录
     */
    var pageId;
    if(current && (pageId = Xut.Presentation.GetPageId())) {
      sceneController.rewrite(current.scenarioId, pageId);
    }


    /**
     * 场景信息
     * @type {[type]}
     */
    var sectionRang = Xut.data.query('sectionRelated', seasonId)
    var barInfo = sectionRang.toolbar //场景工具栏配置信息
    var pageTotal = sectionRang.length

    /**
     * 通过chapterId转化为实际页码指标
     * season 2 {
     *     chapterId : 1  => 0
     *     chpaterId : 2  => 1
     *  }
     * [description]
     * @return {[type]} [description]
     */
    var parseInitIndex = () => {
      return chapterId ? (() => {
        //如果节点内部跳转方式加载,无需转化页码
        if(createMode === 'GotoSlide') {
          return chapterId;
        }
        //初始页从0开始，减去下标1
        return chapterId - sectionRang.start - 1;
      })() : 0;
    }

    /**
     * 传递的参数
     * seasonId    节ID
     * chapterId   页面ID
     * pageIndex   指定页码
     * isInApp     是否跳到收费提示页
     * pageTotal   页面总数
     * barInfo     工具栏配置文件
     * history     历史记录
     * sectionRang 节信息
     * complete    构件完毕回调
     * @type {Object}
     */
    var data = {
      seasonId: seasonId,
      chapterId: chapterId,
      pageIndex: pageIndex || parseInitIndex(),
      isInApp: isInApp,
      pageTotal: pageTotal,
      barInfo: barInfo,
      history: options.history,
      sectionRang: sectionRang,
      //制作场景切换后处理
      complete(nextBack) {
        //销毁多余场景
        current && current.destroy()
          //下一个任务存在,执行切换回调后,在执行页面任务
        nextBack && nextBack();
        //去掉忙碌
        Xut.View.HideBusy();
        //解锁回调
        useUnlockCallBack && useUnlockCallBack();
      }
    }

    //主场景判断（第一个节,因为工具栏的配置不同）
    if(options.main || sceneController.mianId === seasonId) {
      //清理缓存
      $$remove("history");
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
