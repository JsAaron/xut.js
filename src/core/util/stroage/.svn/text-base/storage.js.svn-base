import { config } from '../../config/index'

let onlyId

const TAG = 'aaron'
const storage = window.localStorage

/*
过滤
 */
const filter = (key) => {
  //添加头部标示
  if (onlyId) {
    return key + onlyId
  } else {
    if (!config.data.appId) {
      config.data.appId = 'aaron-' + new Date().getDate();
    }
    //子文档标记
    const sub = window.SUbCONFIGT && window.SUbCONFIGT.dbId ? "-" + window.SUbCONFIGT.dbId : ''
    onlyId = "-" + config.data.appId + sub
  }
  return key + onlyId;
}


/**
 * 设置localStorage
 * @param {[type]} key [description]
 * @param {[type]} val [description]
 */
export function setStorage(key, val) {
  var setkey;

  if (_.isObject(key)) {
    for (var i in key) {
      if (key.hasOwnProperty(i)) {
        setkey = filter(i);
        storage.setItem(setkey, key[i])
      }
    }
  } else {
    key = filter(key);
    storage.setItem(key, val);
  }
}


/**
 * 获取localstorage中的值
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
export function getStorage(key) {
  key = filter(key);
  const value = storage.getItem(key)
  //storage为null string的情况
  if (!value || value && value == 'null') {
    return undefined
  }
  return storage.getItem(key)
}


/**
 * 删除localStorage中指定项
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
export function removeStorage(key) {
  key = filter(key);
  storage.removeItem(key);
}

/**
 * 重设缓存的UUID
 * 为了只计算一次
 * @return {[type]} [description]
 */
export function clearStorageId() {
  onlyId = null
}
