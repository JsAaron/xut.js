import { config } from '../config/index'
import flowConfig from './flowpage.config'

/**
 * 动态计算翻页距离
 * @return {[type]} [description]
 */
export default function getFlipDistance({
    action,
    distance,
    direction,
    nextIsFolw
} = {}) {

    let leftOffset
    let currOffset
    let rightOffset

    //当前视图页面
    //用来处理页面回调
    let viewOffset

    //滑动区域宽度
    const veiwWidth = config.viewSize.width

    switch (direction) {

        //前翻
        case 'prev':
            switch (action) {
                case 'flipMove':
                    leftOffset = distance - veiwWidth
                    currOffset = distance
                    rightOffset = distance + veiwWidth
                    break;
                case 'flipRebound':
                    leftOffset = -veiwWidth
                    currOffset = distance;
                    rightOffset = veiwWidth
                    break;
                case 'flipOver':
                    leftOffset = 0
                    currOffset = veiwWidth
                    rightOffset = 2 * veiwWidth
                    viewOffset = leftOffset
                    break;
            }
            break;

            //后翻
        case 'next':
            switch (action) {
                case 'flipMove':
                    leftOffset = distance - veiwWidth;
                    rightOffset = distance + veiwWidth;
                    currOffset = distance;
                    break;
                case 'flipRebound':
                    leftOffset = -veiwWidth;
                    rightOffset = veiwWidth;
                    currOffset = distance;
                    break;
                case 'flipOver':
                    leftOffset = -2 * veiwWidth
                    currOffset = -veiwWidth
                    rightOffset = distance
                    viewOffset = rightOffset
                    break;
            }
            break;
    }

    return [leftOffset, currOffset, rightOffset, viewOffset]
}
