/*****************
 文字特效
 https://tympanus.net/codrops/2016/10/18/inspiration-for-letter-effects/
******************/

export default class textAnim {

	/**
	 * 文本节点
	 * 编号
	 * @param  {[type]} node   [description]
	 * @param  {[type]} serial [description]
	 * @return {[type]}        [description]
	 */
	constructor(node,serial){
		console.log(node)
		this.text = new TextFx(node)
		setTimeout(()=>{
			console.log(31)
			this.text.show("fx5");
			this.text.show("fx6");
		},1000)
	}
}