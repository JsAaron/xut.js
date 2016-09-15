
import { navMenu } from '../../scenario/layout'

import nextTick from '../../nexttick'


/**
 * 创建dom
 */
export default function createHTML(container, callback) {

    const data = []

    Xut.data.query('Chapter', Xut.data.novelId, 'seasonId', item => {
        data.push(item)
    })

    nextTick({
        'container' : container,
        'content'   : navMenu(data)
    }, function() {
        callback(data)
    })
}
