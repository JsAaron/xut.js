import { config } from '../../config/index'

/*
  $warn('hello');
  $warn('信息','info');
  $warn('错误','error');
  $warn('警告','warn');


  debug.success("This is success message:)");
  debug.error("This is error message:)");
  debug.log("This is primary message:)");
  debug.log({a: 1, b: 2});
  debug.log([1,2,3]);
 */
const hasConsole = typeof console !== 'undefined'

function $warn(data, content, level, color) {

  const silent = config.debug.silent

  if (!silent) {
    return
  }

  if (!hasConsole) {
    return
  }

  const dataType = typeof data

  /**
   * 输出日志
   * @return {[type]} [description]
   */
  function outlog(type, content, level, color) {
    //默认按照普通日子输出
    const command = console[level] || console.log

    //如果启动了全部处理
    //如果能找到对应的处理
    //silent：['all','preload'.....]
    if ((~silent.indexOf('all')) || (~silent.indexOf(type))) {
      if (typeof content === 'string') {
        command(`%c<类型>:%c${type} %c<结果>:%c${content}`, "color:#A0522D", "color:" + color, "color:#A0522D", "color:" + color)
      } else {
        command(`<类型>:${type} <结果>:`, content)
      }
    }
  }

  //如果是对象数据
  //data = {
  //  type
  //  content
  //  level
  //  color
  //}
  if (dataType === 'object') {
    const type = data.type
    const content = data.content
    const level = data.level
    const color = data.color
    outlog(type, content, level, color)
  } else {
    //传递的是普通类型
    //$warn(type,content,level,color)
    outlog(data, content, level, color)
  }

}


Xut.$warn = $warn

export {
  $warn
}
