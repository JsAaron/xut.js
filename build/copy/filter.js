const fs = require("fs")
const fsextra = require('fs-extra')
const path = require('path');

const SLASHES = new RegExp("/", "ig")
const DIRNAME = new RegExp("(?!=\/)([*,.,**]\*[a-z]+)$", "i")
const perfix = '.'
const specialKey = {
    '*.number': '[0-9]+'
}

const excludeKeywords = [
    'apk/content',
    'apk/www',
    '.svn',
    'epub',
    'node_modules',
    // 'dist',
    'src/*.number',
    'src/content',
    'src/test'
]


module.exports = () => {

    var excludeGroup = []

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
        let hierarchy, i, exp, match, dirname, pathdir, setGroup
        hierarchy = key.match(SLASHES)

        i = 0
        exp = perfix

        setGroup = (dirname) => {
            excludeGroup.push(path.normalize(exp + path.sep) + (specialKey[dirname] || dirname))
        }

        if (hierarchy) {
            i = hierarchy.length
            match = DIRNAME.exec(key)
            dirname = match[0]
            pathdir = key.replace('/' + dirname, '')
            exp += pathdir
            setGroup(dirname)
        } else {
            ///.\/.svn(\/[.\w\d]+)*/ig
            dirname = key + '(\/[.\\w\\d]+)*'
            setGroup(dirname)
        }

    }


    /**
     * Create a regular expression to replace their own string
     * @param  {[type]}
     * @return {[type]}     [description]
     */
    return new RegExp(excludeGroup.join(',').replace(/,/g, '|'), 'i')
}
