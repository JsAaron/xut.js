/**
 * 编译content的容器
 * 2013.10.12
 * 1 为处理重复content数据引用问题,增加
 * 			  makeWarpObj方法,用于隔绝content数据的引用关系，导致重复数据被修正的问题
 * 2 多个页面引用同一个content的处理，Conetnt_0_1 ,类型+页码+ID的标示
 * @return {[type]} [description]
 */

import { parseJSON, arrayUnique ,reviseSize,readFile} from '../../../util/index'

import { Container as pixiContainer } from '../../../component/pixi/Container'

let prefix = Xut.plat.prefixStyle;

/**
 * 解析序列中需要的数据
 * @param  {[type]}   contentIds [description]
 * @param  {Function} callback   [description]
 * @return {[type]}              [description]
 */
function parseContentDas(contentIds, callback) {
    var data, temp = [];
    contentIds.forEach(function(contentId, index) {
        data = Xut.data.query('Content', contentId)
        temp.unshift(data)
        callback && callback(data, contentId);
    })
    return temp;
}

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
        makeId: function(name) {
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
 * 组成HTML结构
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
function createDom(data, wrapObj) {
    var restr = '';
    //创建包装容器
    restr += createWapper(data, wrapObj);
    //创建内容
    restr += createContent(data, wrapObj);
    restr += "</div></div>";
    return restr;
}


/**
 * 创建包含容器
 * @param  {[type]} data    [description]
 * @param  {[type]} wrapObj [description]
 * @return {[type]}         [description]
 */
function createWapper(data, wrapObj) {
    var wapper, actName, offset, visibility,
        backwidth, backheight, backleft, backtop,
        zIndex = data['zIndex'],
        id = data['_id'],
        containerName = wrapObj.containerName,
        pid = wrapObj.pid,
        makeId = wrapObj.makeId,
        background = data.background ? 'background-image: url(' + Xut.config.pathAddress + data.background + ');' : '';

    //背景尺寸优先
    if (data.scaleBackWidth && data.scaleBackHeight) {
        backwidth = data.scaleBackWidth;
        backheight = data.scaleBackHeight;
        backleft = data.scaleBackLeft;
        backtop = data.scaleBackTop;
        wrapObj.backMode = true //背景图模式
    } else {
        backwidth = data.scaleWidth;
        backheight = data.scaleHeight;
        backleft = data.scaleLeft;
        backtop = data.scaleTop;
    }

    //content默认是显示的数据的
    //content.visible = 0
    //如果为1 就隐藏改成hidden
    //05.1.14
    visibility = 'visible'
    if (data.visible) {
        visibility = 'hidden';
    }

    // var isHtml = "";
    //2015.12.29
    //如果是html内容
    if (wrapObj.isJs) {
        //正常content类型
        wapper = '<div id="{0}"' + ' data-behavior="click-swipe"' + ' style="overflow:hidden;width:{1}px;height:{2}px;top:{3}px;left:{4}px;position:absolute;z-index:{5};visibility:{6};background-size:100% 100%;{10}">' + ' <div id="{7}" style="width:{8}px;position:absolute;">';

        return String.format(wapper,
            containerName, backwidth, backheight, backtop, backleft, zIndex, visibility,
            makeId('contentWrapper'), backwidth, backheight, background
        );
    }

    //正常content类型
    wapper = '<div id="{0}"' + ' data-behavior="click-swipe"' + ' style="overflow:hidden;width:{1}px;height:{2}px;top:{3}px;left:{4}px;position:absolute;z-index:{5};visibility:{6};">' + ' <div id="{7}" style="width:{8}px;height:{9}px;{10}position:absolute;background-size:100% 100%;">';


    return String.format(wapper,
        containerName, backwidth, backheight, backtop, backleft, zIndex, visibility,
        makeId('contentWrapper'), backwidth, backheight, background
    );
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
        readFile(wrapObj.data.md5, function(svgdata) {
            wrapObj['svgstr'] = svgdata;
            svgCallback(wrapObj);
        });
    } else if (wrapObj.isJs) {
        //如果是.js的svg文件
        readFile(wrapObj.data.md5, function(htmldata) {
            wrapObj['htmlstr'] = htmldata;
            svgCallback(wrapObj);
        }, "js");
    } else {
        svgCallback(wrapObj);
    }
}

