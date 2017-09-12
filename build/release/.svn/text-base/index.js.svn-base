const fs = require('fs')
const repl = require('repl');
const path = require('path')
const Client = require('ssh2').Client;
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const _ = require("underscore")
const fsextra = require('fs-extra')
const util = require('../util')

//动作
//全处理 npm run release
//只下载 npm run release down
//只更新 npm run release up
const action = process.argv[process.argv.length - 1]

///////////////////////
/// ssh config
///////////////////////
let data = fs.readFileSync("/Users/Aaron/project/svn/bak/ssh.js", "utf-8");
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
const localRoot = process.cwd()
const localDirectory = `${localRoot}/release`
const uploadDir = `${localDirectory}/upload`
const downloadDir = `${localDirectory}/download`
const conn = new Client();


/**
 * 下载服务器文件
 */
async function downloadFile() {
  await new Promise(function(resolve, reject) {
    fsextra.emptyDirSync(downloadDir)
    const command = `scp -r ${remoteDirectory} ${downloadDir}`
    util.log('The server path:' + remotePath)
    util.log('The local path:' + downloadDir)
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      util.log(stdout, stderr)
    });
    child.on('exit', function(code) {
      util.log('Completed with code: ' + code);
      resolve()
    });
  })
}

/**
 * 更新上传文件
 */
function uploadFile() {
  return new Promise(function(resolve, reject) {
    const command = `scp -r ${uploadDir}/www ${remoteDirectory}`
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        reject()
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


/**
 * 比较版本号
 */
function compareVsersion() {
  return new Promise(function(resolve, reject) {
    sshCommand(`cd ${remotePath} && cat lib/version.js`).then(function(version) {
      return sshCommand(`cd ${remotePath} && ls -lR|grep "^-"|wc -l`, version)
    }).then(function(data) {
      util.log(`The server version number:${data[1]} ,The number of files:${data[0]}`)
      resolve()
    })
  })
}

/**
 * 链接ssh服务器
 */
async function sshLink() {
  util.log('SSH link success');
  await new Promise(function(resolve, reject) {
    conn.on('ready', resolve).connect(config);
  });
}

async function actionUp() {
  await sshLink()
  await compareVsersion()
  //清理目录
  await sshCommand(`rm -r ${remotePath}`)
  //上传发布代码
  await uploadFile()
  await compareVsersion()
  //更新完毕
  conn.end()
}


function actionDown() {
  downloadFile().then(() => {
    fsextra.emptyDirSync(uploadDir)
    fsextra.copySync(downloadDir, uploadDir)
    util.log('The server and the local file synchronization is complete')
  })
}


async function updateLocalFiles(options) {
  await new Promise(function(resolve, reject) {
    _.each(options, function(data) {
      _.each(data.name, function(fileName) {
        fsextra.copySync(`${localRoot}/dist/${fileName}`, `${uploadDir}/www/${data.dir}/${fileName}`)
      })
    })
    resolve()
    util.log('Basic package the finished')
  })
}


//上传
if (action === 'upload') {
  actionUp()
}
//下载
else if (action === 'download') {
  actionDown()
}
//发布
else if (action === 'all') {
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
