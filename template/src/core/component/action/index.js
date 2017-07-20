/**
 *
 *  动作对象
 *      1 跳转页面
 *      2 打开系统程序
 *      3 加载子文档
 *
 */

import extendDoc from './subdoc'


/**
 * 废弃子文档
 * @param  {[type]} results [description]
 * @return {[type]}         [description]
 */
const _init = function(results) {

  let para1 = results.para1 //跳转参数
  let dbId = results._id
  let actionType = parseInt(results.actionType);

  //跳转或打开本地程序
  switch(actionType) {
    case 0:
      this.toPage(para1);
      break;
    case 1:
      if(Xut.plat.isBrowser) return;
      //打开插件
      Xut.Plugin.OpenApp.openAppAction(para1, function() {}, function() {});
      break;
    case 2:
      //子文档处理
      this._loadSubdoc(para1, dbId);
      break;
  }
  this.state = true;
}


/**
 * 跳转页面
 * @param  {[type]} para1 [description]
 * @return {[type]}       [description]
 */
const toPage = function(para1) {
  para1 = JSON.parse(para1);
  if(para1.seasonId) {
    Xut.View.GotoSlide(para1.seasonId, para1.chapterId)
  } else {
    //向下兼容
    Xut.View.GotoSlide(para1)
  }
}


export default function Action(data) {
  const id = parseInt(data.id)
  const results = Xut.data.query('Action', id, 'activityId')
  const para1 = results.para1 //跳转参数
  const actionType = parseInt(results.actionType)
  if(actionType == 0) {
    toPage(para1)
  }
}