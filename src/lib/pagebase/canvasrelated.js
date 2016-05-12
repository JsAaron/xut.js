// 观察
import {observe} from '../observer/observe'

/**
 * canvas相关处理
 * 启动canvas,pixi库
 * 事件，动画等
 * 需要收集所有content的执行
 * 因为canvas只能绘制一次
 * cnavas模式下 category === "Sprite" 转化cid
 */

var Factory = function() {

    /**
     * 是否启动模式
     * @type {Boolean}
     */
    this.enable = false

    /**
     * 加载失败content列表
     * @type {Array}
     */
    this.failCid = []

    //所有contentId
    this.cid = []

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

    /**
     * cid=>wid
     * 对应的pixi对象容器
     * @type {Object}
     */
    this.collections = {}

}

observe.call(Factory.prototype);

export { Factory }
