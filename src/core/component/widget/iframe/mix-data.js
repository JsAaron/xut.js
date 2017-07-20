/*
混入图片数据
 */
export default function mixData(inputPara) {
  let [item, field, token] = [undefined]
  let source = []
  let images = Xut.data['Image']
  let items = inputPara.source
  for(item in items) {
    if(items.hasOwnProperty(item)) {
      field = {};
      token = images.item((parseInt(items[item]) || 1) - 1);
      field['img'] = '../gallery/' + token.md5;
      field['thumb'] = '';
      field['title'] = token.imageTitle;
      source.push(field);
    }
  }
  inputPara.source = source
  return inputPara
}
