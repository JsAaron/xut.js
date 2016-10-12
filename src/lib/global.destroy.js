import { sceneController } from './scenario/controller'
import { clearAudio } from './component/audio/manager'
import { clearVideo } from './component/video/manager'
import databaseDestroy from './database/destroy'
import { adapterDestory } from './visuals/adapter/adapter.type'

/**
 * 销毁接口
 * action 可能是
 * 1 refresh 刷新，旋转切换（需要做一些数据保留，比如外联json数据）
 * 2 默认：销毁
 * @param {[type]} action [description]
 */
export default function Destroy(action) {

    //桌面左右按钮
    if (Xut.plat.isBrowser) {
        $(document).off()
    }

    //销毁所有场景
    sceneController.destroyAllScene()

    //删除数据库
    databaseDestroy(action === 'refresh')

    //音视频
    clearAudio()

    //音频
    clearVideo()

    //expand销毁
    //flow的一些接口缓存
    adapterDestory()

    //销毁节点
    Xut.Application.__removeNode__()

    //清理节点内容
    $("#xxtppt-app-container").empty()
}
