import { config } from '../index'

/**
 * 新增模式,用于记录浏览器退出记录
 * 默认启动
 * 是否回到退出的页面
 * set表中写一个recordHistory
 * 是   1
 * 否   0
 */
export default function setHistory(data) {
  //Launch接口定义
  if (config.launch.historyMode !== undefined) {
    return
  }

  //数据库定义 && == 1
  if (data.recordHistory !== undefined && Number(data.recordHistory)) {
    config.launch.historyMode = true
    return
  }
}
