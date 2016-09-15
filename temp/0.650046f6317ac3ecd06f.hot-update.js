webpackHotUpdate(0,{

/***/ 148:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 书签栏
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 加入这个书签功能后，可以让用户自由选择哪页是需要保存记录的
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @param options object
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @example {parent:页面容器,pageId:chapterId,seasonId:seasionId}
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _tap = __webpack_require__(5);

	var _index = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var icons = {
	    hide: 'images/icons/arrowDown.svg'
	};

	/**
	 * 行高
	 * @type {[type]}
	 */
	var sLineHeiht = parseInt($('body').css('font-size')) || 16; //行高

	/**
	 * 书签缓存
	 */
	var BOOKCACHE = void 0;

	var BookMark = function () {
	    function BookMark() {
	        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        var parent = _ref.parent;
	        var pageId = _ref.pageId;
	        var seasonId = _ref.seasonId;

	        _classCallCheck(this, BookMark);

	        this.parent = parent;
	        this.pageId = pageId;
	        this.seasonId = seasonId;

	        this.screenSize = Xut.config.screenSize;
	        this.sHeight = this.screenSize.height;
	        this.sWidth = this.screenSize.width;

	        //是否已存储
	        this.isStored = false;
	        this.init();
	    }

	    /**
	     * 初始化
	     * @return {[type]} [description]
	     */


	    _createClass(BookMark, [{
	        key: 'init',
	        value: function init() {
	            var $bookMark = this.createBookMark(),
	                dom = this.parent[0],
	                that = this;

	            this.parent.append($bookMark);
	            this.bookMarkMenu = $bookMark.eq(0);
	            //显示书签
	            setTimeout(function () {
	                that.restore();
	            }, 20);
	            //获取历史记录
	            BOOKCACHE = this.getHistory();

	            //邦定用户事件
	            (0, _tap.bindTap)(dom, {
	                end: this
	            });
	        }

	        /**
	         * 创建书签
	         * @return {[object]} [jquery生成的dom对象]
	         */

	    }, {
	        key: 'createBookMark',
	        value: function createBookMark() {
	            var height = sLineHeiht * 3,
	                // menu的高为3em
	            box = '<div class="xut-bookmark-menu" style="width:100%;height:{0}px;left:0;top:{1}px;">' + '<div class="xut-bookmark-wrap">' + '<div class="xut-bookmark-add">加入书签</div>' + '<div class="xut-bookmark-off" style="background-image:url({2})"></div>' + '<div class="xut-bookmark-view">书签记录</div>' + '</div>' + '</div>' + '<div class="xut-bookmark-list" style="display:none;width:100%;height:{3}px;">' + '<ul class="xut-bookmark-head">' + '<li class="xut-bookmark-back">返回</li>' + '<li>书签</li>' + '</ul>' + '<ul class="xut-bookmark-body"></ul>' + '</div>';
	            box = String.format(box, height, this.sHeight, icons.hide, this.sHeight);
	            this.markHeight = height;
	            return $(box);
	        }

	        /**
	         * 生成书签列表
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'createMarkList',
	        value: function createMarkList() {
	            var tmp,
	                seasonId,
	                pageId,
	                list = '',
	                box = '',
	                self = this;

	            //取历史记录
	            _.each(BOOKCACHE, function (mark) {
	                tmp = mark.split('-');
	                seasonId = tmp[0];
	                pageId = tmp[1];
	                mark = self.getMarkId(seasonId, pageId);
	                list += '<li><a data-mark="' + mark + '" class="xut-bookmark-id" href="javascript:0">第' + pageId + '页</a><a class="xut-bookmark-del" data-mark="' + mark + '" href="javascript:0">X</a></li>';
	            });

	            return list;
	        }

	        /**
	         * 创建存储标签
	         * 存储格式 seasonId-pageId
	         * @return {string} [description]
	         */

	    }, {
	        key: 'getMarkId',
	        value: function getMarkId(seasonId, pageId) {
	            return seasonId + '-' + pageId;
	        }

	        /**
	         * 获取历史记录
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'getHistory',
	        value: function getHistory() {
	            var mark = (0, _index._get)('bookMark');
	            if (mark) {
	                return mark.split(',');
	            }
	            return [];
	        }

	        /**
	         * 添加书签
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'addBookMark',
	        value: function addBookMark() {
	            var key;

	            this.updatePageInfo();
	            key = this.getMarkId(this.seasonId, this.pageId);

	            //避免重复缓存
	            if (BOOKCACHE.indexOf(key) > -1) {
	                return;
	            }
	            BOOKCACHE.push(key);
	            (0, _index._set)('bookMark', BOOKCACHE);
	        }

	        /**
	         * 更新页信息
	         *  针对母板层上的书签
	         */

	    }, {
	        key: 'updatePageInfo',
	        value: function updatePageInfo() {
	            var pageData = Xut.Presentation.GetPageData();
	            this.pageId = pageData._id;
	            this.seasonId = pageData.seasonId;
	        }

	        /**
	         * 删除书签
	         * @param {object} [key] [事件目标对象]
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'delBookMark',
	        value: function delBookMark(target) {
	            if (!target || !target.dataset) return;

	            var key = target.dataset.mark,
	                index = BOOKCACHE.indexOf(key);

	            BOOKCACHE.splice(index, 1);
	            (0, _index._set)('bookMark', BOOKCACHE);

	            if (BOOKCACHE.length == 0) {
	                (0, _index._remove)('bookMark');
	            }

	            //移除该行
	            $(target).parent().remove();
	        }

	        /**
	         * 显示书签
	         * @param {object} [target] [事件目标对象]
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'viewBookMark',
	        value: function viewBookMark(target) {
	            var $bookMarkList,
	                list = this.createMarkList();

	            if (this.bookMarkList) {
	                $bookMarkList = this.bookMarkList;
	            } else {
	                $bookMarkList = $(target).parent().parent().next();
	            }
	            //更新书签内容
	            $bookMarkList.find('.xut-bookmark-body').html(list);
	            this.bookMarkList = $bookMarkList;
	            $bookMarkList.fadeIn();
	        }

	        /**
	         * 点击放大效果
	         * @param  {[object]} target [事件目标对象]
	         * @return {[type]}      [description]
	         */

	    }, {
	        key: 'iconManager',
	        value: function iconManager(target) {
	            var $icon = this.bookMarkIcon = $(target),
	                restore = this.iconRestore;

	            $icon.css({
	                'transform': 'scale(1.2)',
	                'transition-duration': '500ms'
	            })[0].addEventListener(Xut.style.transitionEnd, restore.bind(this), false);
	        }

	        /**
	         * 复原按钮
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'iconRestore',
	        value: function iconRestore() {
	            this.bookMarkIcon.css('transform', '');
	        }

	        /**
	         * 跳转到书签页
	         * @param  {[type]} target [description]
	         * @return {[type]}        [description]
	         */

	    }, {
	        key: 'goBookMark',
	        value: function goBookMark(target) {
	            if (!target || !target.dataset) return;

	            var key = target.dataset.mark.split('-');
	            var seasonId = Number(key[0]);
	            var pageId = Number(key[1]);

	            this.updatePageInfo();
	            //关闭书签列表
	            this.backBookMark();

	            //忽略当前页的跳转
	            if (this.pageId == pageId && this.seasonId == seasonId) {
	                return;
	            }

	            Xut.View.LoadScenario({
	                'scenarioId': seasonId,
	                'chapterId': pageId
	            });
	        }

	        /**
	         * 书签回退键
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'backBookMark',
	        value: function backBookMark() {
	            this.bookMarkList.fadeOut();
	        }

	        /**
	         * 邦定事件
	         * @param  {[type]} evt [事件]
	         * @return {[type]}     [description]
	         */

	    }, {
	        key: 'handleEvent',
	        value: function handleEvent(evt) {
	            var target = evt.target;
	            switch (target.className) {
	                //加入书签
	                case 'xut-bookmark-add':
	                    this.addBookMark();
	                    this.iconManager(target);
	                    break;
	                //显示书签记录
	                case 'xut-bookmark-view':
	                    this.viewBookMark(target);
	                    this.iconManager(target);
	                    break;
	                //关闭书签
	                case 'xut-bookmark-off':
	                    this.closeBookMark(target);
	                    break;
	                //返回书签主菜单
	                case 'xut-bookmark-back':
	                    this.backBookMark();
	                    break;
	                //删除书签记录
	                case 'xut-bookmark-del':
	                    this.delBookMark(target);
	                    break;
	                //跳转到书签页
	                case 'xut-bookmark-id':
	                    this.goBookMark(target);
	                    break;
	                default:
	                    //console.log(target.className)
	                    break;
	            }
	        }

	        /**
	         * 关闭书签菜单
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'closeBookMark',
	        value: function closeBookMark(target) {
	            this.bookMarkMenu.css({
	                transform: 'translate3d(0,0,0)',
	                'transition-duration': '1s'
	            });
	        }

	        /**
	         * 恢复书签菜单
	         */

	    }, {
	        key: 'restore',
	        value: function restore() {
	            this.bookMarkMenu.css({
	                transform: 'translate3d(0,-' + this.markHeight + 'px,0)',
	                'transition-duration': '1s'
	            });
	        }

	        /**
	         * 销毁书签
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            var dom = this.parent[0];

	            dom.removeEventListener('touchend', this, false);
	            dom.removeEventListener('mouseup', this, false);

	            //菜单部分
	            if (this.bookMarkMenu) {
	                this.bookMarkMenu.remove();
	                this.bookMarkMenu = null;
	            }

	            //列表部分
	            if (this.bookMarkList) {
	                this.bookMarkList.remove();
	                this.bookMarkList = null;
	            }

	            //按钮效果
	            if (this.bookMarkIcon) {
	                this.bookMarkIcon[0].removeEventListener(Xut.style.transitionEnd, this.iconRestore, false);
	                this.bookMarkIcon = null;
	            }

	            this.parent = null;
	        }
	    }]);

	    return BookMark;
	}();

	exports.default = BookMark;

/***/ }

})
//# sourceMappingURL=0.650046f6317ac3ecd06f.hot-update.js.map