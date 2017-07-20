/************************
 * 上面页面Translate钩子
 ************************/
export default function topTranslate(styleDataset) {
  const bottomPageStyle = styleDataset.getPageStyle('top')
  return -bottomPageStyle.visualHeight
}
