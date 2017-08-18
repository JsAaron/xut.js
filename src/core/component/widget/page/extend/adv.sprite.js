import { config } from '../../../../config/index'
import { parseJSON } from '../../../../util/lang'
import SeniorSprite from '../../../../expand/sprite/senior'

let spiritObjs = {}

// $("body").on("dblclick",function(){
//   console.log(spiritObjs)
// })

/**
 * get data
 * @param  {[type]} inputPara [description]
 * @param  {[type]} contents  [description]
 * @return {[type]}           [description]
 */
const getData = (inputPara, contents) => {
  let option;
  let resourcePath = config.getWidgetPath() + "gallery/" + inputPara.id + "/";
  let xhr = new XMLHttpRequest();
  xhr.open('GET', resourcePath + 'app.json', false);
  xhr.send(null);
  try {
    option = parseJSON(xhr.responseText);
  } catch (e) {
    console.log("app.json get error:" + e);
  }
  return option
}


const moveContent = (contentPrefix, id, parentId) => {
  let obj = $("#" + contentPrefix + id);
  let parentObj = $("#" + contentPrefix + parentId)
  let $parent = $("#spirit_parent_" + parentId)
  if ($parent.length == 0) {
    parentObj.append("<div style='position:absolute; width:100%; height:100%'  id='spirit_parent_" + parentId + "'></div>");
  }
  $parent.append(obj);
}


const getId = (inputPara, contentPrefix) => {
  let id = '';
  if (_.isObject(inputPara)) {
    id = contentPrefix + inputPara.framId;
  } else {
    id = inputPara;
  }
  return id
}



export function updateAction(id, params) {
  let loop = 1
  let obj
  if (params.playerType == "loop") {
    loop = 'loop'
  }

  if (obj = spiritObjs[id]) {
    obj.play(params.actList, loop);
  } else {
    console.log('error')
  }
}


export default function (inputPara, contents) {
  let option = getData(inputPara, contents)
  let ResourcePath = config.getWidgetPath() + "gallery/" + inputPara.id + "/";
  let contentPrefix = inputPara.contentPrefix
  let ids = []
  let options = {};
  options.contentPrefix = contentPrefix;
  options.resourcePath = ResourcePath;
  options.type = 'seniorSprite';

  if (option.spiritList) {
    for (let i = 0; i < option.spiritList.length; i++) {
      let spiritList = option.spiritList[i];
      let id = getId(spiritList, contentPrefix)
      let framId = spiritList.framId
      let parentId = spiritList.parentId
      if (_.isObject(inputPara)) {
        if (parentId != "0") {
          moveContent(contentPrefix, framId, parentId)
        }
        spiritObjs[id] = new SeniorSprite(spiritList, options)
        ids.push(id)
      } else {
        console.log("inputPara undefine Spirit")
      }
    }
  } else {
    console.log('没有高级精灵动画数据')
  }


  return {
    stop() {
      ids.forEach((key) => {
        spiritObjs[key].stop()
      })
    },
    destroy() {
      ids.forEach((key) => {
        if (spiritObjs[key]) {
          spiritObjs[key].destroy()
          spiritObjs[key] = null
          delete spiritObjs[key]
        }
      })
    }
  }

}
