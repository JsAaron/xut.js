import { sceneController } from './scenario/controller'
import { clearAudio } from './component/audio/manager'
import { clearVideo } from './component/video/manager'
import { adapterDestory } from './visuals/hooks/adapter'
import { destroyFixAudio } from './component/audio/fix'
import { destroyCache, destroyResult } from './database/destroy'
import { destroyConfig } from './config/index'
import { $$resetUUID } from './util/stroage'
import { offAndroid } from './initialize/android.button'

/**
 * 销毁接口
 * action 可能是
 * 1 destory 默认，单页面切换，只做销毁。但是代码还是同一份
 * 2 refresh 刷新，旋转切换（需要做一些数据保留，比如外联json数据）
 * 3 exit 退出应用，所以这个应该是全销毁
 * @param {[type]} action [description]
 */
export default function Destroy(action = 'destory') {

    //销毁所有场景
    sceneController.destroyAllScene()

    //销毁只创建一次的对象
    //修复的音频对象
    //数据的结果集
    if (action === 'exit') {
        if (Xut.plat.isBrowser) {
            $('body').off() //默认事件
            $(document).off() //左右按钮
            $(window).off() //横竖切换
        }

        //修复的音频对象
        destroyFixAudio()
    }

    //refresh状态不删除结果集
    if (action === 'destory' || action === 'exit') {
        destroyResult()
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

    /**
     * 重设缓存的UUID
     * 为了只计算一次
     * @return {[type]} [description]
     */
    $$resetUUID()

    Xut.TransformFilter = null
    Xut.CreateFilter = null

    //销毁节点
    Xut.Application.$$removeNode()
}
