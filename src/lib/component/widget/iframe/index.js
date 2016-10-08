import { clearVideo } from '../../../component/video/manager'
import { config } from '../../../config/index'


/**
 * 创建iframe零件包装器
 */
export default class iframeWidget {

    constructor(data) {
        _.extend(this, data)
        this._$wapper = this._createWapper()
        Xut.nextTick({
            'container': this.rootNode,
            'content': this._$wapper
        }, () => {
            this.rootNode = null
            this._bindPMS()
        })
        return this
    }


    /**
     * 创建包含容器
     * @return {[type]} [description]
     */
    _createWapper() {
        if (this.zIndex !== 0) {
            this.zIndex = this.zIndex || Xut.zIndexlevel()
        }

        const html = String.styleFormat(
            `<div id="widget_iframe_${this.id}"
                  style="z-index:${this.zIndex};
                         width:${this.width}px;
                         height:${this.height}px;
                         top:${this.top}px;
                         left:${this.left}px;
                         position:absolute;">
             </div>`
        )

        this._$iframe = this._createIframe()

        return $(html).append(this._$iframe)
    }


    /**
     * 加载iframe
     * @return {[type]} [description]
     */
    _createIframe() {

        const ifr = document.createElement('iframe')
        const rootPath = config.pathAddress.replace('gallery/', '')
        const path = rootPath + 'widget/' + this.widgetId + '/index.html?xxtParaIn=' + this.key

        ifr.id           = 'iframe_' + this.id
        ifr.src          = path
        ifr.style.width  = '100%'
        ifr.style.height = '100%'
        ifr.sandbox      = "allow-scripts allow-same-origin"
        ifr.frameborder  = 0

        if (ifr.attachEvent) {
            ifr.attachEvent('onload', () => {
                this._iframeComplete()
            })
        } else {
            ifr.onload = () => {
                this._iframeComplete()
            }
        }
        return ifr
    }


    /**
     * iframe加载完毕回调
     * @return {[type]} [description]
     */
    _iframeComplete() {

        var dataSource = this._loadData()
        var width      = this._$iframe.offsetWidth
        var height     = this._$iframe.offsetHeight

        if (dataSource.screenSize.width * 0.98 <= width
            && dataSource.screenSize.height * 0.98 <= height) {
            Xut.View.Toolbar({
                show: 'button',
                hide: 'controlBar'
            })
        } else if (dataSource.screenSize.width * 0.7 <= width
            && dataSource.screenSize.height * 0.7 <= height) {
            Xut.View.Toolbar({
                show: 'button'
            })
        }

        PMS.send({
            target: this._$iframe.contentWindow,
            origin: '*',
            type: 'loadData',
            data: dataSource,
            //消息传递完毕后的回调
            success: function(){},
            error: function() {}
        })

        //iframe加载的状态
        this.state = true;
    }

    /**
     * ifarme内部，请求返回数据
     * @return {[type]} [description]
     */
    _loadData() {
        var item,
            field,
            source_export = [],
            images = Xut.data['Image'],
            token = null,
            outputPara = this.inputPara,
            items = outputPara.source;

        for (item in items) {
            if (items.hasOwnProperty(item)) {
                field = {};
                token = images.item((parseInt(items[item]) || 1) - 1);
                field['img'] = '../gallery/' + token.md5;
                field['thumb'] = '';
                field['title'] = token.imageTitle;
                source_export.push(field);
            }
        }

        outputPara.source = source_export;

        return outputPara;
    }


    /**
     * 与iframe通讯接口
     * @return {[type]} [description]
     */
    _bindPMS() {

        const markId = this.id
        const $wapper = this._$wapper
        const $iframe = $(this._$iframe)

        //隐藏widget
        PMS.bind("onHideWapper" + markId, () => {
            $wapper.hide()
            this.state = false
        }, '*')

        //全屏操作
        PMS.bind("onFullscreen" + markId, e => {

            if (!$iframe.length) return

            //关闭视频
            clearVideo()

            $wapper.css({
                width  : '100%',
                height : '100%',
                zIndex : Xut.zIndexlevel(),
                top    : 0,
                left   : 0
            })

            //Widget全屏尺寸自动调整
            if (e.full == false) {
                var body = document.body,
                    width = parseInt(body.clientWidth),
                    height = parseInt(body.clientHeight),
                    rote = this.width / this.height,
                    getRote = function(width, height, rote) {
                        var w = width,
                            h = width / rote;
                        if (h > height) {
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

                $iframe.css({
                    width    : size.w,
                    height   : size.h,
                    position : 'absolute',
                    top      : top,
                    left     : left
                });
            }
            //隐藏工作条
            Xut.View.Toolbar("hide")

        }, '*');

        //还原初始窗口操作
        PMS.bind("onReset" + markId, () => {

            if (!$iframe.length) return;

            $wapper.css({
                zIndex : this.zIndex,
                width  : this.width + 'px',
                height : this.height + 'px',
                top    : this.top + 'px',
                left   : this.left + 'px'
            });

            //还原iframe样式
            $iframe.css({
                width    : '100%',
                height   : '100%',
                position : '',
                top      : '0',
                left     : '0'
            })

            Xut.View.Toolbar("show");

        }, '*');

        //显示工作条
        PMS.bind("onShowToolbar" + markId, function() {
            // Xut.View.ShowToolBar();
        }, '*')

        //隐藏工作条
        PMS.bind("onHideToolbar" + markId, function() {
            Xut.View.HideToolBar();
        }, '*')

        //跳转页面
        PMS.bind('scrollToPage' + markId, function(data) {
            Xut.View.GotoSlide(data['ppts'], data['pageIndex'])
        }, '*')
    }



    /**
     * 外部调用接口
     * 显示隐藏
     * @return {[type]} [description]
     */
    dispatchProcess() {
        if (this.state) {
            this._stop()
        } else {
            this._start()
        }
    }


    /**
     * 开始
     * @return {[type]} [description]
     */
    _start() {
        this._domWapper()
        PMS.send({
            target : this._$iframe.contentWindow,
            url    : this._$iframe.src,
            origin : '*',
            type   : 'onShow',
            success: function() {
                // alert(123)
            }
        })
        setTimeout(() => {
            this.state = true;
        }, 0)
    }


    /**
     * 暂停
     * @return {[type]} [description]
     */
    _stop() {
        this._domWapper()
        PMS.send({
            target : this._$iframe.contentWindow,
            url    : this._$iframe.src,
            origin : '*',
            type   : 'onHide',
            success: function() {}
        });
        setTimeout(() => {
            this.state = false;
        }, 0)
    }


    /**
     * 处理包装容器的状态
     * @return {[type]} [description]
     */
    _domWapper() {
        if (this.state) {
            this._$wapper.hide();
        } else {
            this._$wapper.show();
        }
    }


    /**
     * 复位
     * @return {[type]} [description]
     */
    recovery() {
        if (this.state) {
            PMS.send({
                target  : this._$iframe.contentWindow,
                url     : this._$iframe.src,
                origin  : '*',
                type    : 'onHide',
                success : function() {}
            });
            this._domWapper()
            this.state = false
            return true
        }
        return false
    }


    /**
     * 销毁接口
     * @return {[type]} [description]
     */
    destroy() {

        //销毁内部事件
        PMS.send({
            target : this._$iframe.contentWindow,
            url    : this._$iframe.src,
            origin : '*',
            type   : 'onDestory',
            success: function() {}
        })

        //销毁事件绑定
        PMS.unbind()

        //销魂节点
        setTimeout(() => {
            this._$iframe = null;
            this._$wapper.remove();
            this._$wapper = null;
        }, 0)
    }


}
