import {
    $$on,
    $$off
} from '../../util/dom'

/**
 * audio对象下标
 * @type {Number}
 */
let index = 0
let loop = 5
let audioes = []

/**
 * 修复audio
 * @param  {[type]} obj    [description]
 * @param  {[type]} key    [description]
 * @param  {[type]} access [description]
 * @return {[type]}        [description]
 */
export function fixAudio(obj, key, access) {
    let start = () => {
        let audio, i
        for (i = 0; i < loop; i++) {
            audio = new Audio()
            audio.play()
            audioes.push(audio)
        }
        $$off(document)
    }
    $$on(document, { start })
}

/**
 * 销毁创建的video对象
 * @return {[type]} [description]
 */
export function destroyFixAudio() {
    for (let i = 0; i < audioes.length; i++) {
        audioes[i] = null
    }
    audioes = null
}

export function hasAudioes() {
    return audioes.length
}


export function getAudio() {
    var audio = audioes[index++]
    if (!audio) {
        index = 0
        return getAudio()
    }
    return audio
}
