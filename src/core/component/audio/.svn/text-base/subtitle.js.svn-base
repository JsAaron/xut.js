/**
 * 音频字幕
 * @param  {[type]} global [description]
 * @return {[type]}        [description]
 */

import { config } from '../../config/index'
import { setProportion } from '../../util/option'

//字幕检测时间
let Interval = 50;

let getStyles = (elem, name) => {
  var styles = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
  return styles.getPropertyValue(name);
};

/**
 * 字幕类
 *   音频实例
 * options 参数
 */
export class Subtitle {

  constructor(options, controlDoms, getAudioTime) {

    let visibility
    let orgAncestorVisibility

    //快速处理匹配数据
    let checkData = {}

    this.getAudioTime = getAudioTime
    this.options = options
    this.parents = controlDoms.parents
    this.ancestors = controlDoms.ancestors

    this.timer = 0

    //缓存创建的div节点
    this.cacheCreateDivs = {}

    //保存原始的属性
    orgAncestorVisibility = this.orgAncestorVisibility = {}
    _.each(this.ancestors, (node, contentId) => {
      visibility = getStyles(node, 'visibility');
      if(visibility) {
        orgAncestorVisibility[contentId] = visibility;
      }
    })

    //去重记录
    this.recordRepart = {}

    //phonegap getCurrentPosition得到的音频播放位置不从0开始 记录起始位置
    this.changeValue = 0;
    _.each(options.subtitles, (data) => {
      checkData[data.start + '-start'] = data;
      checkData[data.end + '-end'] = data;
    })

    this._createSubtitle(checkData)
  }


  /**
   * 运行字幕
   * @return {[type]}
   */
  _createSubtitle(checkData) {
    this.timer = setTimeout(() => {
      this.getAudioTime(audioTime => {
        let match
        _.each(checkData, (data, key) => {
          match = key.split('-')
          this._action(match[0], audioTime, match[1], data);
        })
        this._createSubtitle(checkData);
      })
    }, Interval)
  }

  /**
   * 执行动作
   * 创建文本框
   * 显示/隐藏文本框
   */
  _action(currentTime, audioTime, action, data) {
    if(audioTime > currentTime - Interval && audioTime < currentTime + Interval) {
      //创建
      if(!this.recordRepart[data.start] && action === 'start') {
        this.recordRepart[data.start] = true
        this._createDom(data)
      }
      //如果是一段字幕结束处理
      else if(!this.recordRepart[data.end] && action === 'end') {
        this.recordRepart[data.end] = true
        var ancestorNode = this.ancestors[data.id]
        if(ancestorNode) {
          ancestorNode.style.visibility = "hidden"
        }
      }
    }
  }

  _createDom(data) {

    //屏幕分辨率
    var proportion = config.proportion;
    var proportionWidth = proportion.width;
    var proportionHeight = proportion.height;

    var contentId = data.id;
    var parentNode = this.parents[contentId];
    var ancestorNode = this.ancestors[contentId];
    var preDiv = this.cacheCreateDivs[contentId];
    var preP = preDiv && preDiv.children[0];

    //转换行高
    var sLineHeight = data.lineHeight ? data.lineHeight : '100%';

    /**
     * 设置父容器div 字体颜色，大小，类型，位置，文本水平、垂直居中
     */
    function createDivStyle(parent, data) {
      let value = setProportion({
        width: data.width,
        height: data.height,
        left: data.left,
        top: data.top
      })

      let cssText =
        `position:absolute;
                 display:table;
                 vertical-align:center;
                 width:${value.width}px;
                 height:${value.height}px;
                 top:${value.top}px;
                 left:${value.left}px;`

      parent.style.cssText = String.styleFormat(cssText)
    }

    /**
     * 内容元素的样式
     */
    function createPStyle(p, data) {
      let cssText =
        `text-align:center;
                 display:table-cell;
                 vertical-align :middle;
                 color:${data.fontColor};
                 font-family:${data.fontName};
                 font-bold:${data.fontBold};
                 font-size:${data.fontSize * proportionWidth}px;
                 line-height:${sLineHeight}%`

      //设置字体间距
      p.style.cssText = String.styleFormat(cssText)

      //设置文字内容
      p.innerHTML = data.title;
    }

    /**
     * 创建内容
     */
    function createContent(parent, p, data) {
      createDivStyle(parent, data) //设置div
      createPStyle(p, data)
    }

    //公用同一个contengid,已经存在
    if(preDiv) {
      createContent(preDiv, preP, data);
    } else {
      //创建父元素与子元素
      var createDiv = document.createElement('div');
      var createP = document.createElement('p');
      //设置样式
      createContent(createDiv, createP, data);
      createDiv.appendChild(createP) //添加到指定的父元素
      parentNode.appendChild(createDiv);
      this.cacheCreateDivs[contentId] = createDiv; //保存引用
    }

    //操作最外层的content节点
    if(ancestorNode) {
      var ancestorNodeValue = getStyles(ancestorNode, 'visibility')
      if(ancestorNodeValue != 'visible') {
        ancestorNode.style.visibility = 'visible';
      }
    }
  }

  /**
   * 清理音频
   * @return {[type]}
   */
  destroy() {
    var self = this;
    _.each(this.cacheCreateDivs, function(node) {
      node.parentNode.removeChild(node)
    })

    //恢复初始状态
    _.each(this.ancestors, function(node, id) {
      var orgValue = self.orgAncestorVisibility[id];
      var currValue = getStyles(node, 'visibility')
      if(currValue != orgValue) {
        node.style.visibility = orgValue;
      }
    })

    this.ancestors = null;
    this.cacheCreateDivs = null;
    this.changeValue = 0;
    this.parents = null;
    if(this.timer) {
      clearTimeout(this.timer)
      this.timer = 0;
    }
  }

}
