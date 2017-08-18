/**
 * 2016.7.10
 * if comsprites is too large，
 * The client will comsprite become the advsprite  by default
 */
import AutoSprite from '../../../../expand/sprite/senior'


const moveContent = (contentPrefix, id, parentId) => {
  let obj = $("#" + contentPrefix + id);
  let parentObj = $("#" + contentPrefix + parentId)
  let $parent = $("#spirit_parent_" + parentId)
  if ($parent.length == 0) {
    parentObj.append("<div style='position:absolute; width:100%; height:100%'  id='spirit_parent_" + parentId + "'></div>");
  }
  $parent.append(obj);
}


export default class {

  constructor(options) {
    this.options = options;
    this.ids = []
  }

  play() {

    const data = this.options.data;
    const resource = data.resource;

    let id, action, spiritList, framId, parentId, params
    let option = {};
    this.spiritObjs = {}

    option.contentId = this.options.id;
    option.ele = this.options.$contentNode;
    option.resourcePath = data.md5;
    option.type = "autoSprite";

    /*
      data.loop
       循环 1
       不循环 0
     */
    let hasLoop = 0
    if (data.loop) {
      hasLoop = 'loop'
    }

    for (let i = 0; i < resource.spiritList.length; i++) {
      spiritList = resource.spiritList[i];
      id = data.containerName
      framId = spiritList.framId
      parentId = spiritList.parentId
      this.ids.push(id)
      if (parentId != "0") {
        let tempArray = id.split('_');
        let contentPrefix = tempArray[0] + '_' + tempArray[1];
        moveContent(contentPrefix, framId, parentId)
      }
      this.spiritObjs[id] = new AutoSprite(spiritList, option)
      params = spiritList.params
      action = params["actList"].split(",")[0]

      //0 循环播放 1播放一次
      this.spiritObjs[id].play(action, hasLoop)
    }

  }

  stop() {
    this.ids.forEach((key) => {
      this.spiritObjs[key].stop()
    })
  }

  reset() {
    this.stop();
  }

  destroy() {
    this.ids.forEach((key) => {
      if (this.spiritObjs[key]) {
        this.spiritObjs[key].destroy()
        this.spiritObjs[key] = null
        delete this.spiritObjs[key]
      }
    })
    this.options.data = null;
    this.options.$contentNode = null;
    this.options = null;
    this.ids = null;
  }

}
