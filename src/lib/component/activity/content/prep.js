/////////////////////////////////
///  预处理
///  1.动画直接改变显示隐藏状态
///  2.动画直接执行脚本
/////////////////////////////////

export default function pretreatment(data, eventName) {
  let parameter = data.getParameter()

  //过滤预生成动画
  if(parameter && parameter.length === 1) {
    let category = data.contentDas.category
    let para = parameter[0];

    if(para.animationName === 'EffectAppear' //出现动画
      &&
      data.domMode //并且只有dom模式才可以，canvas排除
      &&
      eventName === 'auto' //自动运行
      &&
      !para.videoId //没有音频
      &&
      !para.delay //没有延时
      &&
      category !== 'Sprite' //不是精灵
      &&
      category !== 'AutoCompSprite' //不是自动精灵
      &&
      !/"inapp"/i.test(para.parameter)) { //并且不能是收费处理

      //针对预处理动作,并且没有卷滚的不注册，满足是静态动画，true是显示,false隐藏
      if(!para.preCode && !para.postCode) {
        return data.prepVisible = /"exit":"False"/i.test(para.parameter) === true ? 'visible' : 'hidden';
      }

      //如果有脚本，可能是针对迷你杂志跳转的数据
      //需要通过onclick绑定，那么就截断这个数据
      if(para.preCode) {

        //方式一
        //通过创建a标签的处理跳转
        // window.XXTAPI.PreCode = [url, function() {
        //   if (plat === 'iOS') {
        //     $.post("http://www.kidreadcool.com/downloads.php", {
        //       esp: "mios",
        //       url: "mindex1"
        //     }, null, "json");
        //   }
        // }]
        if(-1 !== para.preCode.indexOf('XXTAPI.PreCode')) {
          return data.prepTag = para.preCode
        }

        //方式二
        ;
        ['window.location.href', 'window.open'].forEach(function(url) {
          if(-1 !== para.preCode.indexOf(url)) {
            return data.prepScript = para.preCode
          }
        })
        if(data.prepScript) {
          return data.prepScript
        }
      }
    }
  }
}