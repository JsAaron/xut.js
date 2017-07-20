/************************
 * 下面页面Translate钩子
 ************************/

export default function bottomTranslate(styleDataset) {
  const bottomPageStyle = styleDataset.getPageStyle('bottom')
  return bottomPageStyle.visualHeight
}
