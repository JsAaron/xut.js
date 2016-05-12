/**
 * 用css3实现的忙碌光标
 * @return {[type]} [description]
 */
export function cursor() {
    var sWidth = window.innerWidth,
        sHeight = window.innerHeight,
        width = Math.min(sWidth, sHeight) / 4,
        space = Math.round((sHeight - width) / 2),
        delay = [0, 0.9167, 0.833, 0.75, 0.667, 0.5833, 0.5, 0.41667, 0.333, 0.25, 0.1667, 0.0833],
        deg = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
        i = 12,
        prefix = Xut.plat.prefixStyle,
        html;

    html = '<div style="width:' + width + "px;height:" + width + 'px;margin:' + space + 'px auto;">';
    html += '<div style="height:30%;"></div><div class="xut-busy-middle">';

    while (i--) {
        html += '<div class="xut-busy-spinner" style="' + prefix('transform') + ':rotate(' + deg[i] + 'deg) translate(0,-142%);' + prefix('animation-delay') + ':-' + delay[i] + 's;"></div>';
    }

    html += '</div><div class="xut-busy-text"></div></div>';

    Xut.View.busyIcon = $('#busyIcon').html(html);

} 