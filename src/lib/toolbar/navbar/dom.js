import { nav as navlayout } from '../../scenario/layout'
import nextTick from '../../nexttick'

/**
 * 创建dom
 */
export function createdom(artControl, callback) {

    var pageArray = [];

    Xut.data.query('Chapter', Xut.data.novelId, 'seasonId', function(item) {
        pageArray.push(item);
    })

    //显示下拉菜单
    nextTick({
        'container': artControl,
        'content': navlayout(pageArray)
    }, function() {
        callback(pageArray)
    });

}
