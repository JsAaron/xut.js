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
  let trackTypes = config.launch && config.launch.trackCode || config.trackCode
  if(trackTypes) {
    trackTypes.forEach(function(type) {
      config.launch.trackCode[type] = true
    })
    config.launch.trackCode.dataset = {
      appId: config.appId,
      appName: config.shortName
    }
  }
}
