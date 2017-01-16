import { sceneController } from './scenario/controller'
import { clearAudio } from './core/component/audio/manager'
import { clearVideo } from './core/component/video/manager'
import { adapterDestory } from './visuals/hooks/adapter'
import { destroyFixAudio } from './core/component/audio/fix'
import { destroyCache, destroyResult } from './database/destroy'
import { destroyConfig } from './config/index'
import { $$resetUUID } from './util/stroage'
import { offAndroid } from './initialize/depend/button'
import { cleanCursor } from './initialize/depend/cursor'

/**
 * 销毁接口
 * action 可能是
 * 1 exit 默认，单页面切换，只做销毁。但是代码还是同一份
 * 2 refresh 刷新，旋转切换（需要做一些数据保留，比如外联json数据）
 * 3 destory 退出应用，所以这个应该是全销毁
 * @param {[type]} action [description]
 */
export default function Destroy(action = 'exit') {

    //销毁所有场景
    sceneController.destroyAllScene()

    //销毁只创建一次的对象
    //修复的音频对象
    //数据的结果集
    if (action === 'destory') {
        if (Xut.plat.isBrowser) {
            $('body').off() //默认事件
            $(document).off() //左右按钮
            $(window).off() //横竖切换
        }

        //修复的音频对象
        destroyFixAudio()
    }

    // refresh状态不删除结果集
    // 只处理destory与exit状态
    if (action === 'destory' || action === 'exit') {

        //删除结果集
        destroyResult()

        //删除流式布局的数据
        let $flowNode = $("#xut-stream-flow")
        if ($flowNode.length) {
            $flowNode.remove()
            $flowNode = null
        }
    }

    //config路径缓存
    destroyConfig()

    //删除数据匹配缓存
    destroyCache()

    //音视频
    clearAudio()

    //音频
    clearVideo()

    //expand销毁
    //flow的一些接口缓存
    adapterDestory()

    //销毁独立APK的键盘事件
    offAndroid()

    //忙了光标设置
    cleanCursor()

    /**
     * 重设缓存的UUID
     * 为了只计算一次
     * @return {[type]} [description]
     */
    $$resetUUID()

    Xut.TransformFilter = null
    Xut.CreateFilter = null

    //销毁节点
    Xut.Application.$$removeNode && Xut.Application.$$removeNode()
}
