const util = require('../util')
const config = require('../config')('compiler-full');

const version = util.getVersion(util.joinPath(config.distDirPath, config.productionName))

if(!version){
  console.log('version找不到')
  return
}

/**
 * 无隐藏文件
 * @param  {[type]} err     [description]
 * @param  {[type]} stdout  [description]
 */
const versionPath = config.releaseDirPath + '/' + version +'.zip'
const srcPath  = config.releaseDirPath + '/upload'
const distPath = config.releaseDirPath
console.log(srcPath)

//cd ${srcPath}
require('child_process').exec(`zip -r ${versionPath} ${distPath} -x "*/\.*" -x "\.*"`, function(err, stdout, stderr) {
  if (err) {
    console.log('get weather api error:' + stderr);
  } else {
    console.log(stdout);
  }
});