/**
 * 创建内容
 * @param  {[type]} data    [description]
 * @param  {[type]} wrapObj [description]
 * @return {[type]}         [description]
 */
function createContent(data, wrapObj) {
    var restr = "";
    //如果内容是图片
    //如果是svg或者html
    if (wrapObj.imgContent) {
        //如果是SVG
        if (wrapObj.isSvg) {
            restr += svgContent(data, wrapObj);
        } else if (wrapObj.isJs) {
            //如果是.js结构的html文件
            restr += jsContent(data, wrapObj)
        } else {
            //如果是蒙板，或者是gif类型的动画，给高度
            restr += maskContent(data, wrapObj);
        }
    } else {
        //纯文本文字
        restr += textContent(data, wrapObj);
    }
    return restr;
}


/**
 * 如果是.js结尾的
 * 新增的html文件
 * @param  {[type]} data    [description]
 * @param  {[type]} wrapObj [description]
 * @return {[type]}         [description]
 */
function jsContent(data, wrapObj) {
    return wrapObj["htmlstr"];
}

/**
 * 如果内容是svg
 * @param  {[type]} data    [description]
 * @param  {[type]} wrapObj [description]
 * @return {[type]}         [description]
 */
function svgContent(data, wrapObj) {
    var restr = "",
        svgstr = wrapObj['svgstr'],
        scaleWidth = data['scaleWidth'];

    //从SVG文件中，读取Viewport的值
    if (svgstr != undefined) {
        var startPos = svgstr.search('viewBox="');
        var searchTmp = svgstr.substring(startPos, startPos + 64).replace('viewBox="', '').replace('0 0 ', '');
        var endPos = searchTmp.search('"');
        var temp = searchTmp.substring(0, endPos);
        var sptArray = temp.split(" ");
        var svgwidth = sptArray[0];
        var svgheight = sptArray[1];

        //svg内容宽度:svg内容高度 = viewBox宽:viewBox高
        //svg内容高度 = svg内容宽度 * viewBox高 / viewBox宽
        var svgRealHeight = Math.floor(scaleWidth * svgheight / svgwidth);
        //如果svg内容高度大于布局高度则添加滚动条
        if (svgRealHeight > (data.scaleHeight + 1)) {
            var svgRealWidth = Math.floor(scaleWidth);
            //if there do need scrollbar, then restore text to its original prop
            //布局位置
            var marginleft = wrapObj['backMode'] ? data.scaleLeft - data.scaleBackLeft : 0;
            var margintop = wrapObj['backMode'] ? data.scaleTop - data.scaleBackTop : 0;
            temp = '<div style="width:{0}; height:{1};margin-left:{2}px;margin-top:{3}px;">{4}</div>';

            if (data.isScroll) {
                restr = String.format(temp, svgRealWidth + 'px', svgRealHeight + 'px', marginleft, margintop, svgstr);
            } else {
                restr = String.format(temp, '100%', '100%', marginleft, margintop, svgstr);
            }
        } else {
            restr += svgstr;
        }
    }
    return restr;
}

/**
 * 蒙版动画
 * @param  {[type]} data    [description]
 * @param  {[type]} wrapObj [description]
 * @return {[type]}         [description]
 */
