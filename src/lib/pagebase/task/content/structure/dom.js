

import { parseJSON } from '../../../../util/index'


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
            var parameter = parseJSON(data.parameter);
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
 * 组成HTML结构
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
export function createDom(data, wrapObj) {
    var restr = '';
    //创建包装容器
    restr += createWapper(data, wrapObj);
    //创建内容
    restr += createContent(data, wrapObj);
    restr += "</div></div>";
    return restr;
}
