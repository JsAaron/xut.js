/**
 * 帧模式-多图
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export default function keyframe(options) {

    var $element, status, data, src, count, loop, fps, root, info, url, ext, num, timer, image

    $element = options.element.find('.sprite')
    status = ''
    data = options.data
    src = data.md5
    count = data.thecount || 0
    loop = data.loop
    fps = data.fps || 1
    root = Xut.config.pathAddress
    info = parsePath(src)
    url = root + info.name
    ext = info.ext
    num = info.num || 0
    timer = 0
    image = document.createElement('img')

    image.src = root + src;
    $element.append(image);

    function runSprites() {
        timer = setTimeout(function() {
            image.src = url + num + ext;
            num++;
            check();
        }, 1000 / fps);
    }

    function check() {
        if (status === 'paused') {
            return;
        }
        if (num > count) {
            if (loop) {
                num %= count;
                runSprites();
            } else {
                timer = null;
            }
        } else {
            runSprites();
        }
    }

    //分解路径,得到扩展名和文件名
    function parsePath(path) {
        var tmp, ext, name, num
        tmp = path.split('.')
        ext = '.' + tmp[1]
        tmp = tmp[0].split('-')
        name = tmp[0] + '-'
        num = tmp[1] - 0
        return {
            name: name,
            ext: ext,
            num: num
        }
    }

    return {

        play: function() {
            status = 'play';
            runSprites();
        },

        stop: function() {
            status = 'paused';
        },

        destroy: function() {
            //停止精灵动画
            clearTimeout(timer);
            status = 'paused';
            num = 0;
            $element = null;
            image = null;
        },

        playSprites: function() {
            status = 'play';
            check();
        }

    }
}
