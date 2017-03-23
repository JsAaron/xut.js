////////////////////////////////
///
/// 全局config与 launch配置优先级
/// lauch可以覆盖全局config配置
///
////////////////////////////////

import { config } from './index'


/*预先判断br的基础类型*/
// 1 在线模式 返回增加后缀
// 2 手机模式 返回删除后缀
// 3 PC模式，不修改
function getBrType(launch) {
  //ios
  if(launch.brModel === 1) {
    if(Xut.plat.isBrowser) { //浏览器访问
      return '_i'
    } else {
      //app访问
      return 'delete'
    }
  }
  //android
  if(launch.brModel === 2) {
    if(Xut.plat.isBrowser) { //浏览器访问
      return '_a'
    } else {
      //app访问
      return 'delete'
    }
  }
  //模式 brModel==0
  return ''
}

/*获取真实的配置文件 priority*/
export function priorityConfig() {

  /*如果启动了代码追踪，配置基本信息*/
  const launch = config.launch
  const trackTypes = launch && launch.trackCode || config.trackCode
  config.hasTrackCode = () => {}
  if(trackTypes && _.isArray(trackTypes) && trackTypes.length) {
    if(!launch.trackCode) { launch.trackCode = {} }
    trackTypes.forEach(type => { launch.trackCode[type] = true })
    config.hasTrackCode = (type, callback) => {
      if(launch && launch.trackCode && launch.trackCode[type]) {
        callback && callback(option => {
          Xut.Application.Notify('trackCode', type, _.extend(option || {}, {
            appId: config.appId,
            appName: config.shortName
          }))
        })
        return true
      }
    }
  }

  /*图片模式webp*/
  if(launch && !launch.brModel && config.brModel) {
    launch.brModel = config.brModel
  }

  /*预先判断出基础类型*/
  if(launch.brModel) {
    launch.brModelType = getBrType(launch)
  }





}
