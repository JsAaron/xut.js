/**
 * 应用对外接口
 * 此模块的所有方法都是动态修正上下文，自动切换场景
 * 1.   Xut.Application
 *          a)  整个应用程序的接口，执行应用级别的操作，例如退出应用之类。
 * 2.   Xut.DocumentWindow
 *          a)  窗口的接口。窗口就是电子杂志的展示区域，可以操作诸如宽度、高度、长宽比之类。
 * 3.   Xut.View
 *          a)  视图接口。视图是窗口的展示方式，和页面相关的接口，都在这里。
 * 4.   Xut.Presentation
 *          a)  数据接口。和电子杂志的数据相关的接口，都在这里。
 * 5.   Xut.Slides
 *          a)  所有页面的集合
 * 6.   Xut.Slide
 *          a)  单个页面
 * 7.   Xut.Master
 *          a)  页面的母版
 * @return {[type]} [description]
 */

import { reviseSize } from './util/option'

const typeFilter = ['page', 'master'];


/**
 * 合并参数设置
 * 1 pageMgr
 * 2 masterMgr
 * 3 修正pageType
 * 4 args参数
 * 5 回调每一个上下文
 */
const createaAccess = (mgr) => {
    return (callback, pageType, args, eachContext) => {
        //如果第一个参数不是pageType模式
        //参数移位
        if (pageType !== undefined && -1 === typeFilter.indexOf(pageType)) {
            var temp = args;
            args = pageType;
            eachContext = temp;
            pageType = 'page';
        }

        //pageIndex为pageType参数
        if (-1 !== typeFilter.indexOf(args)) {
            pageType = args;
            args = null;
        }

        pageType = pageType || 'page';

        if (mgr[pageType]) {
            return callback(mgr[pageType], pageType, args, eachContext)
        } else {
            console.log('传递到access的pageType错误！')
        }
    }
}


/**
 * 判断是否存在页码索引
 * 如果不存在默认取当前页面
 */
const createExistIndex = ($globalEvent) => {
    return (pageIndex) => {
        //如果不存在
        if (pageIndex == undefined) {
            pageIndex = $globalEvent.getHindex() //当前页面
        }
        return pageIndex
    }
}


