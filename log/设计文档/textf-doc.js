文本动画效果有两种使用情况：
1：单独使用，没有Animation数据
2：混合使用，配合Animation数据

设计思路：
A:整个杂志的设计的时候，文本content对象都会初始化了Animation表的数据的(只有提供给零件使用的卷滚条处理时例外)，所以为了简单化，可以规定如果有texteffect的文本，都可以必须有Animation表的数据，这样处理可以统一文本的动画的处理
B:Animation表中，有个preCode，postCode的脚本的处理，也可以让文字动画统一成脚本调用即可,这样跟动画保持高度一致性，接口名暂定，Xut.Assist.TextFx(content的ID编号)，这样处理后不同的文本动画对象，都可以任意调用，可以延时，可以配合动画
C:因为texteffect效果初始化会改变DOM的文字结构，所以为了尽可能的优化DOM的渲染，所以在的content做一个标记 texteffect 写true，无需什么格式

生成数据：
1：文字动画只支持html结构，文件需要写成.js结尾的，文件内部数据格式： window.HTMLCONFIG['文件名'] = "<div>动画效果</div>"
2：对应的content做一个标记 texteffect 写true就可以了，无需规定什么规格
3：Animation表中，有个preCode，postCode的脚本的处理，脚本代码：Xut.Assist.TextFx(content的ID编号)



