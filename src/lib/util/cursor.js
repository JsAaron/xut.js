/**
 * 用css3实现的忙碌光标
 * @return {[type]} [description]
 */
const prefix = Xut.plat.prefixStyle

/**
 * 延时加载
 * @type {Number}
 */
const delay = 1000

/**
 * 光标对象
 * @type {[type]}
 */
let container = null

/**
 * 光标状态
 * 调用隐藏
 * @type {Boolean}
 */
let isCallHide = false

let timer = null


/**
 * create
 * @return {[type]} [description]
 */
export function createCursor() {
    var sWidth = window.innerWidth,
        sHeight = window.innerHeight,
        width = Math.min(sWidth, sHeight) / 4,
        space = Math.round((sHeight - width) / 2),
        delay = [0, 0.9167, 0.833, 0.75, 0.667, 0.5833, 0.5, 0.41667, 0.333, 0.25, 0.1667, 0.0833],
        deg = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
        i = 12,
        html;

    html = '<div style="width:' + width + "px;height:" + width + 'px;margin:' + space + 'px auto;">';
    html += '<div style="height:30%;"></div><div class="xut-busy-middle">';

    while (i--) {
        html += '<div class="xut-busy-spinner" style="' + prefix('transform') + ':rotate(' + deg[i] + 'deg) translate(0,-142%);' + prefix('animation-delay') + ':-' + delay[i] + 's;"></div>';
    }

    html += '</div><div class="xut-busy-text"></div></div>';

    container = $('#busyIcon').html(html);
}


const clear = () => {
    clearTimeout(timer)
    timer = null
}

/**
 * 显示光标
 */
export const ShowBusy = () => {
    if (Xut.IBooks.Enabled) return;
    timer = setTimeout(() => {
        container.show()
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
export const HideBusy = (IsPay) => {
    if (Xut.IBooks.Enabled) return;
    if (ShowBusy.lock) return; //显示忙碌加锁，用于不处理hideBusy
    if (!timer) {
        container.hide();
    } else {
        isCallHide = true
    }
    IsPay && container.css('pointer-events', '').find('.xut-busy-text').html('')
}


/**
 * 显示光标
 * @param {[type]} txt [description]
 */
export const ShowTextBusy = (txt) => {
    if (Xut.IBooks.Enabled) return;
    container.css('pointer-events', 'none').find('.xut-busy-text').html(txt);
    ShowBusy();
}
