import { config } from '../../config/index'
import Debug from './debug'

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

let debug
let count = 0

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

    //如果启动了全部处理
    //如果能找到对应的处理
    //silent：['all','preload'.....]
    if ((~silent.indexOf('all')) || (~silent.indexOf(type))) {

      const stringType = typeof content === 'string'

        ++count

      //远程debug输出
      if (config.debug.terminal) {
        if (!debug) {
          debug = new Debug()
        }

        function errListener(error) {
          var msg = ["Error:", "filename: " + error.filename, "lineno: " + error.lineno, "message: " + error.message, "type: " + error.type];
          return debug.error(msg.join("<br/>"));
        }
        //监听错误
        window.addEventListener('error', errListener, false);
        debug.log(`${count} 类型:${type} 内容:${content}`)
        return
      }

      //console输出
      const command = console[level] || console.log
      if (stringType) {
        command(`%c${count} 类型:%c${type} %c内容:%c${String.styleFormat(content)}`, "color:#A0522D", "color:" + color, "color:#A0522D", "color:" + color)
      } else {
        command(`${count} 类型:${type} 内容:`, content)
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

function resetCount() {
  count = 0
}

Xut.$warn = $warn

export {
  resetCount,
  $warn
}
