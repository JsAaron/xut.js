let dbId,onlyId

const TAG = 'aaron'
const storage = window.localStorage

//如果数据库为写入appid ,则创建
const createAppid = function() {
    //添加UUID
    var appId = 'aaron-' + new Date().getDate();
    //写入数据库
    Xut.config.db && Xut.config.db.transaction(function(tx) {
        tx.executeSql("UPDATE Setting SET 'value' = " + appId + " WHERE [name] = 'appId'", function() {}, function() {});
    }, function() {
        //  callback && callback();
    }, function() {
        //  callback && callback();
    });
    return appId;
}

//过滤
const filter = function(key) {
    //添加头部标示
    if (onlyId) {
        return key + onlyId;
    } else {
        if (!Xut.config.appUUID) {
            Xut.config.appUUID = createAppid();
        }
        //子文档标记
        if (window.SUbCONFIGT && window.SUbCONFIGT.dbId) {
            onlyId = "-" + Xut.config.appUUID + "-" + window.SUbCONFIGT.dbId;
        } else {
            onlyId = "-" + Xut.config.appUUID;
        }
    }
    return key + onlyId;
};

/**
 * *按索引值获取存储项的key
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
export function _key(index) { //本地方法
    return storage.key(index);
};


var set = function name(key, val) {
    var setkey;

    //ipad ios8.3setItem出问题
    function set(key, val) {
        try {
            storage.setItem(key, val);
        } catch (e) {
            console.log('storage.setItem(setkey, key[i]);')
        }
    }

    if (_.isObject(key)) {
        for (var i in key) {
            if (key.hasOwnProperty(i)) {
                setkey = filter(i);
                set(setkey, key[i])
            }
        }
    } else {
        key = filter(key);
        set(key, val);
    }
}

var get = function(key) {
    key = filter(key);
    return storage.getItem(key) || undefined
}

/**
 * 设置localStorage
 * @param {[type]} key [description]
 * @param {[type]} val [description]
 */
export {set as _set }

/**
 * 获取localstorage中的值
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
export {get as _get }

/**
 * 删除localStorage中指定项
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
export function _remove(key) {
    key = filter(key);
    storage.removeItem(key);
};

/**
 * 序列化
 * @return {[type]} [description]
 */
export function _fetch() {
    return JSON.parse(get(name || TAG) || '[]');
}


export function _save(name, val) {
    set(name || TAG, JSON.stringify(val));
}
