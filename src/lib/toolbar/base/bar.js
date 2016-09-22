import iconsConfig from './iconconf.js'
import { svgIcon } from './svgicon'
import { config } from '../../config/index'

const isIOS = Xut.plat.isIOS

/**
 * 获取翻页按钮位置
 * @return {[type]} [description]
 */
const arrowStyle = function() {
    let height = config.iconHeight
    let settings = config.settings
    let styleText = 'height:' + height + 'px;width:' + height + 'px';
    switch (settings.NavbarPos) {
        case 0:
            styleText += ';top:0';
            break; //顶部
        case 1:
            styleText += ';margin-top:' + (-height / 2) + 'px';
            break; //中间
        case 2:
            styleText += ';top:auto;bottom:0';
            break; //底部
        default:
            break;
    }
    return styleText;
}


export default class Bar {

    constructor() {

        /**
         * 系统状态栏高度
         * @type {[type]}
         */
        this.barHeight = isIOS ? 20 : 0

        /**
         * 默认创建左翻页按钮
         * @type {Boolean}
         */
        this.enableLeft = true

        /**
         * 默认创建右翻页按钮
         * @type {Boolean}
         */
        this.enableRight = true
    }


    initConfig() {
        var propHeight;
        //获取高度缩放比
        //自动选择缩放比例
        this.propHeight = propHeight = function() {
            var layout = config.layoutMode,
                prop = config.proportion;
            return layout == "horizontal" ? prop.width : prop.height;
        }()

        //获取图标高度
        //工具栏图标高度
        this.iconHeight = function() {
            var height = config.iconHeight;
            return isIOS ? height : Math.round(propHeight * height);
        }()

        this.appName = config.shortName //应用标题
        this.settings = config.settings //应用默认配置
    }


    /**
     * 创建翻页按钮
     * @return {[type]} [description]
     */
    createArrows() {
        //是否使用自定义的翻页按钮: true /false
        //图标名称是客户端指定的：pageforward_'+appId+'.svg
        var isCustom = this.settings.customButton;

        if (this.enableLeft) {
            isCustom ? this.createLeftIcon() : this.createLeftArrow();
        }

        if (this.enableRight) {
            isCustom ? this.createRightIcon() : this.createRightArrow();
        }
    }


    /**
     * 左箭头翻页按钮
     * @return {[type]} [description]
     */
    createLeftArrow() {
        var style = arrowStyle(),
            state = this.barStatus ? '' : 'hide',
            $dom;
        $dom = $('<div class="si-icon xut-flip-control xut-flip-control-left ' + state + '" data-icon-name="prevArrow" style="' + style + '"></div>');

        this.createSVGIcon($dom[0],
            function() {
                Xut.View.GotoPrevSlide();
            }
        );

        this.container.append($dom);
        this.arrows.prev = {
            el: $dom,
            able: true
        };
    }

    /**
     * 右箭头翻页按钮
     * @return {[type]} [description]
     */
    createRightArrow() {
        var style = arrowStyle(),
            state = this.barStatus ? '' : 'hide',
            $dom;
        $dom = $('<div class="si-icon xut-flip-control xut-flip-control-right ' + state + '" data-icon-name="nextArrow" style="' + style + '"></div>');

        this.createSVGIcon($dom[0],
            function() {
                Xut.View.GotoNextSlide();
            }
        );

        this.container.append($dom);
        this.arrows.next = {
            el: $dom,
            able: true
        };
    }

    /**
     * 自定义左翻页按钮
     * [createLeftIcon description]
     * @return {[type]} [description]
     */
    createLeftIcon() {
        var style = arrowStyle(),
            appId = this.config.appId,
            state = this.barStatus ? '' : 'hide',
            $dom;
        style += ';background-image:url(images/icons/pageforward_' + appId + '.svg);background-size:cover';
        $dom = $('<div name="prevArrow" class="xut-flip-control xut-flip-control-left ' + state + '" style="' + style + '"></div>');

        $dom.on("touchend mouseup", function() {
            Xut.View.GotoPrevSlide();
        });

        this.container.append($dom);
        this.arrows.prev = {
            el: $dom,
            able: true
        };
    }

