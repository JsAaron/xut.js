import { config } from '../config/index'

let $warn = function() {}

/*
  $warn('hello');
  $warn('信息','info');
  $warn('错误','error');
  $warn('警告','warn');
 */
if(process.env.NODE_ENV !== 'production') {
  const hasConsole = typeof console !== 'undefined'
  $warn = (msg, level) => {
    if(hasConsole && config.debug.silent) {
      const command = console[level] || console.error
      if(typeof msg == 'object') {
        command(`[Xut warn]:`, msg)
      } else {
        command(`[Xut warn]: ${msg}`)
      }
    }
  }
}

export {
  $warn
}
