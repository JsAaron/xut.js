


//卷滚
import { Iscroll } from './iscroll'

/*********************************************************************
*
*                 私有方法
*
**********************************************************************/

export function extendPrivate(activitProto) {


    /**
     * 增加翻页特性
     * 可能有多个引用关系
     * @return {[type]}         [description]
     */
    activitProto.addIScroll = function (scope, element) {
        var self = this,
            // elementName,
            contentDas = scope.contentDas;

        //给外部调用处理
        function makeUseFunction(element) {

            var prePocess = self.makePrefix('Content', scope.pid, scope.id),
                preEle = self.getContextNode(prePocess)

            //重置元素的翻页处理
            // defaultBehavior(preEle);

            //ios or pc
            if (!Xut.plat.isAndroid) {
                return function () {
                    self.iscroll = Iscroll(element);
                }
            }

            //在安卓上滚动文本的互斥不显示做一个补丁处理
            //如果是隐藏的,需要强制显示,待邦定滚动之后再还原
            //如果是显示的,则不需要处理,
            var visible = preEle.css('visibility'),
                restore = function () { };

            if (visible == 'hidden') {
                var opacity = preEle.css('opacity');
                //如果设置了不透明,则简单设为可见的
                //否则先设为不透明,再设为可见
                if (opacity == 0) {
                    preEle.css({
                        'visibility': 'visible'
                    })
                    restore = function () {
                        preEle.css({
                            'visibility': visible
                        })
                    }
                } else {
                    preEle.css({
                        'opacity': 0
                    }).css({
                        'visibility': 'visible'
                    })
                    restore = function () {
                        preEle.css({
                            'opacity': opacity
                        }).css({
                            'visibility': visible
                        })
                    }
                }
            }

            return function () {
                self.iscroll = Iscroll(element);
                restore();
                preEle = null;
                restore = null;
            }
        }

        //增加卷滚条
        if (contentDas.isScroll) {
            //去掉高度，因为有滚动文本框
            element.find(">").css("height", "")
            this.relatedCallback.iscrollHooks.push(makeUseFunction(element[0]));
        }

        //如果是图片则补尝允许范围内的高度
        if (!contentDas.mask || !contentDas.isGif) {
            element.find && element.find('img').css({
                'height': contentDas.scaleHeight
            });
        }
    }


    /**
     * 制作一个查找标示
     * @return {[type]}
     */
    activitProto.makePrefix = function (name, pid, id) {
        return name + "_" + pid + "_" + id;
    }


    /**
     * 从文档碎片中找到对应的dom节点
     * 查找的范围
     * 1 文档根节点
     * 2 文档容器节点
     * @param  {[type]} prefix [description]
     * @return {[type]}        [description]
     */
    activitProto.getContextNode = function (prefix, type) {

        var element, containerPrefix, contentsFragment

        // //canvas模式
        // if (type === 'canvas') {
        //     //直接在root查找，因为canvasdom是pxixi创建的
        //     //不能在文档碎片中查找 
        //     return element = this.rootNode.find('#' + prefix);
        // }

        //dom模式
        contentsFragment = this.relatedData.contentsFragment;
        if (element = (contentsFragment[prefix])) {
            element = $(element)
        } else {
            //容器处理
            if (containerPrefix = this.relatedData.containerPrefix) {
                _.each(containerPrefix, function (containerName) {
                    element = contentsFragment[containerName];
                    element = $(element).find('#' + prefix);
                    if (element.length) {
                        return;
                    }
                })
            }
        }
        return element;
    }


}