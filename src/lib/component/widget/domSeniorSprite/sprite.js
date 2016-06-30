/**
 * 高级精灵动画
 */
let prefix = Xut.plat.prefixStyle

export class seniorSpiritAni {
    constructor(data, contentPrefix, path) {
        this.resType = 1;
        this.data = data;
        this.contentPrefix = contentPrefix;
        this.curFPS = 0;
        this.timer = null;
        this.loop = 1;
        this.curLoop = 1;
        if (this.playerType == "loop")
            this.loop = 0;

        let params = this.data.params
        let action = this.action = params["actList"].split(",")[0]

        this.FPS = parseInt(params[action].fps);
        this.playerType = (params[action].playerType);
        this.isSports = parseInt(params[action].isSports);
        this.imageList = params[action].ImageList;
        this.obj = $("#" + this.contentPrefix + this.data.framId);
        this.FPSCount = this.imageList.length;
        this.ResourcePath = path;
        this.imgArray = new Array();
        this.init();
    }

    getFilename(name) {
        return name.substr(0, name.indexOf('.'));
    }

    loadResource(url, callback) {
        var img = new Image();
        img.onload = function() {
            img.onload = null;
            if (typeof(callback) == "function") callback(img);
        }
        img.src = url;
        return img;
    }

    init() {
        if (this.isSports) {
            this.cutInit();
        } else {
            this.switchInit();
        }
        this.curFPS++;
    }

    cutInit() {
        let obj = this.obj;
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
        if (this.resType == 1) {
            let ret = ""
            ret += String.format(
                "<img"
                +" id='spImg_{0}'"
                +" src='{1}'"
                +" style='width:100%;height:100%;position:absolute;' width='100%' height='100%' />", 
                this.data.framId, this.ResourcePath + this.imageList[0].name)
            obj.html(ret);
        } else {
            var filename = this.getFilename(this.imageList[0].name);
            let ret = ""
            ret += String.format(
                "<div id='spImg_{0}'"
                +" style='width:100%;height:100%;position:absolute;background: url({1}.jpg) no-repeat;background-size: 100% 100%;-webkit-mask: url({2}.png) no-repeat;-webkit-mask-size: 100% 100%;'></div>",
                this.data.framId,this.ResourcePath + filename,this.ResourcePath + filename)
            obj.append(ret);
        }
    }

    switchInit() {
        let obj = this.obj
        if (this.resType == 1) {
            let ret = ""
            ret += String.format(
                "<img"
                +" id='spImg_{0}'"
                +" src='{1}'"
                +" style='width:100%;height:100%;position:absolute;' />",this.data.framId,this.ResourcePath + this.imageList[0].name)
            obj.html(ret);
        } else {
            var filename = this.getFilename(this.imageList[0].name);
            let ret = ""
            ret += String.Foramt(
                "<div"
                +" id='spImg_{0}'"
                +" style='width:100%;height:100%;position:absolute;background: url({1}.jpg) no-repeat;background-size: 100% 100%;-webkit-mask: url({2}.png) no-repeat;-webkit-mask-size: 100% 100%;'></div>",this.data.framId,this.ResourcePath + filename,this.ResourcePath + filename)

            obj.append(ret);
        }
    }

