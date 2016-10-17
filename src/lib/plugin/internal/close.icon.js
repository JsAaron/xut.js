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

const createCloseIcon = function(right, top) {
    const html =
        `<div class="page-pinch-close" style="right:${right}px;top:${top}px;">
            <div class="si-icon" data-icon-name="close"></div>
        </div>`
    return $(String.styleFormat(html))
}

const createCloseIconFont = function(right, top) {
    const html =
        `<div class="page-pinch-close" style="right:${right}px;top:${top}px;">
           <div class="si-icon icomoon icon-close" style="font-size:6vh;background:white;border-radius:6vh;width:6vh;height:6vh;position:absolute;right:0;"></div>
        </div>`
    return $(String.styleFormat(html))
}



/**
 * 创建关闭按钮
 * @return {[type]} [description]
 */
export default function createPinchButton(callback, right = 0, top = 0) {
    const svgButton = Xut.config.settings.svgButton;
    var $closeNode;
    if (svgButton) {
        $closeNode = createCloseIcon(right, top)
        createSVGIcon($closeNode.children()[0], callback)
    } else {
        $closeNode = createCloseIconFont(right, top)
        $closeNode.on("touchend mouseup", function() {
            callback();
        });
    }
    return $closeNode
}
