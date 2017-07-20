/**
 *
 * 杂志全局API
 *
 *  *** 有方法体的是全局接口，不会被重载***
 *  *** 无方法体的是场景接口，总会切换到当前可视区域场景***
 *
 * 1.   Xut.Application
 *          a)  整个应用程序的接口，执行应用级别的操作，例如退出应用之类。
 * 2.   Xut.DocumentWindow
 *          a)  窗口的接口。窗口就是电子杂志的展示区域，可以操作诸如宽度、高度、长宽比之类。
 * 3.   Xut.View
 *          a)  视图接口。视图是窗口的展示方式，和页面相关的接口，都在这里。
 * 4.   Xut.Presentation
 *          a)  数据接口。和电子杂志的数据相关的接口，都在这里。
 * 5.   Xut.Slides
 *          a)  所有页面的集合
 * 6.   Xut.Slide
 *          a)  单个页面
 * 7.   Xut.Master
 *          a)  页面的母版
 */
import { initView } from './view'
import { initAsset } from './asset'
import { initContents } from './content'
import { initApplication } from './application'
import { initExtend } from './extend'

const assignInit = interName => {
  if(!Xut[interName]) {
    Xut[interName] = {}
  }
}

export function initGlobalAPI() {

  //初始化接口
  assignInit('U3d')
  assignInit('View')
  assignInit('Assist')
  assignInit('Contents')
  assignInit('Application')
  assignInit('Presentation')

  /*新增虚拟摄像机运行的接口
  2017.6.2*/
  assignInit('Camera')

  //脚本接口
  window.XXTAPI = {}

  initExtend()
  initAsset()
  initView()
  initContents()
  initApplication()
}