    cutAni() {
        let imageList = this.imageList;
        let curFPS = imageList[this.curFPS];
        let ele = $("#spImg_" + this.data.framId);
        let ResourcePath = this.ResourcePath;
        if (this.resType == 1) {
            var str = ResourcePath + curFPS.name
            //console.log(curFPS.X,curFPS.Y,str);
            ele.attr("src", str);
        } else {
            var filename = this.getFilename(curFPS.name);
            ele.css("background-image", "url(" + ResourcePath + filename + ".jpg)");
            ele.css("-webkit-mask-image", "url(" + ResourcePath + filename + ".png)");
        }
        var x = curFPS.X - this.startPoint.x;
        var y = curFPS.Y - this.startPoint.y;

        this.obj.css("left", this.startLeft + x * this.xRote);
        this.obj.css("top", this.startTop + y * this.yRote);

         // this.obj[0].style.cssText += String.format(
         //    "top:0;left:0;"
         //    + " {0}:translate3d({1}px,{2}px,0)",
         //    prefix('transform'),this.startLeft + x * this.xRote,this.startTop + y * this.yRote);

        this.imgArray.pop();
        if (this.resType != 1) this.imgArray.pop();
        var nextImgId = this.curFPS + 6;
        if (nextImgId < imageList.length) {
            if (this.resType == 1) {
                var img = this.loadResource(ResourcePath + imageList[nextImgId].name, null);
                this.imgArray.unshift(img);
            } else {
                var filename = this.getFilename(imageList[nextImgId].name);
                var mask = this.loadResource(ResourcePath + filename + ".png", null);
                var img = this.loadResource(ResourcePath + filename + ".jpg", null);
                this.imgArray.unshift(img);
                this.imgArray.unshift(mask);
            }
        }
        this.curFPS++;
    }

    changeSwitchAni(action, loop) {
        let params = this.data.params;
        this.action = action;
        if (!this.data.params[action]) {
            console.log(" Function changeSwitchAni  parameters " + action + " error");
            return;
        }
        this.FPS = parseInt(params[action].fps);
        this.playerType = params[action].playerType;
        this.loop = loop;

        this.isSports = parseInt(params[action].isSports);
        let imageList = this.imageList = params[action].ImageList;
        this.obj = $("#" + this.contentPrefix + this.data.framId);
        this.FPSCount = imageList.length;
        this.curFPS = 0;
        clearTimeout(this.timer);
        //Ô¤¼ÓÔØÍ¼Æ¬
        this.imgArray = [];
        for (let i = 1; i < 6; i++) {
            if (i >= imageList.length) break;
            if (this.resType == 1) {
                var img = this.loadResource(this.ResourcePath + imageList[i].name, null);
                this.imgArray.unshift(img);
            } else {
                var filename = this.getFilename(imageList[i].name);
                var mask = this.loadResource(this.ResourcePath + filename + ".png", null);
                var img = this.loadResource(this.ResourcePath + filename + ".jpg", null);
                this.imgArray.unshift(img);
                this.imgArray.unshift(mask);
            }
        }
        this.setAni();
       // this.runTimer = setTimeout(this.setAni.bind(this), 250);
        //this.setAni();
    }

    switchAni() {
        let ele = $("#spImg_" + this.data.framId);
        let ResourcePath = this.ResourcePath;
        if (this.resType == 1) {
            ele.attr("src", ResourcePath + this.imageList[this.curFPS].name);
        } else {
            var filename = this.getFilename(this.imageList[this.curFPS].name);
            ele.css("background-image", "url(" + ResourcePath + filename + ".jpg)");
            ele.css("-webkit-mask-image", "url(" + ResourcePath + filename + ".png)");
        }
        this.curFPS++;
    }

    stop() {
        clearTimeout(this.timer);
        //clearTimeout(this.runTimer);
        this.timer = null;
        //this.runTimer = null;
    }

    destroy() {
        this.stop();
    }
    

    setAni() {
        this.isAni = false;
        var self = this;

        function ani() {
            if (self.curFPS >= self.FPSCount) {
                if (self.loop > 0) {
                    if (self.curLoop >= self.loop) {
                        self.isAni = false;
                        return;
                    } else {
                        self.curLoop++;
                        self.curFPS = 0;
                        self.isAni = true;
                        time();
                    }
                } else {
                    self.curFPS = 0;
                    self.isAni = true;
                    time();
                }
            } else {
                self.isAni = true;
                time();
            }
        }

        function time() {
            self.timer = setTimeout(function() {
                if (self.isSports) {
                    self.cutAni();
                } else {
                    self.switchAni();
                }
                ani();
            }, 1000 / self.FPS);
        }
        ani();
    }
}
