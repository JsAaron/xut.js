/*
 * 母版管理模块
 * @param  {[type]}
 * @return {[type]}
 */
import { config } from '../../config/index'
import { ManageSuper } from './super'
import { Pagebase } from '../pagebase/index'
import {
  $suspend,
  $original,
  $autoRun
} from '../command/index'
import {
  cacheProperty,
  getStepProperty,
  setStyle
} from '../../component/activity/content/parallax/depend'


/**
 * 扁平化对象到数组
 * @param  {[type]} filter [description]
 * @return {[type]}        [description]
 */
const toArray = (filter) => {
  var arr = [];
  if (!filter.length) {
    for (var key in filter) {
      arr.push(filter[key]);
    }
    filter = arr;
  }
  return filter;
}

const rword = "-"

/**
 * parallaObjsCollection: Object
 *      0: Page
 *      1: Page
 *
 *  recordMasterId: Object
 *      0: 9001
 *      1: 9001
 *
 *  recordMasterRange: Object
 *      9001: Array[2]
 *
 *  rootNode: ul # parallax.xut - parallax xut - flip
 *
 *  currMasterId: 9001 //实际的可使区
 */
export default class MasterMgr extends ManageSuper {

  constructor(rootNode) {
    super()

    this.visualWidth = config.visualSize.width
    this.visualHeight = config.visualSize.height

    this.pageType = 'master';

    this.rootNode = rootNode;
    this.recordMasterRange = {}; //记录master区域范围
    this.recordMasterId = {}; //记录页面与母板对应的编号
    this.currMasterId = null; //可视区母板编号

    /**
     * 记录视察处理的对象
     * @type {Object}
     */
    this.parallaxProcessedContetns = {};
  }

  /**
   * 注册状态管理
   */
  register(pageIndex, type, hotspotObj) {
    var parallaxObj = this.$$getPageBase(this.converMasterId(pageIndex))
    if (parallaxObj) {
      parallaxObj.registerCotents.apply(parallaxObj, arguments);
    }
  }

  /**
   * 创建
   */
  create(dataOpts, pageIndex, createCallBack, repeatCallBack) {
    let reuseMasterKey
    let pptMaster = dataOpts.chapterData.pptMaster
    let pageOffset = dataOpts.chapterData.pageOffset

    //母板复用的标示
    let reuseMasterId = pageOffset && pageOffset.split(rword);

    //组合下标
    if (reuseMasterId && reuseMasterId.length === 3) {
      reuseMasterKey = pptMaster + rword + reuseMasterId[2];
    } else {
      reuseMasterKey = pptMaster;
    }

    //检测母版已经创建
    if (this._hasMaster(reuseMasterKey, pageOffset, pageIndex)) {
      //重复的母版对象
      //用于检测页面模式是否一致
      let currMasterObj = this.$$getPageBase(reuseMasterKey);
      currMasterObj && repeatCallBack(currMasterObj)
      return
    }

    //通知外部,需要创建的母版
    createCallBack();

    let masterObj = new Pagebase(
      _.extend(dataOpts, {
        pptMaster, //ppt母板ID
        'pageType': this.pageType, //创建页面的类型
        'rootNode': this.rootNode //根元素
      })
    );

    //增加页面管理
    this._$$addBaseGroup(reuseMasterKey, masterObj);

    return masterObj;
  }


  /**
   * 页面滑动处理
   * 1 母版之间的切换
   * 2 浮动对象的切换
   */
  move(options, isAppBoundary) {

    const {
      nodes,
      speed,
      action,
      moveDistance,
      direction,
      frontIndex,
      middleIndex,
      backIndex
    } = options

    //是边界处理
    //边界外处理母版
    //边界内处理视觉差
    let isBoundary = false

    //找到需要滑动的母版
    let masterObjs = this._findMaster(frontIndex, middleIndex, backIndex, direction, action, isAppBoundary)

    _.each(masterObjs, function(pageObj, index) {
      if (pageObj) {
        isBoundary = true
        pageObj.movePage(action, moveDistance[index], speed, moveDistance[3])
      }
    })

    //越界不需要处理内部视察对象
    this.isBoundary = isBoundary;
    if (isBoundary) {
      return
    }

    /**
     * 移动内部的视察对象
     * 处理当前页面内的视觉差对象效果
     */
    const moveParallaxObject = (nodes) => {
      let getMasterId = this.converMasterId(middleIndex)
      let currParallaxObj = this.$$getPageBase(getMasterId)
      if (currParallaxObj) {
        //处理当前页面内的视觉差对象效果
        currParallaxObj.moveParallax({
          action,
          direction,
          speed,
          nodes,
          moveDistance,
          parallaxProcessedContetns: this.parallaxProcessedContetns
        })
      }
    }

    //移动视察对象
    switch (direction) {
      case 'prev':
        moveParallaxObject();
        break;
      case 'next':
        nodes && moveParallaxObject(nodes)
        break;
    }
  }


