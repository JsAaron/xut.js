import { bindEvent, offEvent } from '../../util/event'

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
        offEvent(document, {
            start: start
        })
    }
    bindEvent(document, {
        start: start
    })
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
