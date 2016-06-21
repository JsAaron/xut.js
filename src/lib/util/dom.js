
/**
 * /解析json字符串
 * @param  {[type]} itemArray [description]
 * @return {[type]}           [description]
 */
export function parseJSON(itemArray) {
    var anminJson;
    try {
        anminJson = JSON.parse(itemArray);
    } catch (error) {
        console.log('parseJSON失败')
        // anminJson = (new Function("return " + itemArray))();
    }
    return anminJson;
}


export function execJson(itemArray) {
    var json;
    try {
        json = (new Function("return " + itemArray))();
    } catch (error) {
        console.log('解析json出错' + itemArray)
    }
    return json;
}


/**
 * 回车符处理
 */
export function enterReplace(str) {
    return str.replace(/\r\n/ig, '').replace(/\r/ig, '').replace(/\n/ig, '');
}

