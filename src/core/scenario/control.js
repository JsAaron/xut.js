/**
 * 场景控制器
 * 场景对象之间的顺序处理
 * @return {[type]} [description]
 */

//场景层级控制
let zIndex = 999999

//场景合集
//主场景
//副场景
const sceneCollection = {
  //场景顺序
  scenarioStack: [],
  //场景链表
  scenarioChain: []
}

export const sceneController = {

  /**
   * 场景层级控制
   * @return {[type]} [description]
   */
  createIndex() {
    return --zIndex;
  },


  /**
   * 设置一个新场景
   * @param {[type]} seasonId [description]
   * @param {[type]} relevant   [description]
   * @param {[type]} sceneObj   [description]
   */
  add(seasonId, chapterId, sceneObj) {
    if(seasonId){
      seasonId = Number(seasonId)
    }
    if(chapterId){
      chapterId = Number(chapterId)
    }
    sceneCollection.scenarioStack.push(seasonId);
    sceneCollection['seasonId->' + seasonId] = sceneObj;
    //场景链表,拥挤记录场景的加载上一页
    sceneCollection.scenarioChain.push({seasonId,chapterId})
    return sceneObj;
  },


  /**
   * 取出上一个场景链
   * @return {[type]} [description]
   */
  takeOutPrevChainId() {
    var pre = sceneCollection.scenarioChain.pop();
    if(sceneCollection.scenarioChain.length > 1) {
      return sceneCollection.scenarioChain.pop()
    } else {
      return sceneCollection.scenarioChain[0];
    }
  },


  /**
   * 检测重复
   * @param  {[type]} seasonId [description]
   * @return {[type]}          [description]
   */
  checkToRepeat(seasonId) {
    var last,
      len = sceneCollection.scenarioChain.length;
    if(len > 1) {
      last = sceneCollection.scenarioChain[len - 2];
    } else {
      last = sceneCollection.scenarioChain[len - 1];
    }

    //往回跳一级
    if(last['seasonId'] == seasonId) {
      this.takeOutPrevChainId();
    }

    //直接会跳到主场景
    if(sceneCollection.scenarioStack[0] == seasonId) {
      var scenarioChain = sceneCollection.scenarioChain.shift();
      sceneCollection.scenarioChain.length = 0
      sceneCollection.scenarioChain.push(scenarioChain);
    }
  },


  /**
   * 返回活动对象
   * @return {[type]} [description]
   */
  containerObj(seasonId) {
    if(seasonId === 'current') {
      var scenarioStack = sceneCollection.scenarioStack;
      seasonId = scenarioStack[scenarioStack.length - 1];
    }
    return sceneCollection['seasonId->' + seasonId];
  },


  /**
   * 找到索引位置的Id
   * @param  {[type]} seasonId [description]
   * @return {[type]}            [description]
   */
  findIndexOfId(seasonId) {
    return sceneCollection.scenarioStack.lastIndexOf(seasonId);
  },


  /**
   * 删除指定场景引用
   * @param  {[type]} seasonId [description]
   * @return {[type]}            [description]
   */
  remove(seasonId) {
    var indexOf = this.findIndexOfId(seasonId)

    //删除索引
    sceneCollection.scenarioStack.splice(indexOf, 1)

    //删除场景对象区域
    delete sceneCollection['seasonId->' + seasonId];
  },


  /**
   * 销毁所有场景
   * @return {[type]} [description]
   */
  destroyAllScene() {
    var cache = _.clone(sceneCollection.scenarioStack);
    _.each(cache, function(seasonId) {
      sceneCollection['seasonId->' + seasonId].destroy();
    });
    sceneCollection.scenarioChain = []
  },


  /**
   * 重写场景的顺序编号
   * 用于记录最后一次跳转的问题
   * @return {[type]} [description]
   */
  rewrite(seasonId, chapterId) {
    _.each(sceneCollection.scenarioChain, function(scenarioChain) {
      if(scenarioChain.seasonId == seasonId) {
        scenarioChain.chapterId = chapterId;
      }
    });
  },


  /**
   * 暴露接口
   * @return {[type]} [description]
   */
  expose() {
    return sceneCollection;
  },


  /**
   * 解析序列
   * @param  {[type]} seasonId    [description]
   * @param  {[type]} currPageIndex [description]
   * @return {[type]}               [description]
   */
  sequence(seasonId, currPageIndex) {
    var chains = sceneCollection.scenarioChain;
    //有多个场景关系,需要记录
    if(chains.length > 1) {
      var history = [];
      //只刷新当前场景的页面
      _.each(chains, function(chain) {
        if(chain.seasonId == seasonId) {
          history.push(chain.seasonId + '-' + chain.chapterId + '-' + currPageIndex)
        } else {
          history.push(chain.seasonId + '-' + chain.chapterId)
        }
      })
      return history;
    }
  },


  /**
   * 反解析
   * @param  {[type]} chains [description]
   * @return {[type]}        [description]
   */
  seqReverse(chains) {
    var chains = chains.split(",")
    var chainsNum = chains.length;

    if(chainsNum === 1) {
      return false;
    }

    //如果只有2层
    if(chainsNum === 2) {
      return chains[1];
    }

    //拼接作用域链
    //排除首页(已存在)
    //尾页(新创建)
    _.each(chains, function(chain, index) {
      if(index >= 1 && (index < chainsNum - 1)) { //从1开始吸入,排除最后一个
        var chain = chain.split('-')
        sceneCollection.scenarioChain.push({
          'seasonId': chain[0],
          'chapterId': chain[1],
          'pageIndex': chain[2]
        })
      }
    })
    return chains[chainsNum - 1];
  }
}
