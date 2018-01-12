//========================
//  秒秒学嵌套Iframe 讨论区
//========================

import { getPostMessageFn } from '../../post-message'

export function extendGlobal(access, $$globalSwiper) {

  /**
   * 标记讨论区状态
   * @type {Boolean}
   */
  let forumStatus = false

  /**
   * 设置讨论区
   * @param {Function} fn    [description]
   * @param {[type]}   state [description]
   */
  function setForum(callback, fn, state) {
    //互斥可以相互关闭
    //并且排除重复调用
    if (fn && forumStatus !== state) {
      //从1开始算
      fn({ pageIndex: Xut.Presentation.GetPageIndex() + 1 })
      //标记状态，提供关闭
      forumStatus = state
      callback && callback()
    }
  }

  /**
   * 针对秒秒学的api
   * 打开讨论区
   */
  Xut.Assist.GlobalForumOpen = callback => setForum(callback, getPostMessageFn('forumOpen'), true)

  /**
   * 针对秒秒学的api
   * 关闭讨论区
   */
  Xut.Assist.GlobalForumClose = callback => setForum(callback, getPostMessageFn('forumClose'), false)


  /**
   * 发送圆点状态请求
   * type
   *   forumDot
   *   commitWorkDot
   */
  Xut.Assist.RequestDot = function(type, pageIndex) {
    const fn = getPostMessageFn(type)
    if (fn) {
      fn({ pageIndex })
    }
  }

  /**
   * 讨论区切换
   * @param {[type]} options.open  [description]
   * @param {[type]} options.close [description]
   */
  Xut.Assist.GlobalForumToggle = function({
    open,
    close
  } = {}) {
    if (forumStatus) {
      Xut.Assist.GlobalForumClose(close)
    } else {
      Xut.Assist.GlobalForumOpen(open)
    }
  }


  //===============================
  //  秒秒学嵌套Iframe 全局工具栏目录
  //===============================

  let globalDirStatus = false

  function setBarDir(callback, fn, state) {
    if (fn && globalDirStatus !== state) {
      //从1开始算
      fn()
      globalDirStatus = state
      callback && callback()
    }
  }

  /**
   * 打开全局工具栏目录
   * @return {[type]} [description]
   */
  Xut.Assist.GlobalDirOpen = (callback) => setBarDir(callback, getPostMessageFn('dirOpen'), true)

  /**
   * 关闭全局工具栏目录
   * @return {[type]} [description]
   */
  Xut.Assist.GlobalDirClose = (callback) => setBarDir(callback, getPostMessageFn('dirClose'), false)

  /**
   * 自动切换
   */
  Xut.Assist.GlobalDirToggle = function({
    open,
    close
  } = {}) {
    if (globalDirStatus) {
      Xut.Assist.GlobalDirClose(close)
    } else {
      Xut.Assist.GlobalDirOpen(open)
    }
  }


  //==========================
  //  秒秒学嵌套Iframe 继续学习
  //==========================
  Xut.Assist.GlobalKeepLearn = function() {
    const fn = getPostMessageFn('keepLearn')
    if (fn) {
      fn()
    }
  }


  //==========================
  //  秒秒学嵌套Iframe 提交作业
  //==========================
  Xut.Assist.GlobalCommitWork = function() {
    const fn = getPostMessageFn('commitWork')
    if (fn) {
      fn()
    }
  }

}
