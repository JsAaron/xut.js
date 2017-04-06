///////////////////////////
///    缩放提示图片
//////////////////////////
import { config } from '../../../../../config/index'
import { Zoom } from '../../../../../plugin/extend/zoom/index'
import {
  $$on,
  $$off,
  getFileFullPath,
  analysisImageName,
  getHDFilePath
} from '../../../../../util/index'


/*图片*/
function createHTML() {
  const size = config.screenSize.width > config.screenSize.height ? '2vw' : '2vh'
  return `<div class="icon-maximize"style="font-size:${size};position:absolute;right:0;"></div>`
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
              originalSrc: getFileFullPath(analysisName.suffix, 'pagebase-zoom'),
              hdSrc: getHDFilePath(analysisName.original)
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
