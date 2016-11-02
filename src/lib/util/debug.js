import { config } from '../config/index'

let $$warn = function() {}

if (process.env.NODE_ENV !== 'production') {
    const hasConsole = typeof console !== 'undefined'
    $$warn = (msg) => {
        if (hasConsole && config.silent) {
            console.error(`[Xut warn]: ${msg}`)
        }
    }
}

export { $$warn }
