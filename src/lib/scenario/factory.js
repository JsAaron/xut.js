import { config } from '../config/index'
import MainBar from '../toolbar/main-sysbar/index'
import DeputyBar from '../toolbar/deputy-fnbar'
import BookBar from '../toolbar/word-bookbar/index'
import NumberBar from '../toolbar/page-number'
import { sceneController } from './controller'
import Mediator from '../scenario-core/index'
import {
    getColumnCount,
    getColumnChpaterCount
} from '../scenario-core/component/column/depend'
import {
    mainScene,
    deputyScene
} from './layout'
import {
    pMainBar,
    pDeputyBar
} from './bar'


/**
 * 找到对应容器
 * @return {[type]}            [description]
 */
const findContainer = ($rootNode, scenarioId, isMain) => {
    return function(pane, parallax) {
        var node;
        if(isMain) {
            node = '#' + pane;
        } else {
            node = '#' + parallax + scenarioId;
        }
        return $rootNode.find(node)[0];
    }
}


/**
 * 如果启动了缓存记录
 * 加载新的场景
 * @return {[type]} [description]
 */
const checkHistory = (history) => {

    //直接启用快捷调试模式
    if(config.deBugHistory) {
        Xut.View.LoadScenario(config.deBugHistory)
        return true;
    }

    //如果有历史记录
    if(history) {
        var scenarioInfo = sceneController.seqReverse(history)
        if(scenarioInfo) {
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
export class SceneFactory {

    constructor(data) {
        let seasonId = data.seasonId;
        let chapterId = data.chapterId;
        let options = _.extend(this, data, {
            'scenarioId': seasonId,
            'chapterId': chapterId,
            '$container': $('.xut-scene-container')
        });
        //创建主场景
        this._createHTML(options, () => {
            if(!Xut.IBooks.Enabled) {
                _.extend(this, this._initToolBar())
            }
            this._createMediator();
            sceneController.add(seasonId, chapterId, this);
        })
    }

    /**
     * 创建场景
     * @return {[type]} [description]
     */
    _createHTML(options, callback) {

        //如果是静态文件执行期
        //支持Xut.IBooks模式
        //都不需要创建节点
        if(Xut.IBooks.runMode()) {
            this.$rootNode = $('#xut-main-scene')
            callback()
            return;
        }

        let layout

        if(options.isMain) {
            layout = mainScene()
        } else {
            layout = deputyScene(this.scenarioId)
        }

        this.$rootNode = $(layout)

        Xut.nextTick({
            'container': this.$container,
            'content': this.$rootNode
        }, callback)
    }


    /**
     * 初始化工具栏
     * 1 主场景，系统工具栏
     * 2 副场景，函数工具栏
     * 3 全场景，页码显示（右下角）
     * @return {[type]} [description]
     */
    _initToolBar() {
        const scenarioId = this.scenarioId
        const pageTotal = this.pageTotal
        const pageIndex = this.pageIndex
        const $rootNode = this.$rootNode
        const findControlBar = function() {
            return $rootNode.find('.xut-control-bar')
        }

        //配置文件
        let barConfig = {}

        //主场景工具栏设置
        if(this.isMain) {
            barConfig = pMainBar(scenarioId, pageTotal)
            if(config.visualMode === 4) {
                //word模式,自动启动工具条
                // this.mainToolbar = new BookBar({
                //     sceneNode: $rootNode,
                //     controlNode: findControlBar(),
                //     pageMode: barConfig.pageMode
                // })
            }
            //如果工具拦提供可配置
            //或者config.pageMode 带翻页按钮
            else if(_.some(barConfig.toolType)) {
                //普通模式
                this.mainToolbar = new MainBar({
                    sceneNode: $rootNode,
                    controlNode: findControlBar(),
                    pageTotal: pageTotal,
                    currentPage: pageIndex + 1,
                    pageMode: barConfig.pageMode,
                    toolType: barConfig.toolType
                })
            }
        }
        //副场景
        else {
            //副场工具栏配置
            barConfig = pDeputyBar(this.barInfo, pageTotal)
            if(_.some(barConfig.toolType)) {
                this.deputyToolbar = new DeputyBar({
                    sceneNode: $rootNode,
                    toolType: barConfig.toolType,
                    pageTotal: pageTotal,
                    currentPage: pageIndex,
                    pageMode: barConfig.pageMode
                })
            }
        }


        //2016.9.29
        //新增页码显示
        //如果有分栏
        let columnCounts = getColumnCount(this.seasonId)

        //如果是min平台强制启动
        if(Xut.config.platform === 'mini' || (config.toolType.number !== false && columnCounts)) {

            let getColumnTotal = (needGet) => {
                if(needGet) {
                    //高度变化后，重新获取
                    columnCounts = getColumnCount(this.seasonId)
                }
                let columnChpterCount = 0
                if(columnCounts) {
                    columnChpterCount = getColumnChpaterCount(this.seasonId)
                }
                return columnCounts ? (pageTotal + columnCounts - columnChpterCount) : pageTotal
            }

            this.numberToolbar = new NumberBar({
                $rootNode: $rootNode,
                currentPage: pageIndex,
                //如果有flowCounts则用
                //否则就用页面的总数
                pageTotal: getColumnTotal()
            })

            //页面总数改变
            if(config.columnCheck) {
                Xut.Application.Watch('change:number:total', () => {
                    this.numberToolbar.updateTotal(getColumnTotal(true))
                })
            }
        }


        return barConfig
    }

    /**
     * 构建创建对象
     * @return {[type]} [description]
     */
    _createMediator() {

        var self = this;
        var scenarioId = this.scenarioId;
        var pageTotal = this.pageTotal;
        var pageIndex = this.pageIndex;
        var $rootNode = this.$rootNode;
        var isMain = this.isMain;
        var tempfind = findContainer($rootNode, scenarioId, isMain);
        var scenarioPage = tempfind('xut-page-container', 'scenarioPage-');
        var scenarioMaster = tempfind('xut-master-container', 'scenarioMaster-');

        //场景容器对象
        var vm = this.vm = new Mediator({
            'pageMode': this.pageMode,
            'container': this.$rootNode[0],
            'multiScenario': !isMain,
            'rootPage': scenarioPage,
            'rootMaster': scenarioMaster,
            'initIndex': pageIndex, //保存索引从0开始
            'pageTotal': pageTotal,
            'sectionRang': this.sectionRang,
            'scenarioId': scenarioId,
            'chapterId': this.chapterId,
            'isInApp': this.isInApp //提示页面
        });


        /**
         * 配置选项
         * @type {[type]}
         */
        var isToolbar = this.isToolbar = this.deputyToolbar ? this.deputyToolbar : this.mainToolbar;


        /**
         * 监听翻页
         * 用于更新页码
         *   parentIndex  父索引
         *   subIndex     子索引
         * @return {[type]} [description]
         */
        vm.$bind('pageUpdate', (...arg) => {
            isToolbar && isToolbar.updatePointer(...arg)
            if(this.numberToolbar) {
                this.numberToolbar && this.numberToolbar.updatePointer(...arg)
            }
        })


        /**
         * 显示下一页按钮
         * @return {[type]} [description]
         */
        vm.$bind('showNext', () => {
            isToolbar && isToolbar.showNext();
        })


        /**
         * 隐藏下一页按钮
         * @return {[type]} [description]
         */
        vm.$bind('hideNext', () => {
            isToolbar && isToolbar.hideNext();
        })


        /**
         * 显示上一页按钮
         * @return {[type]} [description]
         */
        vm.$bind('showPrev', () => {
            isToolbar && isToolbar.showPrev();
        })


        /**
         * 隐藏上一页按钮
         * @return {[type]} [description]
         */
        vm.$bind('hidePrev', () => {
            isToolbar && isToolbar.hidePrev();
        })


        /**
         * 切换工具栏
         * state, pointer
         * @return {[type]} [description]
         */
        vm.$bind('toggleToolbar', (...arg) => {
            isToolbar && isToolbar.toggle(...arg)
            if(this.numberToolbar) {
                this.numberToolbar && this.numberToolbar.toggle(...arg)
            }
        })


        /**
         * 复位工具栏
         * @return {[type]} [description]
         */
        vm.$bind('resetToolbar', () => {
            if(this.mainToolbar) {
                this.mainToolbar.resetArrow() //左右翻页按钮
                this.mainToolbar.hideNavbar() //导航栏
            }
        })


        /**
         * 监听创建完成
         * @return {[type]} [description]
         */
        vm.$bind('createComplete', (nextAction) => {
            self.complete && setTimeout(() => {
                if(isMain) {
                    self.complete(() => {
                        Xut.View.HideBusy()
                            //检测是不是有缓存加载
                        if(!checkHistory(self.history)) {
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
        if(window.DUKUCONFIG && isMain && window.DUKUCONFIG.success) {
            window.DUKUCONFIG.success();
            vm.$init();
            //如果是客户端加载
        } else if(window.CLIENTCONFIGT && isMain && window.CLIENTCONFIGT.success) {
            window.CLIENTCONFIGT.success();
            vm.$init();
        } else {
            //正常加载
            vm.$init();
        }
    }


    /**
     * 销毁场景对象
     * @return {[type]} [description]
     */
    destroy() {

        //销毁当前场景
        this.vm.$destroy();

        //销毁工具栏
        if(this.isToolbar) {
            this.isToolbar.destroy()
            this.isToolbar = null
        }

        this.$container = null

        //销毁节点
        this.$rootNode.off()
        this.$rootNode.remove()
        this.$rootNode = null

        //销毁引用
        sceneController.remove(this.scenarioId)
    }
}
