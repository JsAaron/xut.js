/********************************************************************
 *
 *                   零件适配器
 *
 *              1 数据过滤
 *              构件5种类型
 *
 * *******************************************************************/
import { sceneController } from '../../scenario/control'
import { parseJSON, reviseSize } from '../../util/index'
import { config } from '../../config/index'
import pageWidget from './page/index'
import iframeWidget from './iframe/index'

const FLOOR = Math.floor
const CEIL = Math.ceil

/**
 * 注册所有组件对象
 * 2 widget 包括 视频 音频 Action 子文档 弹出口 类型
 * 这种类型是冒泡处理，无法传递钩子，直接用这个接口与场景对接
 * @param  {[type]} regData [description]
 * @return {[type]}         [description]
 */
const injectionComponent = function(regData) {
  var sceneObj = sceneController.containerObj('current')
  sceneObj.$$mediator.$injectionComponent = regData
}


const load = (type, data, constructor) => {
  injectionComponent({
    'pageType': data.pageType, //标记类型区分
    'pageIndex': data.pageIndex,
    'widget': new constructor(data)
  })
}

/**
 * 构建5中零件类型
 *  1、iframe零件
 *  2、页面零件
 *  3、SVG零件
 *  4、canvas零件
 *  5、webGL零件
 * @type {Object}
 */
const adapterType = {

  /**
   * iframe零件类型
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  'iframe' (data) {
    load('widget', data, iframeWidget);
  },

  'widget' (data) {
    load('widget', data, iframeWidget);
  },

  /**
   * js零件类型处理
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  'js' (data) {
    load('js', data, pageWidget);
  },
  'page' (data) {
    load('page', data, pageWidget);
  },
  'svg' (data) {
    load('svg', data, pageWidget);
  },
  'canvas' (data) {
    load('canvas', data, pageWidget);
  },
  'webgL' (data) {
    load('webgL', data, pageWidget);
  }
}

/*过滤出数据*/
const getWidgetData = (data) => {
  //直接通过id查询数据
  if(data.widgetId) {
    _.extend(data, Xut.data.query('Widget', data.widgetId))
  } else {
    //直接通过activityId查询数据
    _.extend(data, Xut.data.query('Widget', data.activityId, 'activityId'));
  }
  return data;
}

/*计算元素的缩放比*/
const calculateSize = (data, pageStyle) => {
  let sizeResults = reviseSize({
    results: data,
    getStyle: pageStyle,
    proportion: pageStyle.pageProportion
  })
  data.width = data.scaleWidth
  data.height = data.scaleHeight
  data.top = data.scaleTop
  data.left = data.scaleLeft
  return data;
}

/*ifarme内部，请求返回数据*/
const parsePara = (data) => {
  let inputPara
  if(inputPara = data.inputPara) {
    return parseJSON(inputPara)
  }
  return {}
}

export function Adapter(para) {

  //获取数据
  let data = getWidgetData(_.extend({}, para))

  data.id = data.activityId
  data.inputPara = parsePara(data)

  /*增加属性参数*/
  if(data.widgetType === 'page') { data.inputPara.container = data.rootNode }

  /*重新定义页面的布局参数*/
  let pageStyle = Xut.Presentation.GetPageStyle(para.pageIndex)
  let pageVisualSize = {
    width: pageStyle.visualWidth,
    height: pageStyle.visualHeight,
    left: pageStyle.visualLeft,
    top: pageStyle.visualTop
  }
  data.pageProportion = pageStyle.pageProportion

  /*缩放比值*/
  data = calculateSize(data, pageStyle)

  data.inputPara.uuid = config.data.appId + '-' + data.activityId; //唯一ID标示
  data.inputPara.id = data.activityId;
  data.inputPara.screenSize = pageVisualSize

  //content的命名前缀
  data.inputPara.contentPrefix = Xut.Presentation.GetContentPrefix(data.pageIndex, data.pageType)

  //画轴模式
  data.scrollPaintingMode = config.launch.visualMode === 4;
  data.calculate = pageVisualSize

  //执行类构建
  adapterType[(data.widgetType || 'widget').toLowerCase()](data);
}
