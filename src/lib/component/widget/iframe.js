import { clearVideo } from '../../component/video/manager'
import nextTick from '../../nexttick'

/**
 * 创建iframe零件包装器
 */
export default class iframeWidget {

    constructor(data) {
        _.extend(this, data)
        this.$wapper = this._createWapper()
        nextTick({
            'container': this.rootNode,
            'content': this.$wapper
        }, () => {
            this.rootNode = null;
            this._bindPMS();
        });
        return this
    }


    /**
     * 创建包含容器
     * @return {[type]} [description]
     */
    _createWapper() {
        var zIndex, str, dom, ifr;

        if (this.zIndex === 0) {
            zIndex = this.zIndex;
        } else {
            zIndex = this.zIndex || Xut.zIndexlevel();
        }

        this.zIndex = zIndex;

        dom = String.format(
            '<div' +
            ' id="iframeWidget_{0}"' +
            ' style="z-index:{1};' +
            ' width:{2}px;' +
            ' height:{3}px;' +
            ' top:{4}px;' +
            ' left:{5}px;' +
            ' position:absolute;">' +
            ' </div>',
            this.id,
            zIndex,
            this.width,
            this.height,
            this.top,
            this.left
        );

        ifr = this._createIframe();
        this._iframe = ifr

        return $(dom).append(ifr)
    }


    /**
     * 加载iframe
     * @return {[type]} [description]
     */
    _createIframe() {

        let ifr = document.createElement('iframe')
        let path = 'widget/' + this.widgetId + '/index.html?xxtParaIn=' + this.key
        let rootPath = Xut.config.pathAddress.replace('gallery/', '')

        path = rootPath + path

        ifr.id = 'iframe_' + this.id;
        ifr.src = path;
        ifr.style.width = '100%';
        ifr.style.height = '100%';
        ifr.sandbox = "allow-scripts allow-same-origin"
        ifr.frameborder = 0

        if (ifr.attachEvent) {
            ifr.attachEvent('onload', () => {
                this._iframeComplete();
            });
        } else {
            ifr.onload = () => {
                this._iframeComplete();
            };
        }
        return ifr;
    }


    /**
     * iframe加载完毕回调
     * @return {[type]} [description]
     */
    _iframeComplete() {
        var me = this;
        var dataSource = this._loadData();
        var width = me._iframe.offsetWidth;
        var height = me._iframe.offsetHeight;

        if (dataSource.screenSize.width * 0.98 <= width && dataSource.screenSize.height * 0.98 <= height) {
            Xut.View.Toolbar({
                show: 'button',
                hide: 'controlBar'
            });
        } else if (dataSource.screenSize.width * 0.7 <= width && dataSource.screenSize.height * 0.7 <= height) {
            Xut.View.Toolbar({
                show: 'button'
            });
        }

        this.PMS.send({
            target: me._iframe.contentWindow,
            origin: '*',
            type: 'loadData',
            data: dataSource,
            //消息传递完毕后的回调
            success: success,
            error: function() {}
        });

        function success() {
            // console.log('完毕')
        }

        //iframe加载的状态
        me.state = true;
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
        var me = this,
            markId = this.id;

        this.PMS = PMS;
        //隐藏widget 
        PMS.bind("onHideWapper" + markId, function() {
            var $wapper = me.$wapper;
            $wapper.hide();
            me.state = false;

        }, '*')

        //全屏操作
        PMS.bind("onFullscreen" + markId, function(e) {
            var $wapper = me.$wapper,
                $iframe = $(me._iframe);

            if (!$iframe.length) return;
            //关闭视频
            clearVideo();

            $wapper.css({
                width: '100%',
                height: '100%',
                zIndex: Xut.zIndexlevel(),
                top: 0,
                left: 0
            })

            //Widget全屏尺寸自动调整
            if (e.full == false) {
                var body = document.body,
                    width = parseInt(body.clientWidth),
                    height = parseInt(body.clientHeight),
                    rote = me.width / me.height,
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
                    width: size.w,
                    height: size.h,
                    position: 'absolute',
                    top: top,
                    left: left
                });
            }
            //隐藏工作条
            Xut.View.Toolbar("hide")

        }, '*');

        //还原初始窗口操作
        PMS.bind("onReset" + markId, function() {
            var $wapper = me.$wapper,
                $iframe = $(me._iframe);

            if (!$iframe.length) return;

            $wapper.css({
                zIndex: me.zIndex,
                width: me.width + 'px',
                height: me.height + 'px',
                top: me.top + 'px',
                left: me.left + 'px'
            });

            //还原iframe样式
            $iframe.css({
                width: '100%',
                height: '100%',
                position: '',
                top: '0',
                left: '0'
            })

            Xut.View.Toolbar("show");

        }, '*');

        //显示工作条
        PMS.bind("onShowToolbar" + markId, function() {
            // Xut.View.ShowToolbar();
        }, '*');

        //隐藏工作条
        PMS.bind("onHideToolbar" + markId, function() {
            Xut.View.HideToolbar();
        }, '*');

        //跳转页面
        PMS.bind('scrollToPage' + markId, function(data) {
            Xut.View.GotoSlide(data['ppts'], data['pageIndex'])
        }, '*');
    }



    /**
     * 外部调用接口
     * 显示隐藏
     * @return {[type]} [description]
     */
    dispatchProcess() {
        if (this.state) {
            this.stop();
        } else {
            this.start();
        }
    }


    /**
     * 开始
     * @return {[type]} [description]
     */
    start() {
        this.domWapper();
        this.PMS.send({
            target: this._iframe.contentWindow,
            url: this._iframe.src,
            origin: '*',
            type: 'onShow',
            success: function() {
                // alert(123)
            }
        });
        setTimeout(() => {
            this.state = true;
        }, 0)
    }


    /**
     * 暂停
     * @return {[type]} [description]
     */
    stop() {
        this.domWapper()
        this.PMS.send({
            target: this._iframe.contentWindow,
            url: this._iframe.src,
            origin: '*',
            type: 'onHide',
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
    domWapper() {
        if (this.state) {
            this.$wapper.hide();
        } else {
            this.$wapper.show();
        }
    }


    /**
     * 复位
     * @return {[type]} [description]
     */
    recovery() {
        var me = this;
        if (me.state) {
            me.PMS.send({
                target: me._iframe.contentWindow,
                url: me._iframe.src,
                origin: '*',
                type: 'onHide',
                success: function() {}
            });
            me.domWapper();
            me.state = false;
            return true;
        }
        return false;
    }


    /**
     * 销毁接口
     * @return {[type]} [description]
     */
    destroy() {

        //销毁内部事件
        this.PMS.send({
            target: this._iframe.contentWindow,
            url: this._iframe.src,
            origin: '*',
            type: 'onDestory',
            success: function() {}
        })

        //销毁事件绑定
        this.PMS.unbind()

        //销魂节点
        setTimeout(() => {
            this._iframe = null;
            this.$wapper.remove();
            this.$wapper = null;
        }, 0)
    }


}
