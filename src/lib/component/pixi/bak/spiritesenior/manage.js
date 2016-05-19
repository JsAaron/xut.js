import { execJson } from '../../../util/dom'
import { spiritAni } from './spirite'


/**
 * 精灵动画合集
 * @type {Object}
 */
let spiritObjs = {}


/**
 * 获取对象id
 * @param  {[type]} inputPara     [description]
 * @param  {[type]} contentPrefix [description]
 * @return {[type]}               [description]
 */
let getId = function(inputPara, contentPrefix) {
    var id = '';
    if (typeof inputPara == "object") {
        id = contentPrefix + inputPara.framId;
    } else {
        id = inputPara;
    }
    return id
}


//初始化
let createSpirit = function(id, inputPara, contentPrefix, path) {
    if (!spiritObjs[id]) {
        spiritObjs[id] = new spiritAni(inputPara, contentPrefix, path)
    } else {
        console.log('创建高级精灵已存在')
    }
}


/**
 * 高级精灵动画
 * @param  {[type]} data        [description]
 * @param  {[type]} contentObjs [description]
 * @return {[type]}             [description]
 */
export function seniorManage(inputPara, contents) {

    var id, para, i, contentPrefix, xhr;

    //合集对象
    //拿到对象的引用
    this.combineId = []

    this.inputPara = inputPara;
    this.resourcePath = "content/widget/gallery/" + inputPara.id + "/"

    contentPrefix = inputPara.contentPrefix

    xhr = new XMLHttpRequest();
    xhr.open('GET', this.resourcePath + 'app.json', false);
    xhr.send(null);

    //解析零件数据
    this.option = execJson(xhr.responseText);

    //生成零件对象爱
    for (i = 0; i < this.option.spiritList.length; i++) {
        para = this.option.spiritList[i]
        id = getId(para, contentPrefix)
        this.combineId.push(id)
        createSpirit(id, para, contentPrefix, this.ResourcePath);
    }

}


seniorManage.prototype = {
    //销毁
    destroy: function() {
        var obj
        this.combineId.forEach(function(id) {
            obj = spiritObjs[id];
            if (obj) {
                obj.destroy()
                spiritObjs[id] = null;
                delete spiritObjs[id]
            } else {
                console.log('精灵动画销毁错误')
            }
        })
    }
}
