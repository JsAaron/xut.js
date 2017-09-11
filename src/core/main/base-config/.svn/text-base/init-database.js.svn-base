import { createStore } from 'database/index'
import { config } from '../../config/index'

/**
 * 数据库支持
 * @return {[type]} [description]
 */
const supportTransaction = (callback) => {
  if(window.openDatabase) {
    try {
      //数据库链接对象
      config.data.db = window.openDatabase(config.data.dbName, "1.0", "Xxtebook Database", config.data.dbSize);
    } catch(err) {
      console.log('window.openDatabase出错')
    }
  }

  //如果读不出数据
  if(config.data.db) {
    config.data.db.transaction(function(tx) {
      tx.executeSql('SELECT * FROM Novel', [], function(tx, rs) {
        callback()
      }, function() {
        config.data.db = null
        callback()
      })
    })
  } else {
    callback()
  }
}

/*
初始化数据库Store
 */
const initStore = function(callback) {
  createStore((dataRet) => callback(dataRet))
}

/**
 * 初始化
 * 数据结构
 */
export default function(hasResults, callback) {
  if(hasResults) {
    config.data.db = null
    initStore(callback)
    return
  }
  /*如果没有外链数据，需要查找本地是否支持*/
  supportTransaction(function() {
    initStore(callback)
  })
}