    //自定义右翻页按钮
    createRightIcon() {
        var style = arrowStyle(),
            appId = this.config.appId,
            state = this.barStatus ? '' : 'hide',
            $dom;
        style += ';background-image:url(images/icons/pageback_' + appId + '.svg);background-size:cover';
        $dom = $('<div name="nextArrow" class="xut-flip-control xut-flip-control-right ' + state + '" style="' + style + '"></div>');

        $dom.on("touchend mouseup", function() {
            Xut.View.GotoNextSlide();
        });

        this.container.append($dom);
        this.arrows.next = {
            el: $dom,
            able: true
        };
    }

    /**
     * [ description]
     * @param  {[type]} dir [next,prev]
     * @param  {[type]} status  [true/false]
     * @return {[type]}       [description]
     */
    toggleArrow(dir, status) {
        var arrow = this.arrows[dir];
        //如果没有创建翻页按钮,则不处理
        if (!arrow) return;
        arrow.able = status;
        //如果人为隐藏了工具栏,则不显示翻页按钮
        if (this.hasTopBar && !this.barStatus && status) {
            return;
        }
        arrow.el[status ? 'show' : 'hide']();
    }

    //隐藏下一页按钮
    hideNext() {
        this.toggleArrow('next', false);
    }

    //显示下一页按钮
    showNext() {
        this.toggleArrow('next', true);
    }

    //隐藏上一页按钮
    hidePrev() {
        this.toggleArrow('prev', false);
    }

    //显示上一页按钮
    showPrev() {
        this.toggleArrow('prev', true);
    }

    /**
     * [ 显示翻页按钮]
     * @return {[type]}        [description]
     */
    showPageBar() {
        var arrows = this.arrows;

        for (var dir in arrows) {
            var arrow = arrows[dir];
            arrow.able && arrow.el.show();
        }
    }

    /**
     * [ 隐藏翻页按钮]
     * @param  {[type]} unlock [description]
     * @return {[type]}        [description]
     */
    hidePageBar() {
        var arrows = this.arrows;
        for (var dir in arrows) {
            arrows[dir].el.hide();
        }
    }

    /**
     * [description]
     * @param  {[type]} state   [description]
     * @param  {[type]} pointer [description]
     * @return {[type]}         [description]
     */
    toggle(state, pointer) {
        if (this.Lock) return;
        this.Lock = true;

        switch (state) {
            case 'show':
                this.showToolbar(pointer);
                break;
            case 'hide':
                this.hideToolbar(pointer);
                break;
            default:
                this.barStatus ? this.hideToolbar(pointer) : this.showToolbar(pointer);
                break;
        }
    }

    /**
     * [ 显示工具栏]
     * @param  {[type]} pointer [description]
     * @return {[type]}         [description]
     */
    showToolbar(pointer) {
        switch (pointer) {
            case 'controlBar':
                this.showTopBar();
                break;
            case 'button':
                this.showPageBar();
                this.Lock = false;
                break;
            default:
                this.showTopBar();
                this.showPageBar();
        }
    }

    /**
     * [ 隐藏工具栏]
     * @param  {[type]} pointer [description]
     * @return {[type]}         [description]
     */
    hideToolbar(pointer) {
        switch (pointer) {
            case 'controlBar':
                this.hideTopBar();
                break;
            case 'button':
                this.hidePageBar();
                this.Lock = false;
                break;
            default:
                this.hideTopBar();
                this.hidePageBar();
        }
    }


    /**
     * 显示IOS系统工具栏
     *  iOS状态栏0=show,1=hide
     * @return {[type]} [description]
     */
    showSystemBar() {
        isIOS && Xut.Plugin.statusbarPlugin.setStatus(null, null, 0);
    }


    /**
     * 隐藏IOS系统工具栏
     * @return {[type]} [description]
     */
    hideSystemBar() {
        isIOS && Xut.Plugin.statusbarPlugin.setStatus(null, null, 1);
    }


    /**
     * 创建SVG按钮
     * @param  {[type]}   el       [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    createSVGIcon(el, callback) {
        var options = {
            speed: 6000,
            size: {
                w: this.iconHeight,
                h: this.iconHeight
            },
            onToggle: callback
        };
        return new svgIcon(el, iconsConfig, options);
    }


    /**
     * 重置翻页按钮,状态以工具栏为标准
     * @return {[type]} [description]
     */
    reset() {
        this.barStatus ? this.showPageBar() : this.hidePageBar();
    }


}
