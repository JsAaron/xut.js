///////////////////////////
///    缩放提示图片
//////////////////////////
import { config } from '../../../../../config/index'
import { ScalePicture } from '../../../../../expand/scale-picture/index'
import {
  $on,
  $off,
  getFileFullPath,
  converUrlName
} from '../../../../../util/index'


/*图片*/
function createHTML() {
  const size = config.screenSize.width > config.screenSize.height ? '2vw' : '2vh'
  return `<div class="xut-icon-maximize"style="font-size:${size};position:absolute;right:0;"></div>`
}

export function zoomPicture(pipeData) {
  let zoomObjs = {}
  let behaviorData
  _.each(pipeData.contentsFragment, function(node) {
    let behaviorData
    if(behaviorData = pipeData.zoomBehavior[node.id]) {
      /*缩放提示图片*/
      behaviorData.prompt && $(node).append(createHTML())

      let hasMove = false
      $on(node, {
        start() { hasMove = false },
        move() { hasMove = true },
        end() {
          if(hasMove) return
          const $node = $(node)
          const $imgNode = $node.find('img')
          if(!$imgNode.length) {
            return
          }

          /*存在*/
          const src = $imgNode[0].src
          if(zoomObjs[src]) {
            return zoomObjs[src].play()
          }

          /*创建*/
          const analysisName = converUrlName(src)
          zoomObjs[src] = new ScalePicture({
            element: $imgNode,
            originalSrc: getFileFullPath(analysisName.suffix, 'pagebase-zoom'),
            hdSrc: getFileFullPath(analysisName.hdName,'getHDFilePath')
          })

        }
      })

      /*销毁*/
      behaviorData.off = function() {
        $off(node)
        node = null
      }
    }
  })

  return zoomObjs;
}
