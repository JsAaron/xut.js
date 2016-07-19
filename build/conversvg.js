const fs = require("fs")
const _ = require("underscore")
const stats = []
const relative = 'content/gallery'

const readFile = function(path) {
    return fs.readFileSync(path, {
        flag: 'r+',
        encoding: 'utf8'
    })
}

const writeFile = function(filename, content) {
    fs.writeFileSync(filename, content, {
        encoding: 'utf8',
        flag: 'w+'
    })
}

module.exports = function(src) {
    var filename, readPath, str, data, handle, svgfiles, total, count
    var galleryPath = src + relative
    var convertedPath = galleryPath + '/converted.txt'

    var exists = fs.existsSync(convertedPath)
    if (exists) {
        data = readFile(convertedPath)
        if (data) {
            console.log('【Cache: ' + data + ' SVG  files have been converted】')
            return
        }
    }

    svgfiles = [];
    files = fs.readdirSync(galleryPath)

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
        readPath = galleryPath + '/' + filename;
        data = readFile(readPath)

        filename = filename.replace('.svg', '')
        str = 'window.HTMLCONFIG[\'' + filename + '\']=' + JSON.stringify(data)

        handle = writeFile(galleryPath + '/' + filename + '.js', str)
        if (handle) {
            console.log('【Convert SVG failure】')
            return
        }

        if (!count) {
            console.log('【' + total + ' SVG  files have been converted】')
            writeFile(convertedPath, total)
            return
        }
        count--
    }

}
