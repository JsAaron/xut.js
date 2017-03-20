///////////////////////////
///    缩放提示图片
//////////////////////////

import { $$on, $$off } from '../../../../util/dom'
import { Zoom } from '../../../../plugin/extend/zoom/index'
import { analysisImageName, insertImageUrlSuffix } from '../../../../util/option'

/*图片*/
function createHTML() {
  const size = config.screenSize.width > config.screenSize.height ? '2vw' : '2vh'
  return `<div class="icon-maximize"style="font-size:${size};position:absolute;right:0;"></div>`
}

/*检测高清图*/
function checkHD(analysisName) {
  if(config.useHDImageZoom && config.imageSuffix && config.imageSuffix['1440']) {
    return config.pathAddress + insertImageUrlSuffix(analysisName.original, config.imageSuffix['1440'])
  }
  return ''
}

export function zoomImage(pipeData) {
  let zoomObjs = {}
  let behaviorData
  _.each(pipeData.contentsFragment, function(node) {
    let behaviorData
    if(behaviorData = pipeData.zoomBehavior[node.id]) {
      /*缩放提示图片*/
      behaviorData.prompt && $(node).append(createHTML())

      let hasMove = false
      $$on(node, {
        start() { hasMove = false },
        move() { hasMove = true },
        end() {
          if(hasMove) return
          let $node = $(node)
          let $imgNode = $node.find('img')
          if(!$imgNode.length) {
            return
          }
          let src = $imgNode[0].src
          if(zoomObjs[src]) {
            zoomObjs[src].play()
          } else {
            const analysisName = analysisImageName(src)
            zoomObjs[src] = new Zoom({
              element: $imgNode,
              originalSrc: config.pathAddress + analysisName.suffix,
              hdSrc: checkHD(analysisName)
            })
          }
        }
      })

      /*销毁*/
      behaviorData.off = function() {
        $$off(node)
        node = null
      }
    }
  })

  return zoomObjs;
}
