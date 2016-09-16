/********************************************************************
 *
 *                   零件适配器
 *
 *              1 数据过滤
 *              构件5种类型
 *
 * *******************************************************************/
import { PageWidget } from './page/index'
import { parseJSON } from '../../util/dom'
import { config } from '../../config/index'
import iframeWidget from './iframe'


const load = (type, data, constructor) => {
    Xut.Application.injectionComponent({
        'pageType'  : data.pageType, //标记类型区分
        'pageIndex' : data.pageIndex,
        'widget'    : new constructor(data)
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
        load('js', data, PageWidget);
    },
    'page' (data) {
        load('page', data, PageWidget);
    },
    'svg' (data) {
        load('svg', data, PageWidget);
    },
    'canvas' (data) {
        load('canvas', data, PageWidget);
    },
    'webgL' (data) {
        load('webgL', data, PageWidget);
    }
}


/**
 * 过滤出数据
 * @return {[type]} [description]
 */
const filterData = (data) => {
    //直接通过id查询数据
    if (data.widgetId) {
        _.extend(data, Xut.data.query('Widget', data.widgetId))
    } else {
        //直接通过activityId查询数据
        _.extend(data, Xut.data.query('Widget', data.activityId, 'activityId'));
    }
    return data;
}


/**
 * 获取widget数据
 * @return {[type]} [description]
 */
const filtrateDas = (data) => {
    data = filterData(data);
    return config.proportion.calculateElement(data)
}



/**
 * ifarme内部，请求返回数据
 * @return {[type]} [description]
 */
const parsePara = (data) => {
    var inputPara, //输入数据
        outputPara; //输出数据
    if (inputPara = data.inputPara) {
        outputPara = parseJSON(inputPara)
    }
    return outputPara;
}



export function Adapter(para) {

    //获取数据
    const data = filtrateDas(para)

    data.id = data.activityId

    //解析数据
    data.inputPara = parsePara(data)
 
    if (!data.inputPara) {
        data.inputPara = {}
    }

    //增加属性参数
    if (data.widgetType === 'page') {
        data.inputPara.container = data.rootNode
    }

    data.inputPara.uuid = config.appId + '-' + data.activityId; //唯一ID标示
    data.inputPara.id = data.activityId;
    data.inputPara.screenSize = config.screenSize;
    //content的命名前缀
    data.inputPara.contentPrefix = Xut.Presentation.MakeContentPrefix(data.pageIndex, data.pageType)

    //画轴模式
    data.scrollPaintingMode = config.scrollPaintingMode;
    data.calculate = config.proportion.calculateContainer();

    //执行类构建
    adapterType[(data.widgetType || 'widget').toLowerCase()](data);
}
