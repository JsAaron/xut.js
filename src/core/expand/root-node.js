import { config } from '../config/index'
import { hasDisable } from '../expand/cursor'

/*
忙碌光标
 */
const getBusyHTML = function() {
  return hasDisable() ? '' : '<div class="xut-busy-icon xut-fullscreen"></div>'
}


/**
 * 初始化根节点
 */
const getContentHTML = newCursor => {
  let coverStyle = ''
  //mini平台不要背景图
  if (config.launch.platform === 'mini') {} else {
    //默认背景图
    let coverUrl = './content/gallery/cover.jpg'
    //重写背景图
    if (config.launch.resource) {
      coverUrl = config.launch.resource + '/gallery/cover.jpg'
    }
    //背景样式
    coverStyle = `style="background-image: url(${coverUrl});"`
  }
  return `${getBusyHTML()}
            <div class="xut-adaptive-image"></div>
            <div class="xut-cover xut-fullscreen" ${coverStyle}></div>
            <div class="xut-scene-container xut-fullscreen xut-overflow-hidden"></div>`
}


/**
 * 根节点
 */
let $rootNode
let $contentNode
export function initRootNode(nodeName = '#xxtppt-app-container', cursor) {
  if (nodeName) {
    $rootNode = $(nodeName)
  }
  if (!$rootNode.length) {
    //如果没有传递节点名，直接放到body下面
    nodeName = ''
    $rootNode = $('body')
  }

  let contentHtml = getContentHTML(cursor)

  //如果根节点不存在,配置根节点
  if (!nodeName) {
    contentHtml = `<div id="xxtppt-app-container" class="xut-fullscreen xut-overflow-hidden">${contentHtml}</div>`
  }
  $contentNode = $(String.styleFormat(contentHtml))
  return { $rootNode, $contentNode }
}


export function clearRootNode() {
  if ($contentNode) {
    $contentNode.remove()
    $contentNode = null
  }
  $rootNode = null
}


/**
 * 移除背景
 * @return {[type]} [description]
 */
export function removeCover(callback) {
  //第一次进入，处理背景
  let $cover = $(".xut-cover")
  if ($cover.length) { //主动探测,只检查一次
    function complete() {
      $cover && $cover.remove()
      $cover = null
      callback()
    }
    //是否配置启动动画关闭
    if (config.launch.launchAnim === false) {
      complete()
    } else {
      //有动画
      $cover.transition({
        opacity: 0,
        duration: 1000,
        easing: 'in',
        complete
      });
    }
  } else {
    $cover = null
    callback()
  }
}
