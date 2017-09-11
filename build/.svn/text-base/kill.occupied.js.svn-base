const net = require('net')
const cp = require('child_process');
const util = require('./util')

module.exports = (port, callback) => {
  var server, killPort

  server = net.createServer().listen(port)
  server.on('listening', () => {
    server.close()
    util.log(`The port ${port} is available.`, 'prompt')
    callback()
  })

  killPort = (pid) => {
    cp.exec('kill -9 ' + pid, (e, stdout, stderr) => {
      if (e) {
        util.log(`Command kill -9 ${pid} fails`, 'error')
      } else {
        util.log(`Command kill -9 ${pid} success`, 'prompt')
        callback()
      }
    })
  }

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      util.log(`The port ${port} is occupied, please waiting.`, 'prompt')
      var command = 'lsof -i:' + port
      cp.exec(command, (e, stdout, stderr) => {　　
        if (e) {
          util.log(`Command ${command} fails`, 'error')
        }　
        else {　　
          var pid = /node(\s*)(\d+)/ig.exec(stdout)[2]
          killPort(Number(pid))
        }
      })
    }
  })
}
