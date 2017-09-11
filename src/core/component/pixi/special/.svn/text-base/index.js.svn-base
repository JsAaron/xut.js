/**
 * 特殊pixi精灵动画
 * @param  {[type]} Utils   [description]
 * @param  {[type]} Config) {}          [description]
 * @return {[type]}         [description]
 */

import { Rule } from '../index'
import { parseJSON } from '../../util/index'
import { spiritAni } from './spirit'


const getSpiritAni = (inputPara, data, canvasEl) => {
  var path = data.resourcePath;
  var loop = data.loop;
  if(_.isObject(inputPara)) {
    return new spiritAni(inputPara, canvasEl, data);
  } else {
    console.log("inputPara undefine Spirit")
    return {};
  }
}

const getResources = (data) => {
  var option;
  var ResourcePath = "content/gallery/" + data.md5 + "/";
  var xhr = new XMLHttpRequest();
  data.resourcePath = ResourcePath;
  xhr.open('GET', ResourcePath + 'app.json', false);
  xhr.send(null);
  option = parseJSON(xhr.responseText);
  return option;
}



class specialSprite extends Rule {

  constructor(options) {
    super()

    this.data = options.data;
    this.renderer = options.renderer
    this.pageIndex = options.pageIndex

    //id标示
    //可以用来过滤失败的pixi对象
    this.contentId = this.data._id;
    this.option = getResources(this.data);
    var spiritList = this.option.spiritList;
    this.sprObjs = [];

    for(var i = 0; i < spiritList.length; i++) {
      var paramObj = spiritList[i].params;
      var actLists = paramObj.actList.split(',');
      for(var k = 0; k < actLists.length; k++) {
        this.sprObjs.push(getSpiritAni(paramObj[actLists[k]], this.data, this.renderer.view));
      }
    }

    //运行状态
    this.animState = false;
    this.first = true;

    this.successCallback(this.contentId);

  }

  /**
   * 运行动画
   * addQueue  将这个渲染加入队列
   * @return {[type]} [description]
   * 1000 / (obj.FPS || 10)
   */
  _play(addQueue) {
    let renderer = this.renderer
    this.uuid = addQueue(this.pageIndex, () => {
      _.each(this.sprObjs, (obj) => {
        //防止内存溢出
        //停止后不能再运行了
        if(!obj.timer) {
          obj.timer = setTimeout(() => {
            //在定时器事件内正好删除了引用
            //必须判断状态
            if(this.action == 'play') {
              renderer.render(obj.stage)
              obj.runAnimate()
            }
            clearTimeout(obj.timer)
            obj.timer = null;
          }, 1000 / (obj.FPS || 10))
        }
      })
    })
  }

  /**
   * 销毁动画
   * stopQueue 销毁队列
   * @return {[type]} [description]
   */
  _stop(stopQueue) {
    stopQueue(this.pageIndex, this.uuid)
    _.each(self.sprObjs, (obj) => {
      obj.timer && clearTimeout(obj.timer)
    })
  }


  /**
   * 销毁动画
   * @return {[type]} [description]
   */
  _destroy(destroyQueue) {
    destroyQueue(this.pageIndex, this.uuid)
    _.each(this.sprObjs, (obj) => {
      obj.destroy();
    })
  }

}


export {
  specialSprite
}
