//布局
import { home, scene } from './layout'
import { parseJSON } from '../util/index'
//场景控制器
import { controll as sceneControll } from './controller'
//工具栏
import { sToolbar as MainBar } from '../toolbar/sysbar'
import { fToolbar as DeputyBar } from '../toolbar/fnbar'
import { Bar as BookToolBar } from '../toolbar/bookbar'
 

//vm
import { Manager } from '../manager/core'
 
let config
    
//========================场景容器,工具栏创建相关================================
 
/**
 * 分解工具栏配置文件
 * @return {[type]}          [description]
 */
function parseTooBar(toolbar, tbType, pageMode) {
    if (toolbar = parseJSON(toolbar)) {
        //兼容数据库中未指定的情况
        var n = Number(toolbar.pageMode);
        pageMode = _.isFinite(n) ? n : pageMode;
        if (_.isString(toolbar.tbType)) {
            tbType = _.map(toolbar.tbType.split(','), function(num) {
                return Number(num);
            });
        }

    }
    return {
        'tbType': tbType,
        'pageMode': pageMode
    }
}


/**
 * 主场景工具栏配置
 * pageMode:默认2 允许滑动,带翻页按钮
 * 
 * @param  {[type]} scenarioId [description]
 * @return {[type]}            [description]
 */
function pMainBar(scenarioId) {
    var sectionRang = Xut.data.query('sectionRelated', scenarioId),
        toolbar = sectionRang.toolbar, //场景工具栏配置信息
        pagetotal = sectionRang.length,
        tbType = [1], //默认显示系统工具栏
        pageMode = pagetotal > 1 ? 2 : 0; //默认2 允许滑动,带翻页按钮
    return parseTooBar(toolbar, tbType, pageMode)
}


/**
 * 副场景工具栏配置
 * pageMode 是否支持滑动翻页  0禁止滑动 1允许滑动
 * tbType   工具栏显示的类型 [0-5]
 */
function pDeputyBar(toolbar, pagetotal) {
    var tbType = [0],
        pageMode = pagetotal > 1 ? 1 : 0;
    return parseTooBar(toolbar, tbType, pageMode)
}


/**
 * 找到对应容器
 * @return {[type]}            [description]
 */
function findContainer(elements, scenarioId, isMain) {
    return function(pane, parallax) {
        var node;
        if (isMain) {
            node = '#' + pane;
        } else {
            node = '#' + parallax + scenarioId;
        }
        return elements.find(node)[0];
    }
}


/**
 * 如果启动了缓存记录
 * 加载新的场景
 * @return {[type]} [description]
 */
function checkHistory(history) {

    //直接启用快捷调试模式
    if (config.deBugHistory) {
        Xut.View.LoadScenario(config.deBugHistory)
        return true;
    }

    //如果有历史记录
    if (history) {
        var scenarioInfo = sceneControll.seqReverse(history)
        if (scenarioInfo) {
            scenarioInfo = scenarioInfo.split('-');
            Xut.View.LoadScenario({
                'scenarioId': scenarioInfo[0],
                'chapterId': scenarioInfo[1],
                'pageIndex': scenarioInfo[2]
            })
            return true;
        } else {
            return false;
        }
    }
}



/**
 * 场景创建类
 * @param  {[type]} seasonId               [description]
 * @param  {[type]} chapterId              [description]
 * @param  {[type]} createCompleteCallback [创建完毕通知回调]
 * @param  {[type]} createMode             [创建模式]
 * @param  {[type]} sceneChainId           [场景ID链,用于后退按钮加载前一个场景]
 * @return {[type]}                        [description]
 */
function SceneFactory(data) {

    config = Xut.config

    //基本配置信息
    var seasonId = data.seasonId;
    var chapterId = data.chapterId;

    var options = _.extend(this, data, {
        'scenarioId': seasonId,
        'chapterId': chapterId,
        'container': $('#sceneContainer')
    })

    //////////////
    // 创建场景容器 //
    //////////////
    var complete = function() {
        //配置工具栏行为
        if (!Xut.IBooks.Enabled) {
            _.extend(this, this.initToolBar());
        }

        //构件vm对象
        this.createViewModel();

        //注入场景管理
        sceneControll.add(seasonId, chapterId, this);
    }
    this.createScenario(complete, options);
}

