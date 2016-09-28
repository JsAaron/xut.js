/**
 * 函数工具栏
 */

import Bar from './base/bar'
import { config } from '../config/index'
import { hash } from '../util/lang'

export default class fnBar extends Bar {

    constructor({
        pageMode,
        id,
        container,
        toolType,
        pageTotal,
        currentPage
    } = {}) {
        super()

        this.pageTips = null;
        this.currTip = null;
        this.tipsMode = 0;
        this.top = 0;
        this.Lock = false;
        this.delay = 50;
        this.hasTopBar = false;
        this.barStatus = true;
        this.arrows = hash()
        //options
        this.pageMode = pageMode;
        this.id = id;
        this.container = container;
        this.toolType = toolType;
        this.pageTotal = pageTotal;
        this.currentPage = currentPage;

        this.initConfig()

        this.initTool();
    }


    /**
     * 创建工具栏
     * toolType:
     *      0   禁止工具栏
     *      1   系统工具栏   - 显示IOS系统工具栏
     *      2   场景工具栏   - 显示关闭按钮
     *      3   场景工具栏   - 显示返回按钮
     *      4   场景工具栏   - 显示顶部小圆点式标示
     *  pageMode:
     *      0禁止滑动
     *      1允许滑动无翻页按钮
     *      2 允许滑动带翻页按钮
     * @return {[type]} [description]
     */
    initTool() {
        var container = this.container,
            type;

        container.hide();
        this.controlBar = [];

        while (type = this.toolType.shift()) {
            switch (type) {
                case 1:
                    this.createSystemBar();
                    break;
                case 2:
                    this.createCloseIcon();
                    break;
                case 3:
                    this.createBackIcon(container);
                    break;
                case 4:
                    this.createPageTips();
                    break;
                default:
                    this.barStatus = false;
                    this.hasTopBar = false;
                    break;
            }
        }

        //创建翻页按钮
        if (this.pageMode === 2) {
            this.createArrows();
        }

        container.show();

        //邦定事件
        this.bindButtonsEvent();
    }

    /**
     * 系统工具栏
     */
    createSystemBar() {
        var id = this.id,
            TOP = this.barHeight,
            html = '',
            style = 'top:0;height:' + this.iconHeight + 'px;padding-top:' + TOP + 'px';
        html = '<div id="xut-control-bar' + id + '" class="xut-control-bar" style="' + style + '"></div>';
        html = $(html);
        this.top = TOP;
        this.showSystemBar();
        this.createBackIcon(html);
        this.createTitle(html);
        this.createPageNum(html);
        this.controlBar = html;
        this.container.append(html);
        this.hasTopBar = true;
    }

    /**
     * 页码小圆点
     */
    createPageTips() {
        var chapters = this.pageTotal,
            height = this.iconHeight,
            TOP = this.top,
            isIOS = Xut.plat.isIOS,
            html = '';

        //如果只有一页则不显示小圆
        if (chapters < 2) {
            return '';
        }

        //圆点尺寸
        var size = isIOS ? 7 : Math.max(8, Math.round(this.propHeight * 8)),
            width = 2.5 * size, //圆点间距
            tipsWidth = chapters * width, //圆点总宽度
            top = (height - size) / 2, //保持圆点垂直居中
            left = (config.viewSize.width - tipsWidth) / 2; //保持圆点水平居中

        html = '<ul class="xut-scenario-tips"  style="top:' + TOP + 'px;left:' + left + 'px;width:' + tipsWidth + 'px;opacity:0.6">';
        for (var i = 1; i <= chapters; i++) {
            html += '<li class="xut-scenario-dark" style="float:left;width:' + width + 'px;height:' + height + 'px;" data-index="' + i + '">';
            html += '<div class="xut-scenario-radius" style="width:' + size + 'px;height:' + size + 'px;margin:' + top + 'px auto"></div></li>';
        }
        html += '</ul>';
        html = $(html);
        this.pageTips = html.children();
        this.tipsMode = 1;
        this.controlBar.push(html);
        this.container.append(html);
    }

    /**
     * 更新页码指示
     * @return {[type]} [description]
     */
    updatePointer(pageIndex) {
        switch (this.tipsMode) {
            case 1:
                if (this.prevTip) {
                    this.prevTip.className = 'xut-scenario-dark';
                }
                this.currTip = this.pageTips[pageIndex];
                this.currTip.className = 'xut-scenario-light';
                this.prevTip = this.currTip;
                break;
            case 2:
                this.currTip.html(pageIndex + 1);
                break;
            default:
                break;
        }
    }

