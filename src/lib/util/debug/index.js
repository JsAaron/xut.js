import { config } from '../../config/index'

let $warn = function () {}

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
if (process.env.NODE_ENV !== 'production') {
  const hasConsole = typeof console !== 'undefined'
  $warn = (msg, level) => {
    if (hasConsole && config.debug.silent) {
      if (window.debug && window.debug[level]) {
        window.debug[level](msg)
      } else {
        const command = console[level] || console.error
        if (typeof msg == 'object') {
          command(`[Xut warn]:`, msg)
        } else {
          command(`[Xut warn]: ${msg}`)
        }
      }
    }
  }
}

Xut.$warn = $warn

export {
  $warn
}
