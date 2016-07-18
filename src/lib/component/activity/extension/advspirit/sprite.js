/**
 *复杂精灵动画
 */
let prefix = Xut.plat.prefixStyle

export class AdvSpiritAni {
    constructor(contentId, data, element, path) {
        this.contentId = contentId;
        //resType:1没有蒙版 0：有蒙版
        this.resType = 1;
        this.data = data;
        this.curFPS = 0;
        this.timer = null;
        this.loop = 1;
        this.curLoop = 1;
        if (this.playerType == "loop") {
            this.loop = 0;
        }

        let params = this.data.params
        let action = this.action = params["actList"].split(",")[0]

        this.FPS = parseInt(params[action].fps);
        this.playerType = (params[action].playerType);
        //isSports:0非运动状态 isSports:1运动状态
        this.isSports = parseInt(params[action].isSports);
        this.imageList = params[action].ImageList;
        this.obj = $(element);
        this.FPSCount = this.imageList.length;
        this.ResourcePath = "content/gallery/" + path + "/";
        this.init();
    }

    getFilename(name) {
        return name.substr(0, name.indexOf('.'));
    }

    //初始化
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

    //初始化位置信息
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

    //初始化结构
    initStructure() {
        let obj = this.obj
        let contentId = this.contentId;
        if (this.resType == 1) {
            let ret = ""
            ret += String.format(
                "<img" +
                " id='spImg_{0}'" +
                " src='{1}'" +
                " style='width:100%;height:100%;position:absolute;' />", contentId + '_' + this.data.framId, this.ResourcePath + this.imageList[0].name)
            obj.html(ret);
        } else {
            var filename = this.getFilename(this.imageList[0].name);
            let ret = ""
            ret += String.Foramt(
                "<div" +
                " id='spImg_{0}'" +
                " style='width:100%;height:100%;position:absolute;background: url({1}.jpg) no-repeat;background-size: 100% 100%;-webkit-mask: url({2}.png) no-repeat;-webkit-mask-size: 100% 100%;'></div>", contentId + '_' + this.data.framId, this.ResourcePath + filename, this.ResourcePath + filename)

            obj.append(ret);
        }
    }

    //开始动画 设置参数
    startAnimation(action, loop) {
        this.action = action;
        if (!this.data.params[action]) {
            console.log(" Function startAnimation  parameters " + action + " error");
            return;
        }

        this.loop = loop;
        this.curFPS = 0;
        clearTimeout(this.timer);

        this.setAnimation();
    }

    //设置动画运行参数
    setAnimation() {
        //第一次循环结束
        if (this.curFPS >= this.FPSCount) {
            //只播放一次
            if (this.loop > 0) {
                return;
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


    //运行动画
    runAnimation() {
        this.changeImageUrl();

        if (this.isSports) {
            this.changeImagePosition();
        }
        this.curFPS++;
    }

    //切换图片src
    changeImageUrl() {
        let imageList = this.imageList;
        let curFPS = imageList[this.curFPS];
        let ele = $("#spImg_" + this.contentId + '_' + this.data.framId);
        let ResourcePath = this.ResourcePath;

        if (this.resType == 1) {
            let str = ResourcePath + curFPS.name
            ele.attr("src", str);
        } else {
            let filename = this.getFilename(curFPS.name);
            ele.css("background-image", "url(" + ResourcePath + filename + ".jpg)");
            ele.css("-webkit-mask-image", "url(" + ResourcePath + filename + ".png)");
        }
    }


    //切换图片位置
    changeImagePosition() {
        let imageList = this.imageList;
        let curFPS = imageList[this.curFPS];
        let x = curFPS.X - this.startPoint.x;
        let y = curFPS.Y - this.startPoint.y;

        this.obj.css("left", this.startLeft + x * this.xRote);
        this.obj.css("top", this.startTop + y * this.yRote);
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
