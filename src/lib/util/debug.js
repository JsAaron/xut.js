import { config } from '../config/index'

let $$warn = function() {}

if (process.env.NODE_ENV !== 'production') {
  const hasConsole = typeof console !== 'undefined'
  $$warn = (msg) => {
    if (hasConsole && config.silent) {
      if (typeof msg == 'object') {
        console.error(`[Xut warn]:`, msg)
      } else {
        console.error(`[Xut warn]: ${msg}`)
      }
    }
  }
}

export {
  $$warn
}
