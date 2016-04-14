import {
	messageBox as box
}
from './notice'


/**
 * 执行脚本注入
 */
export function injectScript(code, type) {
	//过滤回车符号
	var enterReplace = function(str) {
		return str.replace(/\r\n/ig, '').replace(/\r/ig, '').replace(/\n/ig, '');
	}
	try {
		new Function("(function(){" + enterReplace(code) + "})")()
	} catch (e) {
		console.log('加载脚本错误', type)
	}
}


/**
 * [ 消息框]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
export function messageBox(message) {
	box(message);
}