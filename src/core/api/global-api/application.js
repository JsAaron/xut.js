/****************************************************
 *  杂志全局API
 *  Xut.Application
 *  整个应用程序的接口，执行应用级别的操作，例如退出应用之类
 * **************************************************/

import { config } from '../../config/index'
import { $getStorage } from '../../util/index'
import { Observer } from '../../observer/index'
import globalDestroy from '../global-destroy'
import { $autoRun, $original, $suspend, $stop } from '../../scenario/command/index'

export function initApplication() {

  /**
   * 后台运行
   * @type {Number}
   */
  let backstage = 0

  /**
   * 应用加载状态
   * false未加载
   * true 已加载
   * @type {Boolean}
   */
  let appState = false

  /**
   * 应用事件监听
   * 1.Xut.Application.Watch('complete',fn)
   * 2.initComplete
   */
  let __app__ = new Observer()

  /**
   * 监听应用事件
   * @param {[type]}   event    [description]
   * @param {Function} callback [description]
   */
  Xut.Application.Watch = function(event, callback) {
    let fn = function() {
      callback.apply(__app__, arguments)
    }
    __app__.$$watch(event, fn)
    return fn
  }

  /**
   * 只监听一次
   * 触发后就销毁
   */
  Xut.Application.onceWatch = function(event, callback) {
    let fn = function() {
      callback.apply(__app__, arguments)
    }
    __app__.$$once(event, fn)
    return fn
  }

  /**
   * 触发通知
   * @param {...[type]} arg [description]
   */
  Xut.Application.Notify = function(...arg) {
    __app__.$$emit(...arg)
  }

  /**
   * 销毁
   */
  Xut.Application.unWatch = function(event, fn) {
    __app__.$$unWatch(event, fn)
  }


  /**
   * 后台运行
   * @type {Number}
   */
  Xut.Application.IsBackStage = function() {
    return backstage
  }

  /**
   * home隐藏
   * 后台运行的时候,恢复到初始化状态
   * 用于进来的时候激活Activate
   */
  Xut.Application.Original = function() {
    backstage = 1;
    //传递一个完全关闭的参数
    $suspend('', '', true);
    $original();
  }

  /**
   * home显示
   * 后台弹回来
   * 激活应用行为
   */
  Xut.Application.Activate = function() {
    backstage = 0
    $autoRun()
  }

  /**
   * 退出应用
   */
  Xut.Application.Exit = function() {
    //判断重复调用
    if (config.launch) {
      /*启动代码用户操作跟踪*/
      config.sendTrackCode('exit', { time: (+new Date) - config.launch.launchTime })
      globalDestroy('exit')
    }
  }

  /**
   * 2016.10.11
   * 刷新程序
   * 这个与销毁有点区别
   * 比如外联的数据，不需要删除
   */
  Xut.Application.Refresh = function() {
    globalDestroy('refresh')
  }

  /**
   * 销毁应用
   */
  Xut.Application.Destroy = function() {
    Xut.Application.DropApp()
  }

  /**
   * 销毁
   * 退出app
   * 提供给iframe方式加载后退出app处理接口
   */
  Xut.Application.DropApp = function() {

    /**
     * iframe模式,退出处理
     * @return {[type]} [description]
     */
    const destroy = () => {
      __app__.$$unWatch()
      globalDestroy('destory')
      window.GLOBALCONTEXT = null;
    }

    /**
     * 通过launch启动动态配置
     */
    if (config.launch.lauchMode === 1) {
      destroy()
      return
    }

    //如果读酷
    if (window.DUKUCONFIG) {
      //外部回调通知
      if (window.DUKUCONFIG.iframeDrop) {
        var appId = $getStorage('appId');
        window.DUKUCONFIG.iframeDrop(['appId-' + appId, 'novelId-' + appId, 'pageIndex-' + appId]);
      }
      window.DUKUCONFIG = null;
      destroy();
      return;
    }

    //客户端模式
    if (window.CLIENTCONFIGT) {
      //外部回调通知
      if (window.CLIENTCONFIGT.iframeDrop) {
        window.CLIENTCONFIGT.iframeDrop();
      }
      window.CLIENTCONFIGT = null;
      destroy();
      return;
    }

    //妙妙学客户端
    if (window.MMXCONFIG) {
      //外部回调通知
      if (window.MMXCONFIG.iframeDrop) {
        window.MMXCONFIG.iframeDrop();
      }
      window.MMXCONFIG = null;
      destroy();
      return;
    }
  }

  /**
   * 停止应用
   * skipMedia 跳过音频你处理(跨页面)
   * dispose   成功处理回调
   * processed 处理完毕回调
   */
  Xut.Application.Suspend = function({
    skipAudio,
    dispose,
    processed
  }) {
    $stop(skipAudio)
    processed && processed()
  }


  /**
   * 启动应用
   */
  Xut.Application.Launch = function() {}

  /**
   * 设置应用状态
   */
  Xut.Application.setAppState = function() {
    appState = true;
  }

  /**
   * 删除应用状态
   * @return {[type]} [description]
   */
  Xut.Application.delAppState = function() {
    appState = false;
  }

  /**
   * 获取应用加载状态
   * @return {[type]} [description]
   */
  Xut.Application.getAppState = function() {
    return appState;
  }

  /**
   * 延时APP运用
   * 一般是在等待视频先加载完毕
   * @return {[type]} [description]
   */
  Xut.Application.delayAppRun = function() {
    Xut.Application.setAppState();
  }

  /**
   * 启动app
   * 重载启动方法
   * 如果调用在重载之前，就删除，
   * 否则被启动方法重载
   * @type {[type]}
   */
  Xut.Application.LaunchApp = function() {
    Xut.Application.delAppState();
  }


}
