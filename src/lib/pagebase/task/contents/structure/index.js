/**
 * 编译content的容器
 * 2013.10.12
 * 1 为处理重复content数据引用问题,增加
 * 			  makeWarpObj方法,用于隔绝content数据的引用关系，导致重复数据被修正的问题
 * 2 多个页面引用同一个content的处理，Conetnt_0_1 ,类型+页码+ID的标示
 * @return {[type]} [description]
 */

import { parseJSON, reviseSize, readFile } from '../../../../util/index'

import { parseCanvas } from './parsetype'
import { createContainer } from './container'
import { createDom } from './dom'
import { createCanvas } from './canvas'
import { parseContentDas } from './parsecontent'


/**
 * 解析序列中需要的数据
 * @param  {[type]}   contentIds [description]
 * @param  {Function} callback   [description]
 * @return {[type]}              [description]
 */


/**
 * 制作包装对象
 * 用于隔绝content数据的引用关系
 * 导致重复数据被修正的问题
 * @return {[type]}             [description]
 */
function makeWarpObj(contentId, content, pageType, pid, virtualOffset) {
    //唯一标示符
    var prefix = "_" + pid + "_" + contentId;
    return {
        pageType: pageType,
        contentId: contentId,
        isJs: /.js$/i.test(content.md5), //html类型
        isSvg: /.svg$/i.test(content.md5), //svg类型
        data: content,
        pid: pid,
        virtualOffset: virtualOffset, //布局位置
        containerName: 'Content' + prefix,
        makeId: function (name) {
            return name + prefix;
        }
    }
}


/**
 * 创建图片地址
 * @return {[type]}         [description]
 */
function analysisPath(wrapObj, conData) {
    var pathImg,
        imgContent = conData.md5,
        //是gif格式
        isGif = /.gif$/i.test(imgContent),
        //原始地址
        originalPathImg = Xut.config.pathAddress + imgContent;

    if (isGif) {
        //处理gif图片缓存+随机数
        pathImg = Xut.createRandomImg(originalPathImg)
    } else {
        pathImg = originalPathImg;
    }
    wrapObj['imgContent'] = imgContent;
    wrapObj['isGif'] = isGif;
    wrapObj['pathImg'] = pathImg;
}


/**
 * content
 * 	svg数据
 * 	html数据
 * 解析外部文件
 * @param  {[type]} wrapObj     [description]
 * @param  {[type]} svgCallback [description]
 * @return {[type]}             [description]
 */
function externalFile(wrapObj, svgCallback) {
    //svg零件不创建解析具体内容
    if (wrapObj.isSvg) {
        readFile(wrapObj.data.md5, function (svgdata) {
            wrapObj['svgstr'] = svgdata;
            svgCallback(wrapObj);
        });
    } else if (wrapObj.isJs) {
        //如果是.js的svg文件
        readFile(wrapObj.data.md5, function (htmldata) {
            wrapObj['htmlstr'] = htmldata;
            svgCallback(wrapObj);
        }, "js");
    } else {
        svgCallback(wrapObj);
    }
}



