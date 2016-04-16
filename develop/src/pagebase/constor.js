//***********************************************************
//
//              构造page类,继承PageBase类
//
//**********************************************************

import {
	PageBase
}
from './pagebase'

let constor = Xut.extend(PageBase, {
	constructor: function(options) {
		//多线程处理
		this.initTasks(options);
		return this;
	}
})

export {constor} 