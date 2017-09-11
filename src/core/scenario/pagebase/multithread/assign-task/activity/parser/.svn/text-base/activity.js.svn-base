/*解析出需要构建的Activity数据*/
export function activityParser(pipeData) {
  let actType
  let activitys = []
  _.each(pipeData.activitys, activity => {
    actType = activity.actType || activity.animation
      //特殊类型 showNote
    if(!actType && activity.note) {
      activity['actType'] = actType = "ShowNote";
    }
    /*匹配content处理相关类型*/
    if(activity.itemArray || activity.autoPlay !== 2) {
      switch(actType) {
        case 'Container':
        case 'Content':
        case 'Parallax':
        case 'Contents':
          activitys.push(activity);
          break;
      }
    }
  })
  return activitys
}