//=====================================================
//
//	构建content的序列tokens
//	createImageIds,
//	createContentIds
//	pid,
//	pageType,
//	dydCreate //重要判断,动态创建
//
//=======================================================
export function structure(callback, data, context) {
    var content,
        contentId,
        wrapObj,
        containerObj,
        sizeResults,
        contentCollection,
        contentCount,
        cloneContentCount,
        pid = data.pid,
        pageType = data.pageType,
        containerRelated = data.containerRelated,
        seasonRelated = data.seasonRelated,
        isMaster = pageType === 'master',

        //容器li生成的位置
        //left,right
        virtualOffset = data.virtualOffset,

        ////////////
        //浮动处理 //
        //1.浮动母版对象
        //2.浮动页面对象
        ////////////
        floatMaters = data.floatMaters,
        floatPages = data.floatPages,

        //文本框
        //2016.1.7
        contentHtmlBoxIds = [],

        //所有content的id记录
        //返回出去给ibooks预编译使用
        idFix = [],

        //缓存contentDas
        contentDas = {},
        //缓存content结构
        cachedContentStr = [];



    /**
     * 容器结构创建 
     */
    if (containerRelated && containerRelated.length) {
        containerObj = createContainer(containerRelated, pid);
    }


    /**
     * 转化canvas模式 contentMode 0/1
     * 页面或者母板浮动对象
     * 页面是最顶级的
     * @return {[type]}           [description]
     */
    var eachPara = function (parameter, contentId, conData) {
        var zIndex;
        _.each(parameter, function (para) {
            //针对母版content的topmost数据处理，找出浮动的对象Id
            //排除数据topmost为0的处理
            zIndex = para['topmost']
            if (zIndex && zIndex != 0) {
                if (isMaster) {
                    //收集浮动的母版对象id
                    floatMaters.ids.push(contentId)
                    floatMaters.zIndex[contentId] = zIndex
                } else {
                    //浮动页面
                    floatPages.ids.push(contentId)
                    floatPages.zIndex[contentId] = zIndex
                }
            }
        })
    }



    /**
     * 开始过滤参数
     * @return {[type]}           [description]
     */
    var prefilter = function (conData, contentId) {
        var eventId, parameter;
        var category = conData.category;

        //如果是模板书签，强制为浮动对象
        if (isMaster && (eventId = seasonRelated[contentId])) {
            if (eventId['BookMarks']) {
                floatMaters.ids.push(contentId)
            }
        }

        //如果有parameter参数
        //1 浮动对象
        //2 canvas对象
        if (conData) {
            //匹配canvas对象数据
            if (category) {
                //解析canvas先关数据
                parseCanvas(contentId, category, conData, data)
            }
            //如果有parameter
            if (conData.parameter) {
                if (parameter = parseJSON(conData.parameter)) {
                    //parameter保持数组格式
                    eachPara(parameter.length ? parameter : [parameter], contentId, conData)
                }
            }
        }
    }

    /**
     * 解析出每一个content对应的动作
     * 传递prefilter过滤器
     * 1 浮动动作
     * 2 canvas动作
     * @type {[type]}
     */
    contentCollection = parseContentDas(data.createContentIds, prefilter);
    contentCount = cloneContentCount = contentCollection.length;


    //如果是启动了特殊高精灵动画
    //强制打开canvas模式设置
    //这里可以排除掉其余的canvas动画
    if (data.canvasRelated.onlyCompSprite) {
        data.canvasRelated.enable = true
    }

    ////////////////
    //开始生成所有的节点 //
    //1:dom
    //2:canvas
    ////////////////
    while (contentCount--) {

        //根据数据创content结构
        if (content = contentCollection[contentCount]) {
            contentId = content['_id'];

            //创建包装器,处理数据引用关系
            wrapObj = makeWarpObj(contentId, content, pageType, pid, virtualOffset);
            idFix.push(wrapObj.containerName)

            //保存文本框content的Id
            if (wrapObj.isJs) {
                contentHtmlBoxIds.push(contentId)
            }
            //转换缩放比
            sizeResults = reviseSize(wrapObj.data);

            //如果启用了virtualMode模式
            //对象需要分离创建
            if (Xut.config.virtualMode) {
                virtualCreate(sizeResults, wrapObj, content, contentId);
            } else {
                //正常模式下创建
                startCreate(wrapObj, content, contentId)
            }
        } else {
            //或者数据出错
            checkComplete();
        }
    }


    //开始创建节点
    function startCreate(wrapObj, content, contentId) {
        //缓存数据
        contentDas[contentId] = content;
        //开始创建
        createRelated(contentId, wrapObj)
    }


    /**
     * 清理剔除的content
     * @param  {[type]} contentId [description]
     * @return {[type]}           [description]
     */
    function clearContent(contentId) {
        data.createContentIds.splice(data.createContentIds.indexOf(contentId), 1);
        checkComplete();
    }


    /**
     * 虚拟模式区分创建
     * @param  {[type]} sizeResults [description]
     * @param  {[type]} wrapObj     [description]
     * @param  {[type]} content     [description]
     * @param  {[type]} contentId   [description]
     * @return {[type]}             [description]
     */
    function virtualCreate(sizeResults, wrapObj, content, contentId) {
        // 创建分布左边的对象
        if (wrapObj.virtualOffset === 'left') {
            if (sizeResults.scaleLeft < Xut.config.screenSize.width) {
                startCreate(wrapObj, content, contentId)
            } else {
                clearContent(contentId)
            }
        }
        // 创建分布右边的对象
        if (wrapObj.virtualOffset === 'right') {
            if (sizeResults.scaleLeft > Xut.config.screenSize.width) {
                startCreate(wrapObj, content, contentId)
            } else {
                clearContent(contentId)
            }
        }
    }


    /**
     * 创建content节点
     * @param  {[type]} wrapObj [description]
     * @return {[type]}         [description]
     */
    function createRelated(contentId, wrapObj) {
        //解析外部文件
        externalFile(wrapObj, function (wrapObj) {
            var uuid,
                startStr,
                contentStr,
                conData = wrapObj.data;

            //拼接地址
            analysisPath(wrapObj, conData)

            //canvas节点
            if (conData.canvasMode) {
                contentStr = createCanvas(conData, wrapObj)
            } else {
                //dom节点
                contentStr = createDom(conData, wrapObj)
            }

            //如果创建的是容器对象
            if (containerObj && (uuid = containerObj[contentId])) {
                startStr = containerObj[uuid];
                startStr.start.push(contentStr)
            } else {
                //普通对象
                cachedContentStr.unshift(contentStr);
            }

            //检测完毕
            checkComplete();
        });
    }

    /**
     * 返回处理
     * @return {[type]} [description]
     */
    function checkComplete() {
        if (cloneContentCount === 1) {
            var data = {
                contentDas: contentDas,
                idFix: idFix,
                contentHtmlBoxIds: contentHtmlBoxIds,
                containerPrefix: ''
            } 
            //针对容器处理
            if (containerObj) {
                var start,
                    end,
                    containerPrefix,
                    containerStr = [];
                //合并容器
                containerObj.createUUID.forEach(function (uuid) {
                    start = containerObj[uuid].start.join('');
                    end = containerObj[uuid].end;
                    containerStr.push(start.concat(end));
                })
                containerStr = containerStr.join('');
                containerPrefix = containerObj.containerName;
                containerObj = null;

                data.contentStr = cachedContentStr.join('').concat(containerStr)
                data.containerPrefix = containerPrefix
            } else {
                data.contentStr = cachedContentStr.join('')
            }
            callback.call(context, data)
        }
        cloneContentCount--;
    }

}


/**
 * 针对分段处理
 * 只构件必要的节点节点对象
 * content字段中visible === 0 是构建显示的对象
 * 					 	=== 1 是构建隐藏的对象
 *
 * 并且不是动态创建
 */
// if (false && (1 == content.visible) && !data.dydCreate) {
// endReturn();  //false 先屏蔽 ，客户端未实现
// }else{}
