/**
 * 当监听的节点内容发生变化时,触发指定的回调
 * @param opts {
 *   container:父容器,dom对象或jQuery对象
 *   content  :要加入父容器的内容,字符串或jQuery对象
 *   position :内容插入父容器的位置,'first' 表示在前加入,默认在末尾
 *   delay    :延时,默认0
 *   }
 * @version  1.02
 * @author [author] bjtqti
 * @return {[type]} [description]
 */

const DOC = document
const MutationObserver = window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver;

const implementation = DOC.implementation.hasFeature("MutationEvents", "2.0")


export default function nextTick({
    container,
    content,
    position,
    delay = 0
} = {}, callback, context) {

    const animatId = 'T' + (Math.random() * 10000 << 1)
    let tick = DOC.createElement('input')
    let observer = null

    if (!container || !content) {
        return;
    }

    //检查容器---$(container) 转为dom对象
    if (typeof container === 'object' && container.selector !== undefined) {
        container = container[0];
    }

    if (container.nodeType !== 1) {
        console.log('container must be HTMLLIElement ');
        return;
    }

    //标记任务
    tick.setAttribute('value', animatId);

    //检查内容
    if (typeof content === 'string') {
        let temp = $(content);
        if (!temp[0]) {
            //纯文本内容
            temp = DOC.createTextNode(content);
            temp = $(temp);
        }
        content = temp;
    }

    /**
     * 组装内容到临时片段
     * @return {[type]} [description]
     */
    const _createFragment = () => {
        var frag = DOC.createDocumentFragment(),
            len = content.length;
        for (var i = 0; i < len; i++) {
            frag.appendChild(content[i]);
        }
        return frag;
    }

    /**
     * 将内容加入父容器
     * @return {[type]} [description]
     */
    const _appendChild = () => {
        //拼接内容
        content = _createFragment();
        content.appendChild(tick);
        //判断插入的位置
        if (position === 'first') {
            container.insertBefore(content, container.firstChild);
        } else {
            container.appendChild(content);
        }
        //触发变动事件
        tick.setAttribute('value', animatId);
    }

    /**
     * 完成任务后处理&Event
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    const _finishTask = (event) => {
        if (event.target.value === animatId) {
            //container.removeEventListener('DOMNodeRemoved',_finishTask,false);
            container.removeEventListener('DOMNodeInserted', _finishTask, false);
            callback.call(context);
        }
    }

    /**
     * 完成任务后处理&Observer
     * @return {[type]} [description]
     */
    const _completeTask = () => {
        container.removeChild(tick);
        callback.call(context);
    }

    if (MutationObserver) {
        observer = new MutationObserver(mutations => {
            mutations.forEach(record => {
                if (record.oldValue === animatId) {
                    _completeTask();
                    observer = null;
                }
            });
        });

        //设置要监听的属性
        observer.observe(tick, {
            attributes: true,
            //childList: true,
            attributeOldValue: true,
            attributeFilter: ["value"] //只监听value属性,提高性能
        });

        _appendChild();

    } else {

        //检测是否支持DOM变动事件
        if (implementation) {
            //container.addEventListener('DOMNodeRemoved',_finishTask,false);
            container.addEventListener('DOMNodeInserted', _finishTask, false);
            _appendChild();
            container.removeChild(tick);
        } else {
            //歉容Android2.xx处理
            _appendChild();
            setTimeout(function() {
                _completeTask();
            }, delay);
        }
    }
}
