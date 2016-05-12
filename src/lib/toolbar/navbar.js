 /**
  * 目录列表
  * @param  {[type]} hindex    [description]
  * @param  {[type]} pageArray [description]
  * @param  {[type]} modules   [description]
  * @return {[type]}           [description]
  *
  */

 let config = Xut.config
 let pageIndex = 0
 let prefix = Xut.plat.prefixStyle
 let _layoutMode = config.layoutMode
 let initializeBusy = false
 let sectionInstance = null
 let directory = 'images/icons/directory.png'
 let directory_act = 'images/icons/directory_act.png'
 let lockAnimation //动画加锁

 /*********************************************************************
  *                 下拉章节列表                                      *
  **********************************************************************/

 function SectionList(artControl) {
     var me = this,
         pageArray = [];

     Xut.data.query('Chapter', Xut.data.novelId, 'seasonId', function(item) {
         pageArray.push(item);
     })

     this.pageArray = pageArray;

     // //显示下拉菜单
     Xut.nextTick({
         'container': artControl,
         'content': SceneLayout.nav(pageArray)
     }, function() {
         me.userIscroll();
         sectionInstance = me;
         initialize();
     });
 };


 SectionList.prototype = {
     userIscroll: function() {
         var me = this,
             hBox = this.hBox,
             H = !!(_layoutMode === 'horizontal'),
             //滑动到指定章节
             list = this.list = $('#SectionThelist li'),
             ele = list.eq(pageIndex)[0];

         if (hBox) {
             if (H) {
                 hBox.goToPage(pageIndex, 0, 0);
             } else {
                 hBox.goToPage(0, pageIndex, 0);
             }
         } else {
             hBox = new iScroll('#SectionWrapper', {
                 snap: 'li',
                 tap: true,
                 scrollX: H,
                 scrollY: !H,
                 scrollbars: true,
                 fadeScrollbars: true,
                 stopPropagation: true
             });
             hBox.on('scrollEnd', function(e) {
                 me.createThumb();
                 me.removeThumb();
             });

             $('#SectionThelist').on('tap', this.clickElement);
             this.hBox = hBox;
         }
     },
     /**
      * [ 创建缩略图]
      * @return {[type]} [description]
      */
     createThumb: function() {
         var index = this.getPageIndex(), //最左边的索引
             count = this.getViewLen(), //允许显示的页数
             createBak = this.createBak || [], //已创建的页码索引
             createNew = [], //新建的页码索引
             pageArray = this.pageArray,
             list = this.list,
             maxLen = pageArray.length,
             path = config.pathAddress;

         //确保不会溢出
         count = count > maxLen ? maxLen : count;
         //尽可能地填满
         index = index + count > maxLen ? maxLen - count : index;

         for (var i = 0; i < count; i++) {
             var j = index + i,
                 page = pageArray[j];

             createNew.push(j);

             if (_.contains(createBak, j)) continue;

             createBak.push(j);

             //如果是分层母板了,此时用icon代替
             if (page.iconImage) {
                 list.eq(j).css({
                     'background-image': 'url(' + path + page.iconImage + ')'
                 });
             } else {
                 list.eq(j).css({
                     'background-image': 'url(' + path + page.md5 + ')',
                     'background-color': 'white'
                 });
             }
         }

         this.createNew = createNew;
         this.createBak = createBak;
     },
     /**
      * [ 清理隐藏的缩略图]
      * @return {[type]} [description]
      */
     removeThumb: function() {
         var list = this.list,
             createNew = this.createNew,
             createBak = this.createBak;

         _.each(createBak, function(val, i) {
             if (!_.contains(createNew, val)) {
                 //标记要清理的索引
                 createBak[i] = -1;
                 list.eq(val).css({
                     'background': ''
                 });
             }
         });

         //执行清理
         this.createBak = _.without(createBak, -1);
     },

     /**
      * [ 得到滑动列表中最左侧的索引]
      * @return {[type]} [description]
      */
     getPageIndex: function() {
         if (this.hBox.options.scrollX) {
             return this.hBox.currentPage.pageX;
         } else {
             return this.hBox.currentPage.pageY;
         }

     },

     /**
      * [ 获取待创建的缩略图的个数]
      * @return {[type]} [description]
      */
     getViewLen: function() {
         var hBox = this.hBox,
             eleSize = 1, //单个li的高度,
             count = 1,
             len = this.pageArray.length; //li的总数

         if (_layoutMode === 'horizontal') {
             eleSize = hBox.scrollerWidth / len;
             count = hBox.wrapperWidth / eleSize;
         } else {
             eleSize = hBox.scrollerHeight / len;
             count = hBox.wrapperHeight / eleSize;
         }
         //多创建一个
         return Math.ceil(count) + 1;
     },

     touchCallback: function(env) {
         var absDistX = this.hBox.absDistX;
         if (!absDistX) {
             this.hBox.swipe = true;
             this.clickElement(env);
         }

     },

     clickElement: function(env) {
         var target = env.target,
             xxtlink;

         if (target) {
             initializeBusy = true;
             initialize();
             if (xxtlink = target.getAttribute('data-xxtlink')) {
                 xxtlink = xxtlink.split('-');
                 Xut.View.GotoSlide(xxtlink[0], xxtlink[1]);
             }
         }
     },

     resetList: function() {
         return initialize();
     },

     scrollTo: function() {
         this.userIscroll();
     },

     refresh: function() {
         this.hBox && this.hBox.refresh();
     },

     destroy: function() {
         if (this.hBox) {
             $('#SectionThelist').off('tap', this.clickElement);
             this.hBox.destroy();
             this.hBox = null;
         }
         this.pageArray = null;
     }

 }

 //执行动画
 function toAnimation(navControlBar, navhandle, action) {
     var end = function() {
         navControlBar.css(prefix('transition'), '');
         Xut.View.HideBusy();
         lockAnimation = false;
     };

     if (action == 'in') {
         sectionInstance.refresh();
         sectionInstance.scrollTo();
         navControlBar.animate({
             'z-index': Xut.zIndexlevel(),
             'opacity': 1
         }, 'fast', 'linear', function() {
             navhandle.attr('fly', 'out');
             end();
         });
     } else {
         navhandle.attr('fly', 'in');
         navControlBar.hide();
         end();
     }
 }


 //控制按钮改变
 function navControl(action, navhandle) {
     navhandle.css('opacity', action === "in" ? 0.5 : 1);
 }


 function initialize() {
     //动画状态
     if (lockAnimation) {
         return false;
     }

     lockAnimation = true;
     Xut.View.ShowBusy();
     startpocess();
 };


 function startpocess() {
     //控制按钮
     var navhandle = $("#backDir"),
         action = navhandle.attr('fly') || 'in',
         navControlBar = $("#navBar");

     //初始化样式
     initStyle(navControlBar, action, function() {
         //触发控制条
         navControl(action, navhandle);
         //执行动画
         toAnimation(navControlBar, navhandle, action);
     })
 };


 function initStyle(navControlBar, action, fn) {
     sectionInstance.state = false;
     if (action == 'in') {
         sectionInstance.state = true;
         navControlBar.css({
             'z-index': 0,
             'opacity': 0,
             'display': 'block'
         });
     }
     fn && fn();
 }

 /**
  * 销毁对象
  * @return {[type]} [description]
  */
 function destroy() {
     if (sectionInstance) {
         sectionInstance.destroy();
         sectionInstance = null;
     }
 };


 /**
  * 预先缓存加载
  * @return {[type]} [description]
  */
 function load() {
     new SectionList($("#navBar"));
 };
 

 //关闭
 function close(callback) {
     if (sectionInstance && sectionInstance.state) {
         callback && callback();
         initialize();
     }
 }

 function init(index) {
     pageIndex = index;
     if (sectionInstance) {
         initialize();
     } else {
         load();
     }
 }


 export {
     load,
     init,
     close,
     destroy
 };
  