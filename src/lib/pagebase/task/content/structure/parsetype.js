/**
 * 设置canvas数据
 */
var createCanvasData = function (type, opts) {

	var data = opts.data
	var contentId = opts.contentId
	var conData = opts.conData

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
    "Sprite": function (opts) {
        //启动精灵模式
        //在动画处理的时候给initAnimations快速调用
        createCanvasData('spiritId', opts)
    },
    //ppt=》pixi动画
    "PPT": function (opts) {
        createCanvasData('pptId', opts)
    },
    //高级精灵动画
    //widget
    "SeniorSprite": function (opts) {
        createCanvasData('widgetId', opts)
    },
	//复杂精灵动画
	"CompSprite": function (opts) {
		var data = opts.data
		var conData = opts.conData
		if (/\./i.test(opts.conData.md5)) {
			console.log('复杂精灵动画数据错误')
			return
		}

		//特殊判断，见canvas.js
		//如果没有启动canvas也能走进这个程序
		//给上特殊标示
		if (!data.canvasRelated.enable
			&& !data.canvasRelated.onlyCompSprite) {
			//仅仅只是满足特殊动画
			//特殊模式，可能chapter表中没有启动canvas模式
			data.canvasRelated.onlyCompSprite = true
		}
		createCanvasData('compSpriteId', opts)
	}

}


/**
 * 解析参数
 */
function callResolveArgs(category, opts) {
	var cat
	var cats = category.split(",")
	var len = cats.length
	if (len) {
		while (len--) {
			cat = cats[len]
			//匹配数据类型
			pixiType[cat] && pixiType[cat](opts, category)
		}
	}
}


/**
 * 解析canvas数据
 * 
 */
export function parseCanvas(contentId, category, conData, data) {

	//类型转化
	//双数据类型转行单个类型
	if (Xut.config.onlyDomMode) {
		var cat
		var cats = category.split(",")
		var len = cats.length

		if (len) { 
			while (len--) {
				cat = cats[len]
				//匹配数据类型
				if(cat !== 'PPT'){
					conData.category = cat
				}
			}
		}
		return
	}

	//动作类型
	//用于动画判断
	conData.actionTypes = {};

	//下一个数据
	var opts = {
		contentId: contentId,
		conData: conData,
		data: data
	}

	//转成canvas标记
	//如果有pixi的处理类型
	//2016.2.25
	//SeniorSprite,PPT
	//Sprite,PPT
	//SeniorSprite
	//Sprite
	//PPT
	//CompSprite
	//多种处理方式
	//可以组合
	category && 　callResolveArgs(category, opts)

}