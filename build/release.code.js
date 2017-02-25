const fs = require('fs')
const repl = require('repl');
const path = require('path')
const Client = require('ssh2').Client;
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const _ = require("underscore")
const fsextra = require('fs-extra')
const appConfig = require('../../config')

//动作
//全处理 npm run release
//只下载 npm run release down
//只更新 npm run release up
const action = process.argv[process.argv.length - 1]

///////////////////////
/// ssh config
///////////////////////
let data = fs.readFileSync("/Users/mac/project/svn/bak/ssh.js", "utf-8");
let config = {
  "host": "",
  "port": 22,
  "username": "",
  "password": ""
}
if (data) {
  config = JSON.parse(data)
}

const remotePath = '/var/www/mobileclouddata/exports/xxtppt/assets/www'
const remoteDirectory = `${config.username}@${config.host}:${remotePath}`
const localRoot = '/Users/mac/project/svn/www-dev'
const localDirectory = `${localRoot}/template/release-code`

const uploadDir = `${localDirectory}/upload`
const originalDir = `${localDirectory}/original`

const conn = new Client();


function syncFiles() {
  fsextra.emptyDirSync(uploadDir)
  fsextra.copySync(originalDir, uploadDir)
  console.log('服务器与本地文件同步完成')
}

function downloadFile() {
  return new Promise(function(resolve, reject) {
    console.log('拉取服务器文件,同步到到本')
    fsextra.emptyDirSync(originalDir)
    const command = `scp -r ${remoteDirectory} ${originalDir}`
    console.log('服务器路径:' + remotePath)
    console.log('本地路径:' + originalDir)
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(stdout, stderr)
    });
    child.on('exit', function(code) {
      console.log('Completed with code: ' + code);
      resolve()
    });
  })
}

function uploadFile() {
  return new Promise(function(resolve, reject) {
    const command = `scp -r ${uploadDir}/www ${remoteDirectory}`
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      resolve()
    });
  })
}


//sshCommand(`mkdir ${remotePath}/chenwen`).
//sshCommand(`cp -r ${remotePath}/css ${remotePath}/chenwen`)
function sshCommand(command, options) {
  return new Promise(function(resolve, reject) {
    conn.exec(command, function(err, stream) {
      if (err) throw err;
      let buf = '';
      stream.on('close', function(code, signal) {
        resolve(options ? [buf, options] : buf)
      }).on('data', function(data) {
        buf += data;
      }).stderr.on('data', function(data) {});
    }, reject);
  })
}

function walk(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      if (/^\./.test(file)) {
        next();
        return
      }
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

function compareInfo() {
  return new Promise(function(resolve, reject) {
    sshCommand(`cd ${remotePath} && cat lib/version.js`).then(function(version) {
      return sshCommand(`cd ${remotePath} && ls -lR|grep "^-"|wc -l`, version)
    }).then(function(data) {
      console.log(`服务器版本号:${data[1]} ,文件数量:${data[0]}`)
      resolve()
    })
  })
}

function ssh() {
  return new Promise(function(resolve, reject) {
    console.log('ssh 链接成功');
    conn.on('ready', resolve).connect(config);
  })
}

function actionUp() {
  //upload files
  ssh().then(function() {
    return compareInfo()
  }).then(function() {
    console.log('清理服务器目录')
    return sshCommand(`rm -r ${remotePath}`)
  }).then(function() {
    console.log('上传新的发布代码')
    return uploadFile()
  }).then(function() {
    return compareInfo()
  }).then(function(data) {
    console.log('更新完毕')
    conn.end()
  })
}

function actionDown() {
  downloadFile().then(() => syncFiles())
}


function updateLocalFiles(options) {
  return new Promise(function(resolve, reject) {
    _.each(options, function(data) {
      _.each(data.name, function(fileName) {
        fsextra.copySync(`${localRoot}/dist/${fileName}`, `${uploadDir}/www/${data.dir}/${fileName}`)
      })
    })
    resolve()
    console.log('基础包制作完毕')
  })
}


function release() {
  updateLocalFiles([{
    dir: 'lib',
    name: ['xxtppt.js', 'version.js']
  }, {
    dir: 'css',
    name: ['font.css', 'xxtppt.css']
  }]).then(function() {
    actionUp()
  })
}

if (action === 'down') {
  actionDown()
}else if (action === 'up') {
  actionUp()
}else {
  release()
}