  /**
   * 停止行为
   * @return {[type]} [description]
   */
  suspend(action, stopPointer) {
    //翻页，如果越界，需要处理
    //跳页，需要处理
    //
    //暂时没有处理
    //如果跳的新页面，还是同一个模板的情况
    if (this.isBoundary || action === 'toPage') {
      let masterObj
      if (masterObj = this.$$getPageBase(stopPointer)) {
        let pageId = masterObj.baseGetPageId(stopPointer);
        //停止活动对象活动
        $suspend(masterObj, pageId);
      }
    }
  }


  /**
   * 复位初始状态
   * @return {[type]} [description]
   */
  resetOriginal(pageIndex) {
    var originalPageObj;
    if (originalPageObj = this.$$getPageBase(pageIndex)) {
      $original(originalPageObj);
    }
  }


  /**
   *  母版自动运行
   */
  autoRun(action, data) {
    const { middleIndex, suspendIndex } = data
    const masterObj = this.$$getPageBase(middleIndex)
    if (masterObj) {
      //如果没有运行自动任务
      //如果动作是初始化，或者触发了母版自动运行
      //如果是越界处理
      if (!masterObj.onceMaster || action || this.isBoundary) {
        //热点状态复位
        this.resetOriginal(suspendIndex)
        $autoRun(masterObj, middleIndex);
      }
    }
  }


  /**
   * 重新激动视觉差对象
   * 因为视察滑动对象有动画
   * 2个CSS3动画冲突的
   * 所以在视察滑动的情况下先停止动画
   * 然后给每一个视察对象打上对应的hack=>data-parallaxProcessed
   * 通过动画回调在重新加载动画
   * @return {[type]} [description]
   */
  reactivation(target) {
    if (this.parallaxProcessedContetns) {
      var actName = target.id;
      var contentObj = this.parallaxProcessedContetns[actName];
      if (contentObj) {
        contentObj.runAnimations();
        //视觉差处理一次,停止过动画
        contentObj.parallaxProcessed = false;
        //移除标记
        target.removeAttribute('data-parallaxProcessed');
        //记录
        delete this.parallaxProcessedContetns[actName];
      }
    }
  }


  /**
   * 制作处理器
   * 针对跳转页面
   */
  makeJumpPocesss(targetIndex) {
    var filter;
    var master = this;
    return {
      pre: function() {
        //目标母板对象
        var targetkey = master.converMasterId(targetIndex);
        //得到过滤的边界keys
        //在filter中的页面为过滤
        filter = master._scanBounds(targetIndex, targetkey);
        //清理多余母板
        //filter 需要保留的范围
        master._checkClear(filter, true);
        //更新可视母板编号
        master.currMasterId = targetkey;
      },
      //修正位置
      clean: function(visualIndex, targetIndex) {
        master._fixPosition(filter);
        master._checkParallaxPox(visualIndex, targetIndex);
      }
    }
  }


  /**
   * 销毁整页面管理对象
   * 退出应用处理
   * @return {[type]} [description]
   */
  destroyManage() {
    this.rootNode = null;
    //销毁对象
    this._$$destroyBaseGroup();
  }


