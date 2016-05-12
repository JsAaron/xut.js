/**
 * 设置canvas数据
 */
var createCanvasData = function(type,nextdata) {

	var data = nextdata.data
	var contentId = nextdata.contentId
	var conData = nextdata.conData

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
		if (conData.zIndex > data.canvasRelated.containerIndex) {
			data.canvasRelated.containerIndex = conData.zIndex;
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
    "Sprite": function(nextdata) {
        //启动精灵模式
        //在动画处理的时候给initAnimations快速调用
        createCanvasData('spiritId', nextdata)
    },
    //ppt=》pixi动画
    "PPT": function(nextdata) {
        createCanvasData('pptId', nextdata)
    },
    //高级精灵动画
    //widget
    "SeniorSprite": function(nextdata) {
        createCanvasData('widgetId', nextdata)
    },
    //复杂精灵动画
    "CompSprite": function(nextdata) {
        //特殊判断，见canvas.js
        if (!nextdata.data.canvasRelated.enable) {
        	//仅仅只是满足特殊动画
            nextdata.data.canvasRelated.onlyCompSprite = true
            //特殊模式，可能chapter表中没有启动canvas模式
            //这里手动开启
            nextdata.data.canvasRelated.enable = true
        }
        createCanvasData('compSpriteId', nextdata)
    }

}


/**
 * 解析canvas数据
 * 
 */
export function parseCanvas(contentId, category, conData, data) {
	//动作类型
	//用于动画判断
	conData.actionTypes = {};

	//下一个数据
	var nextdata = {
		contentId: contentId,
		conData: conData,
		data: data
	}

	//复杂精灵动画
	pixiType[category] && pixiType[category](nextdata)

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
	if (data.canvasRelated.enable) {
		var _cat;
		var cat;
		var _cats = category.split(",");
		var i = _cats.length;
		if (i) {
			while (i--) {
				cat = _cats[i]

				//匹配数据类型
				pixiType[cat] && pixiType[cat](nextdata)
			}
		}
	}
}