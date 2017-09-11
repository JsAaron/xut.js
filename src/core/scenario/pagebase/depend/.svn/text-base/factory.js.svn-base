// 观察
import { Observer } from '../../../observer/index'

/**
 * canvas相关处理
 * 启动canvas,pixi库
 * 事件，动画等
 * 需要收集所有content的执行
 * 因为canvas只能绘制一次
 * cnavas模式下 category === "Sprite" 转化cid
 */
export default class Factory extends Observer {

  constructor() {
    super()

    /**
     * 是否启动模式
     * @type {Boolean}
     */
    this.enable = false

    /**
     * CompSprite非常特殊
     * 可以在dom的情况下使用
     * 所以如果是dom模式要强制开始enable‘
     * 这样会导致 精灵等动画强制转canvas
     * 这是错误的，所以增加一个判断
     *
     */
    this.onlyCompSprite = false

    /**
     * 加载失败content列表
     * @type {Array}
     */
    this.failCid = []

    //所有contentId合集
    this.contentIdset = []

    //开启了contentMode的节点
    //对应的content转化成canvas模式
    //普通精灵动画
    //ppt动画=>转化
    this.pptId = []

    //普通灵精
    this.spiritId = []

    //widget零件保存的content id
    //高级精灵动画
    this.widgetId = []

    //复杂精灵动画
    this.compSpriteId = []

    //默认canvas容器的层级
    //取精灵动画最高层级
    //2016.2.25
    this.containerIndex = 1

    /**
     * cid=>wid
     * 对应的pixi对象容器
     * @type {Object}
     */
    this.collections = {}
  }
}
