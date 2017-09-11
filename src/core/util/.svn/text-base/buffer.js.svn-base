/**
 * 缓存池
 * @return {[type]} [description]
 */
function createCache() {
  let keys = [];

  function cache(key, value) {
    if(keys.push(key) > 20) {
      delete cache[keys.shift()];
    }
    return(cache[key] = value);
  }
  return cache;
}

export let contentCache = createCache()