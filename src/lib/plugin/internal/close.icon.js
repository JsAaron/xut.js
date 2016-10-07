import iconsConfig from '../../toolbar/base/iconconf.js'
import { svgIcon } from '../../toolbar/base/svgicon'
import { config } from '../../config/index'


const createSVGIcon = function(el, callback) {
    var options = {
        speed: 6000,
        size: { w: '100%', h: '100%' },
        onToggle: callback
    };
    return new svgIcon(el, iconsConfig, options);
}

const createCloseIcon = function(right) {
    const html =
        `<div class="page-pinch-close" style="right:${right}px;">
            <div class="si-icon" data-icon-name="close"></div>
        </div>`
    return $(String.styleFormat(html))
}


/**
 * 创建关闭按钮
 * @return {[type]} [description]
 */
export default function createPinchButton(callback, right = 0) {
    const $closeNode = createCloseIcon(right)
    createSVGIcon($closeNode.children()[0], callback)
    return $closeNode
}
