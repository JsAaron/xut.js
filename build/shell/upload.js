const fs = require('fs')
const Client = require('ssh2').Client;
const exec = require('child_process').exec;
const rf = require("fs");
const fsextra = require('fs-extra')
const appConfig = require('../../config')

///////////////////////
/// ssh config
///////////////////////
let data = rf.readFileSync("/Users/mac/project/svn/bak/ssh.js", "utf-8");
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
const localDirectory = `${localRoot}/template/upload`

const conn = new Client();

const uploadDir = `${localDirectory}/new`
const originalDir = `${localDirectory}/original`

function downloadFiles() {
  return new Promise(function(resolve, reject) {
    const command = `scp -r ${remoteDirectory} ${originalDir}`
    console.log('下载文件到: ' + originalDir)
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      resolve()
    });
  })
}

function execCommand(command, callback) {
  return new Promise(function(resolve, reject) {
    conn.exec(command, function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
        console.log('3-Stream:: close :: code: ' + code + ', signal: ' + signal);
        resolve()
      }).on('data', function(data) {
        console.log('1-STDOUT: ' + data);
      }).stderr.on('data', function(data) {
        console.log('2-STDERR: ' + data);
      });
    }, reject);
  })
}


function ssh() {
  conn.on('ready', function() {
    console.log('Client :: ready');
    execCommand(`mkdir ${remotePath}/chenwen`).
    then(function() {
      return execCommand(`cp -r ${remotePath}/css ${remotePath}/chenwen`)
    }).then(function() {
      return downloadFiles()
    }).then(function() {
      console.log('克隆新的更新副本：' + uploadDir)
      fsextra.copySync(originalDir, uploadDir)
    })
  }).connect(config);
}

// ssh()
/**
 * 更新本地文件
 * @return {[type]} [description]
 */
function updateLocalFiles(originaFiles) {
  for (let fileType in originaFiles) {
    let fileName = originaFiles[fileType]
    fsextra.copySync(`${localRoot}/dist/${fileName}`, `${uploadDir}/www/${fileType}/${fileName}`)
  }
  console.log('更新本地文件完毕')
}

updateLocalFiles({
  lib: ['xxtppt.js', 'version.js'],
  css: ['font.css', 'xxtppt.css']
})
