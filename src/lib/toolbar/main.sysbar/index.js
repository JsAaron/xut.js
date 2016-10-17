/**
 * 系统工具栏
 * 主场景工具栏
 */
import Bar from '../base/bar'
import Navbar from './navbar/index'

import {
    goHomePage,
    createHomeIcon,
    createDirIcon,
    createTitle,
    createPageNumber,
    createHideToolbar,
    createCloseIcon,
    createCloseIconFont
} from './str.conf'

import {
    hash,
    handle,
    bindEvent,
    offEvent,
    eventTarget
} from '../../util/index'


export default class sysBar extends Bar {

    constructor({
        controlNode,
        sceneNode,
        pageMode,
        pageTotal,
        currentPage,
        toolType
    } = {}) {
        super()

        this.curTips = null //当前页码对象
        this.Lock = false //操作锁
        this.delay = 50 //动画延时
        this.hasTopBar = true //有顶部工具条

        this.$controlNode = controlNode //导航控制条节点
        this.eventElement = controlNode[0] //绑定事件
        this.$sceneNode = sceneNode //场景根节点
        this.pageTotal = pageTotal
        this.currentPage = currentPage

        //顶部工具栏可配置
        //0 禁止工具栏
        //1 系统工具栏 - 显示IOS系统工具栏
        _.some(toolType) && this._initToolbar()

        //翻页按钮
        pageMode == 2 && this.super_createArrows()
    }


    /**
     * 初始化顶部工具栏
     * @return {[type]} [description]
     */
    _initToolbar() {

        const $controlNode = this.$controlNode
        const setting = this.settings
        const iconHeight = this.super_iconHeight

        //工具栏的显示状态
        this.toolBarStatus = ($controlNode.css('display') === 'none') ? false : true

        //工具栏摆放位置
        this._toolbarPostion($controlNode, setting.ToolbarPos)


        let html = ''

        //首页按钮
        if (setting.HomeBut) {
            html += createHomeIcon(iconHeight)
        }

        //目录按钮
        if (setting.ContentBut) {
            html += createDirIcon(iconHeight)
        }

        //添加标题
        html += createTitle(iconHeight, this.appName)

        //工具栏隐藏按钮
        html += createHideToolbar(iconHeight)

        //关闭子文档
        if (setting.CloseBut) {
            html += (setting.svgButton ? createCloseIcon(iconHeight) : createCloseIconFont(iconHeight));
        }

        //页码数
        if (setting.PageBut) {
            html += createPageNumber(iconHeight, this.currentPage, this.pageTotal)
        }

        //显示
        Xut.nextTick($controlNode.append(String.styleFormat(html)))

        //当前页码标识
        this.curTips = $controlNode.find('.control-current-page')

        //事件
        bindEvent(this.eventElement, {
            start: this
        })
    }

    /**
     * 相应事件
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    handleEvent(e) {
        handle({
            start(e) {
                switch (eventTarget(e).className) {
                    //跳主页
                    case "xut-control-backhome":
                        goHomePage();
                        break;
                        //切换目录
                    case "xut-control-navbar":
                        this._toggleNavBar();
                        break;
                        //隐藏工具栏
                    case 'xut-control-hidebar':
                        this.hideTopBar();
                        break;
                }
            }
        }, this, e)
    }


    /**
     * 系统工具条的位置
     * position
     *     0 顶部
     *     1 底部
     * @param  {[type]} bar      [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    _toolbarPostion($controlNode, position) {
        const height = this.super_iconHeight
        if (position == 1) { //在底部
            $controlNode.css({
                bottom: 0,
                height: height + 'px'
            });
        } else { //在顶部
            $controlNode.css({
                top: 0,
                height: height + 'px',
                paddingTop: this.super_barHeight + 'px'
            })
        }
    }

    /**
     * 切换目录导航
     * @return {[type]} [description]
     */
    _toggleNavBar() {
        const pageIndex = Xut.Presentation.GetPageIndex()
        if (this.navbarObj) {
            this.navbarObj.toggle(pageIndex)
        } else {
            this.navbarObj = new Navbar(pageIndex)
        }
    }

    /**
     * 更新页码指示
     * @return {[type]} [description]
     */
    updatePointer({
        parentIndex
    }) {
        this.curTips && this.curTips.html(parentIndex + 1)
    }


    /**
     * 隐藏导航栏
     * @return {[type]} [description]
     */
    hideNavbar() {
        this.navbarObj && this.navbarObj.hide('hide')
    }

    /**
     * 显示顶部工具栏
     * @return {[type]} [description]
     */
    showTopBar() {
        var that = this;

        if (this.toolBarStatus) {
            this.Lock = false;
            return;
        }
        this.$controlNode.css({
            'display': 'block',
            'opacity': 0
        });

        Xut.nextTick(function() {
            that.$controlNode && that.$controlNode.animate({
                'opacity': 1
            }, that.delay, 'linear', function() {
                that.hideNavbar()
                that.super_showSystemBar()
                that.toolBarStatus = true
                that.Lock = false
            });
        })
    }

    /**
     * 隐藏顶部工具栏
     * @return {[type]} [description]
     */
    hideTopBar() {
        var that = this;

        if (!this.toolBarStatus) {
            this.Lock = false;
            return;
        }

        this.$controlNode.animate({
            'opacity': 0
        }, that.delay, 'linear', function() {
            that.hideNavbar()
            that.$controlNode.hide();
            that.super_hideSystemBar();
            that.toolBarStatus = false;
            that.Lock = false;
        });
    }


    /**
     * 销毁
     * @return {[type]} [description]
     */
    destroy() {
        //目录导航
        this.navbarObj && this.navbarObj.destroy()

        //解除事件
        offEvent(this.eventElement, {
            start: this
        })

        //销毁超类
        this.super_destory()

        this.curTips = null;
        this.toolBarStatus = false
        this.$controlNode = null
        this.eventElement = null

    }

}
