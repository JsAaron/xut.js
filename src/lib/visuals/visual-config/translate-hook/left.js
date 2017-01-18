/************************
 * 左边页面Translate钩子
 ************************/

export function leftTranslate(usefulData) {
    let middlePageStyle = usefulData.getPageStyle('middle', 'before')
    let leftPageStyle = usefulData.getPageStyle('before')

    //中间：溢出
    if (middlePageStyle && middlePageStyle.viewLeftInteger) {
        //左边：溢出
        if (leftPageStyle && leftPageStyle.viewLeftInteger) {
           return -middlePageStyle.viewWidth
        }
        //左边：正常
        else {
            return -(middlePageStyle.viewWidth - middlePageStyle.viewLeftInteger)
        }
    }
    //中间：正常
    else {
        //左边：溢出
        if (leftPageStyle && leftPageStyle.viewLeftInteger) {
            return -(leftPageStyle.viewWidth - leftPageStyle.viewLeftInteger)
        }
        //左边：正常
        else {
            return -leftPageStyle.viewWidth
        }
    }

}
