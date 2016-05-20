/**
 * 特殊pixi精灵动画
 * @param  {[type]} Utils   [description]
 * @param  {[type]} Config) {}          [description]
 * @return {[type]}         [description]
 */

import { Factory } from '../core/factory'
import { parseJSON } from '../../../util/index'
import { spiritAni } from './spirit'


function getSpiritAni(inputPara, data) {
    var path = data.resourcePath;
    if (typeof inputPara == "object") {
        return new spiritAni(inputPara, path, data);
    } else {
        console.log("inputPara undefine Spirit")
        return {};
    }
}


function getResources(data) {
    var option;
    var ResourcePath = "content/gallery/" + data.md5 + "/";
    var xhr = new XMLHttpRequest();
    data.resourcePath = ResourcePath;

    xhr.open('GET', ResourcePath + 'app.json', false);
    xhr.send(null);
    try {
        option = parseJSON(xhr.responseText);
    } catch (e) {
        console.log("app.json get error:" + e);
    }
    return option;
}

var specialSprite = Factory.extend({

    /**
     * 初始化
     * @param  {[type]} data          [description]
     * @param  {[type]} canvasRelated [description]
     * @return {[type]}               [description]
     */
    constructor: function(successCallback, failCallback, options) {


        var self = this;

        this.data = options.data;
        this.renderer = options.renderer
        this.pageIndex = options.pageIndex

        //id标示
        //可以用来过滤失败的pixi对象
        this.contentId = this.data._id;

        this.option = getResources(this.data);

        var spiritList = this.option.spiritList;

        this.sprObjs = [];

        for (var i = 0; i < spiritList.length; i++) {
            var paramObj = spiritList[i].params;
            var actLists = paramObj.actList.split(',');
            for (var k = 0; k < actLists.length; k++) {
                this.sprObjs.push(getSpiritAni( paramObj[actLists[k]], this.data ));
            }
        }

        //运行状态
        this.animState = false;
        this.first = true;

        successCallback(this.contentId);

    },

    /**
     * 运行动画
     * addQueue  将这个渲染加入队列
     * @return {[type]} [description]
     */
    play: function(addQueue) {
        var self = this
        var renderer = self.renderer
        this.uuid = addQueue(this.pageIndex, function() {
            _.each(self.sprObjs, function(obj) {
                renderer.render(obj.stage);
                obj.timer = setTimeout(function() {
                    obj.runAnimate();
                }, 1000 / (obj.FPS || 10))
            })
        })
    },

    /**
     * 停止动画
     * stopQueue 停止队列
     * @return {[type]} [description]
     */
    stop: function(stopQueue) {
        stopQueue(this.pageIndex, this.uuid)
    },

    /**
     * 销毁动画
     * destroyQueue 销毁队列
     * @return {[type]} [description]
     */
    destroy: function(destroyQueue) {
        destroyQueue(this.pageIndex, this.uuid)
        //销毁添加到画布上的containers
        _.each(this.sprObjs, function(obj) {
            obj.stage.destroy(true)
        })
    }
})


export {
    specialSprite
}
