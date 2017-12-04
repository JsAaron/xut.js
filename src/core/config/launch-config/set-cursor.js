import {
  setDelay,
  setDisable,
  setPath,
  resetCursor
} from '../../expand/cursor'

//////////////////////////////////
/// 忙碌光标
//////////////////////////////////
export default function setCursor(launch, global) {

  if (launch) {
    /*因为光标可以配置false 关闭，所以这里需要注意判断*/
    const cursor = launch.cursor || launch.cursor === false ?
      launch.cursor :
      global.cursor

    /*每次配置光标之前都重置，可能被上个给覆盖默认的*/
    resetCursor()

    //设置关闭
    if (cursor == false) {
      setDisable()
      return
    }

    //自定义忙绿光标
    if (cursor.time) {
      setDelay(cursor.time)
    }
    if (cursor.url) {
      setPath(cursor.url)
    }

  }

}
