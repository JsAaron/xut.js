import { config } from '../../config/index'

/**
 * flow页面的style单独设置
 * @return {[type]} [description]
 */
export default function() {

    let viewWidth
    let viewHeight
    let viewTop
    let viewLeft


    //宽度100%的情况下
    //如果是flow页面处理,全屏
    if (config.visualMode === 2) {
        //1 全屏
        //2 流式排版排版需要这个单位设置
        return {
            viewWidth: config.screenSize.width,
            viewHeight: config.screenSize.height,
            viewTop: 0
        }
    }

    //高度100%的情况下
    //flow下,设置容易宽度
    if (config.visualMode === 3) {
        if (config.pptVertical) {
            //竖版竖版
            //高度100%,宽度会存在溢出
            //所以需要修复flow页面是全屏状态
            if (config.screenVertical) {
                viewWidth = config.screenSize.width
            } else {

            }
        }
    }

}
