/**
 * 2016.7.10
 * if comsprites is too large，
 * The client will comsprite become the advsprite  by default
 */
import { AdvSpiritAni } from './sprite'

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

        let ids, data, ele, resource, path

        data = options.data;
        ele = options.element;
        resource = data.resource;
        path = data.md5;

        this.spiritObjs = {}
        this.ids = []

        for (let i = 0; i < resource.spiritList.length; i++) {
            let spiritList = resource.spiritList[i];
            let id = data.containerName
            let framId = spiritList.framId
            let parentId = spiritList.parentId
            this.spiritObjs[id] = new AdvSpiritAni(spiritList, id, path)
            this.ids.push(id)
            if (parentId != "0") {
                let tempArray = data.containerName.split('_');
                let contentPrefix = tempArray[0] + '_' + tempArray[1];
                moveContent(contentPrefix, framId, parentId)
            }
            this.spiritObjs[id] = new AdvSpiritAni(spiritList, ele, path)
            let params = spiritList.params

            let action = params["actList"].split(",")[0]
            this.spiritObjs[id].changeSwitchAni(action, 1)
            this.ids.push(id)
        }
    }


    play() {
        console.log('play');
        // var self = this;
        // console.log(this.stop);
        // setTimeout(function() {
        //     self.stop();
        // }, 3000)
    }

    stop() {
        this.ids.forEach((key) => {
            this.spiritObjs[key].stop()
        })
    }

    reset() {

    }

    destroy() {
        this.ids.forEach((key) => {
            if (this.spiritObjs[key]) {
                this.spiritObjs[key].destroy()
                this.spiritObjs[key] = null
                delete this.spiritObjs[key]
            }

        })
    }


}
