const fs = require("fs")
const fsextra = require('fs-extra')

const SLASHES = new RegExp("/", "ig")
const DIRNAME = new RegExp("(?!=\/)([*,.,**]\*[a-z]+)$", "i")

const hash = () => {
    return Object.create(null)
}

const excludeKeywords = [
    '.svn',
    'epub',
    'node_modules',
    'temp',
    'dist',
    'src',
    'src/content',
    'src/test'
]

let i

module.exports = () => {

    var excludeGroup = hash()

    /**
     * { '0': { './': '.svn,epub,node_modules,temp,dist' },
      '   1': {
                 'scr/' : 'content,set',
                'build/': 'test,image'
              },
      '   2': { 'scr/ima/': 'teb' },
      '   4': { 'scr/content/image/test/': 'aaa' }
      }
     * @param  {[type]} var i             in excludeGroup [description]
     * @return {[type]}     [description]
     */
    for (let key of excludeKeywords) {
        let hierarchy, traversal, exp, match, dirname, pathdir, setGroup
        hierarchy = key.match(SLASHES)

        i = 0
        exp = '.'

        setGroup = (dirname) => {
            dirname = dirname || key
            if (!excludeGroup[i]) {
                excludeGroup[i] = hash()
            }
            if (!excludeGroup[i][exp]) {
                excludeGroup[i][exp] = hash()
                excludeGroup[i][exp] = dirname
            } else {
                excludeGroup[i][exp] = excludeGroup[i][exp].concat(',').concat(dirname)
            }
        }

        if (hierarchy) {
            i = hierarchy.length
            match = DIRNAME.exec(key)
            dirname = match[0]
            pathdir = key.replace('/' + dirname, '')
            exp = pathdir
            setGroup(dirname)
        } else {
            setGroup()
        }

    }

    /**
     * Create a regular expression to replace their own string
     * @param  {[type]}
     * @return {[type]}     [description]
     */
    for (let i in excludeGroup) {
        for (let j in excludeGroup[i]) {
            excludeGroup[i][j] = new RegExp(excludeGroup[i][j].replace(/,/g, '\\b|') + '\\b', 'ig')
        }
    }


    return {
        express: excludeGroup,
        index: i
    }
}
