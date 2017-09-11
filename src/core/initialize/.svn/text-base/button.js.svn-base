import { getPlugVideoState, closePlugVideo } from './video'

/**
 * 回退按钮状态控制器
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
const controller = (state) => {
  //如果是子文档处理
  if(Xut.isRunSubDoc) {
    //通过Action动作激活的,需要到Action类中处理
    Xut.publish('subdoc:dropApp');
    return;
  }

  //home
  if(state === 'pause') {
    Xut.Application.Original()
  }

  //恢复
  if(state === 'resume') {
    Xut.Application.Activate()
  }

  //退出
  if(state === 'back') {
    window.GLOBALCONTEXT.navigator.notification.confirm('您确认要退出吗？',
      function(button) {
        if(1 == button) {
          Xut.Application.Suspend({
            processed() {
              window.GLOBALCONTEXT.navigator.app.exitApp()
            }
          })
        }
      },
      '退出', '确定,取消'
    )
  }
}

/**
 * 绑定安卓按钮
 * 回退键
 * @return {[type]} [description]
 */
function bindAndroidBack() {
  //如果是预加载视频
  if(getPlugVideoState()) {
    closePlugVideo()
  } else {
    controller('back');
  }
}

/**
 * 绑定安卓按钮
 * 暂停键
 * @return {[type]} [description]
 */
function bindAndroidPause() {
  controller('pause');
}


/**
 * 前台恢复
 * @return {[type]} [description]
 */
function bindAndroidResume() {
  controller('resume');
}

/**
 * 绑定安卓按钮
 * @return {[type]} [description]
 */
export function bindAndroid() {
  if(Xut.plat.hasPlugin) {
    document.addEventListener("backbutton", bindAndroidBack, false);
    document.addEventListener("pause", bindAndroidPause, false);
    document.addEventListener("resume", bindAndroidResume, false);
  }
}

/**
 * 销毁安卓按钮
 * @return {[type]} [description]
 */
export function clearAndroid() {
  if(Xut.plat.hasPlugin) {
    document.removeEventListener("backbutton", bindAndroidBack, false);
    document.removeEventListener("pause", bindAndroidPause, false);
    document.removeEventListener("resume", bindAndroidResume, false);
  }
}
