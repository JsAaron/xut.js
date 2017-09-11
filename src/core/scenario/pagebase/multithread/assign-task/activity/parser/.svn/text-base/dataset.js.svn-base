/**
 * 解析序列中需要的数据
 * @param  {[type]}   contentIds [description]
 * @param  {Function} callback   [description]
 * @return {[type]}              [description]
 */
export function parseContentData(contentIds, callback) {
  var data, temp = [];
  contentIds.forEach(function(contentId, index) {
    data = Xut.data.query('Content', contentId)
    temp.unshift(data)
    callback && callback(data, contentId);
  })
  return temp;
}