    /**
     * [ 关闭按钮]
     * @return {[type]} [description]
     */
    createCloseIcon() {
        var style, html,
            TOP = this.top,
            height = this.iconHeight;
        style = 'top:' + TOP + 'px;width:' + height + 'px;height:' + height + 'px';
        html = '<div class="si-icon xut-scenario-close" data-icon-name="close" style="' + style + '"></div>';
        html = $(html);
        this.createSVGIcon($(html)[0],
            function() {
                Xut.View.CloseScenario()
            }
        );
        this.controlBar.push(html);
        this.container.append(html);
    }

    /**
     * [ 返回按钮]
     * @return {[type]} [description]
     */
    createBackIcon(container) {
        var style, html,
            TOP = this.top,
            height = this.iconHeight;
        style = 'top:' + TOP + 'px;width:' + height + 'px;height:' + height + 'px';
        html = '<div class="si-icon xut-scenario-back" data-icon-name="back" style="' + style + '"></div>';
        html = $(html);
        this.createSVGIcon(html[0],
            function() {
                Xut.View.CloseScenario()
            }
        );
        this.controlBar.push(html);
        container.append(html);
    }

    //创建页码数
    createPageNum(container) {
        var pageTotal = this.pageTotal,
            TOP = this.top,
            height = this.iconHeight,
            currentPage = this.currentPage,
            style, html;
        style = 'position:absolute;right:4px;top:' + (height * 0.25 + TOP) + 'px;padding:0 0.25em;height:' + height * 0.5 + 'px;line-height:' + height * 0.5 + 'px;border-radius:0.5em';
        html = '<div class="xut-control-pageindex" style="' + style + '">';
        html += '<span class="currentPage">' + currentPage + '</span>/<span>' + pageTotal + '</span>';
        html += '</div>';
        html = $(html);
        this.tipsMode = 2;
        this.currTip = html.children().first();
        container.append(html);
    }

    //工具栏隐藏按钮
    createHideToolbar(container) {
        var html, style,
            TOP = this.top,
            height = this.iconHeight,
            right = this.iconHeight * 2.5;
        style = 'position:absolute;right:' + right + 'px;top:' + TOP + 'px;width:' + height + 'px;height:' + height + 'px;background-size:cover';
        html = '<div class="xut-control-nav-hide" style="' + style + '"></div>';
        container.append(html);
    }

    //应用标题
    createTitle(container) {
        var style, html,
            appName = this.appName;
        style = 'line-height:' + this.iconHeight + 'px';
        html = '<div class="xut-control-title" style="' + style + '">' + appName + '</div>';
        container.append(html)
    }


    /**
     * [ 普通按钮邦定事件]
     * @param  {[type]} bar [description]
     * @return {[type]}     [description]
     */
    bindButtonsEvent() {
        var that = this,
            index = 1,
            id = this.id;

        this.container.on("touchend touchend", function(e) {
            var target = Xut.plat.evtTarget(e),
                type = target.className;
            switch (type) {
                case 'xut-control-nav-hide':
                    that.hideTopBar();
                    break;
                case 'xut-scenario-dark':
                    if (that.pageMode) {
                        index = target.getAttribute('data-index') || 1;
                        Xut.View.GotoSlide(Number(index));
                    }
                    break;
                default:
                    break;
            }
        })
    }

    /**
     * [ 显示顶部工具栏]
     * @return {[type]} [description]
     */
    showTopBar() {
        var that = this,
            delay = this.delay,
            controlBar = this.controlBar;
        if (this.barStatus) {
            this.Lock = false;
            return;
        }
        if (this.hasTopBar) {
            controlBar.css({
                'display': 'block',
                'opacity': 0
            });
            setTimeout(function() {
                controlBar.animate({
                    'opacity': 1
                }, delay, 'linear', function() {
                    that.showSystemBar();
                    that.barStatus = true;
                    that.Lock = false;
                });
            });
        } else {
            controlBar.forEach(function(el) {
                el.show();
                that.Lock = false;
                that.barStatus = true;
            });
        }
    }

    /**
     * [ 隐藏顶部工具栏]
     * @return {[type]} [description]
     */
    hideTopBar() {
        var that = this,
            delay = this.delay,
            controlBar = this.controlBar;

        if (!this.barStatus) {
            this.Lock = false;
            return;
        }
        if (this.hasTopBar) {
            controlBar.animate({
                'opacity': 0
            }, delay, 'linear', function() {
                that.controlBar.hide();
                that.hideSystemBar();
                that.barStatus = false;
                that.Lock = false;
            });
        } else {
            controlBar.forEach(function(el) {
                el.hide(delay, function() {
                    that.Lock = false;
                    that.barStatus = false;
                });
            });
        }
    }

    destroy() {
        this.container.off();
        this.controlBar = null;
        this.arrows = null;
        this.pageTips = null;
        this.currTip = null;
        this.prevTip = null;
    }

}
