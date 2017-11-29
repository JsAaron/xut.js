import { config } from '../../config/index'

/**
 * 默认工具栏配置
 * @type {Object}
 */
const defaults = {
  ToolbarPos: 0, //工具栏[0顶部,1底部]
  NavbarPos: 1, //左右翻页按钮[0顶部, 1中间, 2底部]
  HomeBut: 1, //主页按钮[0不显示,1显示]
  ContentBut: 1, //目录按钮[0不显示,1显示]
  PageBut: 1, //页码按钮[0不显示,1显示]
  NavLeft: 1, //左翻页按钮[0不显示,1显示]
  NavRight: 1, //右翻页按钮[0不显示,1显示]
  customButton: 0, //自定义翻页按钮
  CloseBut: window.SUbDOCCONTEXT ? 1 : 0 //关闭按钮[0不显示,1显示]
}


/**
 * 配置默认数据
 * @return {[type]} [description]
 */
export default function initDefaults(setData) {

  let rs
  const data = {}
  const setConfig = {}

  _.each(setData, (key, index) => {
    rs = setData.item(index);
    data[rs.name] = rs.value;
  })

  _.defaults(data, defaults);

  for (let i in defaults) {
    setConfig[i] = Number(data[i]);
  }

  _.extend(config.data, {
    originalAppId: Number(data.appId),
    //应用的唯一标识符
    //生成时间+appid
    appId: data.adUpdateTime ? data.appId + '-' + /\S*/.exec(data.adUpdateTime)[0] : data.appId,
    settings: setConfig,
    delayTime: data.delayTime,
    Inapp: data.Inapp,
    shortName: data.shortName,
    /*字符串类型，需要转化*/
    visualMode: data.visualMode ? Number(data.visualMode) : 0
  })


  //广告Id
  //2014.9.2
  Xut.Presentation.AdsId = data.adsId;

  return data
}
