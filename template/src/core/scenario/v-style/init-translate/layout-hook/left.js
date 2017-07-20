/************************
 * 左边页面Translate钩子
 ************************/

export default function leftTranslate(styleDataset) {

  let middlePageStyle = styleDataset.getPageStyle('middle', 'left')
  let leftPageStyle = styleDataset.getPageStyle('left')

  //中间：溢出
  if(middlePageStyle && middlePageStyle.visualLeftInteger) {
    //左边：溢出
    if(leftPageStyle && leftPageStyle.visualLeftInteger) {
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
    if(leftPageStyle && leftPageStyle.visualLeftInteger) {
      return -(leftPageStyle.visualWidth - leftPageStyle.visualLeftInteger)
    }
    //左边：正常
    else {
      return -leftPageStyle.visualWidth
    }
  }

}

