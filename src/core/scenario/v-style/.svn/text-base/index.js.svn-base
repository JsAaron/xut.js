import Stack from '../../observer/stack'
import { config } from '../../config/index'
import { getVisualSize } from './size'
import { getPageProportion } from './proportion'
import { initTranslate } from './init-translate/index'

/**
 * 获取页面对象的样式配置对象
 * @param  {[type]} pageIndex [description]
 * @return {[type]}           [description]
 */
const getPageStyle = function (pageIndex) {
  let pageBase = Xut.Presentation.GetPageBase(pageIndex)
  return pageBase && pageBase.getStyle
}

/**
 * 自定义样式页面容器的样式
 * 创建页面的样式，与布局
 * 1 创建页面的初始化的Transform值
 * 是否初始化创建
 * @return {[type]} [description]
 */
export function setCustomStyle(styleDataset) {

  /*
  1.容器可视区尺寸
  2.容器内部元素的缩放比
  3.提供快速索引
   */
  _.each(styleDataset, (data, index) => {
    /*获取容器尺寸*/
    _.extend(data, getVisualSize(data))
    data.pageProportion = getPageProportion(data);
    /*数组形式，因为有双页面的情况*/
    if (!styleDataset['_' + data.position]) {
      styleDataset['_' + data.position] = []
    }
    styleDataset['_' + data.position].push(data.chapterIndex)
  })

  if (!config.launch.doublePageMode) {

    /**
     * 获取指定页面样式
     * pageName
     * assistName 辅助页面名
     * 初始化的时候，可以正常创建多个页面的style，在不同页面可以获取不同的style
     * 但是在翻页的时候，由于只动态创建了一个页，所以在获取其他页面的时候，必须通过辅助参数
     * 跨页面对象获取数据
     */
    styleDataset.getPageStyle = function (pageName, assistName) {
      let pageStyle = this[this['_' + pageName]]
        //翻页动态创建的时候，只能索取到一页，因为只动态创建了一页
        //所以这里需要动态获取关联的中间页面对象
      if (!pageStyle && pageName === 'middle') {
        let standbyStyle = this.getPageStyle(assistName)
        if (assistName === 'left') {
          return getPageStyle(standbyStyle.chapterIndex + 1)
        }
        if (assistName === 'right') {
          return getPageStyle(standbyStyle.chapterIndex - 1)
        }
      }
      return this[this['_' + pageName]]
    }

    _.each(styleDataset, function (data, index) {
      //容器的初始translate值
      if (data.position) {
        _.extend(data, initTranslate({
          styleDataset,
          position: data.position
        }))
      }
    })
  }

  return styleDataset
}
