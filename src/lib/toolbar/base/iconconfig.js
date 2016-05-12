/**
 * [svgIconConfig description]
 * http://tympanus.net/Development/AnimatedSVGIcons/
 * @type {Object}
 */
let iconConfig = {
    nextArrow: {
        url: 'images/icons/pageback.svg',
        animation: [{
            el: 'path:nth-child(1)',
            animProperties: {
                from: {
                    val: '{"transform" : "r0 16 16", "fill-opacity" : "0.9"}',
                    before: '{"fill-opacity" : "0.9", "stroke-opacity" : "0" , "transform" : "r90 16 16"}'
                },
                to: {
                    val: '{"transform" : "r360 16 16", "fill-opacity": "0"}',
                    before: '{"fill-opacity" : "0", "stroke-opacity" : "1" }'
                }
            }
        }]
    },
    prevArrow: {
        url: 'images/icons/pageforward.svg',
        animation: [{
            el: 'path:nth-child(1)',
            animProperties: {
                from: {
                    val: '{"transform" : "r0 16 16", "fill-opacity" : "0.9"}',
                    before: '{"fill-opacity" : "0.9", "stroke-opacity" : "0" , "transform" : "r90 16 16"}'
                },
                to: {
                    val: '{"transform" : "r360 16 16", "fill-opacity": "0"}',
                    before: '{"fill-opacity" : "0", "stroke-opacity" : "1" }'
                }
            }
        }]
    },
    close: {
        url: 'images/icons/close.svg',
        animation: [{
            el: 'path:nth-child(1)',
            animProperties: {
                from: {
                    val: '{"transform" : "r0 16 16", "fill-opacity" : "0.9"}',
                    before: '{"fill-opacity" : "0.9", "stroke-opacity" : "0" , "transform" : "r90 16 16"}'
                },
                to: {
                    val: '{"transform" : "r360 16 16", "fill-opacity": "0"}',
                    before: '{"fill-opacity" : "0", "stroke-opacity" : "1" }'
                }
            }
        }]
    },
    back: {
        url: 'images/icons/back.svg',
        animation: [{
            el: 'path:nth-child(1)',
            animProperties: {
                from: {
                    val: '{"transform" : "r0 16 16", "fill-opacity" : "0.9"}',
                    before: '{"fill-opacity" : "0.9", "stroke-opacity" : "0" , "transform" : "r90 16 16"}'
                },
                to: {
                    val: '{"transform" : "r360 16 16", "fill-opacity": "0"}',
                    before: '{"fill-opacity" : "0", "stroke-opacity" : "1" }'
                }
            }
        }]
    }
};


export {iconConfig}