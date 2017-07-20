const fs = require("fs")
const fsextra = require('fs-extra')
const path = require('path');

const SLASHES = new RegExp("/", "ig")
const DIRNAME = new RegExp("(?!=\/)([*,.,**]\*[a-z]+)$", "i")
const perfix = '.'
const specialKey = {
  '*.number': '[0-9]+'
}

///.apk\/content|.apk\/www|.\/.svn(\/[.\w\d]+)*|.\/epub(\/[.\w\d]+)*|.\/node_modules(\/[.\w\d]+)*|.\/temp(\/[.\w\d]+)*|.src\/[0-9]+|.src\/content|.src\/test/i
const excludeKeywords = [
  'apk/content',
  'apk/www',
  '.svn',
  'epub',
  'node_modules',
  'temp',
  // 'test',
  // 'dist',
  // 'src/*.number',
  'template/content',
  'template/test'
]


module.exports = () => {

  let excludeGroup = []

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
    let match, dirname, pathdir
    let hasHierarchy = key.match(SLASHES)
    let exp = perfix
    let setGroup = (dirname) => {
      excludeGroup.push(path.normalize(exp + path.sep) + (specialKey[dirname] || dirname))
    }

    //matches only the  2
    if (hasHierarchy) {
      match = DIRNAME.exec(key)
      dirname = match[0]
      pathdir = key.replace('/' + dirname, '')
      exp += pathdir
      setGroup(dirname)
    } else {
      //Combined with boundary judgment
      excludeGroup.push('^[.\/]*' + key)
    }

  }

  /**
   * Create a regular expression to replace their own string
   * @param  {[type]}
   * @return {[type]}     [description]
   */
  return new RegExp(excludeGroup.join(',').replace(/,/g, '|'), 'i')
}
