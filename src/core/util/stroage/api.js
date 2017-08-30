/////////////////////////////////////////////////////////////////////
///
///  默认用H5的localStorage保存数据
///  例外：safari开启了
///  1 safari无痕模式下被禁用的localStorage，不可写，只能读
///  2 有些机型不能存储信息到localStorage中,微信中通过cookie方式单独修复，直接用浏览器不可以
///
/////////////////////////////////////////////////////////

import { setStorage, getStorage, removeStorage, clearStorageId } from './storage'
import { setCookie, getCookie, removeCookie } from './cookie'

const supportPlat = function(storage, cookie) {
  if (Xut.plat.supportStorage) {
    return storage
  } else {
    /*微信支持cookie*/
    if (Xut.plat.isWeiXin) {
      return cookie
    }
    /*剩余就下ios的safari无痕模式*/
    /*无痕模式用cookie暂时替代，至少在不关闭浏览器的情况有一定作用*/
    return cookie
  }
}


const SET = supportPlat(setStorage, setCookie)
const GET = supportPlat(getStorage, getCookie)
const REMOVE = supportPlat(removeStorage, removeCookie)
const CLEAR = supportPlat(clearStorageId, clearStorageId)


/**
 * 设置localStorage
 * @param {[type]} key [description]
 * @param {[type]} value [description]
 */
export function $setStorage(key, value) {

  if (!key) {
    return
  }

  //字符串
  if (_.isString(key) && value !== undefined) {
    SET(key, value)
  }

  //对象
  if (_.isObject(key)) {
    for (let i in key) {
      $setStorage(i, key[i])
    }
  }

}

/**
 * 获取localstorage中的值
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
export function $getStorage(key) {
  if (key) {
    return GET(key)
  }
}


/**
 * 删除localStorage中指定项
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
export function $removeStorage(key) {
  if (key) {
    REMOVE(key)
  }
}

/**
 * 退出清理
 * @return {[type]} [description]
 */
export function clearId() {
  CLEAR()
}