  /**
   * 找到当前页面的可以需要滑动是视觉页面对象
   * isAppBoundary 是应用边界反弹，##317,最后一页带有视觉差反弹出错,视觉差不归位
   */
  _findMaster(frontIndex, middleIndex, backIndex, direction, action, isAppBoundary) {
    let prevFlag, nextFlag,
      prevMasterId, nextMasterId,
      prevMasterObj, currMasterObj, nextMasterObj,
      currMasterId = this.converMasterId(middleIndex)

    switch (direction) {
      case 'prev':
        prevMasterId = this.converMasterId(frontIndex)
        prevFlag = currMasterId !== prevMasterId

        //如果2个页面不一样的视觉差
        //或者是应用最后一页反弹的情况，2个页面同一个视觉差，也就是最后一页，往前面反弹
        if (prevFlag || isAppBoundary) {
          currMasterObj = this.$$getPageBase(currMasterId);
        }

        if (prevMasterId && prevFlag) {
          action === 'flipOver' && this._checkClear([currMasterId, prevMasterId]); //边界清理
          prevMasterObj = this.$$getPageBase(prevMasterId)
        }

        break;
      case 'next':
        nextMasterId = this.converMasterId(backIndex)
        nextFlag = currMasterId !== nextMasterId
        if (nextFlag) {
          currMasterObj = this.$$getPageBase(currMasterId)
        }
        if (nextMasterId && nextFlag) {
          action === 'flipOver' && this._checkClear([currMasterId, nextMasterId]); //边界清理
          nextMasterObj = this.$$getPageBase(nextMasterId)
        }
        break;
    }
    return [prevMasterObj, currMasterObj, nextMasterObj];
  }


  //扫描边界
  //扫描key的左右边界
  //当前页面的左右边
  _scanBounds(currPage, currkey) {
    var currKey = this.converMasterId(currPage),
      filter = {},
      i = currPage,
      prevKey, nextKey;

    //往前
    while (i--) {
      prevKey = this.converMasterId(i);
      if (prevKey && prevKey !== currkey) {
        filter['prev'] = prevKey;
        break;
      }
    }

    //往后
    nextKey = this.converMasterId(currPage + 1);

    //如果有下一条记录
    if (nextKey && nextKey !== currkey) {
      //如果不是当期页面满足范围要求
      filter['next'] = nextKey;
    }

    //当前页面
    if (currKey) {
      filter['curr'] = currKey;
    }
    return filter;
  }


  /**
   * 修正位置
   * @param  {[type]} filter [description]
   * @return {[type]}        [description]
   */
  _fixPosition(filter) {

    var self = this

    const setPosition = function(parallaxObj, position) {

      /**
       * 设置移动
       */
      const _fixToMove = function(distance, speed) {
        var $pageNode = parallaxObj.$pageNode;
        if ($pageNode) {
          Xut.style.setTranslate({
            speed,
            x: distance,
            node: $pageNode
          })
        }
      }

      if (position === 'prev') {
        _fixToMove(-self.visualWidth);
      } else if (position === 'next') {
        _fixToMove(self.visualWidth);
      } else if (position === 'curr') {
        _fixToMove(0);
      }
    }

    for (var key in filter) {
      switch (key) {
        case 'prev':
          setPosition(this.$$getPageBase(filter[key]), 'prev')
          break;
        case 'curr':
          setPosition(this.$$getPageBase(filter[key]), 'curr')
          break;
        case 'next':
          setPosition(this.$$getPageBase(filter[key]), 'next')
          break;
      }
    }
  }


  _checkParallaxPox(currPageIndex, targetIndex) {
    var key, pageObj,
      pageCollection = this._$$getBaseGroup();
    for (key in pageCollection) {
      pageObj = pageCollection[key];
      //跳跃过的视觉容器处理
      this._fixParallaxPox(pageObj, currPageIndex, targetIndex)
    }
  }


  /**
   * 当前同一视觉页面作用的范围
   * @param  {[type]} reuseMasterKey [description]
   * @param  {[type]} pageIndex      [description]
   * @return {[type]}                [description]
   */
  _toRepeat(reuseMasterKey, pageIndex) {
    var temp;
    if (temp = this.recordMasterRange[reuseMasterKey]) {
      return temp;
    }
    return false;
  }

  //更新母板作用域范围
  //recordMasterRange:{
  //   9001-1:[0,1], master 对应记录的页码
  //   9002-1:[2,3]
  //   9001-2:[4,5]
  //}
  _updataMasterscope(reuseMasterKey, pageIndex) {
    var scope;
    if (scope = this.recordMasterRange[reuseMasterKey]) {
      if (-1 === scope.indexOf(pageIndex)) {
        scope.push(pageIndex);
      }
    } else {
      this.recordMasterRange[reuseMasterKey] = [pageIndex]
    }
  }

