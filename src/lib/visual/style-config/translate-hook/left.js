/************************
 * 左边页面Translate钩子
 ************************/

export function leftTranslate(useStyleData) {
    let middlePageStyle = useStyleData.getPageStyle('middle', 'before')
    let leftPageStyle = useStyleData.getPageStyle('before')

    //中间：溢出
    if (middlePageStyle && middlePageStyle.visualLeftInteger) {
        //左边：溢出
        if (leftPageStyle && leftPageStyle.visualLeftInteger) {
           return -middlePageStyle.visualWidth
        }
        //左边：正常
        else {
            return -(middlePageStyle.visualWidth - middlePageStyle.visualLeftInteger)
        }
    }
    //中间：正常
    else {
        //左边：溢出
        if (leftPageStyle && leftPageStyle.visualLeftInteger) {
            return -(leftPageStyle.visualWidth - leftPageStyle.visualLeftInteger)
        }
        //左边：正常
        else {
            return -leftPageStyle.visualWidth
        }
    }

}
