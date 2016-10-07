import iconsConfig from '../../toolbar/base/iconconf.js'
import { svgIcon } from '../../toolbar/base/svgicon'
import { config } from '../../config/index'


const createSVGIcon = function(el, callback) {
    var options = {
        speed: 6000,
        onToggle: callback
    };
    return new svgIcon(el, iconsConfig, options);
}

const createCloseIcon = function() {
    const proportion = config.proportion
    const width = proportion.width * 55
    const height = proportion.height * 70
    const top = proportion.height * 10
    const right = config.viewSize.left ? Math.abs(config.viewSize.left) + (top * 2) : top * 2
    const html =
        `<div class="si-icon xut-scenario-close" 
                 data-icon-name="close" 
                 style="width:${width}px;height:${height}px;top:${top}px;right:${right}px">
            </div>'`
    return $(html)
}


/**
 * 创建关闭按钮
 * @return {[type]} [description]
 */
export default function createPinchButton(callback) {
    const $node = createCloseIcon()
    createSVGIcon($node[0], callback)
    return $node
}
