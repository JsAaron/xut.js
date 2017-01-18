/************************
 * 右边页面Translate钩子
 ************************/

export function rightTranslate(usefulData) {

    let middlePageStyle = usefulData.getPageStyle('middle', 'after')
    let rightPageStyle = usefulData.getPageStyle('after')

    //中间：溢出
    if (middlePageStyle && middlePageStyle.viewLeftInteger) {
        //右边：溢出
        if (rightPageStyle && rightPageStyle.viewLeftInteger) {
        }
        //右边：正常
        else {
            return rightPageStyle.viewWidth + middlePageStyle.viewLeftInteger
        }
    }
    //中间：正常
    else {
        //右边：溢出
        if (rightPageStyle && rightPageStyle.viewLeftInteger) {
            return rightPageStyle.viewWidth - rightPageStyle.viewLeftInteger
        }
        //右边：正常
        else {
            return rightPageStyle.viewWidth + rightPageStyle.viewLeftInteger
        }
    }



}
