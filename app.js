var http = require('http');
var server = new http.Server();
server.on('request', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write('<h1>Node.js1</h1>');
    res.end('<p>Hello World</p>');
});
server.listen(3000);


// var http = require('http');
// http.createServer(function(req, res) {
//     res.writeHead(200, {
//         'Content-Type': 'text/html'
//     });
//     res.write('<h1>Node.js</h1>');
//     res.end('<p>Hello World</p>');
// }).listen(3000);
// console.log("HTTP server is listening at port 3000.");


// var fs = require('fs')

// fs.open('text.txt', 'r', function(err, fd) {

//     if (err) {
//         console.error(err);
//         return;
//     }

//     var buf = new Buffer(8);
//     fs.read(fd, buf, 0, 8, null, function(err, bytesRead, buffer) {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         console.log('bytesRead: ' + bytesRead);
//         // console.log(buffer); 
//     })

// })

// fs.readFile('text.txt','utf-8',function(err,data){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log(data)
// 	}
// })


// console.log(
// 	new Buffer('aaron')
// 	)
