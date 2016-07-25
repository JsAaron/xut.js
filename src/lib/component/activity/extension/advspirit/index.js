/**
 * 2016.7.10
 * if comsprites is too large，
 * The client will comsprite become the advsprite  by default
 */
import { SpiritAnimation } from '../../../widget/seniorsprite/sprite'

let moveContent = (contentPrefix, id, parentId) => {
    let obj = $("#" + contentPrefix + id);
    let parentObj = $("#" + contentPrefix + parentId)
    let $parent = $("#spirit_parent_" + parentId)
    if ($parent.length == 0) {
        parentObj.append("<div style='position:absolute; width:100%; height:100%'  id='spirit_parent_" + parentId + "'></div>");
    }
    $parent.append(obj);
}

export class AdvSpirit {

    constructor(options) {
        this.options = options;
        this.ids = []
    }


    play() {

        let id, action, ids, data,  resource, loop,
            spiritList, framId, parentId, params, options


        options = this.options;
        data = options.data;
        resource = data.resource;
        loop = data.loop;
        this.spiritObjs = {}
        let option = {};
        option.contentId = options.id;
        option.ele = options.element;
        option.resourcePath = data.md5;
        option.type = "advSprite";
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
            this.spiritObjs[id] = new SpiritAnimation(spiritList, option)
            params = spiritList.params

            action = params["actList"].split(",")[0]
            //0 循环播放 1播放一次
            this.spiritObjs[id].startAnimation(action, loop)
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
        this.options.element = null;
        this.options = null;
        this.ids = null;

    }

}
