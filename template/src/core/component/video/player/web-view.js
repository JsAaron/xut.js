/**
 * webView弹出框
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
const webView = options => {

  const { width, height, pageUrl, left, top } = options

  const play = () => {
    //打开一个网页的时候，需要关闭其他已经打开过的网页
    Xut.Plugin.WebView.close();
    Xut.openWebView = false;
    setTimeout(() => {
      Xut.Plugin.WebView.open(pageUrl, left, top, height, width, 1);
      Xut.openWebView = true;
    }, 500);
  }

  const close = () => {
    Xut.Plugin.WebView.close();
    Xut.openWebView = false;
  }

  play()

  return {
    play,
    close,
    stop: close
  }
}
