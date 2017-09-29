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

  //传递的是字符串
  //$warn(type,content,level,color)
  if (typeof data === 'string') {
    console.log(123)
    return
  }

  //如果是对象数据
  //data = {
  //  type
  //  content
  //  level
  //  color
  //}
  if (typeof data === 'object') {
    const type = data.type
    const content = data.content
    const level = data.level
    const color = data.color
    //默认按照普通日子输出
    const command = console[level] || console.log

    //如果启动了全部处理
    //如果能找到对应的处理
    //silent：['all','preload'.....]
    if ((~silent.indexOf('all')) || (~silent.indexOf(type))) {
      command(`%c<类型>:%c${type} %c<内容>:%c${content}`, "color:#A0522D", "color:" + color, "color:#A0522D", "color:" + color)
    }
    return
  }

  console.log('$warn传递了错误参数', arguments)
}

Xut.$warn = $warn

export {
  $warn
}
