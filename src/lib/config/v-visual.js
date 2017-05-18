import { $warn } from '../util/debug'

const FLOOR = Math.floor
const CEIL = Math.ceil

/**
 * 全局可视区域布局处理
 * 4种可选模式，1/2/3/4
 *
 * noModifyValue 是否强制修改值，主要用来第一次进应用探测是否有全局宽度溢出的情况
 */
export function getVisualSize(config, fullProportion, setVisualMode, noModifyValue) {

  let screenWidth = config.screenSize.width
  let screenHeight = config.screenSize.height

  let newWidth = screenWidth
  let newHeight = screenHeight
  let newTop = 0
  let newLeft = 0

  if(!setVisualMode) {
    $warn('getVisualSize没有提供setVisualMode')
  }

  /**
   * 模式2：
   * 宽度100%，正比缩放高度
   */
  if(setVisualMode === 2) {

    //竖版PPT
    if(config.pptVertical) {
      //竖版显示：正常
      if(config.screenVertical) {
        newHeight = fullProportion.pptHeight * fullProportion.width
        newTop = (screenHeight - newHeight) / 2
      }
      //横版显示：反向
      if(config.screenHorizontal) {
        newWidth = fullProportion.pptWidth * fullProportion.height
        newLeft = (screenWidth - newWidth) / 2
      }
    }

    //横版PPT
    if(config.pptHorizontal) {
      //横版显示：正常
      if(config.screenHorizontal) {
        newHeight = fullProportion.pptHeight * fullProportion.width
        newTop = (screenHeight - newHeight) / 2
      }
      //竖版显示：反向
      if(config.screenVertical) {
        newHeight = fullProportion.pptHeight * fullProportion.width
        newTop = (screenHeight - newHeight) / 2
      }
    }

    //保证模式2高度不能溢出分辨率最大距离
    if(newHeight > screenHeight) {
      newHeight = screenHeight
      newTop = 0
    }
  }

  /**
   * 模式3：
   * 高度100%,宽度溢出可视区隐藏
   */
  if(setVisualMode === 3) {

    //竖版：PPT
    if(config.pptVertical) {
      //竖版显示：正常
      if(config.screenVertical) {
        //宽度溢出的情况
        newWidth = fullProportion.pptWidth * fullProportion.height
        newLeft = (screenWidth - newWidth) / 2

        //宽度没办法溢出
        //要强制宽度100%
        if(newWidth < screenWidth) {
          newWidth = screenWidth
          newLeft = 0
        }
      }
      //横版显示：反向
      if(config.screenHorizontal) {
        newWidth = fullProportion.pptWidth * fullProportion.height
        newLeft = (screenWidth - newWidth) / 2
      }
    }

    //横版：PPT
    if(config.pptHorizontal) {

      //横版显示:正常
      if(config.screenHorizontal) {
        newWidth = fullProportion.pptWidth * fullProportion.height
        newLeft = (screenWidth - newWidth) / 2

        //宽度没办法溢出
        //要强制宽度100%
        if(!noModifyValue && newWidth < screenWidth) {
          newWidth = screenWidth
          newLeft = 0
        }
      }

      //竖版显示：反向
      if(config.screenVertical) {
        newHeight = fullProportion.pptHeight * fullProportion.width
        newTop = (screenHeight - newHeight) / 2
      }
    }

  }

  /**
   * 模式1
   * 如果启动了双页模式
   */
  if(config.launch.doublePageMode && setVisualMode === 1) {
    newWidth = newWidth / 2
  }

  /**
   * 模式2.3.4
   * config.launch.visualMode === 1
   * @return {[type]}
   */
  return {
    width: CEIL(newWidth),
    height: CEIL(newHeight),
    left: CEIL(newLeft),
    top: CEIL(newTop)
  }

}
