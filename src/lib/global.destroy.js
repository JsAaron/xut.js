import { sceneController } from './scenario/controller'
import { clearAudio } from './component/audio/manager'
import { clearVideo } from './component/video/manager'
import { adapterDestory } from './visuals/adapter/adapter.type'
import { destroyFixAudio } from './component/audio/fix'
import { destroyCache, destroyResult } from './database/destroy'
import { destroyConfig } from './config/index'

/**
 * 销毁接口
 * action 可能是
 * 1 destory 默认
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
        //桌面左右按钮
        if (Xut.plat.isBrowser) {
            $(document).off()
        }
        //修复的音频对象
        destroyFixAudio()
    }

    //横竖切换应用，数据集合不删除
    if (action !== 'refresh') {
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

    //销毁节点
    Xut.Application.$$removeNode()

    console.log(Xut)
}