function maskContent(data, wrapObj) {

    var restr = "",
        //如果有蒙版图
        isMaskImg = data.mask ? prefix('mask-box-image') + ":url(" + Xut.config.pathAddress + data.mask + ");" : "";

    //蒙板图
    if (data.mask || wrapObj['isGif']) {
        //蒙版图
        if (prefix('mask-box-image') != undefined) {
            restr += String.format(
                '<img' + ' id="img_{1}"' + ' class="contentScrollerImg"' + ' src="{0}"' + ' style="width:{2}px;height:{3}px;position:absolute;background-size:100% 100%;{4}"/>',
                wrapObj['pathImg'], data['_id'], data.scaleWidth, data.scaleHeight, isMaskImg
            );
        } else {
            //canvas
            restr += String.format(
                ' <canvas src="{0}"' + ' class="contentScrollerImg edges"' + ' mask="{5}"' + ' id = "img_{1}"' + ' width="{2}"' + ' height="{3}"' + ' style="width:{2}px; height:{3}px;opacity:0; background-size:100% 100%; {4}"' + ' />',
                wrapObj['pathImg'], data['_id'], data.scaleWidth, data.scaleHeight, isMaskImg, Xut.config.pathAddress.replace(/\//g, "\/") + data.mask);
        }
        //精灵图
    } else if (data.category == 'Sprite') {

        var matrixX = 100 * data.thecount;
        var matrixY = 100;

        //如果有参数
        //精灵图是矩阵图
        if (data.parameter) {
            var parameter = Utils.parseJSON(data.parameter);
            if (parameter && parameter.matrix) {
                var matrix = parameter.matrix.split("-")
                matrixX = 100 * Number(matrix[0])
                matrixY = 100 * Number(matrix[1])
            }
        }
        restr += String.format(
            '<div' + ' class="sprite"' + ' style="height:{0}px;background-image:url({1});background-size:{2}% {3}%;"></div>',
            data.scaleHeight, wrapObj['pathImg'], matrixX, matrixY
        );

    } else {
        //普通图片
        restr += String.format(
            '<img' + ' src="{0}"' + ' class="contentScrollerImg"' + ' id="img_{1}"' + ' style="width:{2}px;height:{3}px;position:absolute;background-size:100% 100%; {4}"/>',
            wrapObj['pathImg'], data['_id'], data.scaleWidth, data.scaleHeight, isMaskImg
        );
    }

    return restr;
}

/**
 * 纯文本内容
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function textContent(data) {
    return String.format(
        '<div' + ' id = "{0}"' + ' style="background-size:100% 100%;height:auto">{1}</div>',
        data['_id'], data.content
    )
}


/**
 * 针对容器类型的处理
 * @param  {[type]} containerName [description]
 * @param  {[type]} contentId     [description]
 * @param  {[type]} pid     [description]
 * @return {[type]}               [description]
 */
function createContainerWrap(containerName, contentId, pid) {
    var contentDas = parseContentDas([contentId]),
        data = reviseSize(contentDas[0]),
        wapper = '<div' + ' id="{0}"' + ' data-behavior="click-swipe"' + ' style="width:{1}px;height:{2}px;top:{3}px;left:{4}px;position:absolute;z-index:{5};">';

    return String.format(wapper,
        containerName, data.scaleWidth, data.scaleHeight, data.scaleTop, data.scaleLeft, data.zIndex)
}

function createContainer(containerRelated, pid) {
    var itemIds, uuid, contentId,
        containerName,
        containerObj = {
            createUUID: [],
            containerName: []
        };
    containerRelated.forEach(function(data, index) {
        contentId = data.imageIds;
        containerName = "Container_" + pid + "_" + contentId,
            uuid = "aaron" + Math.random();
        containerObj[uuid] = {
            'start': [createContainerWrap(containerName, contentId, pid)],
            'end': '</div>'
        };
        containerObj.createUUID.push(uuid);
        containerObj.containerName.push(containerName);
        data.itemIds.forEach(function(id) {
            containerObj[id] = uuid;
        })
    })
    return containerObj;
}


//=====================================================
//
//	构建content的序列tokens
//	createImageIds,
//	containerRelated,
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
        createImageIds = data.createImageIds,
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

        //默认canvas容器的层级
        //取精灵动画最高层级
        //2016.2.25
        canvasIndex = 1,

        //缓存contentDas
        contentDas = {},
        //缓存content结构
        cachedContentStr = [];


    //启动cnavas模式
    var canvasRelatedMode = data.canvasRelated.enable;


    //容器结构创建 
    if (containerRelated && containerRelated.length) {
        containerObj = createContainer(containerRelated, pid);
    }


    //========================================
    //
    //	    创建dom结构
    //
    //========================================


    /**
     * 转化canvas模式 contentMode 0/1
     * 页面或者母板浮动对象
     * 页面是最顶级的
     * @return {[type]}           [description]
     */
    var eachPara = function(parameter, contentId, conData) {
        var zIndex;
        _.each(parameter, function(para) {
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
     * 设置canvas数据
     */
    var createCanvasData = function(type, contentId, conData) {
        //content收集id标记
        //cid =>content=> 普通动画 ppt
        //wid =>widget=>高级动画 
        if (data.canvasRelated[type].indexOf(contentId) == -1) {
            data.canvasRelated[type].push(contentId);
            conData.actionTypes[type] = true;
        }

        if (data.canvasRelated.cid.indexOf(contentId) == -1) {
            data.canvasRelated.cid.push(contentId);
        }

        //给content数据增加直接判断标示
        conData.canvasMode = true;

        //拿到最高层级
        if (conData.zIndex) {
            if (conData.zIndex > canvasIndex) {
                canvasIndex = conData.zIndex;
            }
        }
    }

    /**
     * canvas pixi.js类型处理转化
     * 填充cid, wid
     * @type {Object}
     */
    var pixiType = {
        //普通精灵动画
        "Sprite": function(contentId, conData) {
            //启动精灵模式
            //在动画处理的时候给initAnimations快速调用
            createCanvasData('spiritId', contentId, conData)
        },
        //ppt=》pixi动画
        "PPT": function(contentId, conData) {
            createCanvasData('pptId', contentId, conData)
        },
        //高级精灵动画
        //widget
        "SeniorSprite": function(contentId, conData) {
            createCanvasData('widgetId', contentId, conData)
        },
    }


    /**
     * 开始过滤参数
     * @return {[type]}           [description]
     */
    var prefilter = function(conData, contentId) {
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
            //转成canvas标记
            //如果有pixi的处理类型
            //2016.2.25
            //SeniorSprite,PPT
            //Sprite,PPT
            //SeniorSprite
            //Sprite
            //PPT
            //5种处理方式
            //可以组合
            if (canvasRelatedMode && category) {
                var _cat;
                var cat;
                var _cats = category.split(",");
                var i = _cats.length;
                //动作类型
                conData.actionTypes = {};
                if (i) {
                    while (i--) {
                        cat = _cats[i]
                            //匹配数据类型
                        pixiType[cat] && pixiType[cat](contentId, conData)
                    }
                }
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

    //创建canvas画布 
    if (canvasRelatedMode) {
        pixiContainer(data, canvasIndex)
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
        externalFile(wrapObj, function(wrapObj) {
            var uuid,
                startStr,
                contentStr,
                conData = wrapObj.data;

            //拼接地址
            analysisPath(wrapObj, conData)

            //dom模式下生成dom节点
            //canvas模式下不处理，因为要合并到pixi场景中
            if (!conData.canvasMode) {
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
            //针对容器处理
            if (containerObj) {
                var start, end,
                    containerStr = [];
                //合并容器
                containerObj.createUUID.forEach(function(uuid) {
                    start = containerObj[uuid].start.join('');
                    end = containerObj[uuid].end;
                    containerStr.push(start.concat(end));
                })
                containerStr = containerStr.join('');
                containerName = containerObj.containerName;
                containerObj = null;
                callback.call(context, contentDas, cachedContentStr.join('').concat(containerStr), containerName, idFix, contentHtmlBoxIds);
            } else {
                callback.call(context, contentDas, cachedContentStr.join(''), '', idFix, contentHtmlBoxIds);
            }
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
