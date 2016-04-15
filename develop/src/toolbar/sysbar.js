/**
 * 主场景工具栏
 * 系统工具栏
 */
import { ToolBar } from './toolBar'


var sToolbar = ToolBar.extend({
    init: function(options) {
        this.arrows      = Object.create(null);
        this.curTips     = null; //当前页码对象
        this.Lock        = false; //操作锁
        this.delay       = 50; //动画延时
        this.hasTopBar   = true; //有顶部工具条
        this.controlBar  = options.controlBar;
        this.container   = options.container;
        this.pageMode    = options.pageMode;
        this.pageTotal   = options.pageTotal;
        this.currentPage = options.currentPage;

        //配置属性
        //config
        this.config = Xut.config
        this.initConfig(this.config);

        this.initTool();
    }
});


sToolbar.prototype.initTool = function() {

    var bar = this.controlBar,
        setting = this.settings;

    //工具栏的显示状态
    this.barStatus = (bar.css('display') === 'none') ? false : true;

    //工具栏摆放位置
    this.toolbarPostion(bar, setting.ToolbarPos);

    //首页按钮
    setting.HomeBut && this.createHomeIcon(bar);

    //目录按钮
    setting.ContentBut && this.createDirIcon(bar);

    //添加标题
    this.createTitle(bar);

    //关闭子文档
    setting.CloseBut && this.createCloseIcon(bar);

    //页码数
    setting.PageBut && this.createPageNum(bar);

    //工具栏隐藏按钮
    this.createHideToolbar(bar);

    //翻页按钮
    if (this.pageMode == 2) {
        this.createArrows();
    }

    //邦定事件
    this.bindButtonsEvent(bar);
}

//工具条的位置
sToolbar.prototype.toolbarPostion = function(bar, position) {
    var height = this.iconHeight,
        TOP = this.barHeight;
    if (position == 1) { //在底部
        bar.css({
            bottom: 0,
            height: height + 'px'
        });
    } else { //在顶部
        bar.css({
            top: 0,
            height: height + 'px',
            paddingTop: TOP + 'px'
        });
    }
}

//创建主页按钮
sToolbar.prototype.createHomeIcon = function(bar) {
    var str = '<div id="backHome" style="float:left;text-indent:0.25em;height:{0}px;line-height:{1}px;color:#007aff">主页</div>',
        height = this.iconHeight,
        html = $(String.format(str, height, height));
    bar.append(html);
}

//创建目录按钮
sToolbar.prototype.createDirIcon = function(bar) {
    var str = '<div id="backDir" class="xut-controlBar-backDir" style="float:left;margin-left:4px;width:{0}px;height:{1}px;background-size:cover"></div>',
        height = this.iconHeight,
        html = $(String.format(str, height, height));
    bar.append(html);
}

//创建页码数
sToolbar.prototype.createPageNum = function(bar) {
    var height = this.iconHeight,
        marginTop = height * 0.25,
        iconH = height * 0.5,
        str, html;
    str = '<div class="xut-controlBar-pageNum" style="float:right;margin:{0}px 4px;padding:0 0.25em;height:{1}px;line-height:{2}px;border-radius:0.5em"><span>{3}</span>/<span>{4}</span></div>';
    html = $(String.format(str, marginTop, iconH, iconH, this.currentPage, this.pageTotal));
    this.curTips = html.children().first();
    bar.append(html);
}

//工具栏隐藏按钮
sToolbar.prototype.createHideToolbar = function(bar) {
    var html, style,
        height = this.iconHeight;
    style = 'float:right;width:' + height + 'px;height:' + height + 'px;background-size:cover';
    html = '<div id="hideToolbar" class="xut-controlBar-hide" style="' + style + '"></div>';
    bar.append(html);
}

//关闭子文档按钮
sToolbar.prototype.createCloseIcon = function(bar) {
    var style, html, height = this.iconHeight;
    style = 'float:right;margin-right:4px;width:' + height + 'px;height:' + height + 'px';
    html = '<div class="si-icon" data-icon-name="close" style="' + style + '"></div>';
    html = $(html);
    this.createSVGIcon(html[0],
        function() {
            if (SUbDOCCONTEXT) {
                SUbDOCCONTEXT.Xut.publish('subdoc:dropApp');
            } else {
                Xut.publish('magazine:dropApp');
            }
        }
    );
    bar.append(html);
}