var sceneProto = SceneFactory.prototype;


/**
 * 创建场景
 * @return {[type]} [description]
 */
sceneProto.createScenario = function(callback, options) {

    //如果是静态文件执行期
    //支持Xut.IBooks模式
    //都不需要创建节点
    if (Xut.IBooks.runMode()) {
        this.elements = $('#sceneHome');
        callback.call(this);
        return;
    }

    var elements, str, self = this;
    if (options.isMain) {
        str = home();
    } else {
        str = scene(this.scenarioId);
    }

    //创建场景容器
    elements = this.elements = $(str);
    Xut.nextTick({
        'container': self.container,
        'content': elements
    }, function() {
        callback.call(self);
    });
}


/**
 * 
 * 配置工具栏行为
 *	1.	工具栏类型 
 *	tbType：(如果用户没有选择任何工具栏信息处理，tbType字段就为空)
 *	 0	禁止工具栏
 *	 1	系统工具栏   - 显示IOS系统工具栏
 *	 2	场景工具栏   - 显示关闭按钮
 *	 3	场景工具栏   - 显示返回按钮
 *	 4	场景工具栏   - 显示顶部小圆点式标示
 *
 *	2.	翻页模式
 *	pageMode：(如果用户没有选择任何处理，pageMode字段就为空)
 *	 0禁止滑动
 *	 1 允许滑动无翻页按钮
 *	 2 允许滑动带翻页按钮
 *
 * @return {[type]} [description]
 */
sceneProto.initToolBar = function() {
    var scenarioId = this.scenarioId;
    var pageTotal = this.pageTotal;
    var pageIndex = this.pageIndex;
    var elements = this.elements;
    var bar;
    var findControlBar = function() {
        return elements.find('#controlBar')
    };

    /**
     * 主场景工具栏设置
     */
    if (this.isMain) {
        bar = pMainBar(scenarioId, pageTotal);
        if (config.scrollPaintingMode) {
            //word模式,自动启动工具条
            this.sToolbar = new BookToolBar({
                container: elements,
                controlBar: findControlBar(),
                pageMode: bar.pageMode
            });
        } else if (_.some(bar.tbType)) {
            //普通模式
            this.sToolbar = new MainBar({
                container: elements,
                controlBar: findControlBar(),
                pageTotal: pageTotal,
                currentPage: pageIndex + 1,
                pageMode: bar.pageMode
            });
        }
    } else {
        /**
         * 副场景
         * @type {[type]}
         */
        bar = pDeputyBar(this.barInfo, pageTotal);
        //创建工具栏
        if (bar) {
            this.cToolbar = new DeputyBar({
                id: scenarioId,
                container: elements,
                tbType: bar.tbType,
                pageTotal: pageTotal,
                currentPage: pageIndex,
                pageMode: bar.pageMode
            });
        }
    }

    return bar;
}


/**
 * 构建创建对象
 * @return {[type]} [description]
 */
