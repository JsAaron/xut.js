
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
        console.log('解析json出错'+ itemArray)
    }
    return json;
}


/**
 * 创建一个纯存的hash对象
 */
export function hash() {
    return Object.create(null)
}
