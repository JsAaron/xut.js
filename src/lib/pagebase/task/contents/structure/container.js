
import {reviseSize } from '../../../../util/index'


import { parseContentDas } from './parsecontent'

/**
 * 针对容器类型的处理
 * @param  {[type]} containerName [description]
 * @param  {[type]} contentId     [description]
 * @param  {[type]} pid     [description]
 * @return {[type]}               [description]
 */
function createContainerWrap(containerName, contentId, pid) {
    var contentDas = parseContentDas([contentId]),
        data = reviseSize(contentDas[0]),
        wapper = '<div' + ' id="{0}"' + ' data-behavior="click-swipe"' + ' style="width:{1}px;height:{2}px;top:{3}px;left:{4}px;position:absolute;z-index:{5};">';

    return String.format(wapper,
        containerName, data.scaleWidth, data.scaleHeight, data.scaleTop, data.scaleLeft, data.zIndex)
}


export function createContainer(containerRelated, pid) {
    var itemIds,
        uuid,
        contentId,
        containerName,
        containerObj = {
            createUUID: [],
            containerName: []
        };

    containerRelated.forEach(function (data, index) {
        contentId = data.imageIds;
        containerName = "Container_" + pid + "_" + contentId
        uuid = "aaron" + Math.random()
        containerObj[uuid] = {
            'start': [createContainerWrap(containerName, contentId, pid)],
            'end': '</div>'
        };
        containerObj.createUUID.push(uuid);
        containerObj.containerName.push(containerName);
        data.itemIds.forEach(function (id) {
            containerObj[id] = uuid;
        })
    })
    return containerObj;
}
