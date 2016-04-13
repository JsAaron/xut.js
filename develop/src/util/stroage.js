var dbId,
    onlyId,
    storage = window.localStorage;

const TAG = 'aaron'

//如果数据库为写入appid ,则创建
var createAppid = function() {
    //添加UUID
    var appId = 'aaron-' + new Date().getDate();
    //写入数据库
    Config.db && Config.db.transaction(function(tx) {
        tx.executeSql("UPDATE Setting SET 'value' = " + appId + " WHERE [name] = 'appId'", function() {}, function() {});
    }, function() {
        //  callback && callback();
    }, function() {
        //  callback && callback();
    });
    return appId;
}

//过滤
var filter = function(key) {
    //添加头部标示
    if (onlyId) {
        return key + onlyId;
    } else {
        if (!Config.appUUID) {
            Config.appUUID = createAppid();
        }
        //子文档标记
        if (SUbCONFIGT && SUbCONFIGT.dbId) {
            onlyId = "-" + Config.appUUID + "-" + SUbCONFIGT.dbId;
        } else {
            onlyId = "-" + Config.appUUID;
        }
    }
    return key + onlyId;
};

/**
 * *按索引值获取存储项的key
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
export function key(index) { //本地方法
    return storage.key(index);
};

/**
 * 设置localStorage
 * @param {[type]} key [description]
 * @param {[type]} val [description]
 */
export function set(key, val) {
    var setkey;

    //ipad ios8.3setItem出问题
    function set(key, val) {
        try {
            storage.setItem(key, val);
        } catch (e) {
            console.log('storage.setItem(setkey, key[i]);')
        }
    }

    if (typeof key === 'object') {
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
};

/**
 * 获取localstorage中的值
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
export function get(key) {
    key = filter(key);
    return storage.getItem(key);
};

/**
 * 删除localStorage中指定项
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
export function remove(key) {
    key = filter(key);
    storage.removeItem(key);
};

/**
 * 序列化
 * @return {[type]} [description]
 */
export function fetch() {
    return JSON.parse(get(name || TAG) || '[]');
}


export function save(name, val) {
    set(name || TAG, JSON.stringify(val));
}