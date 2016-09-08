import Flow from '../../../component/flow/index'

/**
 * 2017.9.7
 * 流式排版
 */
export default function(base, successCallback) {

	

    base._flows.register(new Flow(base,successCallback))
}
