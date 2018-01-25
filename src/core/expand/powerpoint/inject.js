import { makeJsonPack } from '../../util/lang'


/**
 * 代码过滤器
 * 针对代码脚本做处理
 * Xut.Assist.RecordPlay(1)
 * =>   Xut.Assist.RecordPlay(1,function(){
           createContentAudio(2, 7)
        })
 */
export function injectCode(code, parameter, parentContext) {
  //如果有音频，并且包含了RecordPlay接口的脚本
  //找到对应的脚本，需要针对这个脚本注入新的代码
  if (code) {

    //扩展录音脚本
    //往前缀加载重复回调的处理
    //开始录音脚本处理
    if (~code.indexOf('Xut.Assist.RecordStart')) {
      const inject = `Xut.Assist.RecordStart(function(){
        Xut.Assist.Run(${parentContext.activityId})
      },`
      code = code.replace('Xut.Assist.RecordStart(', inject)
    }

    //扩展播放录音脚本处理
    //如果没有用户录音，就取自身的音频
    if (parameter.videoId && ~code.indexOf('Xut.Assist.RecordPlay')) {
      const recordREG = code.match(/Xut.Assist.RecordPlay\((\w+)\)/)
      if (recordREG.length) {
        const full = recordREG[0]
        const id = recordREG[1]
        const inject = `Xut.Assist.RecordPlay(${id},function(){
           Xut.Assist.ContentAudioCreate(${parameter.chapterId}, ${parameter.videoId})
        })`
        //重新组合新的脚本代码
        code = code.replace(full, inject)
        //如果遇到对应的脚本
        //那么就清理音频
        parameter.videoId = null
      }
    }
    return makeJsonPack(code)
  }
}