export default function overrideApi(vm) {

    const $globalEvent = vm.$globalEvent
    const options = vm.options
    const $dispatch = vm.$dispatch

    //页面与母版的管理器
    const access = createaAccess({
        page: $dispatch.pageMgr,
        master: $dispatch.masterMgr
    })

    const isExistIndex = createExistIndex($globalEvent);

    //***************************************************************
    //
    //  数据接口
    //
    //***************************************************************

    const Presentation = Xut.Presentation;

    /**
     * 获取当前页码
     */
    Presentation.GetPageIndex = () => $globalEvent.getHindex()

    /**
     * [获取页面的总数据]
     * 1 chapter数据
     * 2 section数据
     * @return {[type]}
     */
    _.each([
        "Section",
        "Page"
    ], (apiName) => {
        Presentation['GetApp' + apiName + 'Data'] = (callback) => {
            var i = 0,
                temp = [],
                cps = Xut.data.query('app' + apiName),
                cpsLength = cps.length;
            for (i; i < cpsLength; i++) {
                temp.push(cps.item(i))
            }
            return temp;
        }
    })


    /**
     * 获取首页的pageId
     * @param {[type]} seasonId [description]
     */
    Presentation.GetFirstPageId = (seasonId) => {
        var sectionRang = Xut.data.query('sectionRelated', seasonId);
        var pageData = Xut.data.query('appPage');
        return pageData.item(sectionRang.start);
    }


    /**
     *  四大数据接口
     *  快速获取一个页面的nodes值
     *  获取当前页面的页码编号 - chapterId
     *  快速获取指定页面的chapter数据
     *  pagebase页面管理对象
     * @return {[type]}            [description]
     */
    _.each([
        "GetPageId",
        "GetPageNode",
        "GetPageData",
        "GetPageObj"
    ], (apiName) => {
        Presentation[apiName] = (pageType, pageIndex) => {
            return access((manager, pageType, pageIndex) => {
                pageIndex = isExistIndex(pageIndex)
                return manager["abstract" + apiName](pageIndex, pageType)
            }, pageType, pageIndex)
        }
    })


    /**
     * 得到页面根节点
     * li节点
     */
    Presentation.GetPageElement = () => {
        var obj = Presentation.GetPageObj()
        return obj.element
    };


    /**
     * 获取页码标记
     * 因为非线性的关系，页面都是按chpater组合的
     * page_0
     * page_10
     * 但是每一个章节页面的索引是从0开始的
     * 区分pageIndex
     */
    Presentation.GetPagePrefix = (pageType, pageIndex) => {
        let pageObj = Presentation.GetPageObj(pageType, pageIndex);
        return pageObj.pid;
    };


    //命名前缀
    const prefix = 'Content_';

    /**
     * 创建一个content的命名规则
     */
    Presentation.MakeContentPrefix = function(pageIndex) {
        return prefix + Presentation.GetPagePrefix(pageIndex) + "_";
    }

    /**
     * 获取命名规则
     */
    Presentation.GetContentName = function(id) {
        if (id) {
            return prefix + Presentation.GetPagePrefix() + "_" + id;
        } else {
            return prefix + Presentation.GetPagePrefix()
        }
    }


    //***************************************************************
    //
    //  视图接口
    //
    //***************************************************************

    const View = Xut.View;

    /**
     * 设置页面的potion编码
     * 为分栏修改
     */
    View.setPointer = function(pageIndex) {
        $globalEvent.setPointer(pageIndex)
    }

    /**
     * 更新页码
     * @param {[type]} point [description]
     */
    View.pageUpdate = function(pageIndex) {
        vm.$emit('change:pageUpdate', pageIndex)
    }

    /**
     * 显示工具栏
     * 没有参数显示 工具栏与控制翻页按钮
     * 有参数单独显示指定的
     */
    View.ShowToolbar = function(point) {
        vm.$emit('change:toggleToolbar', 'show', point)
    }

    /**
     * 隐藏工具栏
     * 没有参数隐藏 工具栏与控制翻页按钮
     * 有参数单独隐藏指定
     */
    View.HideToolbar = function(point) {
        vm.$emit('change:toggleToolbar', 'hide', point)
    }

    /**
     * 指定特定的显示与隐藏
     *  Xut.View.Toolbar({
     *       show :'bottom',
     *       hide :'controlBar'
     *   })
     *
     *  //工具栏与翻页按钮全部显示/隐藏
     *  Xut.View.Toolbar('show')
     *  Xut.View.Toolbar('hide')
     *
     * @return {[type]} [description]
     */
    View.Toolbar = function(cfg) {
        vm.$emit('change:toggleToolbar', cfg)
    };

    /**
     * 跳转到上一个页面
     */
    View.GotoPrevSlide = function(seasonId, chapterId) {
        if (seasonId && chapterId) {
            Xut.View.LoadScenario({
                'scenarioId': seasonId,
                'chapterId': chapterId
            })
            return;
        }

        //ibooks模式下的跳转
        //全部转化成超链接
        if (Xut.IBooks.Enabled && Xut.IBooks.runMode()) {
            location.href = (Xut.IBooks.pageIndex - 1) + ".xhtml";
            return
        }

        options.multiplePages && $globalEvent.prev()
    };

    /**
     * 跳转到下一个页面
     */
    View.GotoNextSlide = function(seasonId, chapterId) {
        if (seasonId && chapterId) {
            Xut.View.LoadScenario({
                'scenarioId': seasonId,
                'chapterId': chapterId
            })
            return;
        }

        //ibooks模式下的跳转
        //全部转化成超链接
        if (Xut.IBooks.Enabled && Xut.IBooks.runMode()) {
            location.href = (Xut.IBooks.pageIndex + 1) + ".xhtml";
            return
        }

        options.multiplePages && $globalEvent.next();
    };

    /**
     * 跳转页面
     * 场景内部切换
     * 跳转到指定编号的页面
     * Action 类型跳转
     * xxtlink 超连接跳转,svg内嵌跳转标记处理
     * 文本框跳转
     * ........
     */
    View.GotoSlide = function(seasonId, chapterId) {
        var count,
            sceneObj,
            currscene,
            sceneController,
            //修正参数
            fixParameter = function(pageIndex) {
                pageIndex = Number(pageIndex) - 1;
                if (pageIndex < 0) {
                    pageIndex = 0;
                }
                return pageIndex;
            };

        //ibooks模式下的跳转
        //全部转化成超链接
        if (Xut.IBooks.Enabled && Xut.IBooks.runMode() && chapterId) {
            location.href = chapterId + ".xhtml";
            return
        }

        //兼容数据错误
        if (!seasonId && !chapterId) return;

        //如果是一个参数是传递页码数,则为内部跳转
        if (arguments.length === 1) {
            //复位翻页按钮
            vm.$emit('change:showNext')
            return $globalEvent.scrollToPage(fixParameter(seasonId))
        }

        //场景模式内部跳转
        if (options.scenarioId == seasonId) {
            //chpaterId 转化成实际页码
            var sectionRang = Xut.data.query('sectionRelated', seasonId);
            var pageIndex = chapterId - sectionRang.start;
            vm.$emit('change:showNext')
            return $globalEvent.scrollToPage(fixParameter(pageIndex))
        }
        //场景与场景的跳转
        return View.LoadScenario({
            'scenarioId': seasonId,
            'chapterId': chapterId
        });
    }


    /**
     * 页面滑动
     * @param {[type]} distance  [description]
     * @param {[type]} speed     [description]
     * @param {[type]} direction [description]
     * @param {[type]} action    [description]
     */
    View.MovePage = function(distance, speed, direction, action) {
        //如果禁止翻页模式 || 如果是滑动,不是边界
        if (!options.multiplePages ||
            $globalEvent.isMove() ||
            action === 'flipMove' && $globalEvent.isBorder(distance)) {
            return
        }
        const pagePointer = $globalEvent.getPointer()
        const data = {
            'distance': distance,
            'speed': speed,
            'direction': direction,
            'action': action,
            'leftIndex': pagePointer.leftIndex,
            'pageIndex': pagePointer.currIndex,
            'rightIndex': pagePointer.rightIndex
        }
        $dispatch.move(data)
    };



    //***************************************************************
    //
    //  辅助对象的控制接口
    //
    //***************************************************************

    /**
     * 运行辅助动画
     * 辅助对象的activityId,或者合集activityId
     * Run
     * stop
     * 1 零件
     * 2 音频动画
     */
    const Assist = Xut.Assist;

    _.each([
        "Run",
        "Stop"
    ], function(apiName) {
        Assist[apiName] = function(pageType, activityId, outCallBack) {
            access(function(manager, pageType, activityId, outCallBack) {
                //数组
                if (_.isArray(activityId)) {
                    //完成通知
                    var markComplete = function() {
                        var completeStatistics = activityId.length; //动画完成统计
                        return function() {
                            if (completeStatistics === 1) {
                                outCallBack && outCallBack();
                                markComplete = null;
                            }
                            completeStatistics--;
                        }
                    }();
                    _.each(activityId, function(id) {
                        manager.abstractAssistAppoint(id, $globalEvent.getHindex(), markComplete, apiName);
                    })
                } else {
                    manager.abstractAssistAppoint(activityId, $globalEvent.getHindex(), outCallBack, apiName);
                }
            }, pageType, activityId, outCallBack)
        }
    })


    //***************************************************************
    //
    //  针对page页面的content类型操作接口
    //
    //***************************************************************

    const Contents = Xut.Contents;

    /**
     * 获取指定的对象
     * 传递参数
     * 单一 id
     * 数据id合集 [1,2,4,5,6]
     * @param {[type]}   contentIds  [description]
     * @param {Function} eachContext 回调遍历每一个上下文
     */
    Contents.Get = function(pageType, contentIds, eachContext) {

        return access(function(manager, pageType, contentIds, eachContext) {

            var contentObj, contentObjs,
                pageIndex = Presentation.GetPageIndex();

            function findContent(currIndex, contentId) {
                var pageObj;
                if (pageObj = manager.abstractGetPageObj(currIndex)) {
                    return pageObj.baseGetContentObject(contentId);
                }
            }

            //如果传递是数组合集
            if (_.isArray(contentIds)) {
                contentObjs = [];
                _.each(contentIds, function(id) {
                    contentObj = findContent(pageIndex, id)
                    if (eachContext) { //传递每一个处理的上下文
                        eachContext(id, contentObj);
                    } else {
                        if (contentObj) {
                            contentObjs.push(contentObj);
                        } else {
                            Xut.log('error', '找不到对应的content数据' + id)
                        }
                    }
                })
                return contentObjs;
            }

            //如果传递的是Content_1_3组合情况
            if (/_/.test(contentIds)) {
                var expr = contentIds.split('_');
                if (expr.length > 1) {
                    return findContent(expr[1], expr[2]);
                }
            }

            //单一content id
            contentObj = findContent(pageIndex, contentIds);

            if (eachContext) {
                eachContext(contentObj);
            } else {
                return contentObj;
            }

        }, pageType, contentIds, eachContext)
    }


    /**
     * 得到指定页面零件的数据
     * 获取指定的content数据
     * @param  {[type]} contentId [description]
     * @return {[type]}           [description]
     */
    Contents.GetPageWidgetData = function(pageType, contentId) {

        //如果没有传递pageType取默认
        if (-1 === typeFilter.indexOf(pageType)) {
            contentId = pageType;
            pageType = 'page';
        }

        //必须有数据
        if (!contentId || !contentId.length) {
            return;
        }

        //保证是数组格式
        if (_.isString(contentId)) {
            contentId = [contentId];
        }

        var contentDas, contents = [];

        Contents.Get(pageType, contentId, function(cid, content) {
            //是内部对象
            if (content && (contentDas = content.contentDas)) { //通过内部管理获取对象
                contents.push({
                    'id': content.id,
                    'idName': content.actName,
                    'element': content.$contentProcess,
                    'theTitle': contentDas.theTitle,
                    'scaleHeight': contentDas.scaleHeight,
                    'scaleLeft': contentDas.scaleLeft,
                    'scaleTop': contentDas.scaleTop,
                    'scaleWidth': contentDas.scaleWidth,
                    'contentData': contentDas,
                    'source': 'innerObjet' //获取方式内部对象
                });
            } else {
                //如果通过内部找不到对象的content数据,则直接查找数据库
                //可能是一个事件的钩子对象
                if (contentDas = seekQuery(cid)) {
                    var actName = Presentation.GetContentName(cid);
                    var element;
                    //如果对象是事件钩子或者是浮动对象
                    //没有具体的数据
                    if (content && content.$contentProcess) {
                        element = content.$contentProcess;
                    } else {
                        element = $('#' + actName);
                    }
                    contents.push({
                        'id': cid,
                        'idName': actName,
                        'element': element,
                        'theTitle': contentDas.theTitle,
                        'scaleHeight': contentDas.scaleHeight,
                        'scaleLeft': contentDas.scaleLeft,
                        'scaleTop': contentDas.scaleTop,
                        'scaleWidth': contentDas.scaleWidth,
                        'contentData': contentDas,
                        'source': 'dataBase'
                    });
                } else {
                    Xut.log('error', '找不到对应的GetPageWidgetData数据' + cid)
                }
            }
        });
        return contents;
    }

    //数据库查找
    function seekQuery(id) {
        var contentData = Xut.data.query('Content', id);
        if (contentData) {
            return reviseSize(_.extend({}, contentData));
        }
    }


    //******************************************
    //
    //      互斥接口
    //      直接显示\隐藏\停止动画
    //
    //*******************************************

    //检测类型为字符串
    function typeCheck(objNameList) {
        return !objNameList || typeof objNameList !== 'string' ? true : false;
    }

    /**
     * 针对文本对象的直接操作
     * 显示
     * 隐藏
     * 停止动画
     */
    _.each([
        "Show",
        "Hide",
        "StopAnim"
    ], function(operate) {
        Contents[operate] = function(pageType, nameList) {
            access(function(manager, pageType, nameList) {
                if (typeCheck(nameList)) return;
                var pageBaseObj;
                if (!(pageBaseObj = manager.abstractAssistPocess($globalEvent.getHindex()))) {
                    console.log('注入互斥接口数据错误！')
                    return;
                }
                _.each(nameList.split(','), function(contentId) {
                    pageBaseObj.baseContentMutex(contentId, operate)
                })
            }, pageType, nameList)
        }
    })


    //******************************************
    //
    //      Application
    //      应用接口
    //
    //*******************************************

    const Application = Xut.Application;


    /**
     * 获取一个存在的实例对象
     * 区分不同层级page/master
     * 不同类型    content/widget
     */
    Application.GetSpecifiedObject = function(pageType, data) {
        return access(function(manager, pageType) {
            var pageObj;
            if (pageObj = manager.abstractGetPageObj(data.pageIndex)) {
                if (data.type === 'Content') {
                    return pageObj.baseSpecifiedContent(data);
                } else {
                    return pageObj.baseSpecifiedComponent(data);
                }
            }
        }, pageType)
    }


    /**
     * 应用滑动接口
     * @return {[type]}
     */
    _.each([
        "closeSwipe",
        "openSwipe"
    ], function(operate) {
        Application[operate] = function() {
            $globalEvent[operate]();
        }
    })
}