  /**
   * 记录页面与模板标示的映射
   */
  _updatadParallaxMaster(reuseMasterKey, pageIndex) {
    //记录页面与模板标示的映射
    this.recordMasterId[pageIndex] = reuseMasterKey;

    //更新可视区母板的编号
    this.currMasterId = this.converMasterId(Xut.Presentation.GetPageIndex())
  }


  /**
   * 检测是否需要创建母版
   */
  _hasMaster(reuseMasterKey, pageOffset, pageIndex) {
    var tag = this._toRepeat(reuseMasterKey, pageIndex); //false就是没找到母版对象
    this._updataMasterscope(reuseMasterKey, pageIndex);
    this._updatadParallaxMaster(reuseMasterKey, pageIndex);
    return tag;
  }


  /**
   * 修正跳转后视觉对象坐标
   * @param  {[type]} parallaxObj   [description]
   * @param  {[type]} currPageIndex [description]
   * @param  {[type]} targetIndex   [description]
   * @return {[type]}               [description]
   */
  _fixParallaxPox(parallaxObj, currPageIndex, targetIndex) {
    let self = this
    let activitys
    let prevNodes
    let nodes

    const repairNodes = function(parallax) {
      let rangePage = parallax.calculateRangePage()
      let lastProperty = parallax.lastProperty

      if (targetIndex > currPageIndex) {
        //next
        if (targetIndex > rangePage['end']) {
          nodes = 1
        }
      } else {
        //prev
        if (targetIndex < rangePage['start']) {
          nodes = 0
        }
      }

      let property = getStepProperty({
        targetProperty: parallax.targetProperty,
        distance: -self.visualWidth,
        nodes: nodes
      });

      //直接操作元素
      setStyle({
        $contentNode: parallax.$contentNode,
        action: 'master',
        property: property,
        speed: 300,
        opacityStart: lastProperty.opacityStart
      })

      cacheProperty(property, lastProperty);
    }


    if (activitys = parallaxObj.baseGetActivity()) {
      //获取到页面nodes
      nodes = Xut.Presentation.GetPageNode(targetIndex - 1);
      activitys.forEach(function(contentObj) {
        contentObj.eachAssistContents(function(scope) {
          if (scope.parallax) {
            repairNodes(scope.parallax)
          }
        })
      })
    }

  }


  //检测是否需要清理
  // 1 普通翻页清理  【数组过滤条件】
  // 2 跳转页面清理  【对象过滤条件】
  _checkClear(filter, toPage) {
    var key, indexOf,
      removeMasterId = _.keys(this._$$getBaseGroup());

    // 如果有2个以上的母板对象,就需要清理
    if (removeMasterId.length > 2 || toPage) { //或者是跳转页面
      //解析对象
      filter = toArray(filter);
      //过滤
      _.each(filter, function(masterId) {
        if (masterId !== undefined) {
          indexOf = removeMasterId.indexOf(masterId.toString());
          if (-1 !== indexOf) {
            //过滤需要删除的对象
            removeMasterId.splice(indexOf, 1);
          }
        }
      })
      this._clearMemory(removeMasterId);
    }
  }


  /**
   * 清理内存
   * 需要清理的key合集
   * @param  {[type]} removeMasterId [description]
   * @return {[type]}                [description]
   */
  _clearMemory(removeMasterId) {
    var pageObj, self = this;
    _.each(removeMasterId, function(removekey) {
      //销毁页面对象事件
      if (pageObj = self.$$getPageBase(removekey)) {
        //移除事件
        pageObj.baseDestroy();
        //移除列表
        self._$$removeBaseGroup(removekey)
        self._removeRecordMasterRange(removekey)
      }
      //清理作用域缓存
      delete self.recordMasterRange[removekey];
    })
  }


  /**
   * page转化成母版ID
   * @param  {[type]} pageIndex [description]
   * @return {[type]}           [description]
   */
  converMasterId(pageIndex) {
    return this.recordMasterId ? this.recordMasterId[pageIndex] : undefined;
  }


  _removeRecordMasterRange(removekey) {
    var me = this;
    var recordMasterRange = me.recordMasterRange[removekey];
    //清理页码指示标记
    recordMasterRange.forEach(function(scope) {
      delete me.recordMasterId[scope];
    })
  }

}
