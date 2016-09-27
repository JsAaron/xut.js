/**
 * 音频动作
 * @param  {[type]} global [description]
 * @return {[type]}        [description]
 */

//音频动作
//替换背景图
//指定动画
export function Action(options) {

    var audioNode = document.querySelector('#Audio_' + options.audioId)

    //页面从属
    var pageType = audioNode.getAttribute('data-belong')

    //切换背景
    function toggle(linker) {
        audioNode.style.backgroundImage = 'url(' + Xut.config.pathAddress + linker + ')'
    }

    function run(ids) {
        ids = ids.split(',');
        Xut.Assist.Run(pageType, ids)
    }

    function stop(ids) {
        ids = ids.split(',');
        Xut.Assist.Stop(pageType, ids)
    }
    return {
        play: function() {
            options.startImg && toggle(options.startImg)
            options.startScript && run(options.startScript);
        },
        pause: function() {
            options.stopImg && toggle(options.stopImg)
            options.stopScript && stop(options.startScript);
        },
        destroy: function() {
            audioNode = null;
        }
    }
}