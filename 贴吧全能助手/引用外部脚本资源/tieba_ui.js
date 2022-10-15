/**
 * @package org.jixun.tieba.ui
 * @author  jixun
 * @source  http://tb1.bdstatic.com/tb/static-common/lib/tb_lib_04e7791.js
 */

// Debugging
// var unsafeWindow = window;

// 配置项目参见 $.dialog.setting 的值
// new $.dialog ( { 配置 } )

// 静态函数已经在相关函数注释了
// $.dialog.open
// $.dialog.ask
// ...

(function ($) {
	$.fn.draggable = function(opt) {
		var $that = this;
		opt = $.extend({
			handle: $that,
			start: $.noop,
			stop: $.noop
		}, opt);

		var _element = $that[0],
			_elementParent = $that.parent()[0];

		var _getPos = function (ele) {
			var addOn = ele.offsetParent != _elementParent && ele.offsetParent
				? _getPos (ele.offsetParent)
				: {x: 0, y: 0};

			return {
				x: ele.offsetLeft + addOn.x,
				y: ele.offsetTop + addOn.y
			};
		};

		var baseOffset, offset, isDrag;
		var _mouseDown = function (e) {
			baseOffset = _getPos (_element);
			offset = {
				x: e.pageX,
				y: e.pageY
			};

			isDrag = true;
			e.preventDefault();
			opt.start();
		}, _mouseUp = function () {
			isDrag = false;
			opt.stop ();
		}, _mouseMove = function (e) {
			if (!isDrag) return;

			$that.css ({
				left: baseOffset.x + e.pageX - offset.x,
				top : baseOffset.y + e.pageY - offset.y
			});
		};

		opt.handle.on('mousedown', _mouseDown);
		$(document)
			.on ('mousemove', _mouseMove)
			.on ('mouseup',   _mouseUp);

		return function () {
			opt.handle.off ('mousedown', _mouseDown);
			$(document)
				.off ('mousemove', _mouseMove)
				.off ('mouseup',   _mouseUp);
		};
	};

	$.getzIndex = function () {
		$.zIndex = $.zIndex || 50000;
		return $.zIndex ++;
	};

	var $modal = function (opts) {
		var that = this;
		this.cfg = $.extend({}, {
			className: "dialogJmodal",
			resizeable: true
		}, opts);

		this.element =
			$('<div>')
				.addClass(this.cfg.className)
				.appendTo(document.body)
				.css({
					display: "none",
					zIndex: $.getzIndex(),
					width: this.width(),
					height: this.height()
				});

		if (this.cfg.show)
			this.show ();

		this.resizeFunc = function () {
			that.css({
				width: that.width (),
				height: that.height ()
			});

			that.triggerHandler("resize");
		};

		if (this.cfg.resizeable) {
			$(unsafeWindow).on("resize", this.resizeFunc);
		}
	};



	$modal.prototype = {
		constructor: $modal,

		show: function () {
			this.element.show.apply(this.element, arguments);
		},

		hide: function () {
			this.element.hide.apply(this.element, arguments);
		},

		width: function () {
			return $(unsafeWindow).width();
		},

		height: function () {
			return Math.max($("body").height(), $("html").height());
		},

		css: function () {
			return this.element.css.apply(this.element, arguments);
		},

		triggerHandler: function () {
			this.element.triggerHandler.apply(this.element, arguments);
		},

		bind: function () {
			this.element.on.apply(this.element, arguments);
		},

		remove: function () {
			if (this.element) {
				this.element.remove();
			}
			$(unsafeWindow).off("resize", this.resizeFunc);
			for (var t in this) {
				if (this.hasOwnProperty(t)) {
					delete this[t];
				}
			}
		}

		// _processTages 移除
		// 因为全部都是兼容 IE 用代码。

	};

	$.modal = $modal;

	var lstEvents = ["onaccept", "oncancel", "onclose", "onresize", "onhide"];
	
	var $dialog = function (dialogOpts) {
		var that = this;
		var cbOnResize = function () {
			
			if (!that.dragged) {
				that.element.triggerHandler("onresize");
				
				if (that.sizeTimer)
					clearTimeout(that.sizeTimer);
				
				that.sizeTimer = setTimeout(that.setPosition.on(that), 5)
			}
		};

		$dialog.INST.push(this);
		
		this.cfg = $.extend({}, $dialog.setting, dialogOpts);
		if (!this.cfg.showTitle)
			this.cfg.draggable =  false;
		
		if (null != this.cfg.top || null != this.cfg.left) {
			this.cfg.autoCenter = false;
		}

		var dialogClass = "dialogJ dialogTiebaUi";

		if (this.cfg.holderClassName)
			dialogClass += " " + this.cfg.holderClassName;

		if (this.cfg.fixed)
			dialogClass += " dialogJfix";

		if (this.cfg.showShadow)
			dialogClass += " dialogJshadow";

		if (this.cfg.modal) {
			var modalArg = {};

			if (this.cfg.modalClassName)
				modalArg.className = this.cfg.modalClassName;

			this.modal = new $.modal(modalArg);
		}

		this.element =
			$('<div class="' + dialogClass + '"></div>')
				.hide ()
				.css({
					zIndex: $.getzIndex()
				}).appendTo(document.body);

		this.elementWrapper = $('<div>').addClass('uiDialogWrapper').appendTo(this.element);

		// 准备对话框标题
		this._setupTitleBar();
		this.setTitle(this.cfg.title);
		this._setupNoTitle();

		// 准备对话框内容
		this._setupContent();
		if ('iframe' === this.cfg.contentType) {
			this.cfg.html = $("<iframe>").css({
				width: "100%",
				height: "100%",
				border: "none"
			}).attr({
				src: this.cfg.html
			});
		}
		this.setContent(this.cfg.html);

		// 设定对话框宽、高
		// Jixun: 设定默认 400x80 的宽高。
		this.width(this.cfg.width);
		this.height(this.cfg.height);
		this.setPosition(this.cfg.left, this.cfg.top);

		if (this.cfg.show)
			this.show();

		if (this.cfg.autoCenter )
			$(unsafeWindow).on("resize", cbOnResize);

		// 设定拖动
		this._setScroll ();
		$.each (lstEvents, function (i, eventName) {
			if (that.cfg[eventName]) {
				that.on(eventName, that.cfg[eventName]);
			}
		});

		if (this.cfg.escable)
			this._setupEscKey();

		// 关闭对话框
		this.close = function () {
			// 如果拒绝关闭则返回
			if (that.element.triggerHandler("onclose") ===  false)
				return false;

			// 取消绑定 resize 事件
			$(unsafeWindow).off("resize", cbOnResize);

			// 移除 modal
			if (that.modal)
				that.modal.remove();

			that._setScroll(true);
			that.element.remove();

			for (var t = 0; t < $dialog.INST.length; t++) {
				if ($dialog.INST[t] == that) {
					$dialog.INST.splice(t, 1);
					break;
				}
			}

			return true;
		}
	};
	

	$.extend($dialog, {
		/**
		 * 启动一个基本对话框
		 * @param content   对话框内容
		 * @param opts      其它传参
		 * @returns {$dialog}
		 */
		open: function (content, opts) {
			return (new $dialog($.extend({}, opts, {html: content})));
		},

		/**
		 * 创建一个询问对话框
		 * @param html          对话框内容
		 * @param arrAnswers    回答按钮内容
		 *
		 * @param callback      两个参数, 原型如下:
		 *                      callback (i, $dialog)
		 *                      i 为回答按钮序号, $dialog 为对话框本体
		 *                      this 绑定为 $(按钮)。
		 *
		 * @param opts          创建时传递给 $dialog / $modal 的参数
		 * @returns {}
		 */
		ask: function (html, arrAnswers, callback, opts) {
			if (!opts) opts = {};

			var _$dialog = new $dialog($.extend({modal: true}, opts, {html: html || "", show: true}));

			if ($.isArray(arrAnswers) && arrAnswers.length) {
				var answerContainer = $('<div>')
					.addClass('dialogJanswers')
					.appendTo(_$dialog.elementWrapper);

				$(arrAnswers).each (function (i, val) {
					//answerContainer.append ($('<input>').val(val).addClass('dialogJbtn').attr('type', 'button'))
					//	.append (' ');

					// 下面这个的按钮有蓝色样式
					answerContainer
						.append (
							$('<a>').addClass('ui_btn ui_btn_m').append($('<span>').append('<em>').text(val))
								.click (function () {
									if (false !== callback.call(this, i, _$dialog))
										_$dialog.close();
								})
						);
				});

				_$dialog.buttons = $("input", answerContainer);
			}
			_$dialog.setPosition();

			if (opts.show)
				_$dialog.show();
			return _$dialog;
		},

		/**
		 * 显示一条警告框
		 * @param message           警告消息
		 * @param [opts]            $modal / $dialog 参数
		 * @param opts.acceptValue 「确定」按钮标题
		 * @returns {$dialog}
		 */
		alert: function (message, opts) {
			var extOpts = $.extend({}, opts || {});
			return $dialog.ask(message, [extOpts.acceptValue || "确定"], function (e, t) {
				return t.element.triggerHandler(lstEvents[e], this)
			}, extOpts)
		},

		/**
		 * 显示一个确认框
		 * @param message           确认的消息
		 * @param [opts]            $modal / $dialog 参数
		 * @param opts.acceptValue  「确定」按钮标题
		 * @returns {$dialog}
		 */
		confirm: function (message, opts) {
			var extOpts = $.extend({}, opts || {});
			return $dialog.ask(message, [extOpts.acceptValue || "确定", extOpts.cancelValue || "取消"], function (e, t) {
				return t.element.triggerHandler(lstEvents[e], this)
			}, extOpts)
		},

		/**
		 * 显示一个定时警告框
		 * @param message               显示的消息
		 * @param callback              回调, 无参数
		 * @param [opts]                参数集合
		 * @param opts.acceptValue      「确定」按钮标题
		 * @param {Boolean} opts.button 是否显示确定按钮
		 * @param opts.time             等待时长
		 * @returns {*}
		 */
		assert: function (message, callback, opts) {
			var extOpts = $.extend({button: true}, opts || {});

			if (2 == arguments.length) {
				extOpts = callback;
				callback = $.noop;
			}

			var $dialogAsk = $dialog.ask(
					message,
					extOpts.button ? [extOpts.acceptValue || "确定"] : [],
					function (i, $dialog) {
						return $dialog.element.triggerHandler(lstEvents[i], this)
					},
					extOpts
				);

			setTimeout(function () {
				if ($dialogAsk && $dialogAsk.close)
					$dialogAsk.close();

				if (callback)
					callback();

			}, parseInt(extOpts.time) || 2000);

			return $dialogAsk;
		},

		/**
		 * 远端加载一个页面并显示其内容
		 * @param url           目标地址
		 * @param opts          选项
		 * @param opts.filter   页面内容选择器
		 * @param opts.cache    参见 jQuery.ajax
		 * @param opts.type     参见 jQuery.ajax
		 * @returns {$dialog}
		 */
		load: function (url, opts) {
			opts = opts || {};
			var _$dialog = new $dialog(opts);
			var requestObj = {
				url: url,
				type: "GET",
				dataType: "html",
				cache: false,
				success: function (html) {
					if (opts.filter)
						html = $(opts.filter, html);

					_$dialog.setContent(html);
				}
			};

			$.each(["type", "cache"], function (i, str) {
				if (opts.hasOwnProperty(str)) {
					requestObj[str] = opts[str];
					delete opts[str];
				}
			});

			$.ajax(requestObj);
			return _$dialog;
		},

		/**
		 * 关闭所有开启的对话框
		 */
		close: function () {
			for (var i = 0; i < this.INST.length; i++) {
				// 如果拒绝关闭, i-- 然后继续枚举关闭过程
				if (false !== this.INST[i].close()) {
					i--;
				}
			}
		},

		setting: {
			modal: true,
			showShadow: true,
			showTitle: true,
			noTitle: false,

			// 默认 400 x 80
			width: 400,
			height: 80,
			fixed: true,
			left: null,
			top: null,
			show: true,
			closeable: true,
			hideOnclose: false,
			draggable: true,
			contentType: null,
			resizeable: false,
			closeTips: null,
			escable: true,
			scrollable: true,
			modalClassName: null,
			autoCenter: true,
			html: null,
			minWidth: 200,
			minHeight: 100,
			maxWidth: null,
			maxHeight: null
		}
	});

	$dialog.prototype = {
		constructor: $dialog,

		/**
		 * 擦除原始标题并设定新标题
		 * 可以为 jQuery 对象、DOM 对象
		 * @param newTitle
		 */
		setTitle: function (newTitle) {
			this.element.find(".dialogJtitle>span.dialogJtxt").html(newTitle || "");
		},

		/**
		 * 擦除原始内容并设定新内容
		 * 可以为 jQuery 对象、DOM 对象
		 * @param newContent
		 */
		setContent: function (newContent) {
			newContent && this.element.find(".dialogJbody").html(newContent);
		},

		/**
		 * 设定新宽度
		 * @param newWidth
		 * @returns {*}
		 */
		width: function (newWidth) {
			return this.element.css("width", newWidth);
		},

		/**
		 * 设定新高度
		 * @param newHeight
		 * @returns {*}
		 */
		height: function (newHeight) {
			return $(".dialogJbody", this.element).css("height", newHeight);
		},

		/**
		 * 设定对话框位置
		 * @param [left] 左边, 留空居中
		 * @param [top]  右边, 留空居中
		 */
		setPosition: function (left, top) {
			if (!$.isNumeric(left) && !$.isNumeric(top)) {
				var $doc = $(document),
					$win = $(unsafeWindow),
					newPosOffset = this.cfg.fixed ? [0, 0] : [$doc.scrollLeft(), $doc.scrollTop()];

				left = newPosOffset [0] + ($win.width()  - this.element.outerWidth() ) / 2;
				top  = newPosOffset [1] + ($win.height() - this.element.outerHeight()) / 2;

				if (top < 0) top = 0;
			}

			this.element.css({
				left: left,
				top: top
			});

			this.triggerHandler("resize");
		},
		/**
		 * 获取标题 (HTML)
		 * @returns {String}
		 */
		getTitle: function () {
			return this.element.find(".dialogJtitle>span").html();
		},
		/**
		 * 获取标题文本
		 * @returns {String}
		 */
		getTitleText: function () {
			return this.element.find(".dialogJtitle").text();
		},

		/**
		 * 获取对话框内容 (HTML)
		 * @returns {String}
		 */
		getContent: function () {
			return $(".dialogJbody", this.element).html()
		},
		/**
		 * 获取对话框内容
		 * @returns {String}
		 */
		getContentText: function () {
			return $(".dialogJbody", this.element).text()
		},

		/**
		 * 显示对话框
		 */
		show: function () {
			this.element.show.apply(this.element, arguments);

			if (this.modal) {
				this.modal.cfg.safety = this.element;
				this.modal.show.apply(this.modal, arguments);
			}
		},

		/**
		 * 隐藏对话框
		 * @returns {boolean}
		 */
		hide: function () {
			if (this.element.triggerHandler("onhide") === false)
				return false;

			this.element.hide.apply(this.element, arguments);
			if (this.modal)
				this.modal.hide.apply(this.modal, arguments);

			return true;
		},

		/**
		 * 获取对话框 DOM 元素
		 * @returns {HTMLElement}
		 */
		getElement: function () {
			return this.element[0];
		},

		/**
		 * 绑定事件
		 * @returns {$dialog}
		 */
		bind: function () {
			this.element.on.apply(this.element, arguments);
			return this;
		},

		/**
		 * 触发事件
		 */
		triggerHandler: function () {
			this.element.triggerHandler.apply(this.element, arguments);
		},

		/**
		 * 获取按钮
		 * @returns {Array|undefined}
		 */
		getButtons: function () {
			return this.buttons;
		},

		/**
		 * 内部函数: 设定无标题对话框
		 * @private
		 */
		_setupNoTitle: function () {
			if (this.cfg.noTitle) {
				$(".dialogJtitle").css({
					"border-bottom": 0,
					"background-color": "#fff"
				});
			}
		},

		/**
		 * 内部函数: 设定对话框标题栏
		 * @private
		 */
		_setupTitleBar: function () {
			if (this.cfg.showTitle) {
				var that = this;
				var titleBar = that.titleBar =
					$('<div>').append(
						$('<span>').addClass('dialogJtxt')
					).addClass('dialogJtitle')
					.appendTo(this.elementWrapper);

				if (this.cfg.closeable) {
					$('<a>').addClass('dialogJclose').attr({
						title: this.cfg.closeTips || "关闭本窗口",
						href:  '#'
					}).text(' ').appendTo(titleBar)
					.on ('mousedown', function (e) {
						e.stopPropagation();
					}).click(function () {
						if (that.cfg.hideOnclose) {
							that.hide()
						} else {
							that.close();
						}
						return false;
					});

					if (this.cfg.draggable) {
						titleBar.css ({
							cursor: 'move'
						});

						var _rmDrag = $(that.element).draggable({
							handle: titleBar,
							start: function () {
								that._setupHackDiv(1)
							},
							stop: function () {
								that.dragged = true;
								that._setupHackDiv(0);
							}
						});
						$(that.element).on("onclose", _rmDrag);
					}
				}
			}
		},

		_setupHackDiv: function (bShowHackDiv) {
			var _$dialog = this;
			if (bShowHackDiv) {
				if ($("IFRAME", _$dialog.element).length) {
					var $content = $(".dialogJcontent", _$dialog.element);
					if (!_$dialog.hack_div) {
						_$dialog.hack_div = $("<div>").appendTo($content).css({
							position: "absolute",
							left: 0,
							top: 0,
							cursor: "move"
						});
					}
					_$dialog.hack_div.show().css({
						width:  _$dialog.element.outerWidth(),
						height: _$dialog.element.outerHeight()
					})
				}
			} else {
				if (_$dialog.hack_div)
					_$dialog.hack_div.hide ();
			}
		},

		_setupEscKey: function () {
			var $that = this;

			var _escKeyCb = function (n) {
				// ESC - 0x1b
				if (0x1b == n.which) {
					if ($that.showTitle) {
						$(".dialogJclose", $that.titleBar).triggerHandler("click")
					} else {
						$that.close();
					}
				}
			};

			$(document).on("keydown", _escKeyCb);
			$($that.element).on("onclose", function () {
				$(document).off("keydown", _escKeyCb)
			});
		},

		_setupContent: function () {
			this.elementWrapper.append(
				$('<div>').addClass('dialogJcontent').append(
					$('<div>').addClass('dialogJbody')));
		},

		_setScroll: function (bSetScroll) {
			if (this.cfg.modal && !this.cfg.scrollable) {
				var htmlRoot = $("html");
				if (htmlRoot.length) {
					var i = htmlRoot[0].scrollTop;
					if (bSetScroll) {
						htmlRoot.css({
							overflow: this.element.data("htmlOverflow") || "",
							paddingRight: 0
						});
					} else {
						if (htmlRoot[0].style.overFlow) {
							this.element.data("htmlOverflow", htmlRoot[0].style.overFlow);
						}

						htmlRoot.css({
							overflow: "hidden",
							paddingRight: 17
						})
					}

					htmlRoot[0].scrollTop = i
				}
			}
		}
	};

	$.each(lstEvents, function (e, t) {
		$dialog.prototype[t] = function (e) {
			this.on(t, e)
		}
	});
	$dialog.INST = [];
	$.dialog = $dialog;
})(jQuery);