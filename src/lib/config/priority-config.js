////////////////////////////////
///
/// 全局config与 launch配置优先级
/// lauch可以覆盖全局config配置
///
////////////////////////////////

import { config } from './index'

/*获取真实的配置文件 priority*/
export function priorityConfig() {

  /*如果启动了代码追踪，配置基本信息*/
  const launch = config.launch
  const trackTypes = launch && launch.trackCode || config.trackCode
  config.hasTrackCode = function() {}
  if(trackTypes && _.isArray(trackTypes) && trackTypes.length) {
    if(!launch.trackCode) { launch.trackCode = {} }
    trackTypes.forEach(type => { launch.trackCode[type] = true })
    config.hasTrackCode = (type, callback) => {
      if(launch && launch.trackCode && launch.trackCode[type]) {
        callback && callback(option => {
          Xut.Application.Notify('trackCode', type, _.extend(option, {
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
}
