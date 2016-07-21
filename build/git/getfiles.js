/**
 * 获取文件夹下面的所有的文件(包括子文件夹)
 * @param {String} dir
 * @param {Function} callback
 * @returns {Array}
 */
module.exports  = (dir, callback) => {
    var filesArr = [];
    dir = ///$/.test(dir) ? dir : dir + '/';
        (function dir(dirpath, fn) {
            var files = fs.readdirSync(dirpath);
            exports.async(files, function(item, next) {
                var info = fs.statSync(dirpath + item);
                if (info.isDirectory()) {
                    dir(dirpath + item + '/', function() {
                        next();
                    });
                } else {
                    filesArr.push(dirpath + item);
                    callback && callback(dirpath + item);
                    next();
                }
            }, function(err) {
                !err && fn && fn();
            });
        })(dir);
    return filesArr;
}
