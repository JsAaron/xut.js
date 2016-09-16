/**
 * 目录列表
 * @param  {[type]} hindex    [description]
 * @param  {[type]} pageArray [description]
 * @param  {[type]} modules   [description]
 * @return {[type]}           [description]
 *
 */
import createHTML from './html'
import Section from './section'
import { config } from '../../config/index'

/**
 * 动画加锁
 */
let lockAnimation

/**
 * 导航对象
 * @type {[type]}
 */
let sectionInstance = null



/**
 * 执行动画
 */
const toAnimation = (navControl, navhandle, action) => {

    var complete = function() {
        //恢复css
        navControl.css(Xut.style.transition, '');
        Xut.View.HideBusy();
        lockAnimation = false;
    }

    //出现
    if (action == 'in') {
        //导航需要重置
        //不同的页面定位不一定
        sectionInstance.refresh();
        sectionInstance.scrollTo();
        //动画出现
        navControl.animate({
            'z-index': Xut.zIndexlevel(),
            'opacity': 1
        }, 'fast', 'linear', function() {
            navhandle.attr('fly', 'out');
            complete();
        });
    } else {
        //隐藏
        navhandle.attr('fly', 'in');
        navControl.hide()
        complete()
    }
}



const _controlNav = () => {

    //控制按钮
    let $button = $(".xut-control-navbar")
    let $navBar = $(".xut-nav-bar")

    //判断点击的动作
    let action = $button.attr('fly') || 'in'

    //初始化目录栏的样式
    //能够显示出来
    sectionInstance.state = false
    if (action == 'in') {
        sectionInstance.state = true
        $navBar.css({
            'z-index': 0,
            'opacity': 0,
            'display': 'block'
        });
    }

    //触发控制条
    $button.css('opacity', action === "in" ? 0.5 : 1);

    //执行动画
    toAnimation($navBar, $button, action);
}



/**
 * 初始化
 */
const _initialize = () => {
    if (lockAnimation) {
        return false;
    }
    lockAnimation = true;
    Xut.View.ShowBusy()
    _controlNav()
}

/**
 * 预先缓存加载
 * @return {[type]} [description]
 */
const _create = (pageIndex) => {
    createHTML($(".xut-nav-bar"), data => {
        //目录对象
        sectionInstance = new Section(data);
        //初始化滑动
        sectionInstance.userIscroll(pageIndex);
        //初始缩略图
        sectionInstance.createThumb();
        //初始化样式
        _initialize()
    })
}

/**
 * 目录
 */
export function createNavbar(pageIndex) {
    lockAnimation = false
    if (sectionInstance) {
        _initialize()
    } else {
        _create(pageIndex)
    }
}


/**
 * 关闭
 */
export function closeNavbar(callback) {
    if (sectionInstance && sectionInstance.state) {
        callback && callback();
        _initialize();
    }
}


/**
 * 销毁对象
 * @return {[type]} [description]
 */
export function destroyNavbar() {
    if (sectionInstance) {
        sectionInstance.destroy();
        sectionInstance = null;
    }
}
