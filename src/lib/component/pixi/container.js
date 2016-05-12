/*******************************************
 *   canvas处理模块
 *   2016.2新增机制
 *   扩充pixi动画
 *                                      *
 ******************************************/


import {
    oneQueue, addQueue, removeQueue, destroyQueue
}
from './queue'


/**
 * 制作uuid
 * @return {[type]} [description]
 */
function makeGuid() {
    return Xut.guid('rAF');
}

 
/**
 * 创建pipx对象
 * @param  {[type]} canvasContainer [description]
 * @param  {[type]} wrapObj         [description]
 * @return {[type]}                 [description]
 */
export function Container(data, canvasIndex) {

    var width = Xut.config.screenSize.width;
    var height = Xut.config.screenSize.height;
    var pageIndex = data.pageIndex;

    var renderer = PIXI.autoDetectRenderer(width, height, {
        transparent: true
    });
    //设置层级关系
    renderer.view.style.position = "absolute"
    renderer.view.style.zIndex = canvasIndex;

    //放入容器
    data.element.append(renderer.view)

    //根容器
    var containerStage = new PIXI.Container();


    //扩充场景处理接口
    var expandRelated = {
        stageWidth: width,
        stageHeight: height,
        container: renderer.view, //canvas容器
        containerStage: containerStage, //根容器
        sprites: {}, //保存精灵合集

        /**
         * 将子pixi加入进来
         */
        addChild: function(stage) {
            containerStage.addChild(stage);
        },

        /**
         * 初始化绘制,3秒的时间
         * 尽量保证节点加载完毕
         * @return {[type]} [description]
         */
        display: function() {
            oneQueue(pageIndex, function display() {
                renderer.render(containerStage);
            });
        },

        /**
         * 绘制一次
         * @return {[type]} [description]
         */
        oneRender: function() {
            renderer.render(containerStage);
        },

        /**
         * 不断绘制
         * task 外部任务
         * type 执行play的类型 高级，普通精灵
         * @return {[type]} [description]
         */
        play: function(type, task) {
            var uuid = makeGuid();
            addQueue(pageIndex, uuid, function play() {
                task && task()
                renderer.render(containerStage);
            }, type);
            return uuid;
        },

        /**
         * 停止绘制
         * @return {[type]} [description]
         */
        stop: function(uuid) {
            removeQueue(pageIndex, uuid);
        },

        /**
         * 销毁
         * @return {[type]} [description]
         */
        destroy: function() {
            if (data.canvasRelated) {
                destroyQueue(pageIndex);
                data.canvasRelated.container = null;
                if (data.canvasRelated.containerStage) {
                    data.canvasRelated.containerStage.removeChildren();
                }
                data.canvasRelated = null;
            }
        }
    }

    //扩充pixi控制
    _.extend(data.canvasRelated, expandRelated)
}
