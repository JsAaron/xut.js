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
        anminJson = (new Function("return " + itemArray))();
    }
    return anminJson;
}


/**
 * 创建一个纯存的hash对象
 */
export function hash() {
    return Object.create(null)
}
