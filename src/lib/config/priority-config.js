////////////////////////////////
///
/// 全局config与 launch配置优先级
/// lauch可以覆盖全局config配置
///
////////////////////////////////

import { config } from './index'
import { setDelay, setDisable, setPath, resetCursor } from '../initialize/cursor'

/*预先判断br的基础类型*/
// 1 在线模式 返回增加后缀
// 2 手机模式 返回删除后缀
// 3 PC模式，不修改
function getBrType(mode) {

  //自适应平台
  if (mode === 1) {
    if (Xut.plat.isIOS) {
      return getBrType(2)
    }
    if (Xut.plat.isAndroid) {
      return getBrType(3)
    }
  }

  //ios
  if (mode === 2) {
    if (Xut.plat.isBrowser) { //浏览器访问
      return '_i'
    } else {
      //app访问
      return 'delete'
    }
  }
  //android
  if (mode === 3) {
    if (Xut.plat.isBrowser) { //浏览器访问
      return '_a'
    } else {
      //app访问
      return 'delete'
    }
  }
  //模式 brModel==0
  return ''
}

/*
  获取真实的配置文件 priority
  优先级： launch > config
  1 cursor
  2 trackCode
  3 brModel
 */
export function priorityConfig() {

  /*独立app与全局配置文件*/
  const launch = config.launch
  const golbal = config.golbal

  //////////////////////////////////
  /// 忙碌光标
  //////////////////////////////////
  if (launch) {
    /*因为光标可以配置false 关闭，所以这里需要注意判断*/
    const cursor = launch.cursor || launch.cursor === false ?
      launch.cursor :
      golbal.cursor

    /*每次配置光标之前都重置，可能被上个给覆盖默认的*/
    resetCursor()

    /*如果配置了关闭*/
    if (cursor === false) {
      setDisable()
    } else if (cursor) {
      /*自定义忙碌*/
      if (cursor.time) {
        setDelay(cursor.time)
      }
      if (cursor.url) {
        setPath(cursor.url)
      }
    }
  }


  //////////////////////////////////
  /// 如果启动了代码追踪，配置基本信息
  //////////////////////////////////
  const trackTypes = launch && launch.trackCode || golbal.trackCode
  config.sendTrackCode = () => {}
  config.hasTrackCode = () => {}
    /*'launch', 'init', 'exit', 'flip', 'content', 'hot', 'swipe']*/
  if (trackTypes && _.isArray(trackTypes) && trackTypes.length) {
    if (!launch.trackCode) { launch.trackCode = {} }
    trackTypes.forEach(type => { launch.trackCode[type] = true })
    const uuid = Xut.guid()

    /*检测是否有代码追踪*/
    config.hasTrackCode = (type) => {
      if (launch && launch.trackCode && launch.trackCode[type]) {
        return true
      }
    }

    /*合并命令，动作类型归类为action*/
    const modifyName = ['content', 'hot']
    const getTrackName = (type) => {
      if (~modifyName.indexOf(type)) {
        return 'action'
      }
      return type
    }

    /*发送代码追踪数据*/
    config.sendTrackCode = (type, options = {}) => {
      if (config.hasTrackCode(type)) {
        Xut.Application.Notify('trackCode', getTrackName(type), _.extend(options || {}, {
          uuid,
          appId: config.data.appId,
          appName: config.data.shortName
        }))
      }
    }
  }

  //////////////////////////////////
  /// 图片模式webp
  //////////////////////////////////
  if (launch) {
    if (!launch.brModel && golbal.brModel) {
      launch.brModel = golbal.brModel
    }
    /*预先判断出基础类型*/
    if (launch.brModel) {
      launch.brModelType = getBrType(launch.brModel)
    }
  }

  //////////////////////////////////
  ///golbal混入到launch中
  //////////////////////////////////
  for (let key in golbal) {
    if (launch[key] === undefined) {
      launch[key] = golbal[key]
    }
  }

  //////////////////////////////////
  ///竖版的情况下，页面模式都强制为1
  //////////////////////////////////
  if (launch.displayMode === 'v') {
    launch.visualMode = 1
  }


}
