
import {readFile} from '../../util/option'


/**
 *	创建背景
 */

var prefix = Xut.plat.prefixStyle;

/**
 * 构建背景类
 * @param {[type]} rootNode             [根节点]
 * @param {[type]} data                 [数据]
 * @param {[type]} suspendCallback      [中断回调]
 * @param {[type]} successCallback      [description]
 */
function TaskBackground(rootNode, data, suspendCallback, successCallback) {
    var layer,
        suspendTasks,
        nextTasks,
        self = this,
        content = data["md5"],
        isSVGContent = /.svg$/i.test(content) ? true : false;

    this.callback = {
        'suspendCallback': suspendCallback,
        'successCallback': successCallback
    }


    //iboosk节点预编译
    //在执行的时候节点已经存在
    //不需要在创建
    if (Xut.IBooks.runMode()) {
        //找到背景节点
        var $element = rootNode.find('.multilayer');
        successCallback()
        return;
    }


    //背景是否需要SVG解析
    this.parseMaster(isSVGContent, content, createWarpper);
    //构建背景
    function createWarpper(svgContents) {
        var backgroundStr = createMaster(svgContents, data);
        if (backgroundStr) {
            svgContents = null;
            self.compileSuspend($(backgroundStr), rootNode);
        } else {
            successCallback();
        }
    }

}


TaskBackground.prototype = {

    clearReference: function() {},

    //构建中断函数
    compileSuspend: function($background, rootNode) {

        var nextTasks, suspendTasks,
            self = this;

        //继续执行
        nextTasks = function() {
            Xut.nextTick({
                'container': rootNode,
                'content': $background
            }, function() {
                self.clearReference();
                self.callback.successCallback();
            });
        }

        //中断方法
        suspendTasks = function() {
            self.suspendQueues = [];
            self.suspendQueues.push(function() {
                nextTasks()
            })
        }
        self.callback.suspendCallback(nextTasks, suspendTasks);
    },

    //运行被阻断的线程任务
    runSuspendTasks: function() {
        if (this.suspendQueues) {
            var fn;
            if (fn = this.suspendQueues.pop()) {
                fn();
            }
            this.suspendQueues = null;
        }
    },

    //解析SVG背景
    parseMaster: function(isSVGContent, content, callback) {
        if (isSVGContent) { //背景需要SVG解析的
            readFile(content, function(svgContents) {
                callback(svgContents);
            });
        } else {
            callback('');
        }
    }
}



/**
 * 修正尺寸
 * @return {[type]} [description]
 */

function fixSize(data) {
    //缩放比
	var proportion   = Xut.config.proportion;
	data.path        = Xut.config.pathAddress;
	data.imageWidth  = data.imageWidth * proportion.width;
	data.imageHeight = data.imageHeight * proportion.height;
	data.imageLeft   = data.imageLeft * proportion.left;
	data.imageTop    = data.imageTop * proportion.top;
}


/*********************************************************************
 *                创建分层背景图层
 *                master               - 母版
 *                imageLayer,imageMask - 图像层图
 *                md5                  - 文字层图                                                                                     *
 **********************************************************************/

function createMaster(svgContent, data) {
    var imageLayer, maskLayer, restr = '',
        imageLayerData = data["imageLayer"], //图片层
        imageMaskData = data["imageMask"], //蒙版层
        backImageData = data["backImage"], //真实图片层
        backMaskData = data["backMask"], //真实蒙版层
        masterData = data["master"], //母板
        backText = data['md5'], //背景文字
        pptMaster = data['pptMaster']; //母板PPTID


    //=======================未分层结构===========================
    //
    //		 只有SVG数据，没有层次数据 ,不是视觉差
    //
    // ============================================================
    if (backText && !masterData && !pptMaster && !imageLayerData) {
        return svgContent ? '<div class="multilayer" data-multilayer ="true" style="width:100%; height:100%;position:absolute;left:0;top:0;z-index:0;">' + svgContent + '</div>' : '';
    }

    //=========================分层结构============================
    //
    //   1 分母板 文字层 背景 蒙版
    //   2 视觉差分层处理
    //
    //=============================================================

    //修正尺寸
    fixSize(data);

    //============= 组层背景图开始 ====================

    restr = '<div class="multilayer" data-multilayer ="true" style="width:100%; height:100%;position:absolute;left:0;top:0;z-index:0;">';

    //如果有母板数据,如果不是视觉差
    if (masterData && !pptMaster) {
        //母版图
        restr += '<div class="master" style="width:100%; height:100%;background-size:100% 100%;position:absolute;z-index:0;background-image:url({0});"></div>';
    }

    //存在背景图
    if (imageLayerData) {
        //蒙版图（与背景图是组合关系）
        maskLayer = data["imageMask"] ? prefix("mask-box-image") + ":url(" + data.path + data["imageMask"] + ");" : "";
        //图片层
        restr += '<div class="imageLayer" style="width:{1}px;height:{2}px;top:{3}px;left:{4}px;position:absolute;z-index:2;background-size:100% 100%;background-image:url({5});{6};"></div>';
    }

    //新增的 真实背景图 默认全屏
    if (backImageData) {
        //计算出对页排版偏移值
        var backImageOffset = (function() {
            var background,
                pageSide = data['pageSide'];

            switch (Number(pageSide)) {
                case 1:
                    background = 'background-position:0';
                    break
                case 2:
                    background = 'background-position:' + Xut.config.screenSize.width + 'px';
                    break
            }

            return background;
        })();

        if (backMaskData) {
            //带蒙版
            if (prefix('mask-box-image') != undefined) {
                restr += '<div class="backImage" style="width:{7};height:100%;position:absolute;z-index:1;background-size:100% 100%;background-image:url(' + data.path + backImageData + ');' + prefix('mask-box-image') + ':url(' + data.path + backMaskData + ');{8}"></div>';
            } else {
                restr += '<canvas class="backImage edges" height=' + document.body.clientHeight + ' width=' + document.body.clientWidth + '  style="width:{7};opacity:0;height:100%;background-size:100% 100%;position:absolute;z-index:1;-webkit-mask-box-image:url(' + data.path + backMaskData + ');{8}" src=' + data.path + backImageData + ' mask=' + data.path + backMaskData + '></canvas>';
            }
        } else {
            //图片层
            restr += '<div class="backImage" style="width:{7};height:100%;position:absolute;z-index:1;background-size:100% 100%;background-image:url(' + data.path + backImageData + ');{8}"></div>';
        }
    }

    //存在svg文字
    if (backText) {
        restr += '<div class="words" style="width:100%;height:100%;top:0;left:0;position:absolute;z-index:3;">{9}</div>';
    }

    restr += '</div>';

    //============= 组层背景图结束 ====================

    return String.format(restr,
        data.path + masterData,
        data.imageWidth, data.imageHeight, data.imageTop, data.imageLeft, data.path + imageLayerData, maskLayer, backImageOffset ? '200%' : '100%', backImageOffset ? backImageOffset : '',
        svgContent);
}



export {TaskBackground}
