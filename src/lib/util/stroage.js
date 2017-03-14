import { config } from '../config/index'

let onlyId

const TAG = 'aaron'
const storage = window.localStorage

/*
如果数据库为写入appid ,则创建
 */
const createAppId = function() {
  //添加UUID
  var appId = 'aaron-' + new Date().getDate();
  //写入数据库
  config.db && config.db.transaction(function(tx) {
    tx.executeSql("UPDATE Setting SET 'value' = " + appId + " WHERE [name] = 'appId'", function() {}, function() {});
  }, function() {
    //  callback && callback();
  }, function() {
    //  callback && callback();
  });
  return appId;
}

/*
过滤
 */
const filter = (key) => {
  //添加头部标示
  if(onlyId) {
    return key + onlyId
  } else {
    if(!config.appId) {
      config.appId = createAppId()
    }
    //子文档标记
    const sub = window.SUbCONFIGT && window.SUbCONFIGT.dbId ? "-" + window.SUbCONFIGT.dbId : ''
    onlyId = "-" + config.appId + sub
  }
  return key + onlyId;
}


const set = (key, val) => {
  var setkey;

  //ipad ios8.3setItem出问题
  function setItem(key, val) {
    try {
      storage.setItem(key, val);
    } catch(e) {
      console.log('storage.setItem(setkey, key[i]);')
    }
  }

  if(_.isObject(key)) {
    for(var i in key) {
      if(key.hasOwnProperty(i)) {
        setkey = filter(i);
        setItem(setkey, key[i])
      }
    }
  } else {
    key = filter(key);
    setItem(key, val);
  }
}

const get = (key) => {
  key = filter(key);
  return storage.getItem(key) || undefined
}


/**
 * *按索引值获取存储项的key
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
export function _key(index) { //本地方法
  return storage.key(index);
}


/**
 * 设置localStorage
 * @param {[type]} key [description]
 * @param {[type]} val [description]
 */
export {set as $$set }

/**
 * 获取localstorage中的值
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
export {get as $$get }

/**
 * 删除localStorage中指定项
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
export function $$remove(key) {
  key = filter(key);
  storage.removeItem(key);
}

/**
 * 重设缓存的UUID
 * 为了只计算一次
 * @return {[type]} [description]
 */
export function $$resetUUID() {
  onlyId = null
}

/**
 * 序列化
 * @return {[type]} [description]
 */
export function $$fetch() {
  return JSON.parse(get(name || TAG) || '[]');
}


export function $$save(name, val) {
  set(name || TAG, JSON.stringify(val));
}
