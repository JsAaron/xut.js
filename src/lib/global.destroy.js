import { sceneController } from './scenario/controller'
import { clearAudio } from './component/audio/manager'
import { clearVideo } from './component/video/manager'
import databaseDestroy from './database/destroy'
import { expandDestory } from './visuals/expand/api.config'
/**
 * 销毁接口
 */
export default function Destroy() {
    if (Xut.plat.isBrowser) {
        //销毁桌面控制
        $(document).off()
    }

    //销毁所有场景
    sceneController.destroyAllScene()

    //删除数据库
    databaseDestroy()

    //音视频
    clearAudio()

    //音频
    clearVideo()

    //expand销毁
    expandDestory()

    //DYNAMICCONFIGT模式销毁节点
    if (window.DYNAMICCONFIGT) {
        window.DYNAMICCONFIGT.removeNode()
    }
}
