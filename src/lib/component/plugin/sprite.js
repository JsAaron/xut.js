/**
 * 2017.7.25
 * 1.高级精灵动画
 *   提供给widget使用
 *
 * 2.复杂精灵动画
 * 	 提供给普通转化高级使用
 */
let prefix = Xut.plat.prefixStyle

export default class {

    constructor(data, options) {

        this.data = data;
        //精灵动画类型 默认为高级精灵动画true 简单转复杂为false
        this.animationType = true;
        //高级精灵动画
        if (options.type == 'seniorSprite') {
            this.contentPrefix = options.contentPrefix;
            this.obj = $("#" + this.contentPrefix + this.data.framId);
            this.ResourcePath = options.resourcePath;
        }
        //简单精灵强制转换复杂精灵动画
        else {
            this.animationType = false;
            this.contentId = options.contentId;
            this.obj = $(options.ele);
            this.ResourcePath = "content/gallery/" + options.resourcePath + "/";
        }

        //resType:1没有蒙版 0：有蒙版
        this.resType = 1;
        this.curFPS = 0;
        this.timer = null;
        this.loop = 1;
        this.curLoop = 1;
        let params = this.data.params
        let action = this.action = params["actList"].split(",")[0]
        let pa = params[action];
        this.FPS = parseInt(pa.fps);
        this.playerType = (pa.playerType);
        //isSports:0非运动状态 isSports:1运动状态
        this.isSports = parseInt(pa.isSports);
        this.imageList = pa.ImageList;
        this.FPSCount = this.imageList.length;
        this.imgArray = new Array();

        if (this.playerType == "loop") {
            this.loop = 0;
        }

        this.init();
    }


    /**
     * 获取文件名
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    getFilename(name) {

        return name.substr(0, name.indexOf('.'));
    }


    /**
     * 资源(图片、MP3)预加载处理
     * @param  {[type]}   url      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    loadResource(url, callback) {
        let img = new Image();
        img.onload = function() {
            img.onload = null;
            if (typeof(callback) == "function") callback(img);
        }
        img.src = url;
        return img;
    }

    /**
     * 初始化
     * @return {[type]} [description]
     */
    init() {
        //判断是否运动状态
        if (this.isSports) {
            //初始化位置信息
            this.initPosition();
        }
        //初始化结构
        this.initStructure();
        this.curFPS++;
    }

    /**
     * 初始化位置信息
     * @return {[type]} [description]
     */
    initPosition() {
        let obj = this.obj;
        //初始化位置信息
        if (!this.initState) {
            let params = this.data.params;
            let action = this.action;
            this.startPoint = {
                x: this.imageList[0].X,
                y: this.imageList[0].Y,
                w: parseInt(params[action].width),
                h: parseInt(params[action].height)
            }

            this.xRote = parseInt(obj.css("width")) / this.startPoint.w;
            this.yRote = parseInt(obj.css("height")) / this.startPoint.h;
            this.startLeft = parseInt(obj.css("left"));
            this.startTop = parseInt(obj.css("top"));
            this.initState = true;
        }
    }

    /**
     * 初始化结构
     * @return {[type]} [description]
     */
    initStructure() {
        let obj = this.obj;
        let framId;
        if (this.animationType) {
            framId = this.data.framId
        } else {
            let contentId = this.contentId;
            framId = contentId + '_' + this.data.framId
        }

        let ResourcePath = this.ResourcePath;
        if (this.resType == 1) {
            let ret = ""
            ret += String.format(
                "<img" +
                " id='spImg_{0}'" +
                " src='{1}'" +
                " style='width:100%;height:100%;position:absolute;' />", framId, ResourcePath + this.imageList[0].name)
            obj.html(ret);
        } else {
            let filename = this.getFilename(this.imageList[0].name);
            let ret = ""
            ret += String.Foramt(
                "<div" +
                " id='spImg_{0}'" +
                " style='width:100%;height:100%;position:absolute;background: url({1}.jpg) no-repeat;background-size: 100% 100%;-webkit-mask: url({2}.png) no-repeat;-webkit-mask-size: 100% 100%;'></div>", framId, ResourcePath + filename, ResourcePath + filename)

            obj.append(ret);
        }
    }

