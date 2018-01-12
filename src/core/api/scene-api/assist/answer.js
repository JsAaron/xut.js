//========================
// 秒秒学嵌套Iframe  答题卡
//========================

export function extendAnswer(access, $$globalSwiper) {

  /**
   * 设置答题卡的正确错误率
   */
  function setAnswer(event) {
    console.log(event)
  }

  /**
   * 秒秒学答题卡
   * 正确性
   */
  Xut.Assist.AnswerRight = () => setAnswer('right')

  /**
   * 秒秒学答题卡
   * 错误性
   */
  Xut.Assist.AnswerError = () => setAnswer('error')

}
