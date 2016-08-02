/**
 * 帧模式-多图
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
import { parseJSON } from '../../util/index'

export default function keyframe(options) {
    var $element, data, callback, count, fps, loop, matrix, parameter, width, height, timer,
        arrays, x, y, t

    arrays = [];
    t = 0;
    $element = options.element.find('.sprite')
    data = options.data
    callback = options.callback || function() {}

    count = data.thecount
    fps = data.fps
    loop = data.loop;
    width = data.scaleWidth;
    height = data.scaleHeight;

    //如果是矩形图
    if (data.parameter) {
        parameter = parseJSON(data.parameter);
        if (parameter && parameter.matrix) {
            matrix = parameter.matrix.split("-")
        }
    }

    getCoordinate();
    //得到坐标：矩阵图：X Y坐标 普通：X坐标
    function getCoordinate() {
        //矩阵图
        if (matrix) {
            var cols = matrix[0];
            var rows = matrix[1];
            for (var i = 0; i < rows; i++) {
                y = -height * i + 'px';
                for (var k = 0; k < cols; k++) {
                    x = -width * k + 'px';

                    arrays.push(x, y)
                }
            }
            //数组长度大于给定的数量时 删除数组中多余的数据
            if (arrays.length / 2 > count) {
                var temp = arrays.length / 2 - count;
                for (var f = 2 * temp; f > 0; f--) {
                    arrays.pop();
                }
            }
        } else {
            for (var i = 0; i < count; i++) {
                x = -width * i + 'px';
                arrays.push(x)
            }
        }
    }


    function start() {
        if (matrix) {
            if (t > arrays.length / 2 - 1) {
                if (loop > 0) {
                    t = 0;
                    time()
                } else {
                    return;
                }

            } else {
                time();
            }
        } else {
            if (t > count - 1) {
                if (loop > 0) {
                    t = 0;
                    time();
                } else {
                    return
                }

            } else {
                time();
            }
        }
    }

    function time() {
        timer = setTimeout(function() {
            if (matrix) {
                x = arrays[2 * t];
                y = arrays[2 * t + 1];
                $element.css('backgroundPositionX', x);
                $element.css('backgroundPositionY', y);
            } else {
                x = arrays[t];
                $element.css('backgroundPositionX', x);
            }
            t++;
            start();
        }, 1000 / fps)
    }



    return {
        play: function() {
            start()
        },

        stop: function() {
            clearTimeout(timer);
        },

        destroy: function() {
            //停止精灵动画
            this.stop();
            t = 0;
            $element = null;
            data = null;
            arrays = null;
        }

    }
}
