/**
 * 文本类型
 */
export default {

    /**
     * 创建热点元素结构（用于布局可触发点
     * 预创建
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    createDom(opts) {
        var sqlRet = opts.sqlRet,
            pageIndex = opts.pageIndex;
        return function(rootEle, pageIndex) {
            sqlRet['container'] = rootEle || opts.rootEle;
            return sqlRet;
        }
    }


    /**
     * 绑定热点事件
     * 用户交互动作产生Action或者widget对象
     */
    , bindEvent() {}


    /**
     * 在当前页面自动触发的通知
     *
     * 作用：
     *   生成Action或者widget触发点对象
     *
     * 有一种情况，如果当前Action对象，已存在必须要做重复处理
     *
     * Xut.ActionMgr.getOne(key) 接口，是获取当前是否有实例对象的引用
     *
     */
    , autoPlay(scopeComplete) {
        return this.autoPlay && this.autoPlay(scopeComplete);
    }


    /**
     * 开始翻页
     *
     * 滑动页面的时候触发
     *
     * 处理要关闭的对象
     *
     * 比如（音频，视频），不能停留到下一个页面,滑动必须立刻关闭或者清理销毁
     *
     * @param  {[type]} this  当前活动对象
     *
     */
    , flipOver() {
        return this.flipOver();
    }


    /**
     * 翻页完成
     * @return {[type]} [description]
     */
    , flipComplete() {
        return this.flipComplete();
    }

    /**
     *  复位状态通知
     *
     *  作用：用户按页面右上角返回，或者pad手机上的物理返回键
     *
     *  那么：
     *      1 按一次， 如果当前页面有活动热点，并且热点对象还在可视活动状态（比如文本，是显示，音频正在播放）
     *        那么则调用此方法，做复位处理，即文本隐藏，音频关闭
     *        然后返回true, 用于反馈给控制器,停止下一步调用
     *        按第二次,则退出页面
     *
     *     2 按一次，如果没有活动的对象，return false,这直接退出页面
     *
     * @param  {[type]} activeObejct [description]
     * @return {[type]}              [description]
     */
    , recovery(opts) {
        return this.recovery && this.recovery();
    }


    /**
     * 销毁接口
     *
     * 1 销毁页面绑定的事件
     *   A hotspotBind 接口绑定的的热点触发事件
     *   B autoPlay 等接口 产生的具体Action对象事件
     *
     * 2 销毁热点元素的在控制器中的引用
     *
     * 3 清理页面结构
     *
     * 注：
     *   2,3操作暂时由控制器已经内部统一完成了,暂时只需要处理1销毁绑定的事件
     *
     * @param  {[type]} pageIndex    [页码标示]
     * @param  {[type]} rootEle      [根元素]
     * @return {[type]}              [description]
     */
    , destroy() {
        return this.destroy();
    }

}