//应用标题
sToolbar.prototype.createTitle = function(bar) {
    var style, html,
        appName = this.appName,
        height = this.iconHeight;
    style = 'width:100%;position:absolute;line-height:' + height + 'px;pointer-events:none';
    html = '<div class="xut-controlBar-title" style="z-index:-99;' + style + '">' + appName + '</div>';
    bar.append(html);
}

/**
 * [ 返回按钮]
 * @return {[type]} [description]
 */
sToolbar.prototype.createBackIcon = function(container) {
    var style, html,
        height = this.iconHeight;
    style = 'float:left;width:' + height + 'px;height:' + height + 'px';
    html = '<div class="si-icon" data-icon-name="back" style="' + style + '"></div>';
    html = $(html);
    this.createSVGIcon(html[0],
        function() {
            Xut.Application.Suspend({
                dispose: function() { //停止热点动作
                    Xut.Application.DropApp(); //退出应用
                },
                processed: function() {
                    Xut.Application.DropApp(); //退出应用
                }
            });
        }
    );
    container.append(html);
}

/**
 * 更新页码指示
 * @return {[type]} [description]
 */
sToolbar.prototype.updatePointer = function(pageIndex) {
    this.curTips && this.curTips.html(pageIndex + 1);
}

sToolbar.prototype.bindButtonsEvent = function(bar) {
    var that = this;
    bar.on("touchend mouseup", function(e) {
        var type = Xut.plat.evtTarget(e).id;
        switch (type) {
            case "backHome":
                that.homeControl();
                break;
            case "backDir":
                that.navigationBar();
                break;
            case 'hideToolbar':
                that.hideTopBar();
                break;
        }
    })
}

/**
 * [ 跳转处理]
 * @return {[type]} [description]
 */
sToolbar.prototype.homeControl = function() {
    if (DUKUCONFIG) {
        Xut.Application.Suspend({
            dispose: function() {
                Xut.Application.DropApp() //退出应用
            },
            processed: function() {
                Xut.Application.DropApp() //退出应用
            }
        });
        return;
    }

    Xut.Application.Suspend({
        dispose: function(promptMessage) {
            //停止热点动作
            //promptMessage('再按一次将跳至首页！')
        },
        processed: function() {
            Xut.View.GotoSlide(1) //调整到首页
        }
    });
}

/**
 * [ 打开目录关闭当前页面活动热点]
 * @return {[type]} [description]
 */
sToolbar.prototype.navigationBar = function() {
   initNavBar(Xut.Presentation.GetPageIndex());
}


/**
 * [ 显示顶部工具栏]
 * @return {[type]} [description]
 */
sToolbar.prototype.showTopBar = function() {
    var that = this;

    if (this.barStatus) {
        this.Lock = false;
        return;
    }
    this.controlBar.css({
        'display': 'block',
        'opacity': 0
    });

    setTimeout(function() {
        that.controlBar.animate({
            'opacity': 1
        }, that.delay, 'linear', function() {
            Navbar.close();
            that.showSystemBar();
            that.barStatus = true;
            that.Lock = false;
        });
    });
}

/**
 * [ 隐藏顶部工具栏]
 * @return {[type]} [description]
 */
sToolbar.prototype.hideTopBar = function() {
    var that = this;

    if (!this.barStatus) {
        this.Lock = false;
        return;
    }

    this.controlBar.animate({
        'opacity': 0
    }, that.delay, 'linear', function() {
        Navbar.close();
        that.controlBar.hide();
        that.hideSystemBar();
        that.barStatus = false;
        that.Lock = false;
    });
}


//销毁
sToolbar.prototype.destroy = function() {
    this.controlBar.off();
    this.controlBar = null;
    this.arrows = null;
    this.curTips = null;
    this.barStatus = false;
}

 export {
 	sToolbar
 }