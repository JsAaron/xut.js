import { getContainer } from './util'

/**
 * 网页
 * @param {[type]} options [description]
 */
export default class WebPage {

  constructor(options) {

    const pageUrl = options.pageUrl;

    this.container = getContainer(options)

    //跳转app市场
    //普通网页是1
    //跳转app市场就是2
    if (options.hyperlink == 2) {
      //跳转到app市场
      window.open(pageUrl)
        //数据统计
      $.get('http://www.appcarrier.cn/index.php/adplugin/recordads?aid=16&esbId=ios')
    } else {

      var padding = options.padding || 0,
        width = options.width,
        height = options.height,
        videoId = options.videoId,
        left = options.left,
        top = options.top,
        eleWidth, eleHeight;

      if (padding) {
        eleWidth = width - 2 * padding;
        eleHeight = height - 2 * padding;
      } else {
        eleWidth = width;
        eleHeight = height
      }

      this.$videoNode = $('<div id="videoWrap_' + videoId + '" style="position:absolute;left:' + left + 'px;top:' + top + 'px;width:' + width + 'px;height:' + height + 'px;z-index:' + Xut.zIndexlevel() + '">' +
        '<div style="position:absolute;left:' + padding + 'px;top:' + padding + 'px;width:' + eleWidth + 'px;height:' + eleHeight + 'px;">' +
        '<iframe src="' + pageUrl + '" style="position:absolute;left:0;top:0;width:100%;height:100%;"></iframe>' +
        '</div>' +
        '</div>');

      this.container.append(this.$videoNode);

      this.play()
    }
  }

  play() {
    this.$videoNode && this.$videoNode.show();
  }

  stop() {
    this.$videoNode && this.$videoNode.hide();
  }

  destroy() {
    if (this.$videoNode) {
      this.$videoNode.remove();
      this.$videoNode = null;
    }
    this.container = null
  }

}
