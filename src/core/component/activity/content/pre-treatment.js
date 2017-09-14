/////////////////////////////////
///  预处理
///  1.动画直接改变显示隐藏状态
///  2.动画直接执行脚本
/////////////////////////////////

import { cleanImage } from '../../../util/option'


export default function pretreatment(data, eventName) {
  const parameter = data.getParameter()

  ///////////////////////////////////////////////////////////////
  //如果是apng、webp、gif的图片
  //在线性模式，由于预加载一页的原理，会让apng提前在非可视区运行
  //所以规定
  //1 如果是显示动画中绑定了apng、webp、gif的资源，那么就需要动态处理
  //2 在dom阶段创建了所有的img.src 在ppt动画阶段需要判断，删除后动态处理
  ///////////////////////////////////////////////////////////////
  const fileName = data.contentData.md5
  if (fileName && /^apng_|gif$/i.test(fileName)) {
    data.useDynamicDiagram = true //标记动画图片动画
  }

  //过滤预生成动画
  if (parameter && parameter.length === 1) {
    const category = data.contentData.category
    const para = parameter[0];

    if (para.animationName === 'EffectAppear' && //出现动画
      data.domMode && //并且只有dom模式才可以，canvas排除
      eventName === 'auto' && //自动运行
      !para.videoId && //没有音频
      !para.delay && //没有延时
      category !== 'Sprite' && //不是精灵
      category !== 'AutoCompSprite' && //不是自动精灵
      !/"inapp"/i.test(para.parameter)) { //并且不能是收费处理


      ///////////////////////////////////////////////////////////////
      //针对预处理动作,并且没有卷滚的不注册，满足是静态动画，true是显示,false隐藏
      ///////////////////////////////////////////////////////////////
      if (!para.preCode && !para.postCode) {
        return data.prepVisible = /"exit":"False"/i.test(para.parameter) === true ? 'visible' : 'hidden';
      }

      ///////////////////////////////////////////////////////////////
      //如果有脚本，可能是针对迷你杂志跳转的数据
      //需要通过onclick绑定，那么就截断这个数据
      /////////////////////////////////////////////////////////////////
      if (para.preCode) {

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
        if (-1 !== para.preCode.indexOf('XXTAPI.PreCode')) {
          return data.prepTag = para.preCode
        }

        //方式二
        ;
        ['window.location.href', 'window.open'].forEach(function(url) {
          if (-1 !== para.preCode.indexOf(url)) {
            return data.prepScript = para.preCode
          }
        })
        if (data.prepScript) {
          return data.prepScript
        }
      }
    }
  }
}
