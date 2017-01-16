/********************************************
 * 场景API
 * 此模块的所有方法都是动态修正上下文，自动切换场景
 * @return {[type]} [description]
 ********************************************/
import { $$warn } from '../../util/debug'
import { typeFilter } from './type-filter'
import { extendPresentation } from './presentation'
import { extendView } from './view'
import { extendAssist } from './assist'
import { extendContent } from './content'
import { extendApplication } from './application'

/**
 * 合并参数设置
 * 1 pageMgr
 * 2 masterMgr
 * 3 修正pageType
 * 4 args参数
 * 5 回调每一个上下文
 */
const createaAccess = mgr => {
    return(callback, pageType, args, eachContext) => {
        //如果第一个参数不是pageType模式
        //参数移位
        if(pageType !== undefined && -1 === typeFilter.indexOf(pageType)) {
            var temp = args;
            args = pageType;
            eachContext = temp;
            pageType = 'page';
        }
        //pageIndex为pageType参数
        if(-1 !== typeFilter.indexOf(args)) {
            pageType = args;
            args = null;
        }
        pageType = pageType || 'page';
        if(mgr[pageType]) {
            return callback(mgr[pageType], pageType, args, eachContext)
        } else {
            $$warn('传递到access的pageType错误！')
        }
    }
}


export function initSceneApi(vm) {
    let $globalEvent = vm.$globalEvent

    //页面与母版的管理器
    let access = createaAccess({
        page: vm.$dispatcher.pageMgr,
        master: vm.$dispatcher.masterMgr
    })

    extendPresentation(access, $globalEvent) //数据接口
    extendView(vm, access, $globalEvent) //视图接口
    extendAssist(access, $globalEvent) // 辅助对象
    extendContent(access, $globalEvent) //content对象
    extendApplication(access, $globalEvent) //app应用接口

    return function() {
        $globalEvent = null
        access = null
        vm = null
    }
}
