const fs = require("fs")
const _ = require("underscore")
const stats = []

const readFile = (path) => {
    let data =  fs.readFileSync(path, {
        // flag: 'r+',
        encoding: 'utf8'
    })
    return data
}

const writeFile = (filename, content) => {
    fs.writeFileSync(filename, content, {
        encoding: 'utf8',
        flag: 'w+'
    })
}


const convert = function(path) {
    var filename,
        readPath,
        str,
        data,
        handle,
        svgfiles,
        total,
        count

    let convertedPath = path + '/converted.txt'
    let exists = fs.existsSync(convertedPath)
    if (exists) {
        data = readFile(convertedPath)
        if (data) {
            console.log(`【Cache:${data} SVG, path is: ${convertedPath}】`)
            return
        }
    }

    svgfiles = [];
    files = fs.readdirSync(path)

    if (!files.length) {
        console.log('【No SVG files】')
        return
    }

    _.each(files, function(url, index) {
        if (/.svg$/i.test(url)) {
            svgfiles.push(url);
        }
    })

    total = svgfiles.length
    count = total - 1

    while (count >= 0) {
        filename = svgfiles[count]
        readPath = path + '/' + filename;
        data = readFile(readPath)

        filename = filename.replace('.svg', '')
        str = 'window.HTMLCONFIG[\'' + filename + '\']=' + JSON.stringify(data)

        handle = writeFile(path + '/' + filename + '.js', str)
        if (handle) {
            console.log('【Convert SVG failure】')
            return
        }else{
            console.log(`【converted SVG is ${readPath}`)
        }

        if (!count) {
            console.log(`【converted: ${total} SVG】`)
            writeFile(convertedPath, total)
            return
        }
        count--
    }
}


module.exports = function(src) {
    var path = src + 'content/'
    var files = fs.readdirSync(path)
    _.each(files, function(file) {
        var stat = fs.lstatSync(path + file);
        if (stat.isDirectory()) {
            //root目录下有gallery
            if (file == 'gallery' || file == 'widget') {
                convert(path + file)
            } else {
                convert(path + file + '/gallery')
            }
        }
    })
    return
}