sceneProto.createViewModel = function() {

    var self = this;
    var scenarioId = this.scenarioId;
    var pageTotal = this.pageTotal;
    var pageIndex = this.pageIndex;
    var elements = this.elements;
    var pageMode = this.pageMode;
    var isMain = this.isMain;
    var tempfind = findContainer(elements, scenarioId, isMain)
        //页面容器
    var scenarioPage = tempfind('pageContainer', 'scenarioPage-');
    //视差容器
    var scenarioMaster = tempfind('masterContainer', 'scenarioMaster-');

    //场景容器对象
    var vm = this.vm = new Manager({
        'container': this.elements[0],
        'pageMode': pageMode,
        'multiScenario': !isMain,
        'rootPage': scenarioPage,
        'rootMaster': scenarioMaster,
        'initIndex': pageIndex, //保存索引从0开始
        'pagetotal': pageTotal,
        'sectionRang': this.sectionRang,
        'scenarioId': scenarioId,
        'chapterId': this.chapterId,
        'isInApp': this.isInApp //提示页面
    });

    /**
     * 配置选项
     * @type {[type]}
     */
    var isToolbar = this.isToolbar = this.cToolbar ? this.cToolbar : this.sToolbar;


    /**
     * 监听翻页
     * 用于更新页码
     * @return {[type]} [description]
     */
    vm.$bind('pageUpdate', function(pageIndex) {
        isToolbar && isToolbar.updatePointer(pageIndex);
    })


    /**
     * 显示下一页按钮
     * @return {[type]} [description]
     */
    vm.$bind('showNext', function() {
        isToolbar && isToolbar.showNext();
    })


    /**
     * 隐藏下一页按钮
     * @return {[type]} [description]
     */
    vm.$bind('hideNext', function() {
        isToolbar && isToolbar.hideNext();
    })

    /**
     * 显示上一页按钮
     * @return {[type]} [description]
     */
    vm.$bind('showPrev', function() {
        isToolbar && isToolbar.showPrev();
    })


    /**
     * 隐藏上一页按钮
     * @return {[type]} [description]
     */
    vm.$bind('hidePrev', function() {
        isToolbar && isToolbar.hidePrev();
    })

    /**
     * 切换工具栏
     * @return {[type]} [description]
     */
    vm.$bind('toggleToolbar', function(state, pointer) {
        isToolbar && isToolbar.toggle(state, pointer);
    })


    /**
     * 复位工具栏
     * @return {[type]} [description]
     */
    vm.$bind('resetToolbar', function() {
        self.sToolbar && self.sToolbar.reset();
    })


    /**
     * 监听创建完成
     * @return {[type]} [description]
     */
    vm.$bind('createComplete', function(nextAction) {
        self.complete && setTimeout(function() {
            if (isMain) {
                self.complete(function() {
                    Xut.View.HideBusy()
                        //检测是不是有缓存加载
                    if (!checkHistory(self.history)) {
                        //指定自动运行的动作
                        nextAction && nextAction();
                    }
                    //全局接口,应用加载完毕
                    Xut.Application.AddEventListener();
                })
            } else {
                self.complete(nextAction)
            }
        }, 200);
    })


    //如果是读酷端加载
    if (DUKUCONFIG && isMain && DUKUCONFIG.success) {
        DUKUCONFIG.success();
        vm.$init();
        //如果是客户端加载
    } else if (CLIENTCONFIGT && isMain && CLIENTCONFIGT.success) {
        CLIENTCONFIGT.success();
        vm.$init();
    } else {
        //正常加载
        vm.$init();
    }

    /**
     * 绑定桌面调试
     */
    config.debugMode && Xut.plat.isBrowser && this.bindWatch();
}



/**
 * 为桌面测试
 * 绑定调试
 * @return {[type]} [description]
 */
sceneProto.bindWatch = function() {
    // for test
    if (Xut.plat.isBrowser) {
        var vm = this.vm;
        this.testWatch = $(".xut-controlBar-pageNum").click(function() {
            console.log('主场景', vm)
            console.log('主场景容器', vm.$scheduler.pageMgr.Collections)
            console.log('主场景视觉差容器', vm.$scheduler.parallaxMgr && vm.$scheduler.parallaxMgr.Collections)
            console.log('多场景', sceneControll.expose())
            console.log('音频', Xut.AudioManager);
            console.log('视频', Xut.VideoManager);
            console.log('数据库', Xut.data);
        })
    }
}



//=============================退出处理,销毁=============================================


/**
 * 销毁场景对象
 * @return {[type]} [description]
 */
sceneProto.destroy = function() {
    /**
     * 桌面调试
     */
    if (this.testWatch) {
        this.testWatch.off();
        this.testWatch = null;
    }

    /**
     * 销毁当前场景
     */
    this.vm.$destroy();

    /**
     * 销毁工具栏
     */
    if (this.isToolbar) {
        this.isToolbar.destroy();
        this.isToolbar = null;
    }

    this.container = null;

    //销毁节点
    this.elements.off();
    this.elements.remove();
    this.elements = null;

    //销毁引用
    sceneControll.remove(this.scenarioId)
}



export {
    SceneFactory as sceneFactory
}
