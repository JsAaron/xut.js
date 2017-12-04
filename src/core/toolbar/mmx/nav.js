/**
 * 目录导航
 */
import { config } from '../../config/index'

export class Navigation {

  constructor($sceneNode) {
    this.$sceneNode = $sceneNode
    this._init()
  }

  _init() {
    this._initContainer()
    this._initSchedule()
    this.$sceneNode.append(this.container)
  }

  /**
   * 容器
   * @return {[type]} [description]
   */
  _initContainer() {
    const style = `position:absolute;z-index:9999;width:30%;height:${config.visualSize.height}px;background:#ccc;`
    this.container = $(`<div class="xut-global-dir-container" style="${style}"></div>`)
  }

  /**
   * 进度
   * @return {[type]} [description]
   */
  _initSchedule() {
    const style = `position:absolute;z-index:9999;width:30%;height:${config.visualSize.height}px;background:#ccc;`
    this.schedule = $(`<div class="xut-global-dir-container" style="${style}"></div>`)
  }


}
