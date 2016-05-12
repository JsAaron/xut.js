/****************************************************
 *
 *         	缓存池
 *
 * ***************************************************/
//创建缓存
function createCache() {
    var keys = [];

    function cache(key, value) {
        if (keys.push(key) > 20) {
            delete cache[keys.shift()];
        }
        return (cache[key] = value);
    }
    return cache;
}
var contentCache = createCache()

export {contentCache}