/**
 * 高级精灵动画
 */

var spiritAni = function(data, contentPrefix, path) {
    this.resType = 1;
    this.data = data;
    this.contentPrefix = contentPrefix;
    this.curFPS = 0;
    this.timer = null;
    this.loop = 1;
    this.curLoop = 1;
    if (this.playerType == "loop") {
        this.loop = 0
    }
    this.action       = this.data.params["actList"].split(",")[0];
    this.fps          = parseInt(this.data.params[this.action].fps);
    this.playerType   = (this.data.params[this.action].playerType);
    this.isSports     = parseInt(this.data.params[this.action].isSports);
    this.imageList    = this.data.params[this.action].ImageList;
    this.obj          = $("#" + this.contentPrefix + this.data.framId);
    this.FPSCount     = this.imageList.length;
    this.resourcePath = path;
    this.imgArray     = []

}

var p = spiritAni.prototype;


p.init = function() {
    if (this.isSports) {
        this.cutInit();
    } else {
        this.switchInit();
    }
}


/**
 * 停止动画
 * @return {[type]} [description]
 */
p.stop = function() {
    clearTimeout(this.timer);
}


/**
 * 销毁动画
 * @return {[type]} [description]
 */
p.destroy = function() {
    console.log('销毁')
}


export { spiritAni }
