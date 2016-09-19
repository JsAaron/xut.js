import { config } from '../config/index'

/**
 * 用css3实现的忙碌光标
 * @return {[type]} [description]
 */
const transform = Xut.style.transform
const animationDelay = Xut.style.animationDelay

/**
 * 延时加载
 * @type {Number}
 */
const delay = 1000

/**
 * 光标对象
 * @type {[type]}
 */
let node = null

/**
 * 是否禁用忙了光标
 * @type {Boolean}
 */
let isDisable = false

/**
 * 光标状态
 * 调用隐藏
 * @type {Boolean}
 */
let isCallHide = false

/**
 * setTimouet
 * @type {[type]}
 */
let timer = null


/**
 * create
 * @return {[type]} [description]
 */
export function createCursor() {
    if (isDisable) return
    const sWidth = config.screenSize.width
    const sHeight = config.screenSize.height
    const width = Math.min(sWidth, sHeight) / 4
    const space = Math.round((sHeight - width) / 2)
    const delay = [0, 0.9167, 0.833, 0.75, 0.667, 0.5833, 0.5, 0.41667, 0.333, 0.25, 0.1667, 0.0833]
    const deg = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]

    let count = 12
    let html = ''
    let container = ''

    while (count--) {
        html =
            `<div class="xut-busy-spinner"
                  style="${transform}:rotate(${deg[count]}deg) translate(0,-142%);${animationDelay}:-${delay[count]}s">
            </div>`
    }

    html =
        `<div style="width:${width}px;height:${width}px;margin:${space}px auto;">
            <div style="height:30%;"></div>
            <div class="xut-busy-middle">${container}</div>
            <div class="xut-busy-text"></div>
        </div>`

    node = $('#xut-busy-icon').html(String.styleFormat(html));
}


const clear = () => {
    clearTimeout(timer)
    timer = null
}

/**
 * 显示光标
 */
export const ShowBusy = () => {
    if (isDisable || Xut.IBooks.Enabled || timer) return
    timer = setTimeout(() => {
        node.show()
        clear()
        if (isCallHide) {
            HideBusy()
            isCallHide = false
        }
    }, delay)
}


/**
 * 隐藏光标
 */
export const HideBusy = () => {
    //显示忙碌加锁，用于不处理hideBusy
    if (isDisable || Xut.IBooks.Enabled || ShowBusy.lock) return;
    if (!timer) {
        node.hide();
    } else {
        isCallHide = true
    }
}


/**
 * 显示光标
 * @param {[type]} txt [description]
 */
export const ShowTextBusy = (txt) => {
    if (isDisable || Xut.IBooks.Enabled) return;
    node.css('pointer-events', 'none').find('.xut-busy-text').html(txt);
    ShowBusy();
}


/**
 * 禁用光标
 * isDisable 是否禁用
 * @return {[type]} [description]
 */
export const disable = (state) => {
    isDisable = state
}