    /**
     * 开始运行动画
     * @param  {[type]} action [description]
     * @param  {[type]} loop   [description]
     * @return {[type]}        [description]
     */
    startAnimation(action, loop) {
        this.action = action;
        if (!this.data.params[action]) {
            console.log(" Function changeSwitchAni  parameters " + action + " error");
            return;
        }

        this.loop = loop;
        this.curFPS = 0;
        clearTimeout(this.timer);

        if (this.animationType) {
            let imageList = this.imageList;
            //预加载图片
            this.imgArray = [];
            for (let i = 1; i < 6; i++) {
                if (i >= imageList.length) break;
                this.preloadImage(i);
            }
        }

        this.setAnimation();
    }

    /**
     * 设置动画运行状态
     */
    setAnimation() {
        //第一次循环结束
        if (this.curFPS >= this.FPSCount) {
            if (this.loop > 0) {
                if (this.animationType) {
                    //只播放loop次
                    if (this.curLoop >= this.loop) {
                        return;
                    } else {
                        this.curLoop++;
                        this.curFPS = 0;
                        this.time();
                    }
                } else {
                    return;
                }

            }
            //循环播放 
            else {
                this.curFPS = 0;
                this.time();
            }
        }
        //开始第一次循环 
        else {
            this.time();
        }
    }

    time() {
        var self = this;
        this.timer = setTimeout(function() {
            self.runAnimation();
            self.setAnimation();
        }, 1000 / self.FPS);
    }

    /**
     * 改变图片url
     * @return {[type]} [description]
     */
    changeImageUrl() {
        let imageList = this.imageList;
        let curFPS = imageList[this.curFPS];
        let ResourcePath = this.ResourcePath;
        let ele;
        if (this.animationType) {
            ele = $("#spImg_" + this.data.framId);
        } else {
            ele = $("#spImg_" + this.contentId + '_' + this.data.framId);
        }

        if (this.resType == 1) {
            let str = ResourcePath + curFPS.name
            ele.attr("src", str);
        } else {
            let filename = this.getFilename(curFPS.name);
            ele.css("background-image", "url(" + ResourcePath + filename + ".jpg)");
            ele.css("-webkit-mask-image", "url(" + ResourcePath + filename + ".png)");
        }

        if (this.animationType) {
            //预加载下下下帧资源
            this.imgArray.pop();
            if (this.resType != 1) this.imgArray.pop();
            let nextImgId = this.curFPS + 3;
            if (nextImgId < imageList.length) {
                this.preloadImage(nextImgId);
            }
        }


    }

    /**
     * 改变图片位置
     * @return {[type]} [description]
     */
    changePosition() {
        let imageList = this.imageList;
        let curFPS = imageList[this.curFPS];
        let x = curFPS.X - this.startPoint.x;
        let y = curFPS.Y - this.startPoint.y;

        this.obj.css("left", this.startLeft + x * this.xRote);
        this.obj.css("top", this.startTop + y * this.yRote);
    }

    /**
     * 预加载图片
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    preloadImage(index) {
        let imageList = this.imageList;
        let resourcePath = this.ResourcePath;
        if (this.resType == 1) {
            let img = this.loadResource(resourcePath + imageList[index].name, null);
            this.imgArray.unshift(img);
        } else {
            let filename = this.getFilename(imageList[index].name);
            let mask = this.loadResource(resourcePath + filename + ".png", null);
            let img = this.loadResource(resourcePath + filename + ".jpg", null);
            this.imgArray.unshift(img);
            this.imgArray.unshift(mask);
        }
    }

    /**
     * 运行动画
     * @return {[type]} [description]
     */
    runAnimation() {
        this.changeImageUrl();
        if (this.isSports) {
            this.changePosition();
        }
        this.curFPS++;
    }


    stop() {
        clearTimeout(this.timer);
        this.timer = null;
    }

    destroy() {
        this.stop();
        this.data.params = null;
        this.data = null;
    }


}
