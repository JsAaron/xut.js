var fs = require('fs');
var path = require('path');


// 写文件
fs.readFile(__dirname + '/text.txt', 'utf-8', function(err, data) {
    // console.log(data)
})


// 写文件
var w_data = '这是一段通过fs.writeFile函数写入的11内容；\r\n';
var w_data = new Buffer(w_data);
fs.writeFile(__dirname + '/text1.txt', w_data, {
    falg: 'a'
}, function(err) {

})


// 追加写入
fs.appendFile(__dirname + '/text2.txt', w_data, function() {

})


fs.open(__dirname + '/text1.txt', 'r', '0666', function(err, fd) {
    // console.log(fd);
});


fs.open(__dirname+'/text.txt','r',function(){

	var buffer = new Buffer(255);

	console.log(buffer.length)

})  