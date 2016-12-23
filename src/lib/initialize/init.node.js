import { config } from '../config/index'
import { setDelay, disable } from '../initialize/busy.cursor'

/**
 * 初始化根节点
 */

const getContentHTML = cursor => {
    //忙碌可配置
    let busyIcon = '<div class="xut-busy-icon xut-fullscreen"></div>'
    if (!cursor) {
        disable(true)
        busyIcon = ''
    }

    if (config.cursor && config.cursor.time) {
        setDelay(config.cursor.time)
    }

    let coverStyle = ''

    //mini平台不要背景图
    if (Xut.config.platform === 'mini') {} else {
        //默认背景图
        let coverUrl = './content/gallery/cover.jpg'

        //重写背景图
        if (Xut.launchConfig && Xut.launchConfig.resource) {
            coverUrl = Xut.launchConfig.resource + '/gallery/cover.jpg'
        }
        //背景样式
        coverStyle = `style="background-image: url(${coverUrl});"`
    }

    return `${busyIcon}
            <div class="xut-cover xut-fullscreen" ${coverStyle}></div>
            <div class="xut-scene-container xut-fullscreen xut-overflow-hidden"></div>`
}

/**
 * 根节点
 */
export default function initNode(nodeName = '#xxtppt-app-container', cursor = true) {
    let $rootNode
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
        contentHtml = `<div id="xxtppt-app-container" class="xut-fullscreen xut-overflow-hidden">
                            ${contentHtml}
                       </div>`
    }

    return {
        $rootNode,
        $contentNode: $(String.styleFormat(contentHtml))
    }
}
