import { config } from '../../config/index'

//////////////////////////////////
/// 如果启动了代码追踪，配置基本信息
//////////////////////////////////
export default function setTrack(launch, golbal) {

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

}
