/****************************
 *
 *  监控columns内容是否需要补全
 *
 *****************************/

export function watchColumn(instance, config) {
  //注册_columns对象改变
  if (config.launch.columnCheck) {
    const columnObj = instance.columnGroup.get()
    if (columnObj && columnObj.length) {
      if (!instance.unWatchDep) {
        instance.unWatchDep = []
      }
      columnObj.forEach(obj => {
        let dep = Xut.Application.Watch('change:column', () => {
          obj.resetColumnDep()
        })

        //保存监控引用
        instance.unWatchDep.push(() => Xut.Application.unWatch('change:column', dep))
      })
    }
  }
}

/**
 * 移除监控
 * @param  {[type]} instance [description]
 * @return {[type]}          [description]
 */
export function unWatchColumn(instance) {
  //如果有更新记录依赖
  if (instance.unWatchDep) {
    instance.unWatchDep.forEach(unDep => {
      unDep()
    })
    instance.unWatchDep = null
  }
}
