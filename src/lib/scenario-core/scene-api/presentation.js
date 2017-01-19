/********************************************
 * 场景API
 * 数据接口。和电子杂志的数据相关的接口，都在这里。
 ********************************************/
import { $$warn } from '../../util/debug'
/**
 * 命名前缀
 * @type {String}
 */
const prefix = 'Content_';

/**
 * 判断是否存在页码索引
 * 如果不存在默认取当前页面
 */
const createExistIndex = ($globalEvent) => {
    return(pageIndex) => {
        //如果不存在
        if(pageIndex == undefined) {
            pageIndex = $globalEvent.getHindex() //当前页面
        }
        return pageIndex
    }
}


export function extendPresentation(access, $globalEvent) {

    let isExistIndex = createExistIndex($globalEvent);

    /**
     * 获取当前页码
     */
    Xut.Presentation.GetPageIndex = () => $globalEvent.getHindex()

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
        Xut.Presentation[apiName] = (pageType, pageIndex) => {
            return access((manager, pageType, pageIndex) => {
                pageIndex = isExistIndex(pageIndex)
                return manager["abstract" + apiName](pageIndex, pageType)
            }, pageType, pageIndex)
        }
    })

    /**
     * 获取页面的总数据
     * 1 chapter数据
     * 2 section数据
     * @return {[type]}
     */
    _.each([
        "Section",
        "Page"
    ], (apiName) => {
        Xut.Presentation['GetApp' + apiName + 'Data'] = callback => {
            var i = 0,
                temp = [],
                cps = Xut.data.query('app' + apiName),
                cpsLength = cps.length;
            for(i; i < cpsLength; i++) {
                temp.push(cps.item(i))
            }
            return temp;
        }
    })

    /**
     * 获取首页的pageId
     * @param {[type]} seasonId [description]
     */
    Xut.Presentation.GetFirstPageId = (seasonId) => {
        var sectionRang = Xut.data.query('sectionRelated', seasonId);
        var pageData = Xut.data.query('appPage');
        return pageData.item(sectionRang.start);
    }

    /**
     * 得到页面根节点
     * li节点
     */
    Xut.Presentation.GetPageElement = () => {
        var obj = Xut.Presentation.GetPageObj()
        return obj.$pageNode
    }

    /**
     * 获取页面样式配置文件
     * @return {[type]} [description]
     */
    Xut.Presentation.GetPageStyle = (pageIndex) => {
        let pageBase = Xut.Presentation.GetPageObj(pageIndex)
        if(pageBase && pageBase.getStyle) {
            return pageBase.getStyle
        } else {
            $$warn('页面Style配置文件获取失败,pageIndex:' + pageIndex)
        }
    }

    /**
     * 获取页码标记
     * 因为非线性的关系，页面都是按chpater组合的
     * page_0
     * page_10
     * 但是每一个章节页面的索引是从0开始的
     * 区分pageIndex
     */
    Xut.Presentation.GetPagePrefix = (pageType, pageIndex) => {
        let pageObj = Xut.Presentation.GetPageObj(pageType, pageIndex);
        return pageObj.pid;
    }

    /**
     * 创建一个content的命名规则
     */
    Xut.Presentation.MakeContentPrefix = function(pageIndex) {
        return prefix + Xut.Presentation.GetPagePrefix(pageIndex) + "_";
    }

    /**
     * 获取命名规则
     */
    Xut.Presentation.GetContentName = function(id) {
        if(id) {
            return prefix + Xut.Presentation.GetPagePrefix() + "_" + id;
        } else {
            return prefix + Xut.Presentation.GetPagePrefix()
        }
    }


}
