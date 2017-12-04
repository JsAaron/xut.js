import { config } from '../config/index'
import { $setStorage, $getStorage, $removeStorage, execScript, $warn } from '../util/index'

/**
 * 设置缓存，必须要可设置
 */
function saveData() {
  if (config.launch.historyMode) {
    const data = config.data
    $setStorage({ "pageIndex": data.pageIndex, "novelId": data.novelId })
  } else {
    //清理
    if ($getStorage('novelId')) {
      $removeStorage('pageIndex')
      $removeStorage('novelId')
    }
  }
}

/**a
 * 初始化值
 * @param {[type]} options [description]
 */
function initDefaultValues(options) {
  return {
    'novelId': Number(options.novelId),
    'pageIndex': Number(options.pageIndex),
    'history': options.history
  }
};


/**
 * 检测脚本注入
 * @return {[type]} [description]
 */
function runScript() {
  let preCode, novels = Xut.data.query('Novel')
  if (preCode = novels.preCode) {
    execScript(preCode, 'novelpre脚本')
  }
}

/**
 * 加载主场景
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export default function(options) {

  options = initDefaultValues(options || {});

  config.data.novelId = options.novelId;
  config.data.pageIndex = options.pageIndex;

  //设置缓存
  saveData()

  //应用脚本注入
  runScript();

  //检测下seasonId的正确性
  //seasonId = 1 找不到chapter数据
  //通过sectionRelated递归检测下一条数据
  let seasonId, seasondata, i;
  for (i = 0; i < Xut.data.Season.length; i++) {
    seasondata = Xut.data.Season.item(i)
    if (Xut.data.query('sectionRelated', seasondata._id)) {
      seasonId = seasondata._id
      break;
    }
  }

  $warn('logic', '加载主场景')

  //加载新的场景
  Xut.View.LoadScenario({
    'main': true, //主场景入口
    'seasonId': seasonId,
    'pageIndex': options.pageIndex,
    'history': options.history
  }, function() {

    $warn('logic', '主场景加载完毕')

    /*应用初始化加载完毕*/
    Xut.Application.Notify('initComplete')

    /*发送初始化完毕代码跟踪*/
    config.sendTrackCode('init', { time: (+new Date) - config.launch.launchTime })
  })
}
