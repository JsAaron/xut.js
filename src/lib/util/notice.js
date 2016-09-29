/**
 * 提示信息
 * @param  {[type]} require [description]
 * @param  {[type]} exports [description]
 * @param  {[type]} module  [description]
 * @return {[type]}         [description]
 */

import { config } from '../config/index'

let msgBox
let toolTip


/**
 * 显示提示信息
 */
function show(opts) {

    var prop = config.proportion,
        fontsize = (prop.width + prop.height) * 0.5 + 'em',
        content = opts.content,
        time = opts.time || 3000,
        css = {
            'font-size': fontsize,
            'background-image': 'url(images/icons/nodeBig.png)',
            'z-index': 99999,
            'bottom': '1%',
            'left': '5%',
            'padding': '0.2em 0.5em',
            'color': 'white',
            'position': 'absolute'
        };

    if (!toolTip) {
        toolTip = $('#xut-tool-tip');
        toolTip.css(css);
        toolTip.css(Xut.style.borderRadius, '5px');
    } else {
        toolTip.empty().show();
    }

    Xut.nextTick({
        'container': toolTip,
        'content': content
    }, hide);
}


/**
 * [模拟alert提示框]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
function messageBox(message) {

    var width = config.viewSize.width * 0.25,
        Box = msgBox || $('#xut-message'),
        html = '<div class="messageBox" style="width:' + width + 'px;">' +
        '<div class="messageTex" style="line-height:2">' + message + '</div>' +
        '<div class="messageBtn" style="line-height:1.5">OK</div>' +
        '</div>';

    //remove the node when user click
    Box.html(html).show().on("touchend mouseup", function(e) {
        if (e.target.className === 'messageBtn') {
            this.innerHTML = '';
            this.style.display = 'none';
        }
    });
}


function hide() {
    setTimeout(function() {
        toolTip.hide(1000)
    }, 1500)
}

function destroy() {
    msgBox = null;
}

export {
    messageBox,
    show,
    destroy
}
