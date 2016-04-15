//***********************************************************
//
//              构造page类,继承PageBase类
//
//**********************************************************

import {
	PageBase
}
from './pagebase'

let Page = Xut.extend(PageBase, {
	constructor: function(options) {
		//多线程处理
		this.initTasks(options);
		return this;
	}
})

export {
	Page
}