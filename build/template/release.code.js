const fs = require('fs')
const repl = require('repl');
const path = require('path')
const Client = require('ssh2').Client;
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const _ = require("underscore")
const fsextra = require('fs-extra')
const utils = require('../utils')
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
const localRoot = process.cwd()
const localDirectory = `${localRoot}/template/release-code`

const uploadDir = `${localDirectory}/upload`
const originalDir = `${localDirectory}/original`

const conn = new Client();


function syncFiles() {
  fsextra.emptyDirSync(uploadDir)
  fsextra.copySync(originalDir, uploadDir)
  utils.log('The server and the local file synchronization is complete')
}

function downloadFile() {
  return new Promise(function (resolve, reject) {
    fsextra.emptyDirSync(originalDir)
    const command = `scp -r ${remoteDirectory} ${originalDir}`
    utils.log('The server path:' + remotePath)
    utils.log('The local path:' + originalDir)
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      utils.log(stdout, stderr)
    });
    child.on('exit', function (code) {
      utils.log('Completed with code: ' + code);
      resolve()
    });
  })
}

function uploadFile() {
  return new Promise(function (resolve, reject) {
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
  return new Promise(function (resolve, reject) {
    conn.exec(command, function (err, stream) {
      if (err) throw err;
      let buf = '';
      stream.on('close', function (code, signal) {
        resolve(options ? [buf, options] : buf)
      }).on('data', function (data) {
        buf += data;
      }).stderr.on('data', function (data) {});
    }, reject);
  })
}


function compareInfo() {
  return new Promise(function (resolve, reject) {
    sshCommand(`cd ${remotePath} && cat lib/version.js`).then(function (version) {
      return sshCommand(`cd ${remotePath} && ls -lR|grep "^-"|wc -l`, version)
    }).then(function (data) {
      utils.log(`The server version number:${data[1]} ,The number of files:${data[0]}`)
      resolve()
    })
  })
}

function ssh() {
  return new Promise(function (resolve, reject) {
    utils.log('SSH link success');
    conn.on('ready', resolve).connect(config);
  })
}

function actionUp() {
  //upload files
  ssh().then(function () {
    return compareInfo()
  }).then(function () {
    utils.log('Clean up the server directory')
    return sshCommand(`rm -r ${remotePath}`)
  }).then(function () {
    utils.log('Upload new release code')
    return uploadFile()
  }).then(function () {
    return compareInfo()
  }).then(function (data) {
    utils.log('Updated completely')
    conn.end()
  })
}

function actionDown() {
  downloadFile().then(() => syncFiles())
}


function updateLocalFiles(options) {
  return new Promise(function (resolve, reject) {
    _.each(options, function (data) {
      _.each(data.name, function (fileName) {
        fsextra.copySync(`${localRoot}/dist/${fileName}`, `${uploadDir}/www/${data.dir}/${fileName}`)
      })
    })
    resolve()
    utils.log('Basic package the finished')
  })
}


function release() {
  updateLocalFiles([{
    dir: 'lib',
    name: ['xxtppt.js', 'version.js']
  }, {
    dir: 'css',
    name: ['font.css', 'xxtppt.css']
  }]).then(function () {
    actionUp()
  })
}

//下载
if (action === 'down') {
  actionDown()
}
//上传
else if (action === 'up') {
  actionUp()
}
//发布
else {
  release()
}
