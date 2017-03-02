import { errorTable } from '../../../database/cache'
import { query } from '../../../database/query'

/**
 * 判断是否能整除2
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
export function offsetPage(num) {
    return ((num % 2 == 0) ? 'left' : 'right');
}


/**
 * 页面之间关系
 * @param  {[type]} createIndex [description]
 * @param  {[type]} currIndex   [description]
 * @return {[type]}             [description]
 */
export function getDirection(createIndex, currIndex) {
    let direction
    if (createIndex < currIndex) {
        direction = 'before'
    } else if (createIndex > currIndex) {
        direction = 'after'
    } else if (currIndex == createIndex) {
        direction = 'middle'
    }
    return direction
}

const mixRang = function(pageIndex, start) {
    return pageIndex.map(oldPageIndex => {
        return oldPageIndex - start
    })
}


/**
 * 如果是场景加载，转化页码数
 * 转化按0开始
 * pageIndex 页码
 * visiblePid 可见页面chpaterId
 */
export function converVisiblePid(pageIndex, visiblePid) {
    //转化可视区域值viewPageIndex
    if (this.options.multiScenario) {
        let sectionRang = this.options.sectionRang;
        //如果传入的是数组数据
        if (!visiblePid && _.isArray(pageIndex)) {
            return mixRang(pageIndex, sectionRang.start)
        }
        pageIndex -= sectionRang.start
        visiblePid += sectionRang.start
    } else {
        //pageIndex是数组，并且realPage为空
        if (_.isArray(pageIndex)) {
            return pageIndex
        }
    }

    return {
        pageIndex,
        visiblePid
    }
}



/**
 * 计算初始化页码
 */
export function initPointer(targetIndex, pageTotal, multiplePages) {

    var leftscope = 0,
        initPointer = {},
        createPointer = [];

    function setValue(index) {
        if (index.leftIndex !== undefined) {
            initPointer.leftIndex = index.leftIndex;
            createPointer.push(index.leftIndex)
        }
        if (index.currIndex !== undefined) {
            initPointer.currIndex = index.currIndex;
            createPointer.push(index.currIndex)
        }
        if (index.rightIndex !== undefined) {
            initPointer.rightIndex = index.rightIndex;
            createPointer.push(index.rightIndex)
        }
    }

    //如果只有一页 or  非线性,只创建一个页面
    if (pageTotal === 1 || !multiplePages) {
        setValue({
            'currIndex': targetIndex
        })
    } else {
        //多页情况
        if (targetIndex === leftscope) { //首页
            setValue({
                'currIndex': targetIndex,
                'rightIndex': targetIndex + 1
            })
        } else if (targetIndex === pageTotal - 1) { //尾页
            setValue({
                'currIndex': targetIndex,
                'leftIndex': targetIndex - 1
            })
        } else { //中间页
            setValue({
                'currIndex': targetIndex,
                'leftIndex': targetIndex - 1,
                'rightIndex': targetIndex + 1
            })
        }
    }


    return {
        createPointer,
        initPointer
    }
}



/**
 * 索引转化成chapter ID
 * 确保解析的正确排序
 * 保证可视页面第一个分解
 * createPage 需要创建的页面 [0,1,2]
 * visualPage 可视区页面       [1]
 * @param  {[type]} createPage [description]
 * @param  {[type]} visualPage [description]
 * @return {[type]}            [description]
 */
export function indexConverChapterId(createPage, visualPage) {

    //如果第一个不是可视区域
    //切换位置
    //加快创建速度
    if (createPage[0] !== visualPage) {
        const indexOf = createPage.indexOf(visualPage)
        const less = createPage.splice(indexOf, 1)
        createPage = less.concat(createPage)
    }

    //场景加载模式,计算正确的chapter顺序
    //多场景的模式chpater分段后
    //叠加起始段落
    if (this.options.multiScenario) {
        //需要提前解析数据库的排列方式
        //chpater的开始位置
        const start = this.options.sectionRang.start
            //拼接位置
        createPage.forEach(function(page, index) {
            createPage.splice(index, 1, page + start)
        })
    }

    // [0,1,2] => [73,74,75]
    return createPage;
}


/**
 * 页码转化成相对应的chpater表数据
 * @param  {[type]} createPage [description]
 * @return {[type]}            [description]
 */
export function indexConverChapterData(createPage) {
    return query('chapter', createPage);
}


/**
 * 检测是否构建母板模块处理
 * @return {[type]} [description]
 */
export function hasMaster() {
    var table = errorTable()
        //如果没有Master数据,直接过滤
    if (-1 !== table.indexOf('Master') || !Xut.data['Master'] || !Xut.data['Master'].length) {
        return false;
    }
    return true;
}
