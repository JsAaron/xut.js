import { reviseSize } from '../../../../../util/option'
import { parseContentDas } from './parse/content'

/**
 * 针对容器类型的处理
 * @param  {[type]} containerName [description]
 * @param  {[type]} contentId     [description]
 * @param  {[type]} pid     [description]
 * @return {[type]}               [description]
 */
const createContainerWrap = (containerName, contentId, pid, getStyle) => {

  const contentDas = parseContentDas([contentId])
  const data = reviseSize({
    results: contentDas[0],
    proportion: getStyle.pageProportion
  })

  const wapper =
    `<div  id="${containerName}"
               data-behavior="click-swipe"
               style="width:${data.scaleWidth}px;
                      height:${data.scaleHeight}px;
                      top:${data.scaleTop}px;
                      left:${data.scaleLeft}px;
                      position:absolute;
                      z-index:${data.zIndex};">`

  return String.styleFormat(wapper)
}


export function createContainer(containerRelated, pid, getStyle) {
  var itemIds,
    uuid,
    contentId,
    containerName,
    containerObj = {
      createUUID: [],
      containerName: []
    };

  containerRelated.forEach((data, index) => {
    contentId = data.imageIds;
    containerName = "Container_" + pid + "_" + contentId
    uuid = "aaron" + Math.random()
    containerObj[uuid] = {
      'start': [createContainerWrap(containerName, contentId, pid, getStyle)],
      'end': '</div>'
    };
    containerObj.createUUID.push(uuid);
    containerObj.containerName.push(containerName);
    data.itemIds.forEach(function(id) {
      containerObj[id] = uuid;
    })
  })
  return containerObj;
}
