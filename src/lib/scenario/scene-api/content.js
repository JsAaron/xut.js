/********************************************
 * 场景API
 * 针对page页面的content类型操作接口
 ********************************************/
import { typeFilter } from './page-type'
import { reviseSize } from '../../util/option'

export function extendContent(access, $$globalSwiper) {

  /**
   * 获取指定的对象
   * 传递参数
   * 单一 id
   * 数据id合集 [1,2,4,5,6]
   * @param {[type]}   contentIds  [description]
   * @param {Function} eachContext 回调遍历每一个上下文
   */
  Xut.Contents.Get = function(pageType, contentIds, eachContext) {

    return access(function(manager, pageType, contentIds, eachContext) {

      var contentObj, contentObjs,
        pageIndex = Xut.Presentation.GetPageIndex();

      function findContent(currIndex, contentId) {
        var pageObj;
        if(pageObj = manager.$$getPageBase(currIndex)) {
          return pageObj.baseGetContentObject(contentId);
        }
      }

      //如果传递是数组合集
      if(_.isArray(contentIds)) {
        contentObjs = [];
        _.each(contentIds, function(id) {
          contentObj = findContent(pageIndex, id)
          if(eachContext) { //传递每一个处理的上下文
            eachContext(id, contentObj);
          } else {
            if(contentObj) {
              contentObjs.push(contentObj);
            } else {
              // console.log('error', '找不到对应的content数据' + id)
            }
          }
        })
        return contentObjs;
      }

      //如果传递的是Content_1_3组合情况
      if(/_/.test(contentIds)) {
        var expr = contentIds.split('_');
        if(expr.length > 1) {
          return findContent(expr[1], expr[2]);
        }
      }

      //单一content id
      contentObj = findContent(pageIndex, contentIds);

      if(eachContext) {
        eachContext(contentObj);
      } else {
        return contentObj;
      }

    }, pageType, contentIds, eachContext)
  }

  /**
   * 得到指定页面零件的数据
   * 获取指定的content数据
   * @param  {[type]} contentId [description]
   * @return {[type]}           [description]
   */
  Xut.Contents.GetPageWidgetData = function(pageType, contentId, pageProportion) {

    //如果没有传递pageType取默认
    if(-1 === typeFilter.indexOf(pageType)) {
      contentId = pageType;
      pageType = 'page';
    }

    //必须有数据
    if(!contentId || !contentId.length) {
      return;
    }

    //保证是数组格式
    if(_.isString(contentId)) {
      contentId = [contentId];
    }

    var contentData, contents = [];

    Xut.Contents.Get(pageType, contentId, function(cid, content) {
      //是内部对象
      if(content && (contentData = content.contentData)) { //通过内部管理获取对象
        contents.push({
          'id': content.id,
          'idName': content.actName,
          'element': content.$contentNode,
          'theTitle': contentData.theTitle,
          'scaleHeight': contentData.scaleHeight,
          'scaleLeft': contentData.scaleLeft,
          'scaleTop': contentData.scaleTop,
          'scaleWidth': contentData.scaleWidth,
          'contentData': contentData,
          'source': 'innerObjet' //获取方式内部对象
        });
      } else {
        //如果通过内部找不到对象的content数据,则直接查找数据库
        //可能是一个事件的钩子对象
        if(contentData = seekQuery(cid, pageProportion)) {
          var actName = Xut.Presentation.GetContentName(cid);
          var element;
          //如果对象是事件钩子或者是浮动对象
          //没有具体的数据
          if(content && content.$contentNode) {
            element = content.$contentNode;
          } else {
            element = $('#' + actName);
          }
          contents.push({
            'id': cid,
            'idName': actName,
            'element': element,
            'theTitle': contentData.theTitle,
            'scaleHeight': contentData.scaleHeight,
            'scaleLeft': contentData.scaleLeft,
            'scaleTop': contentData.scaleTop,
            'scaleWidth': contentData.scaleWidth,
            'contentData': contentData,
            'source': 'dataBase'
          });
        } else {
          // console.log('error', '找不到对应的GetPageWidgetData数据' + cid)
        }
      }
    });
    return contents;
  }

  //数据库查找
  function seekQuery(id, proportion) {
    var contentData = Xut.data.query('Content', id);
    if(contentData) {
      return reviseSize({
        results: _.extend({}, contentData),
        proportion
      })
    }
  }

  /**
   * 互斥接口
   * 直接显示\隐藏\停止动画
   */

  //检测类型为字符串
  function typeCheck(objNameList) {
    return !objNameList || typeof objNameList !== 'string' ? true : false;
  }

  /**
   * 针对文本对象的直接操作
   * 显示
   * 隐藏
   * 停止动画
   */
  _.each([
    "Show",
    "Hide",
    "StopAnim"
  ], function(operate) {
    Xut.Contents[operate] = function(pageType, nameList) {
      access(function(manager, pageType, nameList) {
        if(typeCheck(nameList)) return;
        var pageBaseObj;
        if(!(pageBaseObj = manager.assistPocess($$globalSwiper.getVisualIndex()))) {
          console.log('注入互斥接口数据错误！')
          return;
        }
        _.each(nameList.split(','), function(contentId) {
          pageBaseObj.baseContentMutex(contentId, operate)
        })
      }, pageType, nameList)
    }
  })


}
