import { $stop } from '../../scenario/command/index'
import { config } from '../../config/index'

/**
 * 扩展子文档
 * @return {[type]} [description]
 */
export default function(Action) {

  /**
   * 加载子文档
   * @param  {[type]} path [description]
   * @param  {[type]} dbId [description]
   * @return {[type]}      [description]
   */
  Action.prototype._loadSubdoc = function(path, dbId) {
    var self = this,
      wapper;

    //配置子文档加载路径
    window.XXTSUbDOC = {
      'path': path,
      'dbId': dbId
    }

    this.subPath = path;

    //构建子文档的容器
    wapper = this.$wapper = this._createWapper();

    Xut.nextTick({
      'container': $(this.rootNode),
      'content': wapper
    }, function() {
      self._destroyCache();
    });
  }


  /**
   * iframe加载完毕
   * @return {[type]} [description]
   */
  Action.prototype.iframeComplete = function() {
    var self = this;
    //关闭事件
    Xut.one('subdoc:dropApp', function() {
      self._destroyCache('iframe', self.iframe[0].contentWindow);
    });
    //隐藏全局工具栏
    Xut.View.HideToolBar();
    Xut.isRunSubDoc = true;
    self.$wapper.css({
      'opacity': '1'
    });
  }

  /**
   * 获取iframe颞部window上下文
   * @param  {[type]} contentWindow [description]
   * @return {[type]}               [description]
   */
  Action.prototype._destroyCache = function(contentWindow) {
    var self = this,
      iframe;
    if(contentWindow) {
      iframe = true;
    } else {
      contentWindow = window
    }

    function clear() {
      Xut.View.ShowToolBar()
      self.$wapper.remove();
      self.$wapper = null;
      self.iframe = null;
      self.rootNode = null;
      Xut.isRunSubDoc = false;
    }

    try {

      if(iframe) {
        //子文档操作
        if($stop()) {

        } else {
          clear();
        }
      } else {
        //父级操作
        $stop()
      }

    } catch(err) {
      clear();
    }
  }


  Action.prototype._createWapper = function() {
    var zIndex,
      str,
      dom,
      ifr;
    //层级设定
    if(this.zIndex === 0) {
      zIndex = this.zIndex;
    } else {
      zIndex = this.zIndex || Xut.zIndexlevel();
    }
    this.zIndex = zIndex;
    str = '<div id="Subdoc_{0}" style="z-index:{1};width:{2}px;height:{3}px;top:{4}px;left:{5}px;position:absolute;opacity:0" >' +
      '</div>';
    dom = String.format(str,
      this.id, zIndex, config.visualSize.width, config.visualSize.height, 0, 0
    );
    ifr = this.iframe = this._createIframe()
    return $(dom).append(ifr);
  }


  /**
   * 加载iframe
   * @return {[type]} [description]
   */
  Action.prototype._createIframe = function() {
    var me = this,
      path = 'content/subdoc/' + this.subPath + '/index.html?xxtParaIn=' + this.key,
      ifr = document.createElement('iframe');
    ifr.id = 'iframe_' + this.id;
    ifr.src = path;
    ifr.style.width = '100%';
    ifr.style.height = '100%';
    ifr.sandbox = "allow-scripts allow-same-origin";
    ifr.frameborder = 0;
    if(ifr.attachEvent) {
      ifr.attachEvent('onload', function() {
        me.iframeComplete();
      });
    } else {
      ifr.onload = function() {
        me.iframeComplete();
      };
    }
    return $(ifr);
  }
}
