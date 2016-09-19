import { readFile } from '../../../util/option'
import createBackground from './layout'
import nextTick from '../../../nexttick'


/**
 * 构建背景类
 * @param {[type]} rootNode             [根节点]
 * @param {[type]} data                 [数据]
 * @param {[type]} suspendCallback      [中断回调]
 * @param {[type]} successCallback      [description]
 */
export default class TaskBackground {

    constructor(rootNode, data, suspendCallback, successCallback) {
        var layer,
            suspendTasks,
            nextTasks,
            self = this,
            content = data["md5"],
            isSVGContent = /.svg$/i.test(content) ? true : false;

        this.callback = {
            'suspendCallback': suspendCallback,
            'successCallback': successCallback
        }


        //iboosk节点预编译
        //在执行的时候节点已经存在
        //不需要在创建
        if (Xut.IBooks.runMode()) {
            //找到背景节点
            var $element = rootNode.find('.multilayer');
            successCallback()
            return;
        }

        //背景是否需要SVG解析
        this.parseMaster(isSVGContent, content, function(svgContents) {

            //构建背景
            var backgroundStr = createBackground(svgContents, data);
            if (backgroundStr) {
                svgContents = null;
                self.compileSuspend($(backgroundStr), rootNode);
            } else {
                successCallback();
            }
        });

    }


    clearReference() {}


    /**
     * 构建中断函数
     * @param  {[type]} $background [description]
     * @param  {[type]} rootNode    [description]
     * @return {[type]}             [description]
     */
    compileSuspend($background, rootNode) {

        var nextTasks, suspendTasks,
            self = this;

        //继续执行
        nextTasks = function() {
            nextTick({
                'container': rootNode,
                'content': $background
            }, function() {
                self.clearReference();
                self.callback.successCallback();
            });
        }

        //中断方法
        suspendTasks = function() {
            self.suspendQueues = [];
            self.suspendQueues.push(function() {
                nextTasks()
            })
        }

        self.callback.suspendCallback(nextTasks, suspendTasks);
    }

    /**
     * 运行被阻断的线程任务
     * @return {[type]} [description]
     */
    runSuspendTasks() {
        if (this.suspendQueues) {
            var fn;
            if (fn = this.suspendQueues.pop()) {
                fn();
            }
            this.suspendQueues = null;
        }
    }


    /**
     * /解析SVG背景
     * @param  {Boolean}  isSVGContent [description]
     * @param  {[type]}   content      [description]
     * @param  {Function} callback     [description]
     * @return {[type]}                [description]
     */
    parseMaster(isSVGContent, content, callback) {
        if (isSVGContent) { //背景需要SVG解析的
            readFile(content, function(svgContents) {
                callback(svgContents);
            });
        } else {
            callback('');
        }
    }
}

