var net = require('net');
var server = net.createServer(function  (conn) {
	console.log('1111')
	// body...
})

server.listen(3000,function(){
	console.log(2222)
})