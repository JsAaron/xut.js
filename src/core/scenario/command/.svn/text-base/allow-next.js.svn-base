/**
 * by 2016.6.30
 * judgment is backstage run
 * Take the opposite judgment
 * @return {[type]} [description]
 */
const allowNext = () => {
  if(window.MMXCONFIG) {
    return() => {
      return !(window.MMXCONFIG.back || Xut.Application.IsBackStage())
    }
  } else {
    return() => {
      return !false
    }
  }
}

export default allowNext()