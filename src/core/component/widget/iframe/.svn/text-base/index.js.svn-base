import { clearVideo } from '../../video/api'
import { config } from '../../../config/index'
import mixData from './mix-data'

/**
 * 创建iframe零件包装器
 */
export default class iframeWidget {

  constructor(data) {
    _.extend(this, data)
    this._$wapper = this._createWapper()
    Xut.nextTick({ 'container': this.rootNode, 'content': this._$wapper }, () => {
      this.rootNode = null
      this._bindMessage()
    })
    return this
  }

  _createWapper() {
    if(this.zIndex !== 0) { this.zIndex = this.zIndex || Xut.zIndexlevel() }
    this._$iframe = this._createIframe()
    return $(String.styleFormat(
      `<div id="widget_iframe_${this.id}"
            style="z-index:${this.zIndex};
                   width:${this.width}px;
                   height:${this.height}px;
                   top:${this.top}px;
                   left:${this.left}px;
                   position:absolute;">
       </div>`
    )).append(this._$iframe)
  }

  _createIframe() {
    const ifr = document.createElement('iframe')
    const path = `${config.data.rootPath}/widget/${this.widgetId}/index.html?xxtParaIn=${this.key}`
    ifr.id = 'iframe_' + this.id
    ifr.src = path
    ifr.style.width = '100%'
    ifr.style.height = '100%'
    ifr.sandbox = "allow-scripts allow-same-origin"
    ifr.frameborder = 0
    if(ifr.attachEvent) {
      ifr.attachEvent('onload', () => { this._iframeComplete() })
    } else {
      ifr.onload = () => { this._iframeComplete() }
    }
    return ifr
  }

  _iframeComplete() {
    const dataSource = mixData(this.inputPara)
    const width = this._$iframe.offsetWidth
    const height = this._$iframe.offsetHeight
    if(dataSource.screenSize.width * 0.98 <= width && dataSource.screenSize.height * 0.98 <= height) {
      Xut.View.Toolbar({ show: 'button', hide: 'controlBar' })
    } else if(dataSource.screenSize.width * 0.7 <= width && dataSource.screenSize.height * 0.7 <= height) {
      Xut.View.Toolbar({ show: 'button' })
    }
    PMS.send({
      target: this._$iframe.contentWindow,
      origin: '*',
      type: 'loadData',
      data: dataSource,
      success: function() {},
      error: function() {}
    })
    this.state = true
  }

  /*与iframe通讯接口*/
  _bindMessage() {

    const markId = this.id
    const $wapper = this._$wapper
    const $iframe = $(this._$iframe)

    //隐藏widget
    PMS.bind("onHideWapper" + markId, () => {
      $wapper.hide()
      this.state = false
    }, '*')

    /*全屏操作*/
    PMS.bind("onFullscreen" + markId, e => {
      if(!$iframe.length) return

      /*关闭视频*/
      clearVideo()
      $wapper.css({ width: '100%', height: '100%', zIndex: Xut.zIndexlevel(), top: 0, left: 0 })

      /*Widget全屏尺寸自动调整*/
      if(e.full == false) {
        var body = document.body,
          width = parseInt(body.clientWidth),
          height = parseInt(body.clientHeight),
          rote = this.width / this.height,
          getRote = function(width, height, rote) {
            var w = width,
              h = width / rote;
            if(h > height) {
              h = height;
              w = h * rote;
            }
            return {
              w: parseInt(w),
              h: parseInt(h)
            };
          },
          size = getRote(width, height, rote),
          left = (width - size.w) / 2,
          top = (height - size.h) / 2;
        $iframe.css({ width: size.w, height: size.h, position: 'absolute', top: top, left: left });
      }

      /*隐藏工作条*/
      Xut.View.Toolbar("hide")
    }, '*');

    /*全屏还原*/
    PMS.bind("onReset" + markId, () => {
      if(!$iframe.length) return;
      $wapper.css({
        zIndex: this.zIndex,
        width: this.width + 'px',
        height: this.height + 'px',
        top: this.top + 'px',
        left: this.left + 'px'
      });
      $iframe.css({ width: '100%', height: '100%', position: '', top: '0', left: '0' })
      Xut.View.Toolbar("show")
    }, '*');

    /*隐藏工作条*/
    PMS.bind("onHideToolbar" + markId, function() { Xut.View.HideToolBar(); }, '*')

    /*跳转页面*/
    PMS.bind('scrollToPage' + markId, function(data) { Xut.View.GotoSlide(data['ppts'], data['pageIndex']) }, '*')
  }

  /*发送消息通知*/
  _send(type) {
    PMS.send({
      type,
      origin: '*',
      target: this._$iframe.contentWindow,
      url: this._$iframe.src,
      success: function() {}
    })
  }

  /*处理包装容器的状态*/
  _perform(type, state) {
    if(this.state) { this._$wapper.hide(); } else { this._$wapper.show(); }
    this._send(type)
    setTimeout(() => { this.state = state; }, 0)
  }

  /*开始*/
  _start() {
    this._perform('onShow', true)
  }

  /*暂停*/
  _stop() {
    this._perform('onHide', false)
  }

  /*停止*/
  stop() {
    this._stop()
  }

  /*外部调用接口*/
  toggle() {
    if(this.state) {
      this._stop()
    } else {
      this._start()
    }
  }

  /*销毁接口*/
  destroy() {
    this._send('onDestory')
    PMS.unbind()
    setTimeout(() => {
      this._$iframe = null;
      this._$wapper.remove();
      this._$wapper = null;
    }, 0)
  }


}
