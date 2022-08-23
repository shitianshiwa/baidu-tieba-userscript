// ==UserScript==
// @name         贴吧全能助手(第三方修改)
// @namespace    http://tampermonkey.net/
// @version      2.1.1843.5
/// @version     2.1
// @description  【装这一个脚本就够了～可能是你遇到的最好用的贴吧增强脚本】(不存在的)，百度贴吧 tieba.baidu.com 看贴（包括楼中楼）无须登录，完全去除扰眼和各类广告模块(贴吧活动广告不管了，都是针对某个贴吧弄的，来无影去无踪，能证明PC贴吧还有人管。。。)，全面精简并美化各种贴吧页面（算不算好要看个人喜好），去除贴吧帖子里链接的跳转（beta），按发贴时间排序/倒序，查看贴吧用户发言记录（有些用户查不了;已经废了），贴子关键字屏蔽（作用不大），移除会员彩名，直接在当前页面查看原图，可缩放，可多开，可拖拽
// @author       shitianshiwa && 忆世萧遥
// @homepage     https://github.com/shitianshiwa/baidu-tieba-userscript/tree/master/%E8%B4%B4%E5%90%A7%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B
// @license      MIT
// @include      http*://tieba.baidu.com/*
// @include      http*://c.tieba.baidu.com/p/*
// @include      http*://jump2.bdimg.com/f?kw=*
// @include      http*://live.baidu.com/f?kw=*
///新发现的贴吧贴子链接
// @exclude      http*://tieba.baidu.com/f/fdir*
/// @exclude     http*://tieba.baidu.com/f/search*
// @exclude      http*://tieba.baidu.com/f/center/*
// @run-at       document-body
///document-start,document-idle;必须使用document-body，否则对多个浏览器的兼容性会下降
///只测试了Google Chrome 75.0.3770.142（正式版本） (64 位),87.0.4280.66（正式版本） （64 位）
/// jQuery 留一份自己用。备注贴吧自带的jQuery是修改过的，至少有lazyload功能
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.scrollto@2.1.2/jquery.scrollTo.min.js

/// @require     http://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
/// @require     http://cdn.staticfile.org/jquery-scrollTo/1.4.11/jquery.scrollTo.min.js
/// 配置界面 UI
// @require     https://cdn.jsdelivr.net/npm/mustache@4.0.1/mustache.min.js
/// @require     http://cdn.staticfile.org/mustache.js/0.8.1/mustache.min.js
// @require     https://greasyfork.org/scripts/2657/code/tieba_ui.js

/// 非同步数组枚举回调
// @require https://greasyfork.org/scripts/3588/code/Interval_Looper.js

/// 兼容 GM 1.x, 2.x
// @require     https://greasyfork.org/scripts/2599/code/gm2_port_v103.js
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
/// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
///该脚本是多个脚本的集合
///贴吧全能助手 by 忆世萧遥 https://greasyfork.org/en/scripts/26992-%E8%B4%B4%E5%90%A7%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B 
///梦姬贴吧助手 by jixun https://github.com/jixunmoe/yume-tieba-helper https://openuserjs.org/scripts/JixunMoe/%E6%A2%A6%E5%A7%AC%E8%B4%B4%E5%90%A7%E5%8A%A9%E6%89%8B MIT License https://github.com/jixunmoe/yume-tieba-helper/blob/master/LICENSE ;tieba_ui.js,Interval_Looper.js,gm2_port_v103.js by Jixun.Moe https://greasyfork.org/scripts/2657/code/tieba_ui.js
///查看发帖 by 文科 https://github.com/wenketel 
///百度贴吧：不登录即可看贴 by VA 
///百度贴吧按发帖时间（帖子ID）排序 by NULL https://greasyfork.org/zh-CN/scripts/23356-tiebasortbyid
///百度贴吧图片点击放大 by lliwhx https://greasyfork.org/zh-CN/scripts/20969-%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E7%82%B9%E5%87%BB%E6%94%BE%E5%A4%A7
///MIT License
///Copyright (c) 2017 lliwhx
///Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
///The above copyright notice and this permission notice (including the next paragraph) shall be included in all copies or substantial portions of the Software.
///THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
///---
///TieBa - Maverick by Onox CC https://userstyles.org/styles/124770/tieba-maverick-2018  BY-NC - Creative Commons Attribution-NonCommercial https://github.com/imaverickk/Tieba-Maverick-UserCSS/ https://userstyles.world/style/3686/tieba-maverick
// ==/UserScript==
/*
历史更新记录
https://github.com/shitianshiwa/baidu-tieba-userscript/blob/master/%E8%B4%B4%E5%90%A7%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B/%E5%8E%86%E5%8F%B2%E6%9B%B4%E6%96%B0%E8%AE%B0%E5%BD%95.txt
2021-2-14 修复我的贴吧里，热门动态的图片全挂了的bug;尝试提高清理广告的成功率
2020-7-23 由于无法确定贴子内的链接实际情况，所以关掉自动替换跳转链接
发现https://tieba.baidu.com/p/898425820 主题贴列表的发贴日期有误
图片话题贴外面的上传图片功能没法发出图片，因为全部会被系统删除。而且这个上传图片功能是使用flash插件的做的
修复贴子内下工具栏点翻页按钮后，不再显示翻页列表
有些时候隐藏侧边栏功能无法实现完全屏蔽效果
http://tieba.baidu.com/i/* 这个域名内无法功能都不能正常运行，例如不能在网页内开关美化，设置功能等
发现初音楼层气泡有显示问题
贴吧只限吧务发言时，文字话题贴在主题贴列表回复有表情显示bug(已修)
屏蔽挽尊卡失效(已修)
发现贴子里的下工具栏的楼主功能无效，贴吧美化切换有显示bug(已修)
http://tieba.baidu.com/f/center/createtb 创建贴吧
贴吧超级会员会导致楼层用户名字和楼中楼头像显示错误(已修复)
在某些贴子，可能会缺失删除和举报按钮(2019-12-21已修复)
有点击图片放大和引用楼层和楼中楼功能失效bug（仅在旧版贴吧有效，这种贴吧是http链接），图片点击放大偶尔可以用，引用楼层和楼中楼功能只有链接为http的贴子可以用
http://tieba.baidu.com/i/i/storethread 使用https链接有bug。原来是http，但偶尔会跳转到https导致出错（仅在手机yandex浏览器见过这个问题）
发现一个bug，电脑端贴吧主题贴列表网页右边的"大家都在搜"（class="search_back_box")和"贴吧热议榜"（class="topic_list_box"）在网页拉到底时会向class中自动添加"search-back-fixed"和"topic-search-back-fixed",这个会导致发主题贴编辑器右边冒出一个"大家都在搜"，暂时用计时器定时删除新加的class来解决这个问题(现在是彻底删了，因为贴吧删掉了贴吧主页（不是首页）的贴吧热议榜)
*/
(function($) {
	//const $ = unsafeWindow.jQuery;
	/*var baiban = document.createElement("div");
	baiban.setAttribute("class "baiban");
	baiban.setAttribute("style "width:9999px;height: 99999px;background-color: white;position: absolute;top: 0px;z-index: 9999;");
	document.body.appendChild(baiban);
	var baiban2 = setTimeout(() => {
	    clearTimeout(baiban2);
	    $("div.baiban").remove();
	}, 1000);*/
	/**
	 * 精简封装 fetch 请求，自带请求 + 通用配置 + 自动 .text()
	 *
	 * @param {string} url - 请求 URL
	 * @param {object} [options={}] - fetch Request 配置
	 * @returns {Promise<string>} fetch 请求
	 */
	//console.log("jquery版本号：" + $.fn.jquery);
	//https://github.com/FirefoxBar/userscript/raw/master/Tieba_Blocked_Detect/Tieba_Blocked_Detect.user.js
	//参考贴吧屏蔽检测脚本的代码 https://greasyfork.org/zh-CN/scripts/383981-%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B
	const request = (url, options = {}) => fetch(url, Object.assign({
		credentials: 'omit',
		// 部分贴吧（如 firefox 吧）会强制跳转回 http（2020年已经全改成https了）
		redirect: 'follow',
		// 阻止浏览器发出 CORS 检测的 HEAD 请求头
		mode: 'same-origin',
		headers: {
			'X-Requested-With': 'XMLHttpRequest'
		}
	}, options)).then(res => res.text());
	/**
	 * 获取主题贴的移动端地址
	 *
	 * @param {number} tid - 贴子 id
	 * @returns {string} URL
	 * src: 1
	 * z: 贴子 id
	 * pn: 1
	 * frsrn: 1
	 * pbrn: 1
	 * 需要登陆才能显示30楼
	 */
	const getThreadMoUrl = tid => `//tieba.baidu.com/mo/q-----1-1-0----/m?kz=${tid}`;
	/**
	 * 返回wap贴吧信息
	 *
	 * @param {string} res - 页面内容
	 */
	const threadreturnxinxi = res => res;
	/**
	 *
	 * @param {number} tid - 贴子 id
	 */
	const getWaptiebaxinxi = tid => request(getThreadMoUrl(tid))
		.then(threadreturnxinxi);

	console.log("脚本引用的jquery版本号: " + $.fn.jquery);
	setTimeout(() => {
		try {
			console.log("贴吧的jquery版本号: " + this.$.fn.jquery);
		} catch (e) {
			console.log("贴吧的jquery版本号err: " + e);
		}
	}, 2000)
	console.log("贴吧全能脚本版本号:" + JSON.parse(JSON.stringify(GM_info)).script.version);
	let tieziurl = window.location.href;
	//https://www.v2ex.com/t/611007
	//https://jump2.bdimg.com/f?kw=
	//https://jump2.bdimg.com/p/
	//https://live.baidu.com/f?kw=
	//贴子不存在就直接退出
	if (document.body.className == "page404") {
		console.log("404界面，退出执行脚本")
		return
	}
	//尝试排除移动网页版
	if (document.body.getAttribute("class") == 'ue_revision' || document.querySelectorAll("div.main-page-wrap")[0] != undefined || document.querySelectorAll("div.tb-mobile-viewport")[0] != undefined) {
		console.log("不是pc端贴吧，退出执行脚本")
		return
	}
	if (tieziurl.search(/(https|http):\/\/c\.tieba\.baidu\.com\/p\//g) != -1 /*发现这种链接即跳转*/ || tieziurl.search(/(https|http):\/\/jump2\.bdimg\.com\/p\//g) != -1) {
		let temp = /(https|http):\/\/c\.tieba\.baidu\.com\/p\/(\d+)/.exec(tieziurl) || /(https|http):\/\/jump2\.bdimg\.com\/p\/(\d+)/.exec(tieziurl);
		//console.log(temp[2]);
		window.location.href = "https://tieba.baidu.com/p/" + temp[2]; //贴子跳转
	} else if (tieziurl.search(/(https|http):\/\/jump2\.bdimg\.com\/f\?kw=/g) != -1 || tieziurl.search(/(https|http):\/\/live\.baidu\.com\/f\?kw=/g) != -1) { //贴吧跳转
		let temp2 = /(https|http):\/\/jump2\.bdimg\.com\/f\?kw=(.+)/.exec(tieziurl) || /(https|http):\/\/live\.baidu\.com\/f\?kw=(.+)/.exec(tieziurl);
		//console.log(temp2[2]);
		window.location.href = "https://tieba.baidu.com/f?kw=" + temp2[2];
	}
	let baiban2 = setTimeout(() => {
		clearTimeout(baiban2);
		$(".tieba-app").remove(); //点击打开贴吧APP查看该吧更多内容 https://tieba.baidu.com/mo/q/weeklybazhuview?fid=吧id&beginTime=1590768000(开始的时间戳/秒)
		//把下载app按钮移到扫码下载app的位置
		let app1 = document.querySelectorAll(".app_download_info")[0]
		if (app1 != undefined) {
			let app2 = document.createElement("a"); //创建节点<a/>
			app2.setAttribute('href', 'https://tiebac.baidu.com/c/s/download/pc');
			app2.innerText = "贴吧app下载跳转";
			app1.after(app2)
		}
		//某些手机浏览器激活发贴文本编辑器用
		var c = '<input type="text" name="" value="某些手机浏览器激活发贴文本编辑器用" style="width:110px;font-weight:bold;"/>'; //文本框
		try {
			let a = $(".old_style_wrapper");
			if (a[0] != null) {
				$(".old_style_wrapper").append(c); //搜索<div class="old_style_wrapper">添加文本框
			}
		} catch (error) {
			console.log("激活发贴文本编辑器:" + error);
		}
		//给PC端的投票加点提示文本
		if (tieziurl.search(/(https|http):\/\/tieba\.baidu\.com\/f\?kw\=/g) != -1 ) {
			$("a.add_vote_btn")[0].title="安卓客户端可能看不见PC端的投票，反之也如此"
		}
	}, 5000);
	//https://tiebac.baidu.com/c/s/download/pc
	//https://www.sitepoint.com/css3-animation-javascript-event-handlers/
	//https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations/Using_CSS_animations
	/*
	W3C standard	Firefox     	webkit	                Opera	        IE10
	animationstart	animationstart	webkitAnimationStart	oanimationstart	MSAnimationStart
	animationiteration	animationiteration	webkitAnimationIteration	oanimationiteration	MSAnimationIteration
	animationend	animationend	webkitAnimationEnd	oanimationend	MSAnimationEnd
	*/
	var pfx = ["webkit", "moz", "MS", "o", ""];

	function PrefixedEvent(element, type, callback) {
		for (var p = 0; p < pfx.length; p++) {
			if (!pfx[p]) type = type.toLowerCase();
			//console.log(pfx[p] + type);
			element.addEventListener(pfx[p] + type, callback, false);
		}
	}
	var tupianfangda = true; //贴吧图片放大
	var pingbi_loucengqipao = false; //屏蔽楼层气泡
	var rmBottom = false; //移除工具栏
	var yincangcebianlanx = false; //隐藏侧边栏
	var qiangdiaoxinxitishi = false; //强调信息显示
	var tieba_custom_pass_login = false;
	var css = "";
	css +=
		`/*广告和无用功能*/
    .tbui_fbar_bazhu,
    .new_list li[data-ext_info],
    .game-head-game-info-wrapper,
    [id=\"pagelet_entertainment-liveshow/pagelet/video_head\"],
    .l_post_bright[data-field*=\"user_name\\\"\\:\\\"\\\\u4e3f\\\\u5929\\\\u4e36\\\\u4e4b\\\\u6b87\"][data-field*=\"content\\\"\\:\\\"\\\\u5e0c\\\\u671b\\\\u5404\\\\u4f4d\\\\u5427\\\\u53cb\\\\u80fd\\\\u652f\\\\u6301\\\\u9b54\\\\u5427\\\\u6708\\\\u520a\\\\u3002\\\"\"],
    .l_post_bright[data-field*=\"template_id\"],
    .l_post_bright[data-field*=\"monitor_id\"],
    #duoku_servers_list_wrapper,
    a[locate*=\"common_search_button\"],
    .play_list_panel,
    .middle-sec,
    .game_live_list,
    .firework_sender_wrap,
    [data-daid],
    #pb_adbanner,
    #forum_recommend,
    .top-sec,
    .r-top-sec,
    #spage_liveshow_slide,
    #plat_act_wrapper,
    #spage_game_tab_wrapper,
    div.member_rank,
    /*楼层列表的幽灵广告*/
    div.fengchao-wrap-feed,
    /*右上角的幽灵广告*/
    .fengchao-wrap,
    #search_fengchao,
    #search_union_mod,
    #search_bottomad,
    .app_forum_top_nav_holdplace,
    .app_forum_top_nav,
    .fav-toolbar,
    img.close_btn,
    img.close_btn.j_click_close+div,
    p.switch_radios+div,
    #aside_ad,
	#aside-ad,
    .region_bright#tieba-notice+div,
    .thread_recommend,
    #platform_left_float,
    .content_top,
    .aside_region.my_app.j_encourage_entry,
    img[src^=\"http://tb1.bdstatic.com/tb/cms/ngmis/adsense/\"],
    #top_activity,
    .life_helper,
    .middle-sec>div>.iframe_wrapper,
    #search_fengchao_left,
    div[id=\"pagelet_entertainment-base/pagelet/xiu8_aside_slide\"],
    [id=\"pagelet_frs-aside/pagelet/ad\"],
    div[id=\"pagelet_frs-header/pagelet/head_content_middle\"] > div:first-child > div[class^=\"iframe_\"],
    .j_voice_ad_gif,
    .p_share_ding,/*发帖域顶部分享控件*/
    .p_mall_tail,/*层主使用了贴吧特权标识*/
    #pop_frame,/*右下弹窗*/
    #encourage_entry,/*右边栏-我的应用*/
    #global_notice_wrap,/*全贴吧底部公共通知*/
    .firework-wrap,.firework-wrap2,/*烟花*/
    ul#thread_list>li:not([data-field]):not(.thread_top_list_folder),/*帖子列表所有项*/
    #j_p_postlist>div:nth-of-type(1)~div:not([data-field]):not(#j_p_postlist),/*帖子内页所有楼层*/
    ul#thread_list>li.j_df_card,/*推广*/
    #j_p_postlist>div[data-isautoreply]:not(:first-of-type),/*推广*/
    .diamond-mall-aside,/*贴吧夺宝*/
    #pc2client,/*i贴吧页面客户端广告*/
    /*贴吧会员相关项*/
    .u_member,
	/*我的蓝钻*/
	li.u_blue,
    #celebrity,
    .aside_region.celebrity,
    .j-placeholder-pay-member,
    .icon-crown-super-non,
    /*.sign_tip_sbox_1key,贴吧右上角的一键签到*/
    .p-post-forbid-speech,
    /*超级会员各种提示*/
    .poster_success .success-foot-tip,
    .l_thread_manage #notify_bubble,
    /*贴吧贴子列表顶的游击广告*/
    .bus-top-activity-wrap,
    .quick-reply-desc,
    /*贴吧列表右上角的广告*/
    #mediago-frs-aside,
    /*贴吧列表内的广告*/
    div.mediago-ad-wrapper,
    /*贴吧游击广告*/
    #lu-frs-aside,
    /*贴吧贴子列表顶的游击广告*/
    .bus-top-activity-wrap,
    /*贴吧顶部广告*/
    #pb_adbanner,
    .l_banner.banner_theme,
    /*右侧浮动的下载app按钮*/
    .tbui_fbar_down,
    /*发贴按钮和一键到底按钮功能一样*/
    .tbui_fbar_post,
    /*不知道是什么*/
    #com_u9_head,
    /*新版贴吧广告*/
    /*贴吧主页列表广告*/
    div.thread_item_box[data-field*="{}"],
    /*贴吧贴子内的广告*/    
    div.l_post_bright[data-field*="{}"],
    /*贴吧主页列表右上角小正方形广告*/
    [id=\"pagelet_frs-aside/pagelet/aside_ad\"],
    /*清理全吧搜索里的广告*/
    .lu-search-box,
    #search_union_mod,
    /*解决一个广告 https://pos.baidu.com/xxxx xxxx是每次都会变化的 百度网盟推广*/
    #lu-user-right>iframe[src*="/pos.baidu.com/"],
    /*贴吧首页右上角的广告*/
    #lu-home-aside>iframe[src*="/pos.baidu.com/"]
    {
        display: none !important;
    }`;

	if (tieziurl.search(/(https|http):\/\/tieba\.baidu\.com\/f\/search\//g) == -1) {
		if (!GM_getValue("tiebameihua")) {
			if (false || (document.domain == "tieba.baidu.com" || document.domain.substring(document.domain.indexOf(".tieba.baidu.com") + 1) == "tieba.baidu.com") || (document.domain == "www.tieba.com" || document.domain.substring(document.domain.indexOf(".www.tieba.com") + 1) == "www.tieba.com")) {
				css +=
					`
               /*
               ——WebFonts——
               Google Fonts: https://www.google.com/fonts
               Google Material icons: https://design.google.com/icons/
               */
               @font-face {
               	font-family: \'Open Sans\';
               	font-style: normal;
               	font-weight: 400;
               	src: url(https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFUZ0bbck.woff2) format(\'woff\');
               }
               /*https://forum.userstyles.org/discussion/49558/ ——图标无法显示请看这里——*/
               @font-face {
               	font-family: \'Material Icons\';
               	font-style: normal;
               	font-weight: 400;
               	src: url(https://fonts.gstatic.com/s/materialicons/v54/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format(\'woff2\')
               }

               body,
               .tb-ueditor-fullscreen .tb_rich_poster_container{
               	background-color: #F1F1F1 !important;
                  background-image: url(https://onox.qiniudn.com/maverick/tbbg/1.jpg) !important;
               	background-size: cover !important;
               	background-attachment: fixed !important;
               	background-repeat: no-repeat !important;
               }
               body,
               .tb-ueditor-fullscreen .tb_rich_poster_container {
                   background-image: none !important;
               }
               body::selection {
               	color: #fff;
               	background-color: #4879BD;
               	text-shadow: none;
               }
               * {
               	font-family: \'Open Sans\', \'Microsoft Yahei UI\', \'Microsoft Yahei\';
               }
               a {
               	transition: color .4s ease;
               }
               /*替换Banner*/
               .star_banner img[src$=\"default_head20141014.jpg\"],
               .vertical_card_banner img[src$=\"default_head20141014.jpg\"],
               .card_banner img[src$=\"default_head20141014.jpg\"]{
               	display: block;
               	background: #fff;
               	padding-top: 180px;
               	padding-left: 100%;
               	width: 0 !important;
               	height: 0 !important;
               	background-size: cover;
               	background-position: center;
               	background-image: url(https://ww2.sinaimg.cn/large/7bde02fbgw1f3yt89p0xej20xc064tae.jpg);
               }

               /*替换吧头像*/
               div[class*=\"_theme2\"] img.card_head_img[src$=\"c1d719f7905298227221ab8bd6ca7bcb0b46d458.jpg\"],
               div[class*=\"_theme2\"] img.card_head_img[src$=\"199a87d6277f9e2fa0419bf01930e924b999f3e0.jpg\"],
               div[class*=\"_theme2\"] img.card_head_img[src$=\"7bf78245d688d43f147b01ba7c1ed21b0cf43b98.jpg\"],
               div[class*=\"_theme2\"] img.card_head_img[src$=\"default_avatar20141017.jpg\"]{
                   padding-top: 60px;
                   padding-left: 60px;
                   width: 0 !important;
                   height: 0 !important;
               }
               img.card_head_img[src$=\"c1d719f7905298227221ab8bd6ca7bcb0b46d458.jpg\"],
               img.card_head_img[src$=\"199a87d6277f9e2fa0419bf01930e924b999f3e0.jpg\"],
               img.card_head_img[src$=\"7bf78245d688d43f147b01ba7c1ed21b0cf43b98.jpg\"],
               img.card_head_img[src$=\"default_avatar20141017.jpg\"]{
               	display: block;
               	background: #fff;
               	padding-top: 150px;
               	padding-left: 150px;
               	width: 0 !important;
               	height: 0 !important;
               	background-size: cover;
               	background-position: center;
               	background-image: url(http://ww2.sinaimg.cn/mw690/7bde02fbgw1f4dg4jwknej2046046gly.jpg);
               }

               /*贴吧会员相关项*/
               .u_member,
               #celebrity,
               .aside_region.celebrity,
               .j-placeholder-pay-member,
               .icon-crown-super-non,
                /*.sign_tip_sbox_1key,贴吧右上角的一键签到*/
                .p-post-forbid-speech,
                /*超级会员各种提示*/
                .poster_success .success-foot-tip,
                .l_thread_manage #notify_bubble,
                /*官方号服务中心post_head_official*/
                .quick-reply-desc {
                    display: none !important;
                }

                #d_post_manage:hover #j_quick_thread>li:nth-of-type(1){
                    transition-delay: .0s;
                }
                #d_post_manage:hover #j_quick_thread>li:nth-of-type(2){
                    transition-delay: .1s;
                }
                #d_post_manage:hover #j_quick_thread>li:nth-of-type(3){
                    transition-delay: .2s;
                }
                #d_post_manage:hover #j_quick_thread>li:nth-of-type(4){
                    transition-delay: .3s;
                }
                #d_post_manage:hover #j_quick_thread>li:nth-of-type(5){
                    transition-delay: .4s;
                }
                #d_post_manage:hover #j_quick_thread>li:nth-of-type(6){
                    transition-delay: .5s;
                }

              /*.tbui_fbar_share,右侧浮层-分享*/
              /*.tbui_fbar_favor,右侧浮层-爱逛的吧*/
              /*.search_main_fixed,搜索栏浮层,取消隐藏*/



                .edui-btn-toolbar .edui-btn-medal,/*编辑框贴吧特权按钮*/
                .save_face_bg,.achievement_medal_section,.achievement_medal_wrapper,/*楼层挽尊按钮,徽章*/
                .lzl_cnt .pre_icon_wrap,.p_postlist .pre_icon_wrap,/*帖子内页会员标识*/
                .share_thread,/*一楼分享按钮*/
                .post-foot-send-gift-btn,/*一楼送礼物按钮*/

                #selectsearch-icon,/*划词搜索*/
                [id=\"pagelet_entertainment-game/pagelet/game_head_middle\"],/*部分游戏贴吧头部游戏域*/



                [id=\"pagelet_frs-aside/pagelet/hottopic\"],
                .l_container .plat_head_v2_unmain_wrapper,/*认证吧帖子内页头部详细信息*/
                .p_reply_first,.d_post_content_firstfloor .core_reply_tail .p_reply,/*屏蔽具有误导性的一楼内容下方回复按钮*/
                .suggestion_list >li[data-field*=\"operation_title\"],.suggestion_list >li[data-field*=\"operation_item\"],.bdfengyun,/*搜索悬浮窗-大伙正在聊*/
                .suggestion_list >li[data-field*=\"relation_game_title\"],.suggestion_list >li[data-field*=\"game_item\"],/*搜索悬浮窗-相关游戏*/
                .tbui_fbar_square {
                /*	display:block !important;*/
                }
                /*让贴吧热议榜可以显示出来，同时改变背景颜色。贴吧的主题贴列表没有热议榜，贴子有热议榜没空间显示。。！*/
                /*div.topic_list_box {
                   background: #fdfdfd;
                }*/

                /*让一楼的回复按钮看起来更好看点？*/
                .p_reply_first{
                right:9px !important;
                }

                /*楼层气泡,也给显示吧*/
                .post_bubble_top,.post_bubble_bottom{
                /*    display: none !important;*/
                }
                /*注释掉，让楼层气泡里的文字背景不变白色*/
                /*.post_bubble_middle{
                    background: none !important;
                    padding: 0 !important;
                    width: 100% !important;
                }*/
                /*标题输入框文字对齐方式*/
                .poster_body .editor_title,
                .poster_body .tbui_placeholder,
                .pprefix-item{
                	text-align: center !important;
                }
                /*帖子列表页会员标识和非实名认证印记*/
                /*悬停显示*/
                .frs_bright_preicon,
                .frs_bright_icons>*:not([data-name=\"user_type\"]):not([data-name=\"is_verify\"]){
                    opacity: 0;
                    transition: opacity .4s ease;
                }
                .threadlist_bright .j_thread_list:hover .frs_bright_preicon,
                .threadlist_bright .j_thread_list:hover .frs_bright_icons>*:not([data-name=\"user_type\"]):not([data-name=\"is_verify\"]){
                    opacity: 1;
                }
                .j_thread_list .red_text,
                .j_thread_list .red-text,
                .j_thread_list .vip_red,
                .j_thread_list .vip-red,
                .j_thread_list .vip_red:hover,
                .j_thread_list .vip-red:hover,
                .j_thread_list .vip_red:visited,
                .j_thread_list .vip-red:visited{
                    color: inherit !important;
                }
                .j_thread_list .sign_highlight{
                    color: inherit !important;
                }
                .threadlist_bright .j_thread_list:hover .sign_highlight{
                    color: #ffa640 !important;
                }
                .threadlist_bright .j_thread_list:hover .red_text,
                .threadlist_bright .j_thread_list:hover .red-text,
                .threadlist_bright .j_thread_list:hover .vip_red,
                .threadlist_bright .j_thread_list:hover .vip-red{
                    color: #f74d4a!important;
                }

                .threadlist_li_left, .j_threadlist_li_left {
                    align-items: center;
                }

                /*用户面板*/

                .u_xiu8,/*个人-我的秀场*/
                .u_wallet,/*T逗账单*/
                .u_tbmall,/*贴吧商城*/
                .u_app,/*移动客户端*/
                /*杂项*/
                .split,
                .u_split,
                .u_appcenterEntrance,
                .u_joinvip,
                .u_bdhome {
                	display: none;
                }

                /*用户面板-动画延迟*/

                .userbar>ul>li.u_username:hover~li:nth-of-type(2) {
                	transition-delay: 0s;
                }
                .userbar>ul>li.u_username:hover~li:nth-of-type(4) {
                	transition-delay: .05s;
                }
                .userbar>ul>li.u_username:hover~li:nth-of-type(6) {
                	transition-delay: .1s;
                }
                .userbar>ul>li.u_username:hover~li {
                	transition-delay: .15s;
                }
                .userbar>ul>li.u_setting:hover~li:nth-of-type(4) {
                	transition-delay: 0s;
                }
                .userbar>ul>li.u_setting:hover~li:nth-of-type(6) {
                	transition-delay: .05s;
                }
                .userbar>ul>li.u_setting:hover~li {
                	transition-delay: .1s;
                }
                .userbar>ul>li.u_news:hover~li:nth-of-type(6) {
                	transition-delay: 0s;
                }
                .userbar>ul>li.u_news:hover~li {
                	transition-delay: .05s;
                }

                .creativeplatform-wrap-word-repost-btn .btn-default,
                #selectsearch-icon {
                	font-size: 14px;
                	line-height: 20px;
                	padding: 4px 6px;
                	padding-right: 9px;
                	background: #4879BD;
                	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.08) !important;
                	color: #fff;
                	border-radius: 4px;
                	transition: background .4s ease;
                	z-index: 9999;
                }
                .creativeplatform-wrap-word-repost-btn .btn-default{
                	padding: 2px 4px !important;
                }
                .creativeplatform-wrap-word-repost-btn .btn-default:hover,
                #selectsearch-icon:hover {
                	background: #4285F4;
                }
                #selectsearch-icon:before {
                	content: \"\\e8b6\";
                	font-family: \'Material Icons\' !important;
                	line-height: 1;
                	font-size: 18px;
                	display: inline-block;
                	vertical-align: bottom;
                	padding-bottom: 1px;
                }
                #selectsearch-icon:after {
                	content: \"搜索\";
                	display: inline-block;
                	vertical-align: bottom;
                }
                #selectsearch-icon img {
                	/*display:none或visibility:hiddend掉竟然会导致点击无效*/

                	position: absolute;
                	left: 0;
                	top: 0;
                	border: none !important;
                	width: 100% !important;
                	height: 100% !important;
                	z-index: 99;
                	opacity: 0;
                }

                /*贴吧头部资料*/
                .vertical_head_bg{
                	background: none!important;
                	position: relative;
                }
                .vertical_head .card_top_wrap{
                	width: 100% !important;
                	height: 96px !important;
                	padding: 15px 0 0 100px !important;
                	box-sizing: border-box;
                }
                .star_banner,
                .vertical_card_banner,
                .card_banner {
                	width: 100% !important;
                	margin: 0 !important;
                	overflow: hidden;
                }
                .star_head,
                .plat_head{
                	padding: 0 !important;
                	border: none !important;
                	background: rgba(0, 0, 0, .04) !important;
                }
                .head_card{
                	background: rgba(0, 0, 0, .04) !important;
                }
                .card_top_left{
                	margin: 5px 0;
                }
                .plat_head_v2_unmain_wrapper,
                .plat_head_v2_main_wrapper {
                	border-left: none !important;
                	border-right: none !important;
                	background: rgba(0, 0, 0, .04) !important;
                	border-top: 1px solid rgba(0,0,0,.06) !important;
                }
                .star_header{
                	padding: 13px 17px !important;
                	background: none !important;
                	border: none !important;
                }
                .star_header_right{
                	position: static !important;
                }
                .star_info{
                	margin-right: 20px;
                }
                .star_nav_btns_wrap{
                	position: static !important;
                }
                .star_nav_btns_wrap:nth-last-of-type(2){
                	display: none !important;
                }
                .plat_recom_carousel {
                	width: 100% !important;
                }
                .time_axis_slide_button_wrapper,
                a.starchannel_entrance{
                	margin: 0 !important;
                }
                .plat_header{
                	padding: 0 !important;
                	background: none !important;
                	border: none !important;
                }
                .plat_card_top {
                	margin: 20px 0;
                	margin-left: 20px;
                	position: relative;
                }
                .card_top_wrap{
                	background: rgba(0, 0, 0, .03) !important;
                	margin: 0 !important;
                	border-left: none !important;
                	border-top: none !important;
                	border-right: none !important;
                	padding: 0 !important;
                	position: relative;
                	z-index: 9;
                }
                .star_picbox,
                .plat_picbox,
                .card_head {
                	padding: 5px !important;
                	background: rgba(255,255,255,.5) !important;
                	border: none !important;
                }
                .plat_picbox img,
                .card_head_img{
              /*width: 150px !important;*/
              /*height: 150px !important;*/
                }
                div[class*=\"_theme2\"] .plat_picbox img,
                div[class*=\"_theme2\"] .card_head_img{
                	width: 60px !important;
                	height: 60px !important;
                }

                .plat_title_h3,
                .card_title_fname{
                	text-transform: capitalize;
                	font-size: 24px !important;
                	line-height: 32px !important;
                	color: #555 !important;
                	text-decoration: none !important;
                }

                .card_slogan{
                	color: #555 !important;
                }
                .focus_btn{
                	width: auto !important;
                	height: auto !important;
                	line-height: 24px !important;
                	border-radius: 12px;
                	font-size: 12px !important;
                	margin: 0 !important;
                	margin-left: 10px !important;
                	margin-right: 4px !important;
                	margin-top: 5px !important;
                	background: none !important;
                	padding: 0 10px !important;
                	background-color: rgba(0,0,0,.06) !important;
                	color: #999 !important;
                	text-decoration: none !important;

                	transition-property: background-color,color;
                	transition-duration: .4s;
                	transition-timing-function: ease;
                }
                .focus_btn:hover{
                	background-color: #F44336 !important;
                	color: #fff !important;
                }
                .focus_btn:before{
                	font-family: \'Material Icons\';
                	font-size: 14px !important;
                	display: inline-block;
                	vertical-align: top;
                	margin-right: 2px;
                	text-indent: -2px;
                }
                .cancel_focus:before{
                	content: \"\\e87d\";
                }
                .cancel_focus:after{
                	content: \"已关注\";
                }
                .islike_focus{
                	background-color: #4879BD !important;
                	color: #fff !important;
                }
                .islike_focus:hover{
                	background-color: #4285F4 !important;
                }
                .islike_focus:before{
                	content: \"\\e87e\";
                }
                .islike_focus:after{
                	content: \"关注\";
                }
                .plat_use_total *,
                .card_num *,
                .card_info *{
                	color:  #aaa !important;
                }
                .plat_post_num,
                .card_menNum,
                .card_infoNum,
                .card_info a[href]{
                	color:  #888 !important;
                   text-decoration: none !important;
                }
                .card_info a[href]:hover{
                	color:  #666 !important;
                }
                /*theme2*/
                .plat_head.plat_head_theme2,
                .card_top_wrap.card_top_theme2{
                	padding-top: 10px !important;
                }
                .card_top_theme2 .card_top {
                	height: 84px !important;
                	padding-left: 104px !important;
                	padding-top: 4px !important;
                	box-sizing: border-box;
                	position: relative;
                }
                .card_top_theme2 .card_title_fname {
                	margin-top: 1px !important;
                }
                .card_top_theme2 .card_num{
                	white-space:nowrap;
                	position: absolute;
                	margin: 0 !important;
                	left: 1px;
                	bottom: -18px;
                }

                .plat_head_theme2 .plat_card_top {
                	margin-top: 16px;
                	margin-bottom: 24px;
                	position: relative;
                }
                .plat_head_theme2 .plat_header_left {
                	height: 86px !important;
                }
                .plat_head_theme2 .plat_picbox,
                .card_top_theme2 .card_head {
                	padding: 4px !important;
                	width: 60px !important;
                	height: 60px !important;
                	margin: 4px 20px !important;
                }
                .plat_head_theme2 .plat_picbox{
                	margin: -7px 15px 0 0 !important;
                }
                .card_top_theme2 .focus_btn,
                .plat_head_theme2 .focus_btn{
                	margin-top: 6px !important;
                }
                .plat_head_theme2 .plat_use_total{
                	white-space:nowrap;
                	position: absolute;
                	left: 79px;
                	bottom: -2px;
                }
                /*签到*/
                .plat_header_right,
                .card_top_right{
                    max-width:100px;
                	position: absolute !important;
                	width: auto !important;
                	height: 100% !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	right: 0;
                	top: 0;
                	z-index: 1;
                }
                .sign_mod_bright{
                	width: 240px;
                }
                .sign_box_bright{
                	width: auto !important;
                	height: auto !important;
                	background: none !important;
                	position: absolute !important;
                	top: 50% !important;
                	right: 20px !important;
                	transform: translateY(-50%) !important;
                }
                .j_signbtn{
                	display: block;
                	position: relative;
                	width: 64px !important;
                	height: 2px !important;
                	background: #4879BD;
                	color: #fff;
                	box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.1);
                }
                .j_signbtn:before{
                	content: \"\\e616\";
                	font-family: \'Material Icons\';
                	position: absolute;
                	z-index: 1;
                	top: 50%;
                	left: 50%;
                	transform: translate(-50%,-50%) !important;
                	display: block;
                	width: 64px;
                	height: 64px;
                	border-radius: 50%;
                	background: inherit;
                	color: inherit;
                	-moz-box-shadow: inherit;
                	-webkit-box-shadow: inherit;
                	line-height: 64px;
                	font-size: 42px;
                	text-align: center;
                	transition-property: background,color;
                	transition-duration: .4s;
                	transition-timing-function: ease;
                }
                .j_signbtn:hover{
                	background: #4285F4;
                }
                .sign_today_date{
                	display:none !important;
                }
                .sign_keep_span,
                .sign_month_lack_days{
                	position: absolute;
                	width: auto !important;
                	margin:0 !important;
                	padding: 0 !important;
                	right: auto !important;
                	bottom: auto !important;
                	top: auto !important;
                	white-space: nowrap;
                	display: inline-block;
                	font-size: 12px !important;
                	line-height: 22px !important;
                	background: inherit;
                	color: inherit !important;
                	-moz-box-shadow: inherit;
                	-webkit-box-shadow: inherit;
                	text-align: right !important;
                	padding-left: 8px !important;
                	padding-right: 20px !important;
                	border-radius: 10px 0 0 10px;
                	left: 18px !important;
                	transform: translateX(-50%);
                	opacity: 0;

                	transition-property: opacity, transform;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .sign_month_lack_days span{
                	color: inherit !important;
                }
                .sign_keep_span{
                	top: -20px !important;
                }
                .sign_month_lack_days{
                	top: 4px !important;
                }
                .sign_mod_bright:hover .sign_keep_span,
                .sign_mod_bright:hover .sign_month_lack_days{
                	opacity: 1;
                	transform: translateX(-100%);
                }
                .sign_month_lack_days:nth-of-type(2){
                	display: none !important;
                }

                .signstar_signed{
                	background: #eee !important;
                	color: #999 !important;
                	box-shadow: none !important;
                }
                .signstar_signed:before{
                	content: \"\\e614\" !important;
                	color: #ccc !important;
                }


                .sign_mod_bright .sign_succ1 {
                	top: 90px;
                	right: -12px;
                }
                .sign_tip_bd_arr {
                	right: 57px;
                }

                /*特殊吧头部*/
                .plat_skin .wrap1,
                .skin_2103 .wrap1,
                .app_forum_body .wrap1{
                	margin: 0 auto;
                	background-position: center 138px !important;
                }
                .app_forum_body .head_content{
                	background: transparent !important;
                }
                .app-header-wrapper {
                	width: 100% !important;
                	border-radius: inherit;
                }
                .app_header{
                	padding-top: 16px !important;
                	width: 100% !important;;
                	height: 100px !important;
                	box-sizing: border-box;
                	background: rgba(0, 0, 0, .04) !important;
                	border-radius: inherit;
                	color: #555 !important;
                }
                .app_header_title_main {
                	margin-top: 10px !important;
                }
                .app_header_forum_name {
                	font-size: 24px !important;
                	padding: 0px 0 0 15px !important;
                	text-transform: capitalize;
                }
                .app_header_forum_name,
                .app_header_forum_name_href{
                	color: #555 !important;
                }
                .app_header_focus_btn {
                	margin: -5px 0 0 !important;
                }
                .app_header_focus_info {
                	white-space: nowrap;
                	position: absolute;
                	margin: 0 !important;
                	left: 104px;
                	bottom: 10px;
                }
                .app_header_focus_info_focusnum,
                .app_header_focus_info_tienum {
                	color: #888 !important;
                }
                .app_header_main_background{
                	display: none !important;
                }
                [id=\"pagelet_platform-official/pagelet/official_forum_card\"],
                .official_head,
                .head_banner,
                .head_banner_img,
                [id=\"pagelet_encourage-appforum/pagelet/head_top\"],
                .app_forum_top{
                	border-radius: inherit;
                }
                .app_header_avatar {
                	padding: 0px 0 0 20px !important;
                }
                .app_header_avatar_img{
                	width: 60px !important;
                	height: 60px !important;
                	padding: 4px;
                	background: rgba(255,255,255,.5) !important;
                	border: none !important;
                }
                .app_forum_body .sign_mod_bright .sign_succ1 {
                	top: 68px;
                	right: 32px;
                }
                .skin_2103 [id=\"pagelet_frs-header/pagelet/head\"],
                .app_forum_body [id=\"pagelet_frs-header/pagelet/head\"]{
                	box-shadow: 0 0 20px 2px rgba(0, 0, 0, .1);
                }
                .app_forum_body [id=\"pagelet_frs-header/pagelet/head\"]>div{
                	box-shadow: none !important;
                	width: 100% !important;
                }
                .skin_2103 .head_top,
                .app_forum_body .head_top{
                	box-sizing: border-box;
                	border: 1px solid #DBDCE0 !important;
                	border-bottom: none !important;
                	position: relative;
                	z-index: 4;
                }
                .app_forum_body [id=\"pagelet_entertainment-game/pagelet/game_head_middle\"]{
                	border-top: 4px solid #EAEAEA;
                }

                /*头部指引*/
                .top_content {
                	background: none !important;
                }
                .top_cont_main{
                	background: rgba(0,0,0,.02) !important;
                	border-top: 1px solid rgba(0,0,0,.06);
                }
                .top_cont_toggle{
                	transition: right .4s ease;
                	z-index: 9;
                	border-radius: 6px 6px 0 0;
                	border: 1px solid rgba(0,0,0,.1);
                	border-bottom: none;
                	background: #fff;
                	color: #2D64B3;
                	height: 24px;
                	line-height: 24px;
                	overflow: hidden;
                }
                .top_content_closed .top_cont_toggle{
                	right: 100px;
                }
                .top_cont_toggle:before{
                	content:\'\\e8ef\';
                	font-family: \'Material Icons\';
                	font-size: 24px;
                	display: inline-block;
                	vertical-align: top;
                	margin-right: -4px;
                	padding-left: 4px;
                }
                .top_cont_toggle .toggleBtn {
                	display: inline-block !important;
                	height: 100%;
                	margin-left: -24px;
                	margin-right: -4px;
                	text-indent: 31px;
                	background: none !important;
                	font-size: 0 !important;
                	color: inherit;
                }
                .top_cont_toggle .toggleBtn:before {
                	content: \'收起指引\';
                	font-size: 12px;
                }
                .top_cont_toggle .toggleBtn:after {
                	content: \'\\e316\';
                	font-family: \'Material Icons\';
                	font-size: 20px;
                	display: inline-block;
                	vertical-align: top;
                	text-indent: 0;
                }
                .top_content_closed .toggleBtn:before{
                	content: \'展开指引\';
                }
                .top_content_closed .toggleBtn:after{
                	content: \'\\e313\';
                }


                /*导航重制*/
                .forumInfo_nav_wrap,
                .star_nav_wrap,
                .ihome_nav_wrap,
                :not(.forum_radio_aside)>.nav_wrap {
                	width: 100% !important;
                	background: rgba(0, 0, 0, .04) !important;
                	border: none !important;
                	border-top: 1px solid rgba(0, 0, 0, .04) !important;
                	border-bottom: 4px solid rgba(0, 0, 0, .04) !important;
                	height: 47px !important;
                	box-sizing: border-box;
                	display: flex;
                }
                .forumInfo_nav_list,
                .star_class_nav,
                .ihome_nav_list,
                .nav_list {
                	margin: 0 !important;
                	padding: 0 !important;
                	height: auto !important;
                	width: 0 !important;
                	background: none!important;
                	border: none!important;
                	position: relative;
                	float: none !important;
                	flex: 1;
                	overflow: visible!important;
                	display: flex;

                }
                .star_class_nav,
                .nav_list{
                	box-sizing: border-box;
                }
                .forumInfo_nav_list>li,
                .star_class_nav>li,
                .nav_list>li{
                	flex: 1;
                }
                .forumInfo_nav_list>li,
                .star_class_nav>li,
                .ihome_nav_list>li,
                .nav_list>li,
                .forumInfo_nav_list>li *,
                .star_class_nav>li *,
                .ihome_nav_list>li *,
                .nav_list>li *{
                	display: block;
                	background: none !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	border: none!important;
                	height: auto !important;
                	width: auto !important;
                	float: none !important;
                }
                .forumInfo_nav_list>li a,
                .star_class_nav>li .star_nav_ico,
                .ihome_nav_list>li .nav_icon,
                .nav_list>li .j_tbnav_tab_a{
                	display: inline-block !important;
                	vertical-align: top;
                	height: 46px !important;
                	line-height: 42px !important;
                	font-size: 16px !important;
                	color: #777 !important;
                	border: none !important;
                	box-sizing: border-box;
                	text-align: center;
                	border-bottom: 4px solid rgba(0, 0, 0, 0) !important;
                	transition-property: border;
                	transition-duration: .4s;
                	transition-timing-function: ease;
                }
                .star_class_nav>li .star_nav_ico *,
                .ihome_nav_list>li .nav_icon *,
                .nav_list>li .j_tbnav_tab_a *{
                	display: inline !important;
                	color: inherit !important;
                }
                .forumInfo_nav_list>li.focus a,
                .star_class_nav>li.focus .star_nav_ico,
                .ihome_nav_list>li.focus .nav_icon,
                .nav_list>li.focus .j_tbnav_tab_a{
                	background: rgba(0,0,0,.06) !important;
                }
                .forumInfo_nav_list>li a:hover,
                .star_class_nav>li .star_nav_ico:hover,
                .ihome_nav_list>li .nav_icon:hover,
                .nav_list>li .j_tbnav_tab_a:hover{
                	border-bottom: 4px solid rgba(0, 0, 0, .2) !important;
                }
                .forumInfo_nav_list>li a,
                .nav_list>li .j_tbnav_tab_a{
                	padding: 0 !important;
                	width: 100% !important;
                }
                .star_class_nav>li .star_nav_ico,
                .ihome_nav_list>li .nav_icon{
                	padding: 0 20px !important;
                	width: 100% !important;
                }
                .star_class_nav>li .star_nav_ico:empty:after,
                .ihome_nav_list>li .nav_icon:empty:after,
                .nav_list>li .j_tbnav_tab_a:empty:after{
                	content:\"空项\"
                }
                .star_class_nav>li .star_nav_ico:before,
                .ihome_nav_list>li .nav_icon:before,
                .nav_list>li .j_tbnav_tab_a:before{
                	content: \"\\e871\";
                	font-family: \'Material Icons\';
                	font-size: 18px;
                	display: inline-block !important;
                	vertical-align: top;
                	margin-right: 3px;
                }
                .nav_list>li[data-tab-main] .j_tbnav_tab_a:before,
                .star_class_nav>li .star_nav_ico.star_nav_ico_tie:before,
                .nav_list>li .j_tbnav_tab_a[stats-data*=\"tabmain\"]:before{
                	content: \"\\e24d\";
                }
                .star_class_nav>li .star_nav_ico.star_nav_ico_photo:before,
                .nav_list>li .j_tbnav_tab_a[stats-data*=\"tabfrsphotogood\"]:before{
                	content: \"\\e410\";
                }
                .star_class_nav>li .star_nav_ico.star_nav_ico_good:before,
                .nav_list>li .j_tbnav_tab_a[stats-data*=\"tabgood\"]:before{
                	content: \"\\e838\";
                	font-size: 20px;
                }
                .star_class_nav>li .star_nav_ico.star_nav_ico_video:before,
                .nav_list>li .j_tbnav_tab_a[stats-data*=\"tabvideo\"]:before{
                	content: \"\\e04b\";
                	font-size: 20px;
                }
                .nav_list>li .j_tbnav_tab_a[stats-data*=\"st_value=wanle\"]:before{
                	content: \"\\e332\";
                }
                .nav_list>li .j_tbnav_tab_a[href*=\"tab=game\"]:before,
                .nav_list>li .j_tbnav_tab_a[stats-data*=\"tabplay\"]:before{
                	content: \"\\e021\";
                }
                .star_class_nav>li .star_nav_ico.star_nav_ico_group:before,
                .nav_list>li .j_tbnav_tab_a[stats-data*=\"tabgroup\"]:before{
                	content: \"\\e7ef\";
                	font-size: 20px;
                }
                .nav_list>li .j_tbnav_tab_a[href*=\"/show/zhanqi\"]:before{
                	content: \"\\e639\";
                	text-indent: 2px;
                }
                .nav_list>li .j_tbnav_tab_a[href*=\"tab=tuan\"]:before{
                	content: \"\\e8cb\";
                }

                .ihome_nav_list>li .nav_icon.nav_main:before{
                	content: \"\\e88a\";
                	font-size: 22px;
                }
                .ihome_nav_list>li .nav_icon.nav_msg:before{
                	content: \"\\e7f4\";
                	font-size: 20px;
                }
                .ihome_nav_list>li .nav_icon.nav_collect:before{
                	content: \"\\e865\";
                }
                .ihome_nav_list>li .nav_icon.nav_concern:before{
                	content: \"\\e87d\";
                }
                .ihome_nav_list>li .nav_icon.nav_post:before{
                	content: \"\\e24d\";
                }
                .ihome_nav_list>li .nav_icon.nav_achieve:before{
                	content: \"\\e545\";
                	font-size: 20px;
                }
                .star_class_tip{
                	display: none !important;
                }
                /*帖子排序按钮*/
                .thread_list_order {
                	position: absolute;
                	top: auto;
                	bottom: 0;
                	cursor: pointer;
                	display: inline-block;
                	white-space: nowrap;
                	font-size: 0;
                	margin-left: 12px;
                	color: #777;
                	line-height: 16px;
                	padding: 0 8px;
                	padding-top: 4px;
                	border-radius: 4px 4px 0 0;
                	background: rgba(0,0,0,.06);
                	transition: color .4s ease;
                }
                .thread_list_order:hover{
                	color: #444;
                }
                .thread_list_order:before {
                	content: \"\\e8fe\";
                	font-size: 18px;
                	font-family: \'Material Icons\';
                	display: inline-block;
                	vertical-align: top;
                	margin-right: 2px;
                }
                .thread_list_order:after {
                	content: \"按回复排序\";
                	font-size: 12px;
                }

                /*吧内搜索*/
                .star_nav_btns_wrap,
                .search_internal_wrap{
                	float: none !important;
                	height: 44px !important;
                	margin: 0 !important;
                	display: block;
                	box-sizing: border-box;
                	padding: 6px 10px !important;
                	width: 18% !important;
                	min-width: 200px !important;
                	position: relative;
                /*	 margin-left: 12% !important;*/
                }
                .search_internal_wrap.pull_right{
                	display: flex;
                }
                .j_search_internal_form{
                	position: relative;
                	width: 100%;
                	box-sizing: border-box;
                	display:flex;
                }
                .search_internal_input{
                	flex: 1;
                	display: block;
                	float: none !important;
                	width: 0 !important;
                	height: 30px !important;
                	background: rgba(0, 0, 0, 0.04);
                	outline: none !important;
                	border: none !important;
                	margin: 0 !important;
                	padding: 0 8px !important;
                	border-bottom: 4px solid rgba(0, 0, 0, .04) !important;
                	box-sizing: border-box;
                	color: #666 !important;
                	font-size: 12px !important;
                	line-height: 26px !important;
                }
                .search_internal_placeholder{
                	color: darkgrey !important;
                	position: absolute;
                	top: 1px !important;
                	left: 8px !important;
                	display: block;
                	line-height: 26px !important;
                	font-size: 12px !important;
                }
                .search_internal_btn{
                	background: none !important;
                	background-color: rgba(0, 0, 0, .04) !important;
                	border-bottom: 4px solid rgba(0, 0, 0, .04) !important;
                	box-sizing: border-box;
                	margin-left: 4px;
                	height: 30px !important;
                	width: 30px !important;
                	display: inline-block;
                	float: none !important;
                	vertical-align: top;
                	text-indent: 0 !important;
                	font-size: 0 !important;
                	position: relative;
                }

                .search_internal_input,
                .search_internal_btn{
                	transition-property: background, border-bottom;
                	transition-duration: .5s;
                	transition-timing-function: ease;
                }
                .search_internal_input:focus{
                	background: rgba(255, 255, 255, .4) !important;
                	border-bottom: 4px solid rgba(0, 0, 0, .2) !important;
                }
                .search_internal_btn:hover{
                	background-color: rgba(0, 0, 0, 0.06) !important;
                	border-bottom: 4px solid rgba(0, 0, 0, .1) !important;
                }
                .search_internal_btn:before,
                .j_search_internal_form:before {
                	content: \"\\e8b6\";
                	font-family: \'Material Icons\';
                	display: block;
                	color: #999;
                	font-size: 20px;
                	position: absolute;
                	right: -5px;
                	top: 13px;
                	transform: translate(-50%, -50%) translateY(1px);
                }
                /*贴子内容页右侧*/
                .right_section {
                	display: none !important;
                	width: 240px;
                }
                .right_section {
                	width: 240px;
                }
                .right_section >div {
                	display: none !important;
                }
                .right_section >div[id] {
                	display: block !important;
                }
                /*首页帖子列表块*/
                .forum_content{
                	display: flex;
                }
                #contet_wrap,
                #content_wrap {
                	flex: 1;
                	box-sizing: border-box;
                	float: none !important;
                	display: block;
                	width: 0 !important;
                }
                #aside {
                	width: 18% !important;
                	min-width: 240px !important;
                	box-sizing: border-box;
                	float: none !important;
                	display: block;
                }
                .region_header,
                .region_bright > .title,
                .region_bright > .trip_title,
                .aside_album_good_title,
                .zyq_bright .mod .tl{
                	background: rgba(0,0,0,.04);
                	height: 28px !important;
                	line-height: 28px !important;
                	border-radius: 14px;
                	width: 100%;
                	padding: 0 10px;
                	margin-left: -10px;
                	color: #777 !important;
                }
                .region_title,
                .region_title a,
                .zyq_mod_title,
                .aside_album_good_title span,
                .region_bright > .title h1{
                	color: inherit !important;
                	font-weight: bold !important;
                	height: inherit !important;
                	font-size: 14px;
                }
                .region_header a,
                .aside_album_good_title a,
                .zyq_bright .mod .tl a{
                	color: inherit !important;
                	text-decoration: none !important;
                }
                .aside_region {
                	border-top: none !important;
                }

                .region_bright {
                	border-top: none !important;
                	background: none;
                }
                .zyq_bright .mod,
                .aside_album_good_bright{
                	background: none !important;
                }
                .aside_region,
                .region_bright,
                .zyq_bright .mod,
                .aside_album_good_bright{
                	border-bottom: 1px solid rgba(0,0,0,.06);
                }

                .aside_album_good_title>a[href],
                .region_header .j_op a{
                	display: inline !important;
                	font-size: 0  !important;
                	opacity: .5;
                	transition: opacity .4s ease;
                }
                .region_header .j_op{
                	height: 100% !important;
                }
                .aside_album_good_title>a[href]:hover,
                .region_header .j_op a:hover{
                	opacity: 1;
                }
                .aside_album_good_title>a[href]:after,
                .region_header .j_op a:after{
                	content: \'\\e5d3\';
                	font-family: \'Material Icons\' ;
                	font-size: 28px;
                }
                .region_header .j_op a.p_balv_btnmanager:after,
                .region_header .j_op a.j_zyq_mod_edit_entry:after{
                	content: \'\\e869\';
                	font-size: 16px;
                	margin-right: 4px;
                }
                .user_level,
                .my_current_forum{
                	position: static !important;
                	margin: 0 !important;
                }
                .user_level .title,
                .my_current_forum .title{
                	display: none !important;
                }
                .my_current_forum .badge,
                .user_level .badge{
                	position: relative;
                	height: 24px;
                	line-height: 24px;
                	border: 1px rgba(0,0,0,.1) solid !important;
                	border-radius: 4px;
                	background: rgba(0,0,0,.04);
                	overflow: hidden;
                }
                .my_current_forum .badge_index,
                .user_level .badge_index{
                	position: absolute;
                	top: 0 !important;
                	left: auto !important;
                	right: 0 !important;
                	margin: 0 !important;
                	height: 100% !important;
                	line-height: inherit !important;
                	background: rgba(0,0,0,.3) !important;
                	color: #fff !important;
                	z-index: 1;
                	padding: 0;
                	text-align: center;
                	width: 24px;
                	text-indent: 0 !important;
                	font-family: inherit !important;
                }
                .user_level .badge_name,
                .my_current_forum .badge_name {
                	position: absolute;
                	width: 72px;
                	color: #4C4C4C;
                	text-align: center;
                }
                .user_level .exp,
                .my_current_forum .exp{
                	padding: 0 !important;
                }
                .exp_bar {
                	border: none !important;
                	border-radius: 0 !important;
                	height: 16px !important;
                	background: rgba(0,0,0,.1);
                }
                .exp_bar_current {
                	margin: 0 !important;
                	height: 100% !important;
                	border: none !important;
                	border-radius: 0 !important;
                	background: rgba(0,0,0,.1) !important;
                }
                .exp_num {
                	top: 0 !important;
                	height: 100% !important;
                	line-height: 16px !important;
                	font-size: 12px !important;
                }
                .region_cnt:hover .exp_num {
                	display: block;
                }
                .exp_bar span,
                .exp_bar .exp_current_num {
                	color: #666 !important;
                }
                #content_leftList,
                div[id=\"pagelet_frs-list/pagelet/thread_list\"],
                #thread_list,
                .j_thread_list,
                .threadlist_bright .t_con{
                	width:100% !important;
                	box-sizing: border-box;
                	padding: 0 !important;
                	margin: 0 !important;
                	border: none !important;
                }
                .threadlist_bright li.thread_top_list_folder{
                	background: none !important;
                }
                .interview .threadListGroupCnt,
                .threadlist_bright li{
                	border-bottom: 1px solid rgba(0,0,0,.06) !important;
                	transition: background .4s ease;
                }
                .threadlist_bright li:last-of-type{
                	border-bottom: none !important;
                }
                /*.interview .threadListGroupCnt:hover,*/
                .threadlist_bright li:hover{
                	background: rgba(0,0,0,.02)
                }
                .threadlist_bright .thread_pic_bright,
                .threadlist_bright .t_con {
                	padding: 12px 0 !important;
                	display: flex;
                	align-items: stretch;
                }
                .threadlist_li_left,
                .j_threadlist_li_left{
                	float: none !important;
                	width: 8% !important;
                	min-width: 75px !important;
                	padding: 0 14px 0 10px !important;
                	box-sizing: border-box;
                	margin-top: -3px !important;
                	position: relative;
                	display: flex;
                }
                .threadlist_rep_num {
                	background: rgba(0,0,0,.04) !important;
                	overflow: hidden;
                	width: 100% !important;
                	height: 24px !important;
                	line-height: 24px !important;
                	text-align: center;
                	color: #666;
                	padding: 0 !important;
                	margin: 0 !important;
                	border-radius:12px;
                }
                .threadlist_li_right,
                .j_threadlist_li_right{
                	margin: 0 !important;
                	float: none !important;
                	width: 0 !important;
                	flex: 1;
                	position: static !important;
                }
                .threadlist_bright .threadlist_lz{
                	width: 100% !important;
                	display: flex;
                	padding: 0 !important;
                /*	height:40px;主题贴列表的标题高度*/
                }
                .threadlist_bright .threadlist_detail{
                	width: 100% !important;
                	display: flex;
                	padding: 0 !important;
                }
                .threadlist_bright .threadlist_lz{
                	overflow: visible;
                }
                .threadlist_bright .threadlist_detail{
                	padding-top: 4px !important;
                }
                .threadlist_bright .threadlist_title,
                .threadlist_bright .threadlist_text{
                	float: none !important;
                	width: 0 !important;
                	flex: 1;
                	display: flex;
                	margin-right: 20px;
                	padding: 0 !important;
                	box-sizing: border-box;
                	height: auto !important;
                	overflow: visible;
                }
                .threadlist_bright .threadlist_abs_onlyline{
                	flex: 1 1 100%;
                }
                .threadlist_bright .threadlist_text{
                	font-size: 12px !important;
                	flex-wrap: wrap;
                }
                .threadlist_bright .threadlist_title{
                	height: 24px!important;
                	line-height: 17px!important;
                	font-size: 14px!important;
                	flex-wrap: nowrap;
                }
                .threadlist_bright .threadlist_title a.j_th_tit {
                	order: 1;
                	flex: 0 1 auto;
                	text-overflow: ellipsis;
                	overflow: hidden;
                }
                .threadlist_bright .threadlist_title.threadlist_img{
                	overflow: visible;
                }
                .threadlist_bright .threadlist_title.threadlist_img img{
                	display: none;
                }
                .interview .threadListGroupCnt .listTitleCnt .listThreadTitle a,
                .threadlist_title a.j_th_tit {
                	color: #2d64b3 !important;
                	font-size: inherit !important;
                }
                .threadlist_title a.j_th_tit:hover {
                	text-decoration: underline;
                }
                .interview .threadListGroupCnt .listTitleCnt .listThreadTitle a:visited,
                .threadlist_title a.j_th_tit:visited {
                	color: #566c84 !important;
                }
                .threadlist_bright .threadlist_abs_onlyline,
                .threadlist_bright .threadlist_abs{
                	color: #666 !important;
                }
                .threadlist_title .see-lz{
                	order: 2;
                	font-size: 12px !important;
                	padding: 0 6px;
                	margin-left: 5px;
                	margin-top: -2px;
                	height: 20px;
                	line-height: 20px;
                	text-decoration: none !important;
                	border-radius: 4px;
                	background: rgba(0,0,0,.25);
                	color: #fff !important;
                	transition: background .4s ease;
                }
                .threadlist_title .see-lz:hover{
                	order: 2;
                	font-size: 12px !important;
                	padding: 0 6px;
                	margin-left: 5px;
                	height: 20px;
                	line-height: 20px;
                	text-decoration: none !important;
                	border-radius: 4px;
                	background: rgba(0,0,0,.4);
                	color: #fff !important;
                }
                .tb_icon_author,
                .tb_icon_author_rely{
                	position: relative;
                	display: inline-block !important;
                	background: none !important;
                	padding: 0 !important;
                	height: 20px  !important;
                	line-height: 20px  !important;
                	margin: 0 !important;
                	overflow: visible !important;
                	flex: 1;
                	float: none !important;
                	z-index: 2;
                	pointer-events: none;
                }
                .tb_icon_author *,
                .tb_icon_author_rely *{
                	pointer-events: auto;
                }
                .tb_icon_author,
                .tb_icon_author_rely{
                   width:168px !important;/*主题贴列表的发贴人，回复人标签宽度*/
                }
                .interview .threadListGroupCnt .listTitleCnt .listUser:before,
                .frs_bright_preicon,
                .tb_icon_author:before,
                .tb_icon_author_rely:before{
                	display: inline-block;
                	font-family: \'Material Icons\';
                	font-size: 12px;
                	width: 30px;
                	vertical-align: top;
                	text-align: center;
                	color: #bbb;
                }
                .interview .threadListGroupCnt .listTitleCnt .listUser:before,
                .tb_icon_author:before{
                	content:\"\\e7fd\";
                	font-size: 16px;
                }
                .tb_icon_author_rely:before{
                	content:\"\\e0ca\"
                }
                .threadlist_bright .icon_author,
                .threadlist_bright .icon_replyer{
                	display: none !important;
                }
                .threadlist_author .j_user_card,
                .threadlist_author .frs-author-name {
                	display: inline-block;
                	width: auto !important;
                	overflow: hidden;
                	text-overflow: ellipsis;
                	white-space: nowrap;
                	font-size: 12px;
                }
                .threadlist_reply_date,
                .frs-author-name {
                	font-size: 12px;
                   padding-right:20px;
                }
                .threadlist_reply_date{/*主题贴列表每个贴子的最后回复时间*/
                   top: 5px;
                	position: absolute;
                   padding-right:unset;
                   width: 40px;
                   right: 10px;
                }
                .frs_bright_preicon{
                	position: absolute;
                	left: 0;
                	top: 0;
                }
                .frs_bright_preicon>*{
                	margin: -2px 0 0 7px!important;
                }
                 /*.frs_bright_icons{控制主题贴列表的用户标识位置
                	vertical-align: top !important;
                	padding-left: 6px;
                	padding-top: 2px;
                }*/
                /*帖子缩略图*/
                .threadlist_bright .small_wrap,
                .threadlist_bright .small_list{
                	position: relative;
                	z-index: 2;
                	pointer-events: none;
                }
                .threadlist_bright .small_wrap *:not(.small_list),
                .threadlist_bright .small_list *{
                	pointer-events: auto;
                }
                .feed_item .large_status,
                .threadlist_bright .media_box{
                	position: relative;
                	z-index: 2;
                	margin: 0 !important;
                	border-top: solid 1px rgba(0,0,0,.04);
                	padding-bottom: 20px;
                }
                .feed_item .large_box,
                .threadlist_bright .media_disp {
                	width: 100% !important;
                	margin: 0 !important;
                	padding: 0 50px;
                	background: none !important;
                	border: none !important;
                	display: block;
                	position: relative;
                	left:  0 !important;
                	box-sizing: border-box;
                	text-align: center;
                }
                .feed_item .tools,
                .media_pic_control .tb_icon_fav,
                .threadlist_bright .media_pic_control {
                	position: relative;
                	height: 30px;
                	line-height: 30px;
                	margin-bottom: 8px !important;
                	width: auto !important;
                	display: inline-block;
                	padding: 0 20px;
                	box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.2) !important;
                	background: #eee !important;
                	border-radius: 0 0 10px 10px;
                	color: rgba(0, 0, 0, .2);
                }
                .feed_item .tools_foot>.enter:before{
                	content: \'进入贴子\'
                }
                .feed_item .tools>a,
                .feed_item .tools_foot>.enter,
                .threadlist_bright .enter_pb_wrapper>a,
                .media_pic_control>a{
                	color: rgba(0, 0, 0, .6) !important;
                	padding: 0 !important;
                	background-image: none !important;
                	width: auto !important;
                }
                .feed_item .tools>a:hover,
                .feed_item .tools_foot>.enter:hover,
                .threadlist_bright .enter_pb_wrapper>a:hover,
                .media_pic_control>a:hover{
                	text-decoration: none;
                	color: rgba(0, 0, 0, .8) !important;
                }
                .media_pic_control .line {
                	margin: 0 10px;
                	color: rgba(0, 0, 0, .2);
                }
                .media_pic_control [class^=\"icon_\"],
                .media_pic_control [class*=\" icon_\"]{
                	display: none;
                }
                .feed_item .tools>a:before,
                .media_pic_control>a:before,
                .media_pic_control>a:before{
                	font-family: \'Material Icons\';
                	font-style: normal;
                	font-size: 20px;
                	display: inline-block;
                	width: 20px;
                	height: 20px;
                	vertical-align: top;
                }
                .feed_item .tools .fold_btn:before,
                .media_pic_control .j_retract:before{
                	content: \"\\e318\";
                }
                .feed_item .tools .screen_full:before,
                .media_pic_control .j_ypic:before{
                	content: \"\\e56b\";
                	font-size: 16px;
                }
                .media_pic_control .j_rotation_left:before{
                	content: \"\\e419\";
                }
                .media_pic_control .j_rotation_right:before{
                	content: \"\\e41a\";
                }
                .media_pic_control .j_pop_media:before{
                	content: \"\\e89e\";
                	font-size: 16px;
                	margin-left: 20px;
                }

                .media_pic_control .tb_icon_fav{
                	position: absolute;
                	right: -20px !important;
                	top: 0;
                	transform: translateX(100%);
                	padding: 0 8px !important;
                	text-indent: -2px;
                }
                .media_pic_control .tb_icon_fav.done{
                	color: #FF7C7C !important;
                }
                .media_pic_control .tb_icon_fav.done:hover{
                	color: #f24949 !important;
                }
                .media_pic_control .tb_icon_fav:before{
                	content: \"\\e87e\";
                	font-size: 16px;
                	margin-right: -1px;
                }
                .media_pic_control .tb_icon_fav.done:before{
                	content: \"\\e87d\";
                }
                .feed_item .tools_foot,
                .threadlist_bright .enter_pb_wrapper{
                	background: none !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	position: absolute;
                	left: auto;
                	right: 0;
                	bottom: 20px;
                	width: auto !important;
                }
                .feed_item .tools_foot>.enter,
                .threadlist_bright .enter_pb_wrapper>a{
                	margin: 0 !important;
                	padding: 0 14px !important;
                	height: 30px;
                	line-height: 30px !important;
                	text-align: center;
                	font-size: 14px;
                	overflow: hidden;
                	border: none !important;
                	box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.2) !important;
                	background: #eee !important;
                	border-radius: 15px 0 0 15px;
                }
                .icon_thread_hidden {/*折叠置顶贴*/
                	position: absolute;
                	top: 0;
                	right: 0;
                	z-index: 1;
                	width: 0 !important;
                	height: 0;
                	border-top: 24px solid rgba(0,0,0,.2);
                	border-left: 24px solid transparent;
                	background: none !important;
                	transition: border .4s ease;
                }
                .icon_thread_hidden:hover {
                	border-top: 24px solid rgba(0,0,0,.4);
                }
                .icon_thread_hidden:before {
                	content: \"\\e5cd\";
                	position: absolute;
                	top: -17px;
                	right: 1px;
                	font-family: \'Material Icons\';
                	font-size: 12px;
                	line-height: 0;
                	color: #fff;
                }
                .icon_top_folder {
                	position: absolute;
                	left: -25px;
                	top: 0;
                	width: 24px;
                	height: auto;
                	border-radius: 10px 0 0 10px;
                	box-shadow: -2px 2px 2px 0 rgba(0, 0, 0, 0.08);
                	background: #fefefe !important;
                	overflow: hidden;
                	word-break: break-all;
                	padding: 10px 6px;
                	box-sizing: border-box;
                	line-height: 16px;
                	font-size: 12px;
                	color: #aaa;
                }
                .icon_top_folder:hover {
                	color: #666;
                }
                .icon_top_folder:before {
                	content:\"展开置顶\";
                }

                .tb_rich_poster {
                	margin-left: 20px;
                }
                .tb_rich_poster_container {
                	width: 100% !important;
                	padding: 0 !important;
                	padding-top: 20px !important;
                }
                #pb-footer-header:empty {
                	display: none !important;
                }
                /*视频浮窗*/
                #pop_video{
                	left: 50vw !important;
                	top: 50vh !important;
                	right: auto!important;
                	bottom: auto !important;
                	transform: translate(-50%,-50%);
                	padding-bottom: 6px !important;
                }
                /*发帖编辑框*/

                .tb_rich_poster {
                	margin: 0 20px !important;
                }
                .poster_body {
                	width: 100% !important;
                	margin: 0 !important;
                	padding: 0 !important;
                }
                .poster_head {
                	border: none !important;
                	width: 100% !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	margin-bottom: 10px !important;
                	line-height: 28px;
                }
                .poster_head_text{
                	width: auto !important;
                	padding: 0 10px !important;
                	background: rgba(0,0,0,.06);
                	border-radius: 6px;
                	color: #999;
                	font-weight: normal !important;
                	font-size: 14px !important;
                }
                .poster_head_text>a{
                	line-height: inherit !important;
                	font-size: inherit !important;
                	font-weight: inherit !important;
                	color: inherit !important;
                	margin-right: 14px !important;
                }
                .poster_head_text>a:last-of-type{
                	margin-right: 4px !important;
                }
                .poster_head_text .split_text,
                .poster_head_text .post_head_btn_icon{
                	display: none !important;
                }

                .poster_head_text>a:before{
                	display: inline-block;
                	font-family: \'Material Icons\';
                	font-size: 16px;
                	width: 24px;
                	vertical-align: top;
                	text-align: center;
                	/*color: #bbb;*/
                }
                .poster_head_text .add_thread_btn:before{
                	content:\"\\e253\";
                }
                .poster_head_text .add_thread_btn[title=\"发表新贴\"]:before{
                	content:\"\\e254\";
                }
                .poster_head_text .add_vote_btn:before{
                	content:\"\\e01d\";
                	font-size: 18px;
                }
				.poster_head_text .add_opus_btn:before{
                	content:\"\\e04B\";
                	font-size: 18px;
                }
                .poster_head_text a{
                	color: #666 !important;
                }
                .poster_head_text a.cur:before{
                	color: #777 !important;
                }
                /*标题编辑域*/

                .title_container {
                	width: 100% !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	padding-bottom: 10px !important;
                }
                .poster_body .editor_title {
                	width: 100% !important;
                	margin: 0 !important;
                	padding: 0 10px !important;
                	box-sizing: border-box !important;
                	outline: none !important;
                	border: none !important;
                	font-size: 18px !important;
                	height: 40px !important;
                	line-height: 36px !important;
                	border-bottom: 4px solid rgba(0, 0, 0, .04) !important;
                	background: rgba(0, 0, 0, 0.04) !important;
                	color: #666 !important;
                	transition-property: background, border-bottom;
                	transition-duration: .5s;
                	transition-timing-function: ease;
                }
                .poster_body .tbui_placeholder {
                	width: 100% !important;
                	position: absolute;
                	font-size: 18px !important;
                	height: 36px !important;
                	line-height: 36px !important;
                	color: #bbb !important;
                	left: 0 !important;
                }
                /*标题前缀*/

                .pprefix-list {
                	display: block !important;
                	background: #f8f8f8;
                	border: none !important;
                	border-bottom: 4px solid rgba(0, 0, 0, .2) !important;
                	pointer-events: none;
                	opacity: 0;
                	transform: translateY(-40px);
                	transition-property: opacity, transform;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .pprefix-list[style*=\"block\"] {
                	opacity: 1;
                	transform: none;
                	pointer-events: auto;
                }
                .pprefix-item {
                	color: #666;
                	cursor: pointer;
                	transition-property: background;
                	transition-duration: .5s;
                	transition-timing-function: ease;
                }
                .editor_content_wrapper {
                	width: 100% !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	background: none !important;
                	box-sizing: border-box;
                }
                .old_style_wrapper {
                	width: 100% !important;
                	background: none !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	border: none !important;
                	box-sizing: border-box;
                }
                .poster_body .edui-container {
                	width: 100% !important;
                	background: none !important;
                	margin: 0 !important;
                	padding: 0 !important;
                }
                .poster_body .edui-body-container {
                	min-height: 216px !important;
                	width: 100% !important;
                	margin: 0 !important;
                	padding: 0 !important;
                }
                .edui-body-container *::selection {
                	background-color: rgba(0,0,0,.12);
                	text-shadow: none;
                }

                .tb_poster_placeholder{
                	position: absolute !important;
                	left: 0 !important;
                	top: 55px !important;
                	width: 100% !important;
                	padding: 0 15px !important;
                    box-sizing: border-box;
                }

                .tb_poster_placeholder p{
                	width: 100% !important;
                }

                /*编辑框控件域*/

                .edui-toolbar {
                	background: rgba(0, 0, 0, .08) !important;
                	box-sizing: border-box;
                	border-bottom: 4px solid rgba(0, 0, 0, .1);
                	height: 40px !important;
                	margin: 0 !important;
                	padding: 0 !important;
                }
                .poster_body .edui-editor-body .edui-body-container {
                	padding: 0 10px !important;
                }
                .poster_body .editor_title:focus,
                .poster_body .edui-editor-body .edui-body-container:focus {
                	background: rgba(0, 0, 0, 0.02) !important;
                	border-bottom: 4px solid rgba(0, 0, 0, .2) !important;
                }
                .edui-popup {
                	z-index: 9 !important;
                }
                .edui-btn-toolbar {
                	position: absolute;
                	top: 0;
                	width: 100% !important;
                	background: none !important;
                	padding: 0 !important;
                	height: 40px !important;
                	line-height: 36px !important;
                	box-sizing: border-box;
                }
                .edui-btn {
                	height: 40px !important;
                	display: block !important;
                	width: 60px !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	float: left !important;
                	background: none !important;
                	overflow: hidden;
                	cursor: pointer;
                	box-sizing: border-box;
                	border-bottom: 4px solid rgba(0, 0, 0, 0) !important;
                	transition-property: border;
                	transition-duration: 1s;
                	transition-timing-function: ease;
                }
                .edui-toolbar .edui-btn-red,
                .edui-toolbar .edui-btn-bold,
                .edui-toolbar .edui-btn-fullscreen {
                	width: 36px !important;
                	float: right !important;
                }
                .edui-toolbar .edui-btn[style*=\"none\"] {
                	display: none !important;
                }
                .edui-btn:hover {
                	border-bottom: 4px solid rgba(0, 0, 0, .2) !important;
                }
                .edui-btn:hover .edui-icon {
                	transform: translateY(-38px);
                }
                .edui-icon {
                	height: 36px !important;
                	background: none !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	width: 100% !important;
                	transition-property: transform;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .edui-icon:before {
                	content: \'\\e22a\';
                	font-family: \'Material Icons\';
                	display: block;
                	color: #999;
                	font-size: 24px;
                	position: absolute;
                	left: 50%;
                	top: 50%;
                	transform: translate(-50%, -50%);
                }
                .edui-icon:after {
                	content: \'未定义\';
                	display: block;
                	color: #666;
                	font-size: 12px;
                	position: absolute;
                	left: 50%;
                	top: 50%;
                	transform: translate(-50%, -50%) translateY(38px);
                	white-space: nowrap;
                }
                .edui-icon-fullscreen:before {
                	content: \"\\e5d0\";
                }
                .tb-ueditor-fullscreen .edui-icon-fullscreen:before {
                	content: \"\\e5d1\";
                }
                .tb-ueditor-fullscreen .edui-icon-fullscreen:after {
                	content: \"还原\";
                }
                .edui-icon-fullscreen:after {
                	content: \"全屏\";
                }
                .edui-icon-bold:before {
                	content: \"\\e238\";
                	margin-top: 1px;
                }
                .edui-icon-bold:after {
                	content: \"加粗\";
                }
                .edui-icon-red:before {
                	content: \"\\e23c\";
                	font-size: 18px;
                }
                .edui-icon-red:after {
                	content: \"红字\";
                }
                .edui-icon-paypost:before {
                	content: \"\\e263\";
                }
                .edui-icon-paypost:after {
                	content: \"付费可见\";
                }
                .edui-icon-medal:before {
                	content: \"\\e838\";
                }
                .edui-icon-medal:after {
                	content: \"贴吧特权\";
                }
                .edui-btn-name-portrait .edui-icon-medal:before {
                	content: \"\\e253\";
                	font-size: 20px;
                }
                .edui-btn-name-portrait .edui-icon-medal:after {
                	content: \"发帖气泡\";
                }
                .edui-icon-image:before {
                	content: \"\\e251\";
                }
                .edui-icon-image:after {
                	content: \"图片\";
                }
                .edui-icon-video:before {
                	content: \"\\e02c\";
                }
                .edui-icon-video:after {
                	content: \"视频\";
                }
                .edui-icon-music:before {
                	content: \"\\e405\";
                }
                .edui-icon-music:after {
                	content: \"音乐\";
                }
                .edui-icon-formula:before {
                	content: \"\\e24a\";
                }
                .edui-icon-formula:after {
                	content: \"数学公式\";
                }
                .edui-icon-emotion:before {
                	content: \"\\e24e\";
                }
                .edui-icon-emotion:after {
                	content: \"表情\";
                }
                .edui-icon-scrawl:before {
                	content: \"\\e3b7\";
                }
                .edui-icon-scrawl:after {
                	content: \"涂鸦\";
                }
                .edui-icon-attachment:before {
                	content: \"\\e2bc\";
                	font-size: 26px;
                }
                .edui-icon-attachment:after {
                	content: \"附件\";
                }
                .edui-icon-quick-reply:before {
                	content: \"\\e539\";
                }
                .edui-icon-quick-reply:after {
                	content: \"快速回帖\";
                }
                .edui-icon-topic:before {
                	content: \'#\';
                	font-family: fantasy;
                	font-size: 24px;
                	font-weight: bold;
                	margin-top: -0.5px;
                }
                .edui-icon-topic:after {
                	content: \"话题\";
                }
                /*付费可见编辑框*/

                .poster_body .paypost-fee-editor {
                	margin: 0 !important;
                	margin-top: 2px !important;
                }
                .paypost_tdou_ipt_area {
                	width: 260px !important;
                	height: 36px !important;
                	line-height: 36px !important;
                	padding-left: 14px;
                	position: absolute;
                	z-index: 1;
                }
                .j_paypost_tdou_ipt {
                	box-sizing: border-box;
                	padding: 0 6px !important;
                	margin: 0 2px !important;
                	width: 70px !important;
                	outline: none !important;
                	border: none !important;
                	background: rgba(255, 255, 255, .4) !important;
                	transition-property: background;
                	transition-duration: .5s;
                	transition-timing-function: ease;
                }
                .j_paypost_tdou_ipt:focus {
                	background: rgba(255, 255, 255, .8) !important;
                }
                .paypost_editor_close_wrap {
                	height: 36px;
                }
                .paypost_editor_close {
                	display: block;
                	width: 36px !important;
                	height: 36px !important;
                	;
                	background: none !important;
                	color: #999 !important;
                }
                .paypost_editor_close:hover {
                	color: #F44336 !important;
                }
                .paypost_editor_close:before {
                	content: \"\\e5c9\";
                	font-family: \'Material Icons\';
                	display: block;
                	font-size: 24px;
                	position: absolute;
                	left: 50%;
                	top: 50%;
                	transform: translate(-50%, -50%);
                }
                .paypost-fee-editor .edui-btn-toolbar {
                	padding-left: 260px !important;
                }
                /*签名档选择域*/
                .lzl_panel_error,
                .poster_error{
                	display: inline-block !important;
                	box-sizing: border-box;
                	margin: 0 !important;
                	padding: 0 10px !important;
                	height: 26px !important;
                	line-height: 26px !important;
                	background: rgba(0, 0, 0, .08);
                	border-radius: 0 0 10px 10px;
                	color: #999 !important;
                	position: relative;
                	left: 50% !important;
                	transform: translateX(-50%);
                }
                .lzl_panel_error:empty,
                .poster_error:empty{
                	display: none !important;
                }
                .editor_content_wrapper .poster_error{
                	position: absolute;
                }
                .poster_share,
                .poster_signature {
                	display: inline-block !important;
                	box-sizing: border-box;
                	margin: 0 !important;
                	padding: 0 20px !important;
                	height: 40px !important;
                	line-height: 40px !important;
                	background: rgba(0, 0, 0, .08);
                	border-radius: 0 0 10px 10px;
                	color: #999 !important;
                }
                .poster_head_surveillance a[href],
                .poster_signature a[href] {
                	color: #666 !important;
                	text-decoration: none !important;
                }
                .poster_head_surveillance a[href]:hover,
                .poster_signature a[href]:hover {
                	color: #999 !important;
                }
                .poster_signature[display*=\"none\"] {
                	display: none !important;
                }
                .poster_share > label,
                .poster_signature > label {
                    padding: 11px 0;
                    line-height: 18px;
                    cursor: pointer;
                    -moz-user-select: none;
                    -webkit-user-select: none;
                }
                .poster_share input,
                .poster_signature input {
                    cursor: pointer;
                    width: 18px !important;
                    height: 18px !important;
                    display: inline-block !important;
                    vertical-align: top !important;
                    margin-right: 4px;
                    margin-top: -1px;
                }
                /*编辑框底部面板*/

                .editor_bottom_panel {
                	width: 100% !important;
                	padding: 0 !important;
                	margin: 0 !important;
                	margin-top: 20px !important;
                }
                .poster_body .poster_submit {
                	height: 28px !important;
                	line-height: 28px !important;
                	padding: 0 10px !important;
                	box-sizing: content-box;
                }
                .poster-right-area {
                	width: 600px;
                	position: relative;
                }
                .poster_body .save-to-quick-reply-btn {
                	width: auto !important;
                	padding: 0 14px !important;
                	height: 28px !important;
                	line-height: 28px !important;
                }
                .poster_body .save-to-quick-reply-btn:before {
                	content: \"\\e149\";
                	font-size: 24px;
                	text-indent: -6px;
                	margin-right: 2px;
                }
                .save-to-quick-reply-btn * {
                	color: inherit !important;
                }
                .poster_draft_status {
                	position: absolute !important;
                	top: 0 !important;
                	right: 180px !important;
                }
                .j_floating > .poster_draft_status {
                	position: relative !important;
                	right: 5px !important;
                	top: -2px !important;
                }
                /*发帖成功提示*/
                .tb_poster_info {
                	position: absolute !important;
                	left: 50% !important;
                	top: 50% !important;
                	transform: translate(-50%,-50%) !important;
                	border: none !important;
                	background-color: #4879BD !important;
                	border-radius: 6px !important;
                	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2), 0 2px 16px 0 rgba(0, 0, 0, 0.2) !important;
                	color: #fff !important;
                	margin: 0 !important;
                	padding: 8px 20px !important;
                }
                .tb_poster_info *{
                	color: inherit !important;
                }
                .poster_success_content {
                	margin: 0 !important;
                	text-align: center;
                }
                .poster_success_content > * {
                	display: inline-block !important;
                	float: none !important;
                	vertical-align: top;
                }
                .post_success_exp {
                	width: 48px !important;
                }

                /*搜索栏*/

                .header_divider{
                	border: none;
                }
                .search_form form{
                	margin: 0;
                   margin-left: 0px!important;
                }

                .search_bright{
                	height: auto !important;
                	margin: 0 auto;
                	position: relative;
                	background: none !important;
                	padding-top: 20px !important;
                	margin-bottom: 20px !important;
                }

                .search_top,
                .search_main_wrap{
                	position: relative;
                	height: 30px !important;
                	width: 100% !important;
                	box-sizing: border-box;
                	padding-right: 14px !important;
                }
                .search_top{
                	display: flex;
                	position: absolute !important;
                	z-index: 1;
                	pointer-events: none;
                }
                .search_main,
                .search_form{
                	width: 100% !important;
                	padding: 0  !important;
                	background: none !important;
                	box-sizing: border-box;
                }
                .search_form {
                	display: flex;
                }
                .search_top:before,
                .search_logo,
                #search_logo_small {
                	position: static !important;
                	width: 60px !important;
                	height: 30px !important;
                	margin: 0 !important;
                	background: none !important;
                	font-size: 36px;
                	line-height:  28px;
                	text-align: center;
                	color: rgba(0,0,0,.2);
                	pointer-events: auto;
                }
                .search_top:hover:before
                .search_logo:hover,
                #search_logo_small:hover {
                	text-decoration: none;
                	color: rgba(0,0,0,.4);
                }
                .search_top:before,
                .search_logo:before,
                #search_logo_small:before {
                	content: \"\\e91d\";
                	font-family: \'Material Icons\';
                }
                .search_form #search_logo_small{
                	visibility: hidden;
                }
                .search_logo+#search_logo_small{
                	display: none  !important;
                }
                .search_main_fixed #search_logo_small{
                	font-size: 30px;
                	visibility: visible;
                }
                #tb_header_search_form{
                	display: flex;
                	flex: 1;
                }

                .search_ipt {
                	flex: 1;
                	font-family: inherit !important;
                	width: 0 !important;
                	margin: 0 !important;
                	padding: 0 10px !important;
                	box-sizing: border-box !important;
                	outline: none !important;
                	border: none !important;
                	font-size: 14px !important;
                	height: 30px !important;
                	border-bottom: 4px solid rgba(0, 0, 0, .04) !important;
                	background: rgba(0, 0, 0, .04) !important;
                	color: #999 !important;
                	transition-property: background, border-bottom;
                	transition-duration: .5s;
                	transition-timing-function: ease;
                }
                .search_ipt:focus {
                	color: #666 !important;
                }
                .search_btn_wrap{
                	display: block !important;
                	float: none !important;
                	margin:0 !important;
                	width: auto !important;
                	height: auto !important;
                	background: none !important;
                }
                .search_nav>a,
                .search_btn,
                .senior-search-link{
                	position: static !important;
                	margin: 0 !important;
                	display: block !important;
                	width: 100px !important;
                	height: 30px !important;
                	line-height: 30px !important;
                	font-size: 14px  !important;
                	text-align: center;
                	border-radius: 0;
                	 background: rgba(0, 0, 0, .08) !important;
                	border: none !important;
                	border-left: 2px solid rgba(0, 0, 0, .04) !important;
                	border-bottom: 4px solid rgba(0, 0, 0, .04) !important;
                	outline: none !important;
                	box-shadow: none !important;
                	box-sizing: border-box;
                	color: #999 !important;
                	font-family: inherit !important;
                	text-decoration: none !important;
                	transition-property: box-shadow, background, height, margin-top, color;
                	transition-duration: .4s;
                	transition-timing-function: ease;
                	font-weight: normal !important;
                }
                .search_nav>a:hover,
                .search_btn:hover,
                .senior-search-link:hover{
                	height: 32px !important;
                	margin-top: -2px !important;
                	color: #666!important;
                	background: rgba(0, 0, 0, .06) !important;
                }
                .search_nav>a:active,
                .search_btn:active,
                .senior-search-link:active{
                	height: 28px !important;
                	margin-top: 2px !important;
                	background: rgba(0, 0, 0, .1) !important;
                }
                .search_nav>a:first-of-type,
                .search_btn_enter_ba{
                	border-left: none !important;
                }
                .j_search_post {
                	margin-right: 0 !important;
                }
                #search_baidu_promote {
                	display: none;
                }
                .s_tools {
                	display: none !important;
                }
                .search_nav {
                	display: flex;
                	flex: 1;
                	padding: 20px 0 !important;
                	margin: -20px 0 !important;
                	height: inherit !important;
                	background: none !important;
                	opacity: 0;
                }
                .search_nav *{
                	display: none !important;
                }
                .search_nav>a{
                	flex: 1;
                }
                .search_logo:hover+.head_right_region .search_top,
                .search_top:hover .search_nav{
                	opacity: 1;
                	/*事件延迟，降低误操作率*/
                	animation-name: eventon_duration;
                	animation-duration: .8s;
                	animation-timing-function: linear;
                	animation-fill-mode: forwards;
                }
                .search_top:hover+.search_main_wrap{
                	opacity: 0;
                }
                .search_nav,
                .search_main_wrap{
                	transition-property: opacity;
                	transition-duration: .4s;
                	transition-timing-function: ease;
                }

                .search_main_fixed {
                	position: fixed;
                	padding: 8px 20px !important;
                	left: 0;
                	background-color: #fafafa !important;
                	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08) !important;
                }
                .search_main_fixed:before {
                	content: \"Design by Maverick\";
                	position: fixed;
                	display: block;
                	height: 39px;
                	width: 60px;
                	top: 46px;
                	right: 25px;
                	font-size: 0;
                	background: #fafafa;
                	border-radius: 0 0 40px 40px;
                	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.08) !important;
                }
                .search_main_fixed .search_btn_wrap+.search_btn_wrap{
                	margin-right: 0px !important;/*让后面的高级搜索按钮可以紧贴前面的按钮*/
                }
                .search_main_fixed .senior-search-link{
                	display: block !important;/*取消隐藏*/
                }
                /*搜索推荐浮层*/

                .suggestion {
                	margin: 0 !important;
                	margin-left: 1px !important;
                	margin-top: 2px !important;
                	padding-bottom: 10px;
                	border-radius: 0 0 4px 4px;
                	border: none !important;
                	box-shadow: 0 4px 8px 2px rgba(0, 0, 0, 0.16);
                	display: block !important;
                	pointer-events: none;
                	opacity: 0;
                	min-height: 30px;
                	transform:translateY(-40px);
                	transition-property: opacity, transform;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .search_main:not(.search_main_fixed) .suggestion{
                	top: 28px !important;
                	left: 60px !important;
                }
                .suggestion:before {
                	content: \"输入你要搜索的贴吧，此处将为你提供候选结果\";
                	white-space: nowrap;
                	position: absolute;
                	left: 50%;
                	top: 50%;
                	transform: translate(-50%, -50%);
                	color: #bbb;
                	z-index: 0;
                }
                .suggestion[style*=\"block\"] {
                	opacity: 1;
                	transform:none;
                	pointer-events: auto;
                }
                .suggestion_list {
                	background: #fff;
                	z-index: 1;
                	position: relative;
                }
                /*用户面板*/
                .userbar {
                	overflow: visible !important;
                	position: fixed !important;
                	top: 20px !important;
                	right: 0 !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	padding-right: 10px !important;
                }
                .userba * {
                	backface-visibility: hidden;
                }
                .userbar>ul {
                	overflow: visible;
                	text-align: center;
                	margin-top: 10px;
                	margin-right: 20px;
                	perspective: 800px;
                }
                .userbar>ul>li {
                	height: 100%;
                	position: relative;
                	margin: 0 !important;
                	padding: 0 !important;
                	margin-bottom: 10px !important;
                	opacity: 1;
                	transform-origin: 100% 50%;
                	transition-property: transform, opacity;
                	transition-duration: 1s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .userbar>ul>li,
                .userbar>ul>li * {
                	float: none !important;
                }
                .userbar>ul>li:hover~li {
                	transform: translateX(50px) rotateY(-90deg) translateZ(-60px);
                	opacity: 0;
                }
                .userbar>ul>li.u_wallet:hover~li,
                .userbar>ul>li.u_tbmall:hover~li,
                .userbar>ul>li.u_hermes:hover~li,
                .userbar>ul>li.u_login:hover~li,
                .userbar>ul>li.u_reg:hover~li {
                	opacity: 1;
                	transform: none;
                }
                .u_menu_item {
                	display: block;
                	margin: 0 auto !important;
                	padding: 0 !important;
                	position: relative !important;
                	height: 50px !important;
                	width: 50px !important;
                	border: none !important;
                	border-radius: 50%;
                	background: transparent;
                	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.08);
                	transition-property: box-shadow, color, background;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .u_menu_item.u_menu_hover,
                .u_menu_item:hover {
                	background: #fff;
                	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1), 0 2px 16px 0 rgba(0, 0, 0, 0.08);
                }
                body>.userbar>ul>li>a,
                .u_menu_wrap,
                .u_menu_item>a {
                	display: block;
                	border-radius: 50%;
                	height: 50px !important;
                	width: 50px !important;
                	background: #4879BD !important;
                	padding: 0 !important;
                	margin: 0 !important;
                	transition-property: background;
                	transition-duration: 1s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                body>.userbar>ul>li>a,
                .u_hermes>.u_menu_item>a {
                	font-size: 14px;
                	line-height: 18px;
                	letter-spacing: 2px;
                	text-indent: 2px;
                	padding: 6px !important;
                	padding-top: 7px !important;
                	box-sizing: border-box;
                }
                .u_hermes a,
                .u_login a,
                .u_reg a {
                	color: #fff !important;
                	font-size: 16px !important;
                	line-height: 50px;
                	font-weight: bold;
                   text-decoration: none !important;
                }
                body>.userbar>ul>.u_hermes>a,
                body>.userbar>ul>.u_login>a,
                body>.userbar>ul>.u_reg>a {
                	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.08);
                }
                body>.userbar>ul>.u_login>a,
                body>.userbar>ul>.u_reg>a {
                	text-indent: 0;
                	letter-spacing: 0;
                	font-size: 16px;
                	line-height: 34px;
                	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.08);
                }
                .u_hermes a:hover,
                .u_login a:hover,
                .u_reg a:hover {
                	background: #4285F4 !important;
                }
                .u_menu_hover:after {
                	display: none !important;
                }
                .u_news_wrap span {
                	color: #fff !important;
                   font-weight: bold;
                	display: block;
                	background: #4879BD !important;
                	line-height: 12px !important;
                	position: absolute !important;
                	padding: 2px 4px !important;
                	text-align: center !important;
                	top: auto !important;
                	bottom: -6px !important;
                	left: 50% !important;
                	transform: translateX(-50%);
                	font-size: 12px !important;
                	border-radius: 6px !important;
                	white-space: nowrap !important;
                	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
                }
                .u_ddl {
                	position: absolute !important;
                	display: block !important;
                	top: 38px !important;
                	left: 50% !important;
                	transform: translateX(-50%);
                	right: auto !important;
                	overflow: visible !important;
                	pointer-events: none;
                	opacity: 0;
                	transition-property: opacity;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .u_menu_hover~.u_ddl,
                li:hover>.u_ddl {
                	pointer-events: auto;
                	opacity: 1;
                }
                .u_ddl_con {
                	position: relative !important;
                	border: none !important;
                	background: transparent !important;
                	padding-bottom: 10px;
                	overflow: visible !important;
                }
                .u_ddl_con_top {
                	background: transparent !important;
                }
                .u_ddl_tit {
                	background: transparent !important;
                }
                .u_ddl_con ul {
                	display: block;
                	overflow: visible;
                	padding: 10px !important;
                	padding-bottom: 0 !important;
                }
                .u_ddl_con ul.sys_notify_last {
                	padding-top: 0 !important;
                }
                .u_ddl_con li a,#u_notify_item li a,ul.sys_notify_last li a{/*解决右上角的浮动按钮文字超出按钮问题*/
                   white-space:normal !important;
                }

                .u_ddl_con li {
                	margin-top: 10px;
                	padding: 0 !important;
                	width: auto !important;
                	transform: translateX(-50px) rotateY(90deg) translateZ(-60px);
                	opacity: 0;
                	transform-origin: 100% 50%;
                	transition-property: transform, opacity;
                	transition-duration: 1s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .u_ddl_con li:nth-of-type(1) {
                	transition-delay: 0s;
                }
                .u_ddl_con li:nth-of-type(2) {
                	transition-delay: .05s;
                }
                .u_ddl_con li:nth-of-type(3) {
                	transition-delay: .1s;
                }
                .u_ddl_con li:nth-of-type(4) {
                	transition-delay: .15s;
                }
                .u_ddl_con li:nth-of-type(5) {
                	transition-delay: .2s;
                }
                .u_ddl_con li:nth-of-type(6) {
                	transition-delay: .25s;
                }
                .u_ddl_con li:nth-of-type(7) {
                	transition-delay: .3s;
                }
                .u_ddl_con li:nth-of-type(8) {
                	transition-delay: .35s;
                }
                .u_ddl_con li:nth-of-type(9) {
                	transition-delay: .4s;
                }
                .category_item_last {
                	transition-delay: .3s !important;
                }
                .u_menu_hover~.u_ddl .u_ddl_con li,
                li:hover>.u_ddl .u_ddl_con li {
                	opacity: 1;
                	transform: none;
                }
                .u_ddl_con li a {
                	color: #999 !important;
                	background: #fff !important;
                	/*display: inline-block;*/
                	width: 50px !important;
                	height: 50px !important;
                	font-size: 12.5px !important;
                	letter-spacing: 2px;
                	line-height: 19.5px !important;
                	padding: 5px !important;
                	padding-left: 6px !important;
                	padding-top: 6px !important;
                	margin: 0 !important;
                	border: 0 !important;
                	white-space: normal;
                	text-decoration: none;
                	border-radius: 50px;
                	box-sizing: border-box !important;
                	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.08);
                	transition-property: box-shadow, color, background;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                	font-family: inherit !important;
                }
                .sys_notify li a {
                	display: block !important;
                	left: 50% !important;
                	transform: translateX(-50%) !important;
                }
                .u_ddl_con li a:hover {
                	color: #fff !important;
                	background: #4285F4 !important;
                	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1), 0 2px 16px 0 rgba(0, 0, 0, 0.08);
                }
                .u_notity_bd .category_item .unread_num,
                .u_notity_bd .category_item .unread-num{
                	color: #999 !important;
                   font-weight: bold;
                	background: #fff;
                	display: block;
                	line-height: 12px;
                	font-size: 12px;
                	border-radius: 12px 0 0 12px;
                	padding: 2px 0;
                	padding-left: 6px;
                	padding-right: 4px;
                	position: absolute;
                	top: 50%;
                	left: 1px;
                	right: auto;
                	transform: translate(-100%, -50%);
                	margin: 0 !important;
                	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.08);
                }
                .sys_notify_last .unread-num,
                .sys_notify_last .unread_num {
              /*	left: 25px !important;*/
                }
                .u_ddl_con li a:hover .unread-num,
                .u_ddl_con li a:hover .unread_num {
                	color: #fff;
                	background: #4285F4;
                }
                .u_ddl_con li.u_logout a {
                	line-height: 36px !important;
                }
                .u_ddl_con li.u_logout a:hover {
                	background: #F44336 !important;
                }
                .u_ddl_con li a[data-type=\"atme\"],
                .u_ddl_con li a[data-type=\"friendapply\"],
                .u_ddl_con li a[data-type=\"fans\"],
                .u_ddl_con_top li a[track-locate=\"2\"], 
                .u_ddl_con_top li a[track-locate=\"3\"],
                .u_ddl_con_top li a[track-locate=\"4\"]{
                	font-size: 0 !important;
                }
                .u_ddl_con li a[data-type]:before {
                	font-size: 12.5px;
                	letter-spacing: 2px;
                	text-indent: 2px;
                	line-height: 19.5px;
                	display: inline-block;
                }
                .u_ddl_con li a[track-locate]:before {
                	font-size: 12.5px;
                	letter-spacing: 2px;
                	text-indent: 2px;
                	line-height: 19.5px;
                	display: inline-block;
                }
                .u_ddl_con li a[data-type=\"atme\"]:before {
                	content: \"查看@我\";
                }
                .u_ddl_con li a[data-type=\"friendapply\"]:before {
                	content: \"新的好友\";
                }
                .u_ddl_con li a[data-type=\"fans\"]:before {
                	content: \"新的粉丝\";
                }
                /*贴吧视频*/
                .u_ddl_con_top li a[track-locate=\"2\"]:before {
                    content: \"视频发布\";
                }
                .u_ddl_con_top li a[track-locate=\"3\"]:before {
                    content: \"视频管理\";
                }
                .u_ddl_con_top li a[track-locate=\"4\"]:before {
                    content: \"视频数据\";
                }
                .u_username_wrap >* {
                	float: none !important;
                }
                .u_username_avatar {
                	width: 50px !important;
                	height: 50px !important;
                	border-radius: 50% !important;
                	display: block !important;
                	margin: 0 !important;
                	z-index: 1;
                	position: relative;
                }
                .u_username_title,
                .u_menu_wrap:after {
                	-moz-osx-font-smoothing: grayscale;
                	-webkit-font-smoothing: antialiased;
                	z-index: 2;
                	line-height: 25px;
                	white-space: nowrap;
                	position: absolute !important;
                	left: 50%;
                	top: 50%;
                	transform: translate(-50%, -50%);
                	padding: 0 10px !important;
                	margin: 0 !important;
                	color: #fff;
                	background: rgba(0, 0, 0, .6) !important;
                	border-radius: 4px;
                	opacity: 0;
                	transition-property: opacity;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .u_username_title{
                	font-size: 12px !important;
                }
                .u_setting_wrap:after {
                	content: \"设置&服务\";
                }
                .u_wallet_wrap:after {
                	content: \"T豆账单\";
                }
                .u_news_wrap:after {
                	content: \"消息通知\";
                }
                .u_tbmall_wrap:after {
                	content: \"T豆商城\";
                }
                .u_username_title:after {
                	display: none !important;
                }
                .u_menu_hover .u_username_title,
                .u_menu_item:hover .u_username_title,
                .u_menu_hover .u_menu_wrap:after,
                .u_menu_item:hover .u_menu_wrap:after {
                	border: none !important;
                	opacity: 1;
                }
                .category_item {
                	border: none !important;
                }
                .u_ddl_con{
                	box-shadow: none !important;
                }
                .u_menu_item>a{
                	font-size: 0;
                }
                .userbar i,
                .u_ddl_arrow,
                .u_menu_item .i-arrow-down{
                	display: none !important;
                }
                .u_menu_item>a:before {
                	font-family: \'Material Icons\';
                	line-height: 1;
                	display: block;
                	color: #fff;
                	font-size: 30px;
                	position: absolute;
                	left: 50%;
                	top: 50%;
                	transform: translate(-50%, -50%);
                }
                .u_username_wrap:before {
                	content: \"\\e7fd\";
                	font-size: 36px;
                	margin-top: -2px;
                }
                .u_wallet_wrap:before {
                	content: \"\\e850\";
                	font-size: 28px;
                }
                /*贴吧消息管理*/
                .u_news_wrap:before {
                	content: \"\\e7f4\";
                	font-size: 32px;
                	margin-top: -2px;
                }
                /*贴吧视频管理按钮*/
                li.u_creative a[track-locate=\"1\"]:before {
                	content: \"\\E04B\";
                	font-size: 32px;
                	margin-left: 1px;
                }
                li.u_creative a[track-locate=\"1\"]:after {
                	content: \"视频号创作中心\";
                }
                .u_tbmall_wrap:before {
                	content: \"\\e8cc\";
                	font-size: 28px;
                }
                .u_app_wrap:before {
                	content: \"\\e324\";
                }
                .u_setting_wrap:before {
                	content: \"\\e8b8\";
                }
                .u_member_wrap:before{
                	content: \"\\e1ac\";
                }
                .ui_bubble_content {
                	position: absolute !important;
                	border: none !important;
                	left: 0 !important;
                	background: #4879BD !important;
                	border-radius: 6px !important;
                	padding: 5px !important;
                	padding-left: 7px !important;
                	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.08) !important;
                	color: #fff !important;
                	letter-spacing: 1px;
                }
                .ui_bubble_up {
                	transform: translate(-100%, -100%) !important;
                	top: 0 !important;
                }
                .ui_bubble_down {
                	transform: translate(-100%, 50%) !important;
                	bottom: 0 !important;
                }
                .ui_bubble_content * {
                	color: #fff !important;
                }
                .ui_triangle {
                	position: absolute !important;
                	left: 0 !important;
                	width: 0 !important;
                	height: 0 !important;
                	border-top: 6px solid transparent;
                	border-left: 8px solid #4879BD;
                	border-bottom: 6px solid transparent;
                }
                .ui_triangle_up {
                	transform: translateY(-100%);
                	margin-top: -10px !important;
                	bottom: 0 !important;
                }
                .ui_triangle_down {
                	transform: translateY(100%);
                	margin-top: 10px !important;
                	bottom: 0 !important;
                }
                .ui_bubble_wrap .close_msg_tip,
                .ui_bubble_closed {
                	background: none !important;
                }
                .ui_bubble_wrap .close_msg_tip:before,
                .ui_bubble_closed:before {
                	content: \"X\";
                	font-weight: bold;
                	display: block;
                	transform: translateY(-2px) scaleY(.8);
                }
                #com_userbar_message.ui_bubble_wrap {
                	z-index: 10004;
                	position: fixed !important;
                	width: 90px !important;
                	right: 0 !important;
                	top: 0 !important;
                }
                #com_userbar_message .ui_bubble_up {
                	top: 42px !important;
                	transform: translateX(-100%) !important;
                	background-color: #4879BD !important;
                }
                #com_userbar_message .ui_triangle_up {
                	top: 48px !important;
                	transform: none !important;
                	margin-top: 0 !important;
                }

                /*帖子内页*/

                .pb_content {
                	background: none !important;
                	border: 0 !important;
                	position: relative;
                	width: 100% !important;
                	display: flex;
                }
                .left_section {
                	flex: 1;
                	background: transparent !important;
                }
                .l_post_bright {
                	/*楼层*/
                   background: none !important;
                	border: none !important;
                	border-bottom: 1px solid rgba(0,0,0,.1) !important;
                	width: 100%!important;
                	position: relative;
                	box-sizing: border-box;
                	display: flex;
                	flex-wrap: wrap;
                /*  color:#000;*/

                }
                .l_post_bright.noborder_bottom,
                .l_post_bright:last-of-type{
                	border: none !important;
                }
                .d_author,
                .d_author_anonym {
                	/*楼层作者栏*/
                	width: 180px !important;
                	padding: 20px 0 !important;
              /*   background-color:#ffffff;*/
                }
                .__tieba_blocked__.l_post::before {
                   content: '该楼层已被屏蔽';
                   right: 0;
                   top: 0;
                   font-size: 14px;
                	height: 35px;
              /*   text-align: center;*/
                }
                .l_post_bright:before {
                	/*作者层背景*/

                	content: \"Design by Maverick\";
                	font-size: 0;
                	display: block;
                	position: absolute;
                	height: 100%;
                	width: 180px;
                /*	background: rgba(0, 0, 0, .01);*/
                	border-right: 1px solid rgba(0,0,0,.1) !important;
                	box-sizing: border-box;
                }
                /*楼主标识*/

                .louzhubiaoshi_wrap {
                	border: none;
                	position: relative;
                }
                .louzhubiaoshi {
              /*	top: -6px !important;
                	right: 12px !important;
                    z-index: 1;*/
                background:url(//tb2.bdstatic.com/tb/static-user/widget/pb_author/images/louzhu_b77db49.png) no-repeat -0px 0;
              /*	width: 30px;
                	height: 30px;
                	line-height: 30px;*/
                }
                /*.louzhubiaoshi a {
                	width: 30px;
                	height: 30px;
                	line-height: 30px;
                	color: rgba(0, 0, 0, .3)
                }
                .louzhubiaoshi a:hover {
                	color: rgba(0, 0, 0, .4)
                }
                .louzhubiaoshi a:before {
                	content: \"\\e853\";
                	font-family: \'Material Icons\';
                	font-size: 28px;
                	display: inline-block;
                	vertical-align: top;
                }*/
                .louzhubiaoshi_wrap .ui_bubble_up {
                	margin-left: 38px;
                	transform: translate(0, -100%) translateY(-6px) !important;
                }
                .louzhubiaoshi_wrap .ui_triangle_up {
                	margin-left: 30px;
                	transform: scaleX(-1) translateY(-100%) translateY(-4px);
                }
                /*作者层头像域*/

                .p_author_face {
                	background: rgba(0, 0, 0, .04) !important;
                	border: none !important;
                	display: block;
                	height: 110px !important;
                	width: 110px !important;
                	padding: 4px !important;
                	transition-property: box-shadow;
                	transition-duration: .5s;
                	transition-timing-function: ease;
                }
                .p_author_face:hover {
                	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
                }
                .p_author_face img {
                	width: 100%;
                	height: 100%;
                }
                /*作者层ID域*/

                .d_author .d_name {
                	font-size: 14px !important;
                }
                /*作者层印记域*/

                .d_author .d_pb_icons {
                	background: rgba(255, 255, 255, .2) !important;
                	border: 1px solid #eee !important;
                }
                /*作者层头衔域*/

                .d_badge_bright {
                	background: rgba(0, 0, 0, .04) !important;
                	border: none !important;
                	width: 100px !important;
                	height: 28px !important;
                	line-height: 28px !important;
                	border-radius: 14px;
                	color: #666;
                	transition-property: box-shadow;
                	transition-duration: .5s;
                	transition-timing-function: ease;
                }
                .d_badge_bright[class*=\"d_badge_bawu\"] {
                	background: #4879BD !important;
                	color: #fff !important;
                }
                .d_badge_bright:hover {
                	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08), 0 4px 4px 0 rgba(0, 0, 0, 0.08);
                }
                .d_badge_bright:after {
                	content: \"\\e866\";
                	font-family: \'Material Icons\';
                	font-size: 36px;
                	line-height: 1;
                	position: absolute;
                	right: 6px;
                	top: -4px;
                	color: rgba(0, 0, 0, .2);
                }
                .d_badge_title {
                	line-height: inherit !important;
                	width: 70px !important;
                	color: inherit !important;
                }
                .d_badge_title_bawu {
                	text-indent: 8px;
                }
                .d_badge_bright .d_badge_lv {
                	position: absolute;
                	top: -2px !important;
                	left: auto !important;
                	right: 12.5px !important;
                	margin: 0 !important;
                	height: 100% !important;
                	line-height: inherit !important;
                	background: none !important;
                	color: #fff !important;
                	z-index: 1;
                	padding: 0;
                	text-align: center;
                	width: 24px;
                	text-indent: 0 !important;
                	font-family: inherit !important;
                }
                .d_author .d_pb_icons .icon_saparater {
                	background: none !important;
                }
                .d_post_content_main {
                	/*楼层右栏*/
                	flex: 1;
                	width: 0 !important;
                	padding: 0 !important;
                /*	background: inherit !important;*/
                	box-sizing: border-box;
                }
                /*楼层内容域*/

                .p_content {
                	padding: 20px !important;
                }
                .core_reply {
                	/*楼层下方框架*/

                	margin-right: 0 !important;
                }
                .core_reply:after {
                	content: \"\";
                	display: table;
                	clear: both;
                }
                .replace_tip{
                	text-align: center;
                	background-color: rgba(0,0,0,.6) !important;
                	border: none !important;
                	padding: 0 1px !important;
                	padding-top: 7px !important;
                	color: #fff;
                	text-decoration: none !important;
                	opacity: 1 !important;
                	transition: background .4s ease;
                }
                .replace_tip:hover{
                	background-color: rgba(0,0,0,.4) !important;
                }
                .replace_tip:before{
                	content: \"\\e5cf\";
                	font-family: \'Material Icons\';
                	display: inline-block;
                	vertical-align: top;
                	font-size: 28px;
                }
                .replace_tip .txt {
                	font-size: inherit;
                	padding: 0;
                	color: inherit;
                }
                .replace_tip .expand,
                .replace_tip .icon-expand{
                	display:none !important;
                }
                .forbid-speech-banner{
                	/*禁言tip*/
                	border-top: 1px solid rgba(0, 0, 0, .04) !important;
                	width: 100% !important;
                	box-sizing: border-box;
                	padding: 8px 12px 8px 2px !important;
                	margin: 0 !important;
                }
                /*楼层信息域*/

                .core_reply_tail {
                	width: 100% !important;
                	margin-right: 0 !important;
                	position: relative !important;
                	margin: 10px 0 !important;
                	color: #999 !important;
                	float: right;
                	box-sizing: border-box;
                }


                .post-tail-wrap {
                	position: static !important;
                   width: auto
                }
                .core_reply_tail > *,
                .core_reply_tail > * > * {
                	float: left !important;
                }
                .post-tail-wrap > *,
                .p_mtail > * {
                	float: right !important;
                }
                .core_reply_tail > *:not(.p_reply) {
                	/*楼层信息*/

                	display: block;
                	background: rgba(0, 0, 0, .04);
                	padding: 0 !important;
                	height: 28px;
                	line-height: 28px;
                	margin: 0 !important;
                	font-size: 14px;
                }
                .core_reply_tail * {
                	color: inherit !important;
                }
                .core_reply_tail a[href]:hover:not(.tail-info),
                .p_reply:hover {
                	color: #999 !important;
                }
                .post-tail-wrap {
                	/*消灭分割线*/

                	font-size: 0 !important;
                }
                .post-tail-wrap > * {
                	font-size: 14px !important;
                }
                .p_mtail > li {
                	font-size: 0 !important;
                }
                .p_mtail > li >* {
                	font-size: 14px !important;
                }
                .core_reply_tail a {
                	color: inherit !important;
                }
                .core_reply_tail > .props_appraise_wrap {
                	/*楼层信息右侧圆角*/
                	padding-top: 5px !important;
                	padding-right: 16px !important;
                	box-sizing: border-box;
                	width: auto;
                	min-width: 16px;
                	border-radius: 0 16px 16px 0;
                }
                .j_jb_ele {
                	/*举报*/

                	font-size: 0 !important;
                	position: relative;
                	width: 45px;
                   height:13px;
                }
                .complaint{
                   top: 6px;
                   width:0px;
                }
                .j_jb_ele:only-child {
                	margin: 0 !important;
                }
                .j_jb_ele .pb_list_triangle_down {
                	display: none !important;
                }
                /*楼层删楼按钮样式*/
                .j_jb_ele > a:not(.post_del_href) {
                	font-size: 0 !important;
                	background: none !important;
                }
                .lzl_jb {
                	display: inline-block !important;
                	font-size:10px;
                	position: relative;
                	width: auto;
                	height: 22px;
                	vertical-align: top;
                	margin-right: 4px;
                	opacity: .6;
                	pointer-events: auto;
                	transition-property: opacity;
                	transition-duration: .4s;
                	transition-timing-function: ease;
                }
                /*.lzl_jb[style*=\"none\"] {
                	opacity: 0;
                	pointer-events: none;
                }*/
                /*楼层删楼按钮样式*/
                .p_post_del_my {
                    font-size: 5px !important;
                    width: 50px;
                }
                /*一大堆楼中楼删楼按钮样式*/
                /*.lzl_jb_in:before,
                .j_jb_ele > a:before {
                	font-family: \'Material Icons\';
                	line-height: 1;
                	display: block;
                	font-size: 20px;
                	position: absolute;
                	left: 50%;
                	top: 50%;
                	transform: translate(-50%, -50%);
                }*/
                /*删除*/
                /*.lzl_jb_in[data-field*=\"\'delete_mine\':\'1\'\"]:before,
                .j_jb_ele > a[data-field*=\"\'delete_mine\':\'1\'\"]:before{
                	content: \"\\e872\";
                }
                .lzl_jb_in[data-field*=\"\'delete_mine\':\'1\'\"]:hover:before,
                .j_jb_ele > a[data-field*=\"\'delete_mine\':\'1\'\"]:hover:before{
                	color: #F44336 !important;
                }*/
                .super_jubao {
                	display: block !important;
                	position: absolute;
                	left: 50% !important;
                	transform: translateX(-50%);
                	background: #fff;
                	border: 1px solid #e5e5e5;
                	text-align: center;
                	padding: 2px 5px;
                	width: 90px;
                	top: 28px;
                	z-index: 50002;
                	font-size: 12px;
                	line-height: 28px;
                	opacity: 0;
                	pointer-events: none;
                	transition-property: opacity;
                	transition-duration: .5s;
                	transition-timing-function: ease;
                }
                .j_jb_ele:hover .super_jubao {
                	opacity: 1;
                	pointer-events: auto;
                }
                /*删除*/

                .p_post_del_my,
                .p_post_del,
                .p_post_ban {
                	display: inline-block;
                	padding: 0 4px;
                	text-indent: -1px;
                	transition-property: color, text-shadow;
                	transition-duration: .4s;
                	transition-timing-function: ease;
                }
                .p_post_del_my:hover,
                .core_reply_tail a.p_post_del[href]:hover,
                .core_reply_tail a.p_post_ban[href]:hover {
                	color: #F44336 !important;
                	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                }
                .p_post_del_my:before,
                .p_post_del:before,
                .p_post_ban:before {
                	font-family: \'Material Icons\';
                	display: inline-block;
                	font-size: 20px;
                	vertical-align: top;
                }
                .p_post_del_my:before,
                .p_post_del:before {
                	content: \"\\e872\";
                }
                .p_post_ban:before {
                	content: \"\\e14b\";
                	font-size: 18px;
                	margin-right: 1px;
                }
                /*点赞*/
                .core_reply_tail .common_complient_container {
                	border-radius: 14px;
                	width: auto !important;
                	margin-left: 2px !important;
                }
                .complient_number{
                	display: inline-block;
                	width: auto !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	padding-left: 10px !important;
                	height: 28px !important;
                }
                .common_complient_container .showContent{
                	top: 0 !important;
                }
                .total_count_number{
                	display: inline-block !important;
                	height: 28px !important;
                	line-height: 28px !important;
                	margin:0 2px !important;
                }
                .total_count_number.hideContent{
                	display: none !important;
                }
                .not_complient_thread,
                .complient_thread{
                	display: inline-block;
                	height: 28px !important;
                	margin: 0 4px !important;
                	margin-right: 10px !important;
                	top: 0 !important;
                	background-position: 0 2px  !important;
                }
                .post-tail-wrap > span.tail-info:nth-last-of-type(2),
                .p_tail > li:nth-last-of-type(2)>span {
                	/*楼层数标识*/

                	position: absolute;
                	top: 0px;
                	right: 5px;
                	display: block;
                	background: rgba(0, 0, 0, .04);
                	border-radius: 16px 0 0 16px;
                	padding: 0 !important;
                	padding-left: 10px !important;
                	padding-right: 30px !important;
                	font-size: 14px;
                	height: 28px;
                	line-height: 28px;
                	margin: 0 !important;
                }
                .d_post_content_firstfloor .post-tail-wrap > span.tail-info:nth-last-of-type(2),
                .d_post_content_firstfloor .p_tail > li:nth-last-of-type(2)>span {
                	/*1楼标识*/
                	width:50px;
                	padding-right: 30px !important;
                }
                .p_reply {
                	/*回复按钮*/

                	position: absolute;
                	top: 0px;
                	right: 5px;
                	display: inline-block;
                	background: transparent !important;
                	margin: 0 !important;
                	z-index: 1;
                	transition-property: color;
                	transition-duration: .2s;
                	transition-timing-function: ease;
                }
                .p_reply > * {
                	border: 0 !important;
                	display: block !important;
                	background: transparent !important;
                	color: inherit !important;
                	border-radius: 0 !important;
                	padding: 0 !important;
                	font-size: 0 !important;
                	height: 28px !important;
                	line-height: 28px !important;
                	margin: 0 !important;
                	width: 30px;
                }
                .p_reply > *:before {
                	font-family: \'Material Icons\';
                	display: block !important;
                	font-size: 20px;
                	position: absolute !important;
                	left: 50%;
                	top: 50%;
                	transform: translate(-50%, -50%);
                }
                .p_reply .lzl_link_fold {
                	padding: 0 !important;
                }
                .lzl_link_unfold:before {
                	content: \"\\e0bf\";
                }
                .lzl_link_fold:before {
                	content: \"\\e318\";
                	font-size: 24px;
                }
                .p_reply[data-field*=\'\"total_num\":null\'] .lzl_link_unfold:before,
                .p_reply[data-field*=\"\'total_num\':\'0\'\"] .lzl_link_unfold:before {
                	content: \"\\e0ca\";
                }
                .p_reply > *[style*=\"none\"] {
                	display: none !important;
                }
                .p_reply > *[style*=\"inline-block\"],
                .p_reply > *[style*=\"inline\"] {
                	display: block !important;
                }
                .l_post_bright .core_reply_wrapper {
                	/*楼中楼框架*/
                	border: 0 !important;
                	margin: 0 !important;
                	background: rgba(0, 0, 0, .02) !important;
                	border-top: 1px solid rgba(0, 0, 0, .04) !important;
                	margin-top: 0 !important;
                	width: 100% !important;
                	box-sizing: border-box;
                	float: right;
                	position: relative;
                }
                .core_reply_wrapper .loading_reply {
                	margin: 0 !important;
                	border-radius: 50%;
                	-webkit-filter: grayscale(1);
                	position: absolute;
                	left: 50%;
                	top: 50%;
                	transform: translate(-50%,-50%);
                }
                .core_reply_border_top {
                	/*楼中楼框架顶描边*/

                	display: none !important;
                }
                .core_reply_content {
                	/*楼中楼内容框架*/

                	border: none !important;
                }
                .core_reply_border_bottom{
                	display: none !important;
                }
                .core_reply_content li {
                	border-top: 1px solid rgba(0, 0, 0, .04);
                }
                .lzl_content_reply {
                	color: #666 !important;
                }
                .lzl_content_reply a {
                   color: #666;
                /*	color: inherit !important;*/
                }
                .lzl_content_reply a:hover {
                	color:#2d64b3;
                }
                .lzl_li_pager_s {
                	color: #666 !important;
                }
                .interview .threadListGroupCnt .uIconCnt,
                .lzl_p_p {
                	border: none !important;
                	padding: 2px;
                	background: rgba(0, 0, 0, .04) !important;
                }
                /*楼中楼MORE*/

                .lzl_more {
                	display: inline-block;
                	height: 30px !important;
                	line-height: 30px !important;
                	padding: 0 8px !important;
                	padding-right: 0 !important;
                	background: rgba(0, 0, 0, .04) !important;
                	color: inherit !important;
                	font-size: 14px;
                	border-radius: 2px;
                }
                .lzl_more .j_lzl_m {
                	display: inline-block;
                	padding: 0 6px;
                	color: inherit !important;
                	border-radius: 0 2px 2px 0;
                	margin-left: -4px;
                	text-indent: 6px;
                	transition-property: background, color;
                	transition-duration: .2s;
                	transition-timing-function: ease;
                }
                .lzl_more .j_lzl_m:after {
                	content: \"\\e5d3\";
                	font-size: 30px;
                	font-family: \'Material Icons\';
                	display: inline-block;
                	vertical-align: top;
                	text-indent: 0;
                }
                .lzl_li_pager_s>.btn-sub {
                	/*我也说一句按钮*/

                	font-size: 0 !important;
                	height: 30px !important;
                	line-height: 30px !important;
                	padding: 0 8px !important;
                	background: rgba(0, 0, 0, .04) !important;
                	color: inherit !important;
                	border: none !important;
                	transition-property: background, color;
                	transition-duration: .2s;
                	transition-timing-function: ease;
                }
                .lzl_more .j_lzl_m:hover,
                .lzl_li_pager_s>.btn-sub:hover {
                	color: #fff !important;
                	background: rgba(0, 0, 0, .3) !important;
                }
                .lzl_li_pager_s .icon-reply {
                	display: none !important;
                }
                .lzl_li_pager_s>.btn-sub:before {
                	content: \"\\e15e\";
                	font-size: 24px;
                	font-family: \'Material Icons\';
                	display: inline-block;
                	vertical-align: top;
                	margin-top: -1px;
                	text-indent: -2px;
                }
                .lzl_li_pager_s>.btn-sub:after {
                	content: \"回复层主\";
                	font-size: 14px;
                }
                /*楼中楼输入框框架*/

                .edui-container {
                	width: 100% !important;
                }
                .edui-editor-body {
                	height: auto !important;
                	border: 0 !important;
                	background: transparent !important;
                }
                .lzl_simple_wrapper,
                .edui-body-container {
                	/*输入框*/
                	position: relative !important;
                	min-height: 60px !important;
                	width: 100% !important;
                	box-sizing: border-box;
                	padding: 0 10px !important;
                	resize: vertical;
                	outline: none !important;
                	border: none !important;
                	background: rgba(0, 0, 0, 0.04) !important;
                	border-bottom: 4px solid rgba(0, 0, 0, .04) !important;
                	transition-property: background, border-bottom;
                	transition-duration: .5s;
                	transition-timing-function: ease;
                }
                .lzl_simple_wrapper p{
                	margin: 0 !important;
                	width: auto !important;
                	display: inline-block;
                	position: absolute;
                	left: 50%;
                	top: 50%;
                	transform: translate(-50%,-50%);
                	color: #999;
                }
                .ueg_pmc-link{
                	display: inline-block;
                	padding: 0 4px;
                	background: rgba(0,0,0,.1);
                	border-radius: 4px;
                	margin-left: 2px;
                	color: #666;
                	transition-property: color,background;
                	transition-duration: .4s;
                	transition-timing-function: ease;
                }
                .ueg_pmc-link:hover{
                	background: rgba(0,0,0,.26);
                	color:#fff;
                }
                .edui-body-container:before {
                	content: \"Design by Maverick\";
                	font-size: 0;
                	position: absolute;
                	bottom: 0;
                	right: 0;
                	width: 10px;
                	height: 10px;
                	cursor: ns-resize;
                }
                .edui-body-container:focus {
                	background: rgba(0, 0, 0, 0.02) !important;
                	border-bottom: 4px solid #4879BD !important;
                }
                .lzl_editor_container .lzl_panel_wrapper {
                	/*楼中楼控件域*/

                	width: 100% !important;
                }
                /*发表按钮*/
                #voteFlashPanel .vote_buttons button,
                .lzl_panel_submit,
                .lzl_panel_submit_disabled,
                .poster_submit,
                .qp_submit,
                .save-to-quick-reply-btn {
                	background: none !important;
                	background-color: #4879BD !important;
                	color: #fff !important;
                	width: 60px;
                	height: 26px !important;
                	line-height: 26px !important;
                	border: none !important;
                	border-radius: 13px;
                	padding: 0 4px !important;
                	text-indent: 3px;
                	text-align: center;
                	transition-property: background, box-shadow;
                	transition-duration: .4s;
                	transition-timing-function: ease;
                }
                .lzl_panel_submit_disabled{
                	background-color: rgba(0,0,0,.4) !important;
                }
                .lzl_panel_submit_disabled:before{
                	content:\"发表\";
                }
                .lzl_panel_submit:after,
                .lzl_panel_submit_disabled:after,
                .poster_submit:after,
                .qp_submit:after,
                .save-to-quick-reply-btn:before {
                	content: \"\\e163\";
                	font-family: \'Material Icons\';
                	font-size: 18px;
                	display: inline-block;
                	vertical-align: top;
                	margin-left: 2px;
                	margin-top: -1px;
                	text-indent: 2px;
                }
                #voteFlashPanel .vote_buttons button:hover,
                .lzl_panel_submit:hover,
                .poster_submit:hover,
                .qp_submit:hover,
                .save-to-quick-reply-btn:hover {
                	background-color: #4285F4 !important;
                	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 6px 0 rgba(0, 0, 0, 0.08);
                }
                .lzl_panel_smile {
                	width: auto !important;
                }
                /*表情选择按钮*/

                .lzl_insertsmiley_holder,
                .qp_insertsmiley_holder,
                .interview .qp_interview_insertsmiley {
                	background: none !important;
                	height: 26px;
                	line-height: 26px;
                	color: #4879BD !important;
                	width: 30px;
                	text-align: center;
                	margin: 0 !important;
                	transition-property: color, text-shadow;
                	transition-duration: .4s;
                	transition-timing-function: ease;
                	cursor: pointer;
                }
                .lzl_insertsmiley_holder:hover,
                .qp_insertsmiley_holder:hover {
                	color: #4285F4 !important;
                	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                }
                .interview .threadListGroupCnt .mini .placeholder:before,
                .lzl_insertsmiley_holder:before,
                .qp_insertsmiley_holder:before {
                	content: \"\\e24e\";
                	font-family: \'Material Icons\';
                	line-height: inherit;
                	font-size: 24px;
                	display: inline-block;
                	vertical-align: top;
                	margin-left: 2px;
                	margin-top: -1px;
                	text-indent: 2px;
                }
                /*楼中楼表情选框*/

                .lzl_edui_dialog_container {
                	left: -390px !important;
                	top: 34px !important;
                }
                .emotion_container .s_tab_content .selected .s_tab_btnbg {
                	background: none !important;
                	background-color: #4879BD !important;
                }
                .d_sign_split {
                	/*签名档分割线*/

                	height: 0 !important;
                	padding: 0 !important;
                	margin: 0 !important;
                	width: 100% !important;
                	border: none !important;
                	border-bottom: 1px solid rgba(0, 0, 0, .08) !important;
                }
                .j_user_sign{
                	/*签名档*/
                	margin: 10px !important;
                }
                .sofa_post {
                	/*沙发层*/
                	display: flex;
                	background: transparent !important;
                	width: 100%;
                }
                .sofa_content {
                	background: transparent !important;
                }
                .sofa_content .core_reply_tail {
                	position: static !important;
                }
                .sofa_content .p_tail {
                	background: none !important;
                }
                .sofa_content .p_tail > li:nth-last-of-type(1)>span {
                	position: absolute;
                	left: 0;
                	display: block;
                	background: rgba(0, 0, 0, .04);
                	color: inherit !important;
                	border-radius: 0 16px 16px 0;
                	padding: 0 !important;
                	padding-left: 6px !important;
                	padding-right: 16px !important;
                	font-size: 14px;
                	height: 28px;
                	line-height: 28px;
                	margin: 0 !important;
                }
                .sofa_content .p_tail > li:nth-last-of-type(2)>span {
                	top: auto !important;
                }
                .core_title_wrap_bright {
                	/*帖子标题*/

                	top: 0 !important;
                	border: none !important;
                	overflow: visible !important;
                	width: 100% !important;
                	background: none;
                	border-bottom: 1px solid rgba(0,0,0,.1) !important;
                }
                /*挽尊*/

                .save_face_bg {
                	opacity: 0;
                	top: -1px;
                	right: 23px;
                	transition-property: opacity;
                	transition-duration: .5s;
                	transition-timing-function: ease;
                }
                .l_post_bright:hover .save_face_bg {
                	opacity: 1;
                }
                /*隐藏用户*/

                .user-hide-post-down,
                .user-hide-post-up {
                	display: block !important;
                	right: 2px !important;
                	top: 2px !important;
                	background: none !important;
                	width: auto !important;
                	height: auto !important;
                	color: #999 !important;
                	font-size: 20px;
                	cursor: pointer;
                	transition-property: color,opacity;
                	transition-duration: .5s;
                	transition-timing-function: ease;
                }
                .user-hide-post-down[style*=\"none\"] {
                	opacity: 0;
                	pointer-events: none;
                }
                .user-hide-post-down:hover,
                .user-hide-post-up:hover {
                	color: #f00 !important;
                }
                .user-hide-post-down:before,
                .user-hide-post-up:before {
                	font-family: \'Material Icons\';
                	display: inline-block;
                	vertical-align: top;
                }
                .user-hide-post-down:before {
                	content: \"\\e15c\";
                }
                .user-hide-post-up:before {
                	content: \"\\e409\";
                	transform: scale(1.5);
                }
                .user-hide-post-action {
                	right: 26px !important;
                	top: 1px !important;
                	border-radius: 6px;
                	overflow: hidden;
                	-moz-user-select: none;
                	-webkit-user-select: none;
                }
                .user-hide-post-action a {
                	padding: 2px 8px !important;
                	transition-property: color, background;
                	transition-duration: .4s;
                	transition-timing-function: ease;
                }
                .user-hide-post-action a:hover {
                	color: #fff !important;
                	background: #aaa !important;
                }
                .core_reply_wrapper .user-hide-post-down,
                .core_reply_wrapper .user-hide-post-up {
                	right: -8px !important;
                	top: 0 !important;
                	font-size: 18px;
                }
                .core_reply_wrapper .user-hide-post-action {
                	right: 14px !important;
                	top: -2px !important;
                }
                .pb_list_pager,
                .l_reply_num {
                	height: 25px !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	display: block;
                	position: relative;
                	color: inherit !important;
                }
                .l_reply_num {
                	padding: 0 20px !important;
                	font-size: 0 !important;
                }
                .l_reply_num>span {
                	display: block;
                	font-size: 12px !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	color: inherit !important;
                	line-height: 18px;
                	float: left;
                	margin-top: 13px !important;
                }
                .l_reply_num>span:nth-of-type(1):before {
                	content: \"回复：\";
                }
                .l_reply_num>span:nth-of-type(2):before {
                	margin-left: 12px;
                	content: \"页数：\";
                }
                .p_thread {
                	border: none !important;
                	width: 100% !important;
                	position: relative;
                	margin: 0 !important;
                	padding: 0 !important;
              /*	-moz-user-select: none;禁止选择文字*/
              /*	-webkit-user-select: none;*/
                	height: 45px !important;
                	background: rgba(0,0,0,.02) !important;
                	border-bottom: 1px solid rgba(0,0,0,.1) !important;
                	color: #666;
                }
                .p_thread.thread_theme_7 {
                	border-top: 1px solid rgba(0,0,0,.1) !important;
                }
                .l_thread_info {
                	height: 100% !important;
                	width: 100% !important;
                	margin: 0 !important;
                	display: flex;
                	position: absolute;
                }
                .l_thread_info > * {
                	float: left !important;
                }
                .l_posts_num {
                	height: 100% !important;
                	float: left;
                	line-height: 1 !important;
                	white-space: nowrap;
                	font-size: 0;
                	flex: 1
                }
                .l_posts_num li {
                	height: 100% !important;
                	display: inline-block !important;
                	vertical-align: top;
                	margin: 0 !important;
                	box-sizing: border-box;
                }
                .l_posts_num > li:empty,
                .thread_theme_bright_absolute .l_posts_num > li:empty {
                	display: none !important;
                }
                #tofrs_up {
                	display: none !important;
                }
                .pb_list_pager {
                	padding-top: 10px !important;
                	padding-left: 20px !important;
                }
                .itb_pager >*,
                .pagination-default >*,
                .pagination-default2 >*,/*支持贴吧主页顶部显示楼层列表脚本 https://greasyfork.org/zh-CN/scripts/398403-%E8%B4%B4%E5%90%A7%E4%B8%BB%E9%A1%B5%E9%A1%B6%E9%83%A8%E6%98%BE%E7%A4%BA%E6%A5%BC%E5%B1%82%E5%88%97%E8%A1%A8*/
                .pager >*,
                .j_pager >*,
                .pb_list_pager >* {
                	float: none !important;
                	display: inline-block !important;
                	text-align: center;
                	min-width: 13px !important;
                	line-height: 25px !important;
                	height: 25px !important;
                	padding: 0 10px !important;
                	margin: 0 !important;
                	border: none !important;
                	overflow: visible !important;
                	color: inherit !important;
                	background: rgba(0, 0, 0, .05) !important;
                	border-radius: 12.5px !important;
                	transition-property: background;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .pagination-default2{
                color: #000 !important;
                }
                .pagination-default >.pagination-current,
                .pagination-default2 >.pagination-current,
                .pager > .cur,
                .j_pager > .tP,
                .pb_list_pager > .tP {
                	color: #fff !important;
                	background: rgba(0, 0, 0, .3) !important;
                	width: auto !important;
                }
                .itb_pager >a:hover,
                .pagination-default >a:hover,
                .pagination-default2 >a:hover,
                .pager >a:hover,
                .j_pager >a:hover,
                .pb_list_pager >a:hover {
                	background: rgba(0, 0, 0, .1) !important;
                }
                .p_thread input {
                	position: relative;
                	width: 80px !important;
                	height: 30px !important;
                	background: rgba(0, 0, 0, 0.04);
                	outline: none !important;
                	border: none !important;
                	margin: 0 !important;
                	padding: 0 4px !important;
                	margin-top: 7px !important;
                	border-bottom: 4px solid rgba(0, 0, 0, .04) !important;
                	box-sizing: border-box;
                	color: transparent !important;
                	font-size: 18px !important;
                	line-height: 26px !important;
                	padding-top: 4px !important;
                	text-align: center;
                	transition-property: transform, box-shadow, background;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .p_thread input::-webkit-inner-spin-button {
                	-webkit-appearance: none;
                }
                .p_thread input::-webkit-outer-spin-button {
                	-webkit-appearance: none;
                }
                .p_thread input~button {
                	display: block;
                	position: absolute;
                	width: 80px;
                	padding: 0 !important;
                	margin: 0 !important;
                	top: 7px;
                	height: 30px;
                	border: 0;
                	outline: none;
                	background: transparent !important;
                	font-size: 0;
                	pointer-events: none;
                	animation-name: eventoff_duration;
                	animation-duration: .5s;
                	animation-timing-function: linear;
                	animation-fill-mode: forwards;
                	transition-property: transform;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }

                .p_thread input~button:after {
                	content: \"\";
                	position: absolute;
                	font-size: 16px;
                	left: 8px;
                	top: 0;
                	line-height: 28px;
                	color: rgba(0, 0, 0, 0.5);
                }
                .p_thread input[id^=\"jumpPage\"]~button:after {
                	content: \"跳转到页\";
                }
                .p_thread input[name=\"elevatorFloor\"]~button:after {
                	content: \"跳转到楼\";
                }
                .p_thread input[id^=\"jumpPage\"]:focus~button:after {
                	content: \"页\";
                }
                .p_thread input[name=\"elevatorFloor\"]:focus~button:after {
                	content: \"楼\";
                }
                .p_thread input:focus {
                	background: #4879BD !important;
                	color: #fff !important;
                	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2), 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                	transform: scale(1.5);
                	z-index: 9999;
                }
                .p_thread input:focus~button {
                	animation: none !important;
                	pointer-events: auto !important;
                	transform: scale(1.5);
                	z-index: 9999;
                }
                .p_thread input:focus~button:before,
                .p_thread input:focus~button:after {
                	position: absolute;
                	font-size: 14px;
                	top: 0;
                	line-height: 30px;
                	color: #fff;
                	background: #4879BD;
                	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2), 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                	animation-duration: .5s;
                	animation-timing-function: ease;
                	animation-fill-mode: forwards;
                }
                .p_thread input:focus~button:before {
                	content: \"跳到\";
                	padding: 0 4px;
                	left: -22px;
                	border-radius: 20px 0 0 20px;
                	animation-name: button_effect_left;
                }
                .p_thread input:focus~button:after {
                	left: auto;
                	right: -13px;
                	padding: 0 6px;
                	border-radius: 0 20px 20px 0;
                	animation-name: button_effect_right;
                }

                .l_reply_num~.l_reply_num {
                	position: relative;
                	padding: 0 !important;
                	margin-right: 10px !important;
                	float: right !important;
                }
                .creativeplatform-elevator {
                	font-size: 0 !important;
                	margin-left: 0 !important;
                	width: auto !important;
                	height: 100% !important;
                	position: relative;
                	display: block;
                	color: inherit !important;
                	margin-right: 10px;
                }
                .l_thread_manage {
                	position: absolute;
                	z-index: 10;
                	padding: 0 !important;
                	margin: 0 !important;
                	bottom: -28px;
                	right: 250px;
                	transform: translateY(50%);
                	background: transparent;
                	font-weight: 600;
                }
                .l_thread_manage * {
                	margin: 0 !important;
                	padding: 0 !important;
                	color: inherit;
                	box-sizing: border-box;
                }
                .d_del_thread,
                #d_post_manage {
                	height: 34px;
                	width: 98px;
                	background: #eee;
                	color: rgba(0, 0, 0, .4) !important;
                	border: solid rgba(0, 0, 0, .1);
                	position: relative;
                	transition-property: background;
                	transition-duration: .6s;
                	transition-timing-function: ease;
                }
                .d_del_thread {
                	border-width: 1px;
                	border-radius: 8px;
                	margin-left: -8px !important;
                	width: 106px !important;
                	padding-left: 8px!important;
                }
                .j_thread_delete:before {
                	margin-left: 8px !important;
                }
                #d_post_manage {
                	border-width: 1px 0 1px 1px;
                	border-radius: 8px 0 0 8px;
                }
                .d_del_thread:hover,
                #d_post_manage:hover {
                	color: #fff !important;
                	background: #aaa;
                }
                .d_del_thread:hover {
                	background: #F44336 !important;
                }
                .j_thread_delete,
                .d_post_manage_link {
                	display: block;
                	background: none !important;
                	font-size: 14px;
                	padding-left: 24px !important;
                	width: 100%;
                	height: 100%;
                	line-height: 30px;
                	text-indent: 6px;
                }
                .j_thread_delete:before,
                .d_post_manage_link:before {
                	font-family: \'Material Icons\';
                	speak: none;
                	font-style: normal;
                	font-weight: normal;
                	font-variant: normal;
                	font-size: 24px;
                	white-space: nowrap;
                	word-wrap: normal;
                	direction: ltr;
                	position: absolute;
                	left: 0;
                }
                .j_thread_delete:before {
                	content: \"\\e872\";
                }
                .d_post_manage_link:before {
                	content: \"\\e869\";
                	font-size: 22px;
                }
                #j_quick_thread {
                	display: block !important;
                	border: none !important;
                	background: none !important;
                	position: absolute;
                	left: 50%;
                	bottom: 0;
                	transform: translate(-50%, 100%);
                	text-align: center;
                	pointer-events: none;
                	z-index: 9999;
                	color: rgba(0, 0, 0, .4) !important;
                }
                #d_post_manage:hover #j_quick_thread {
                	pointer-events: auto;
                }
                #j_quick_thread>li {
                	width: auto !important;
                	height: auto !important;
                	transition-property: transform, opacity;
                	transition-duration: .6s;
                	transition-timing-function: ease;
                	transform: translateY(-100%);
                	opacity: 0;
                	transition-delay: 0;
                }
                #j_quick_thread>li>a {
                	display: block;
                	width: 100px;
                	height: 30px;
                	line-height: 30px;
                	margin-top: 4px !important;
                	border-radius: 4px;
                	background: #eee;
                	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2) !important;
                	transition-property: background, color;
                	transition-duration: .6s;
                	transition-timing-function: ease;
                }
                #j_quick_thread>li>a:hover {
                	background: #aaa;
                	color: #fff !important;
                }
                #d_post_manage:hover #j_quick_thread>li {
                	transform: none;
                	opacity: 1;
                }
                .p_thread .loading-tip {
                	top: auto !important;
                	right: auto !important;
                	bottom: 90px;
                	margin: 0 !important;
                	left: 50% !important;
                	transform: translateX(-50%);
                	display: block;
                	position: fixed;
                	z-index: 9999;
                	border: none;
                	background: #4879BD !important;
                	border-radius: 6px !important;
                	padding-left: 7px !important;
                	color: #fff !important;
                	text-indent: -1px;
                	letter-spacing: 1px;
                	padding: 6px 8px !important;
                	width: 100px;
                	text-align: center;
                	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2), 0 2px 16px 6px rgba(0, 0, 0, 0.2) !important;
                }
                /*帖子内页-标题栏*/

                .core_title_bg {
                	background: rgba(0,0,0,.01) !important;
                	position: absolute;
                	left: 0;
                	top: 0;
                	width: 100%;
                	height: 100%;
                	transition: none !important;
                }
                .core_title {
                    height: 56px !important;
                	border: none !important;
                	background: transparent !important;
                }
                .core_title_txt {
                	font-family: inherit !important;
                	width: 730px !important;
                	z-index: 4 !important;
                    left: 10px;
                }
                .core_title_btns {
                	margin: 0 !important;
                	padding: 0 !important;
                	z-index: 4 !important;
                	position: absolute;
                	right: 0;
                }
                .core_title_btns i{
                    display: none !important;
                }
                .core_title_btns > *,
                .core_title_btns .l_lzonly,
                .core_title_btns .l_lzonly_cancel,
                .core_title_btns .p_favthr_main,
                .core_title_btns .j_quick_reply {
                	float: left !important;
                	display: block !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	margin-right: 10px !important;
                   min-width:65px;
                	width: auto !important;
                	height: 66px !important;
                	border-radius: 0 0 20px 20px;
                	background: transparent;
                	border: none !important;
                	overflow: visible !important;
                	position: relative !important;
                	text-align: center;
                	line-height: 94px !important;
                	font-size: 16px !important;
                	cursor: pointer;
                }
                .core_title_btns *,
                .core_title_btns *:before,
                .core_title_btns *:after {
                	box-sizing: border-box;
                	color: rgba(0, 0, 0, .4) !important;
                	transition: none !important;
                }
                .core_title_btns>* {
                	box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.2) !important;
                	background: #eee !important;
                	transition-property: transform !important;
                	transition-duration: .2s !important;
                	transition-timing-function: ease !important;
                   left:unset !important;/*兼容 Copy Tieba Link https://github.com/shitianshiwa/baidu-tieba-userscript/ 复制链接按钮*/

                }
                .core_title_absolute_bright .core_title_btns > *{/*兼容 Copy Tieba Link https://github.com/shitianshiwa/baidu-tieba-userscript/ 复制链接按钮*/
                   top: 50% !important;
                }
                .core_title_btns>*:hover {
                	transition-property: transform, background, box-shadow !important;
                	background: #aaa !important;
                }
                .core_title_btns>*:hover,
                .core_title_btns>*:hover *,
                .core_title_btns>*:hover .d_lzonly_bdaside:before,
                .core_title_btns>*:hover #lzonly_cntn:before,
                .core_title_btns>#lzonly_cntn:hover:before,
                .core_title_btns>#j_favthread:hover:before,
                .core_title_btns>.j_favor:hover:before,
                .core_title_btns>#quick_reply:hover:before,
                .core_title_btns>.quick_reply:hover:before {
                	color: #fff !important;
                }
                .core_title_btns>*:active {
                	box-shadow: 0 4px 2px -1px rgba(0, 0, 0, 0.2) !important;
                }
                .d_lzonly_bdaside {
                	font-size: 0 !important;
                	letter-spacing: 0;
                	text-indent: 0;
                }
                .d_lzonly_bdaside:before {
                	content: \"楼主\";
                	font-size: 16px !important;
                }
                .core_title_btns #lzonly_cntn:before,
                .core_title_btns>#j_favthread:before,
                .core_title_btns>.j_favor:before,
                .core_title_btns>#quick_reply:before,
                .core_title_btns>.quick_reply:before {
                	font-family: \'Material Icons\';
                	speak: none;
                	font-style: normal;
                	font-weight: normal;
                	font-variant: normal;
                	line-height: 1;
                	white-space: nowrap;
                	word-wrap: normal;
                	direction: ltr;
                	display: block;
                	font-size: 30px;
                	position: absolute !important;
                	left: 50% !important;
                	top: 50% !important;
                	transform: translate(-50%, -50%);
                	margin-top: -14px !important;
                }
                .core_title_btns #lzonly_cntn:before {
                	content: \"\\e8f4\" !important;
                	font-size: 32px !important;
                }
                .core_title_btns>#j_favthread:before,
                .core_title_btns>.j_favor:before {
                	content: \"\\e89a\";
                }
                .core_title_btns>#quick_reply:before,
                .core_title_btns>.quick_reply:before {
                	content: \"\\e24c\";
                }
                /*帖子内页底侧浮层,这个是靠贴吧自带的样式变化触发的*/

                .core_title_absolute_bright {
                	display: block !important;
                	z-index: 3 !important;
                	top: auto !important;
                	bottom: 10px !important;
                	left: 50%;
                	transform: translateX(-50%);
                	border: none !important;
                }
                .core_title_absolute_bright .core_title_bg {
                	background: #4879BD  !important;
                	border-radius: 28px;
                	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1), 0 2px 16px 0 rgba(0, 0, 0, 0.08) !important;
                }
                .core_title_absolute_bright .core_title_txt {
                	margin-left: 40px;
                	color: #fff !important;
                }
                .core_title_absolute_bright .core_title_btns {
                	float: none !important;
                	display: block !important;
                	position: absolute !important;
                	right: 20px !important;
                	bottom: 0 !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	height: 100% !important;
                }
                .core_title_absolute_bright .core_title_btns *,
                .core_title_absolute_bright .core_title_btns *:before,
                .core_title_absolute_bright .core_title_btns *:after {
                	color: #fff !important;
                }
                .core_title_absolute_bright .core_title_btns > * {
                	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2), 0 2px 16px 0 rgba(0, 0, 0, 0.08) !important;
                	background: #4879BD !important;
                	transform: translateY(-50%) scale(1) !important;
                	transition-duration: .6s !important;
                }
                .core_title_absolute_bright .core_title_btns > *:hover {
                	transform: translateY(-50%) scale(1.1) !important;
                	background: #4285F4 !important;
                }
                .core_title_absolute_bright .core_title_btns > *:active {
                	transform: translateY(-50%) scale(1.05) !important;
                }
                .core_title_absolute_bright .core_title_btns > *,
                .core_title_absolute_bright .core_title_btns .l_lzonly,
                .core_title_absolute_bright .core_title_btns .l_lzonly_cancel,
                .core_title_absolute_bright .core_title_btns .p_favthr_main,
                .core_title_absolute_bright .core_title_btns .j_quick_reply {
                	width: 70px !important;
                	height: 70px !important;
                	border-radius: 50% !important;
                	top: 50%;
                	transform: translateY(-50%);
                	color: #fff !important;
                	line-height: 104px !important;
                	font-size: 12px !important;
                	letter-spacing: 2px;
                	text-indent: 2px;
                    left: unset !important;/*贴子内标题栏的功能按钮 给旧版贴吧用的，例如火狐吧 解决下工具栏文本右偏*/
                }
                /*fix bug*/
                .quick_reply{
                	pointer-events: none;
                }
                .quick_reply > *{
                	pointer-events: auto;
                }
                .core_title_absolute_bright .d_lzonly_bdaside {
                	line-height: 20px;
                }
                .core_title_absolute_bright .d_lzonly_bdaside:before {
                	font-size: 12px !important;
                	letter-spacing: 2px;
                }
                .core_title_absolute_bright .d_lzonly_bdaside,
                .core_title_absolute_bright .p_favthr_main p {
                	color: inherit !important;
                }
                .core_title_absolute_bright .core_title_btns #lzonly_cntn:before,
                .core_title_absolute_bright .core_title_btns>#j_favthread:before,
                .core_title_absolute_bright .core_title_btns>.j_favor:before,
                .core_title_absolute_bright .core_title_btns>#quick_reply:before,
                .core_title_absolute_bright .core_title_btns>.quick_reply:before {
                	display: block !important;
                	color: inherit !important;
                	font-size: 32px !important;
                	margin-top: -10px !important;
                	z-index: 1;
                }
                .core_title_absolute_bright .core_title_btns #lzonly_cntn:before {
                	font-size: 36px !important;
                }
                .core_title_btns>li>a,.core_title_btns>li>*{/*贴子内标题栏的功能按钮 给旧版贴吧用的，例如火狐吧*/
                   left: 5px;
                }
                /*收藏成功提示框*/

                .recommend_outtest_container {
                	border: none !important;
                	background-color: #4879BD !important;
                	border-radius: 6px !important;
                	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2), 0 2px 16px 6px rgba(0, 0, 0, 0.2) !important;
                	color: #fff !important;
                	z-index: 9999;
                	margin: 0 !important;
                	top: 90px !important;
                	right: 32px !important;
                	bottom: auto !important;
                	left: auto !important;
                }
                .recommend_outtest_container > div {
                	width: 100% !important;
                	box-sizing: border-box;
                	left: auto !important;
                	margin: 0 !important;
                	padding: 0 4px !important;
                	position: relative;
                }
                .recommend_outtest_container .arrow_top {
                	width: 0;
                	height: 0;
                	border: none !important;
                	top: -9px;
                	border-left: 10px solid transparent !important;
                	border-right: 10px solid transparent !important;
                	border-bottom: 10px solid #4573b4 !important;
                	transform: translateX(-50%);
                	z-index: 1;
                	margin-left: 100px;
                	background: transparent !important;
                }
                .recommend_outtest_container .success_tip {
                	background: #4573b4;
                	border-radius: 6px 6px 0;
                }
                .recommend_outtest_container .success_tip hr,
                .recommend_outtest_container .success_tip .collect_tip {
                	display: none;
                }
                .recommend_outtest_container .collect_success span {
                	margin-left: 9px;
                	font-size: 18px;
                	top: 10px;
                }
                .recommend_outtest_container .collect_success span:before {
                	content: \"\\e52d\";
                	font-family: \'Material Icons\';
                	line-height: 1;
                	white-space: nowrap;
                	word-wrap: normal;
                	direction: ltr;
                	font-size: 28px;
                	margin-right: 4px;
                	margin-top: -2px;
                	display: block;
                	float: left;
                }
                .recommend_outtest_container .success_tip .delete_collect {
                	position: absolute;
                	right: 0;
                	left: auto;
                	display: block;
                	float: right;
                	height: 40px;
                	line-height: 40px;
                	width: 40px;
                	margin: 0 !important;
                	top: 0;
                	background: none !important;
                	cursor: pointer;
                	text-align: center;
                	color: rgba(255, 255, 255, .6);
                	transform: scale(1);
                	transition-property: color, transform;
                	transition-duration: .4s;
                	transition-timing-function: ease;
                }
                .recommend_outtest_container .success_tip .delete_collect:hover {
                	transform: scale(1.3);
                	color: rgba(255, 255, 255, 1)
                }
                .recommend_outtest_container .success_tip .delete_collect:before {
                	content: \"\\e5cd\";
                	font-family: \'Material Icons\';
                	font-size: 24px;
                }
                .recommend_outtest_container .rules_tip {
                	font-size: 14px;
                	text-align: center;
                	line-height: 30px;
                	height: 60px;
                	margin-bottom: -30px !important;
                }
                .recommend_outtest_container .show_tag_input {
                	margin: 0 !important;
                	padding: 0 6px !important;
                	z-index: 1;
                }
                .recommend_outtest_container .j_add_tag {
                	width: 100% !important;
                	height: 30px !important;
                	outline: none !important;
                	border: none !important;
                	margin: 0 !important;
                	box-sizing: border-box;
                	color: #fff !important;
                	font-size: 18px !important;
                	line-height: 26px !important;
                	text-align: center;
                	background: rgba(0, 0, 0, 0.08) !important;
                	padding: 0 4px !important;
                	padding-top: 4px !important;
                	border-bottom: 4px solid rgba(0, 0, 0, .04) !important;
                	transition-property: transform, box-shadow, background, border-bottom;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .recommend_outtest_container .j_add_tag:focus {
                	background: rgba(0, 0, 0, 0.1) !important;
                	border-bottom: 4px solid #4285F4 !important;
                }
                .recommend_outtest_container .recommend_tag {
                	margin-top: 12px !important;
                	padding: 0 6px !important;
                }
                .recommend_outtest_container .recommend_tag:empty {
                	display: none;
                }
                .recommend_outtest_container .pb_recommend_tag {
                	margin: 0 !important;
                	margin-bottom: 4px !important;
                	margin-right: 5px !important;
                	padding: 0 6px !important;
                	height: 20px;
                	line-height: 20px;
                	float: none;
                	display: inline-block;
                	background: rgba(0, 0, 0, .1);
                	border: none;
                	cursor: pointer;
                }
                .recommend_outtest_container .pb_recommend_tag span {
                	position: static !important;
                	top: auto !important;
                }
                .recommend_outtest_container .pb_recommend_tag:hover {
                	background: #4285F4 !important;
                }
                .recommend_outtest_container .tag_button {
                	margin-top: 12px !important;
                	margin-bottom: 16px !important;
                }
                .recommend_outtest_container .tag_submit_button {
                	width: 200px;
                	height: 27px;
                	line-height: 27px;
                	display: block;
                	position: relative;
                	margin: 0 auto;
                	z-index: 1;
                	background: rgba(0, 0, 0, 0.08) !important;
                	text-align: center;
                	cursor: pointer;
                	letter-spacing: 20px;
                	text-indent: 20px;
                }
                .recommend_outtest_container .tag_submit_button:hover {
                	background: #4285F4 !important;
                }
                .recommend_outtest_container .tag_submit_button span {
                	position: static !important;
                	font-size: inherit !important;
                	color: inherit !important;
                }
                .recommend_outtest_container .pb_recommend_tag,
                .recommend_outtest_container .tag_submit_button {
                	transition-property: background;
                	transition-duration: .4s;
                	transition-timing-function: ease;
                }
                .p_favthread .p_favthr_tip {
                	line-height: 0;
                	font-size: 0 !important;
                	width: 80px !important;
                	height: 80px !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	border-radius: 8px;
                	background: #4879BD !important;
                	color: #fff !important;
                	position: absolute;
                	top: 80px !important;
                	right: -8px !important;
                	z-index: 9999;
                	box-shadow: 0 2px 12px 2px rgba(0, 0, 0, 0.2)!important;
                	display: block !important;
                	transform: translateY(10px);
                	pointer-events: none;
                	opacity: 0 !important;
                	transition-property: opacity, transform;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .p_favthread .p_favthr_tip[style*=\"height:\"] {
                	visibility: visible;
                	opacity: 1 !important;
                	transform: none;
                }
                .core_title_wrap_bright>.p_favthread .p_favthr_tip {
                	top: 70px !important;
                	right: 76px !important;
                }
                .p_favthread .p_favthr_tip * {
                	display: none;
                }
                .p_favthread .p_favthr_tip>span:only-child,
                .p_favthread .p_favthr_tip>a:nth-of-type(1) {
                	display: block;
                }
                .core_title_absolute_bright .p_favthread .p_favthr_tip {
                	top: -82px !important;
                	right: -5px !important;
                }
                .core_title_absolute_bright>.p_favthread .p_favthr_tip {
                	top: -100px !important;
                	right: 105px !important;
                }
                .p_favthread .p_favthr_tip>span:only-child:after,
                .p_favthread .p_favthr_tip>a:nth-of-type(1):after {
                	font-size: 12px;
                	letter-spacing: 2px;
                	display: inline-block;
                	width: 100%;
                	color: #fff;
                	margin-top: 12px;
                }
                .p_favthread .p_favthr_tip>span:only-child:after {
                	content: \"取消成功\";
                }
                .p_favthread .p_favthr_tip>a:nth-of-type(1):after {
                	content: \"收藏成功\";
                }
                .p_favthread .p_favthr_tip>span:only-child:before,
                .p_favthread .p_favthr_tip>a:nth-of-type(1):before {
                	font-family: \'Material Icons\';
                	line-height: 1;
                	font-size: 42px;
                	display: block;
                	margin-top: 6px;
                	color: #fff;
                }
                .p_favthread .p_favthr_tip>span:only-child:before {
                	content: \"\\e8e7\";
                }
                .p_favthread .p_favthr_tip>a:nth-of-type(1):before {
                	content: \"\\e8e6\";
                }
                .core_title_absolute_bright~.p_postlist .recommend_outtest_container {
                	position: fixed !important;
                	bottom: 86px !important;
                	right: auto !important;
                	left: 50% !important;
                	top: auto !important;
                	transform: translateX(194px);
                	width: 360px;
                	margin: 0 !important;
                	padding: 0 !important;
                }
                .core_title_absolute_bright~.p_postlist .recommend_outtest_container .arrow_top {
                	border: none !important;
                	border-left: 10px solid transparent !important;
                	border-right: 10px solid transparent !important;
                	border-top: 10px solid #4879BD !important;
                	top: auto;
                	left: 50%;
                	bottom: -9px;
                	position: absolute;
                	margin: 0 !important;
                }
                .p_thread.thread_theme_bright_absolute {
                	position: fixed;
                	z-index: 450 !important;
                	bottom: -14px !important;
                	box-sizing: border-box;
                	height: 80px !important;
                	width: 50% !important;
                   max-width: 660px;/*尝试解决超宽屏的情况下，工具栏会过长bug*/
                	background: none !important;
                	border: none !important;
                	padding: 0 !important;
                	margin: 0 !important;
                	color: #fff !important;
                }
                .p_thread.thread_theme_bright_absolute:before {
                	content: \"Design by Maverick\";
                	font-size: 0;
                	position: absolute;
                	height: 54px;
                	width: 85%;
                	background: #4879BD !important;
                }
                .p_thread.thread_theme_bright_absolute:before,
                .p_thread.thread_theme_bright_absolute>*:not(.loading-tip) {
                	opacity: 0;
                	transition-property: opacity;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .p_thread.thread_theme_bright_absolute:hover {
                	transition-duration: 1s;
                }
                .p_thread.thread_theme_bright_absolute:hover:before,
                .p_thread.thread_theme_bright_absolute:hover>*:not(.loading-tip) {
                	opacity: 1;
                	transition-duration: 1s;
                }
                .p_thread.thread_theme_bright_absolute:hover>* {
                	/*过渡时禁止事件*/
                	animation-name: eventon_duration;
                	animation-duration: .8s;
                	animation-timing-function: linear;
                	animation-fill-mode: forwards;
                }

                .thread_theme_bright_absolute .l_posts_num .pb_list_pager {
                	background: none !important;
                	margin: 0 !important;
                	padding: 0 !important;
                	padding-top: 16px !important;
                	box-sizing: border-box;
                	margin-right: 10px !important;
                }
                .thread_theme_bright_absolute .l_thread_info {
                	display: block;
                }
                /*浮动下工具栏页数列表按钮样式*/
                .thread_theme_bright_absolute .pb_list_pager >* {
                	padding: 0 6px !important;
                	/*background: rgba(0, 0, 0, 0.1) !important;*/
                }
                .thread_theme_bright_absolute .pb_list_pager >a:hover {
                    background: #4285F4 !important;
                    /*color:#000 !important;*/
                    background: rgba(0, 0, 0, 0.6) !important;
                }
                .thread_theme_bright_absolute .l_reply_num>span {
                	margin-left: 50% !important;
                	transform: translateX(-50%);
                	white-space: nowrap;
                	float: none !important;
                	margin-top: 2px !important;
                }
                .thread_theme_bright_absolute .l_reply_num>span:nth-of-type(1) {
                	margin-top: 10px !important;
                }
                .thread_theme_bright_absolute .l_reply_num>span:before {
                	margin-left: -1.5em !important;
                }
                .thread_theme_bright_absolute .l_reply_num~.l_reply_num {
                	margin-left: 60px !important;
                }
                .thread_theme_bright_absolute input {
                	background: rgba(0, 0, 0, 0.08) !important;
                	padding: 0 4px !important;
                	padding-top: 4px !important;
                	margin-top: 14px !important;
                	border-bottom: 4px solid rgba(0, 0, 0, .04) !important;
                }
                .thread_theme_bright_absolute input~button {
                	top: 14px;
                }
                .thread_theme_bright_absolute input~button:after {
                	color: rgba(255, 255, 255, 0.5);
                }
                .thread_theme_bright_absolute input:focus~button:before,
                .thread_theme_bright_absolute input:focus~button:after {
                	background: #4285F4;
                }
                .thread_theme_bright_absolute input:focus~button:before {
                	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1), 0 2px 24px 0 rgba(0, 0, 0, 0.1), -10px 0 20px 0px #4879BD;
                }
                .thread_theme_bright_absolute input:focus~button:after {
                	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1), 0 2px 24px 0 rgba(0, 0, 0, 0.1), 10px 0 20px 0px #4879BD;
                }
                .thread_theme_bright_absolute input:focus {
                	background: #4285F4 !important;
                	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1), 0 2px 24px 0 rgba(0, 0, 0, 0.1);
                }
                .thread_theme_bright_absolute .creativeplatform-elevator {
                	margin: 0 !important;
                	padding: 0 !important;
                }
                .thread_theme_bright_absolute .l_thread_manage {
                	display: none !important;
                }
                /*右边栏分割线*/

                .forum_content .aside:before,
                .right_bright:before,
                .side:before,
                .right_aside:before {
                	content: \"Design by Maverick\";
                	font-size: 0;
                	display: block;
                	position: absolute;
                	height: 100%;
                	width: 0;
                	border-left: 1px solid rgba(0,0,0,.1);
                }

                /*keyframes*/
                @keyframes eventoff_duration {
                	from {
                		pointer-events: auto;
                	}
                	to {
                		pointer-events: none;
                	}
                }
                @keyframes eventon_duration {
                	from {
                		pointer-events: none;
                	}
                	to {
                		pointer-events: auto;
                	}
                }
                @keyframes button_effect_left {
                	from {
                		opacity: 0;
                		transform: translateX(80%);
                	}
                	to {
                		opacity: 1;
                		transform: translateX(0);
                	}
                }
                @keyframes button_effect_right {
                	from {
                		opacity: 0;
                		transform: translateX(-90%);
                	}
                	to {
                		opacity: 1;
                		transform: translateX(0);
                	}
                }

                /*细节处理*/

                /*帖子内容图片宽度限制*/
                .d_post_content .BDE_Image{
                	height: auto !important;
                	max-width: 100% !important;
                }
                .d_post_content .BDE_Image[width=\"560\"],
                .poster_body .edui-editor-body .edui-body-container img[width=\"560\"] {
                	width: auto !important;
                	height: auto !important;
                	max-width: 100% !important;
                }

                /*占位符穿透*/

                .tbui_placeholder,
                .tb_poster_placeholder {
                	pointer-events: none;
                }
                .icon_wrap:empty {
                	/*印记栏为空不显示*/

                	display: none !important;
                }
                .frs_bright_icons{
                	/*主题贴列表的印记栏*/
                	right: 10px !important;
                   position: absolute;
                   width: 60px;
                }
                /*话题贴回复框控件域*/

                .qp_btn {
                	width: 100% !important;
                }
                .qp_smile {
                	margin-right: 6px;
                	float: right;
                }
                .thread_theme_bright_absolute .pb_list_pager:empty+.l_reply_num {
                	/*帖子内页页数为1时增大功能栏项目间距*/

                	margin-right: 20px !important;
                }

                .core_reply {
                	/*楼中楼的最小高度导致帖子内页滚动时跳动*/

                	min-height: 0 !important;
                }
                .j_user_card {
                	/*楼中楼回复后头像a标签高度出错*/

                	display: inline-block;
                	min-height: 100%;
                }
                .core_reply_content>ul>li:nth-of-type(1) {
                	/*楼中楼回复后即使是一楼也会出现上描边*/

                	border-top: none;
                }
                /*编辑快速回帖 输入框宽度问题*/

                #quick-reply-edit-wrapper .quick-reply-item {
                	margin-right: 0 !important;
                }
                #quick-reply-edit-wrapper .quick-reply-item .quick-reply-delete-btn {
                	right: 4px !important;
                }

                /*右侧浮层*/

                .tbui_aside_float_bar {
                	border-top: none !important;
                	position: fixed;
              /*	left: 50% !important;*/
                	bottom: 0px !important;
					/*尝试解决侧边工具栏会覆盖在签到框上面*/
					z-index: 4 !important;
                }
                .tbui_aside_fbar_button {
                	box-sizing: content-box;
                	width: 45px !important;
                	height: 50px !important;
                	margin-bottom: 5px;
                }
                .tbui_aside_fbar_button >a {
                	display: block;
                	position: relative;
                	width: inherit !important;
                	height: inherit !important;
                	border-radius: 0 10px 10px 0;
                	box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.08);
                	background: #fefefe !important;
                	overflow:hidden;
                	font-size: 0;
                	white-space: nowrap;
                	text-indent: -45px;
                	transition-property: text-indent;
                	transition-duration: .6s;
                	transition-timing-function: ease;
                }
                .tbui_aside_fbar_button >a:hover {
                	text-indent: 0px;
                }
                .tbui_aside_fbar_button >a:after,
                .tbui_aside_fbar_button >a:before{
                	display: inline-block;
                	color: #ccc;
                	width: inherit !important;
                	height: inherit !important;
                	box-sizing: border-box;
                	vertical-align: top;
                	white-space: normal;
                	text-indent: 0;
                }
                .tbui_aside_fbar_button >a:after{
                	content: \"\\e871\";
                	font-family: \'Material Icons\';
                	font-size: 28px;
                	line-height: 50px;
                	text-align: center;
                	text-indent: -2px;
                }
                .tbui_aside_fbar_button >a:before{
                	content: \"未知项目\";
                	font-size: 14px;
                	line-height: 20px;
                	padding-top: 5px;
                	padding-left: 7px;
                }
                /*e2c4字符下,e2c6字符上*/
                .tbui_fbar_top>a:after {
                	content:\"\\e255\";
                	font-size: 32px;
                }
                .tbui_fbar_top>a:before {
                	content:\"返回顶部\";
                }
                .tbui_fbar_tsukkomi>a:after {
                	content:\"\\e815\";
                }
                .tbui_fbar_tsukkomi>a:before {
                	content:\"神来一句\";
                }
                .tbui_fbar_props>a:after {
                	content:\"\\e39f\";
                }
                .tbui_fbar_props>a:before {
                	content:\"魔法道具\";
                }
                .tbui_fbar_home>a:after {
                	content:\"\\e91d\";
                }
                .tbui_fbar_home>a:before {
                	content:\"召唤度娘\";
                }
                .tbui_fbar_square>a:after {
                	content:\"\\e639\";
                }
                .tbui_fbar_square>a:before {
                	content:\"主播广场\";
                }
                .tbui_fbar_lab>a:after {
                	content:\"\\e87b\";
                	font-size: 26px;
                }
                .tbui_fbar_lab>a:before {
                	content:\"实验功能\";
                }
                .tbui_fbar_feedback>a:before {
                	content:\"我要反馈\";
                }
                .tbui_fbar_feedback>a:after {
                	content:\"\\e0c9\";
                }
                .tbui_fbar_down>a:before {
                	content:\"下载APP\";
                }
                .tbui_fbar_down>a:after {
                	content:\"\\e0d6\";
                }
                .tbui_fbar_favor>a:after {
                	content:\"\\e87d\";
                }
                .tbui_fbar_favor>a:before {
                	content:\"爱逛的吧\";
                }
                .tbui_fbar_share>a:after {
                	content:\"\\e80d\";
                }
                .tbui_fbar_share>a:before {
                	content:\"分享此页\";
                }
                .tbui_fbar_refresh>a:after {
                	content:\"\\e5d5\";
                	font-size: 30px;
                }
                .tbui_fbar_refresh>a:before {
                	content:\"立即刷新\";
                }
                .tbui_fbar_post>a:after {
                	content:\"\\e254\";
                }
                .tbui_fbar_post>a:before {
                	content:\"发表主题\";
                }
                .tbui_fbar_auxiliaryCare>a:before {
                	content:\"辅助功能\";
                }
                .tbui_fbar_auxiliaryCare>a:after {
                	content:\"辅\";
                }
                /*隐藏动画效果?*/
                .tbui_fbar_top,.tbui_fbar_bottom{
                	overflow: hidden;
                	padding-right: 2px;
                	padding-bottom: 2px;
                }
                
                .tbui_fbar_top>a,.tbui_fbar_bottom>a{
                	transition-property: text-indent,transform;
                }
                .tbui_fbar_top[style*=\"hidden\"],.tbui_fbar_bottom[style*=\"hidden\"]{
                	pointer-events: none;
                	visibility: visible !important;
                }
                .tbui_fbar_top[style*=\"hidden\"]>a,.tbui_fbar_bottom[style*=\"hidden\"]>a{
                	transform: translateX(-110%);
                }
                .tbui_fbar_top[style*=\"visible\"],.tbui_fbar_bottom[style*=\"visible\"]{
                	opacity: 1;
                }
                .tbui_fbar_bottom>a:before {
                	content:\"快速到底\";
                }
                .tbui_fbar_bottom>a:after {
                	content:\"\\e2c4\";
                }
                .threadListGroupCnt>.listBtnCnt>#interview-share-wrapper>.tbshare_popup_wrapper{
                    position:unset !important;/*特殊的今日话题分享按钮*/
                }
                .tbshare_popup_wrapper{
                	position: fixed;/*特殊的今日话题分享按钮*/
                	width: inherit;
                	height: inherit;
                	text-indent: 0;
                	font-size: 12px;
                }
                .tbui_aside_float_bar .tbshare_popup_wrapper{
                	transform: translateY(-100%);
                }
                .tbshare_popup_enter {/*特殊的今日话题分享按钮*/
                	width: inherit;
                	height: inherit;
                	/*background: none !important;*/
                }
                .tbshare_popup_main {
                	display: block !important;
                	left: 0 !important;
                	top: 50% !important;
                	pointer-events: none;
                	opacity: 0;
                	transform: translate(-120%,-50%);
                	transition-property: opacity,transform;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .tbshare_popup_main[style*=\"block\"] {
                	pointer-events: auto;
                	opacity: 1;
                	transform: translate(-100%,-50%);
                }
                /*根据相关法律政策...*/
                .container .icon-attention{
                	font-size: 20px;
                	text-align: center;
                	width: 100%;
                	height: auto;
                	position: static;
                	padding: 0;
                	background: none !important;
                	margin: 0 0 40px 0;
                	color: #999;
                }
                .container .icon-attention:before{
                	content: \"\\e001\";
                	font-family: \'Material Icons\';
                	display: block;
                	width: 100%;
                	margin: 0 0 20px 0;
                	font-size: 100px;
                	line-height: 100px;
                }
                /*帖子标题标识*/
                .threadlist_title i:not(.icon-bazhurecruit):not(.icon-bazhupublicity/*排除吧主投票贴和公示贴*/):not(.icon-bazhuvote){
                	flex: 0 0 auto;
                	background-image: none !important;
                	display: inline-block !important;
                	width: auto !important;
                	min-width: 20px;
                	height: 20px !important;
                	line-height: 20px;
                	border-radius: 4px;
                	background-color: #4285F5;
                	margin: 0;
                	margin-top: -1px;
                	margin-right: 2px;
                	text-align: center;
                	font-size: 0 !important;
                	font-style: normal !important;
                	color: #fff !important;
                }
                .threadlist_title i:before{
                	font-family: \'Material Icons\';
                	font-size: 20px;
                	vertical-align: top;
                }
                .threadlist_title i:after{
                	font-size: 12px;
                	margin: 0 4px;
                }
                .threadlist_title i+.j_th_tit {
                	margin-left: 2px;
                }
                .threadlist_title:not(.pull_left) span{
                	flex: 0 0 auto;
                	margin-top: -1px;
                	margin-right: 2px;
                }
                .threadlist_title:not(.pull_left) span:empty{
                	display: none;
                }
                .threadlist_title img[src*=\"idisk.gif\"],
                .threadlist_title img[src*=\"icon_bright\"]{
                	float: right;
                	width: 20px !important;
                	height: 20px !important;
                	padding-left: 20px;
                	padding-top: 20px;
                	border-radius: 4px;
                	margin: 0 !important;
                	margin-right: 2px  !important;
                	background-color: #4285F5;
                	box-sizing: border-box;
                	background-image: url(http://7punbc.com1.z0.glb.clouddn.com/tieba-icon.svg?20160327);
                	background-repeat: no-repeat;
                	background-position: 0 20px;
                }
                .threadlist_title .icon-voice:before{
                	content: \"\\e31d\";
                }
                .threadlist_title .icon-game-type-mini-game {
                	background-color: #FF732A;
                }
                .threadlist_title .icon-game-type-mini-game:after {
                	content: \"小游戏\";
                }
                .threadlist_title .icon-novel-thanks {
                	background-color: #FF6666;
                }
                .threadlist_title .icon-novel-thanks:after {
                	content: \"感谢\";
                }
                .threadlist_title .icon-novel-genuine,
                .threadlist_title .icon-novel-chapter{
                	background-color: #FFA800;
                }
                .threadlist_title .icon-novel-genuine:after,
                .threadlist_title .icon-novel-chapter:after{
                	content: \"章节\";
                }
                .threadlist_title .icon-game-feature-strategy:after {
                	content: \"策略经营\";
                }
                .threadlist_title .icon-game-feature-sports:after {
                	content: \"体育竞速\";
                }

                .threadlist_title .icon-game-feature-shooting:after {
                	content: \"飞行射击\";
                }

                .threadlist_title .icon-game-feature-network:after {
                	content: \"网络游戏\";
                }

                .threadlist_title .icon-game-feature-cosplay:after {
                	content: \"角色扮演\";
                }

                .threadlist_title .icon-game-feature-casual:after {
                	content: \"休闲益智\";
                }

                .threadlist_title .icon-game-feature-cards:after {
                	content: \"卡片棋牌\";
                }

                .threadlist_title .icon-game-feature-action:after {
                	content: \"动作冒险\";
                }
                .threadlist_title .icon-game-type-web {
                	background-color: #FF6666
                }
                .threadlist_title .icon-game-type-web:after {
                	content: \"网页游戏\";
                }

                .threadlist_title .icon-game-type-mobile {
                	background-color: #FF6666
                }
                .threadlist_title .icon-game-type-mobile:after {
                	content: \"手机游戏\";
                }

                .threadlist_title .icon-game-type-client {
                	background-color: #FF6666
                }
                .threadlist_title .icon-game-type-client:after {
                	content: \"客户端游戏\";
                }

                .threadlist_title .icon-novel-reward {
                	background-color: #FF6666
                }
                .threadlist_title .icon-novel-reward:after {
                	content: \"捧场\";
                }

                .threadlist_title .icon-zhengwen-book {
                	background-color: #FF6666
                }
                .threadlist_title .icon-zhengwen-book:after {
                	content: \"贴吧原创\";
                }

                .threadlist_title .icon-fb-solved {
                	background-color: #5DB772
                }
                .threadlist_title .icon-fb-solved:before {
                	 content: \"\\e876\";
                	margin: 0 1px;
                	font-size: 18px;
                	line-height:19px;
                }
                .threadlist_title .icon-fb-solved:after {
                	content: \"已解决\";
                   margin-left: 0;
                }
                .threadlist_title .icon-fb-following {
                	background-color: #FF6666;
                }
                .threadlist_title .icon-fb-following:before {
                	 content: \"\\e80e\";
                	margin: 0 2px;
                	font-size: 16px;
                }
                .threadlist_title .icon-fb-following:after {
                	content: \"正在跟进\";
                   margin-left: -1px;
                }

                .threadlist_title .icon-mass-response {
                	background-color: #FF914D;
                }
                .threadlist_title .icon-mass-response:after {
                	content: \"一呼百应\";
                }
                .threadlist_title .icon-guessing {
                	background-color: #F8220C;
                }
                .threadlist_title .icon-guessing:after {
                	content: \"拳王\";
                }

                .threadlist_title .tb_tag_forward:after,
                .threadlist_title .icon-repost:after {
                	content: \"转帖\";
                }
                .threadlist_title img[src*=\"membertop_icon.png\"],
                .threadlist_title .icon-member-top {
              /*	background-color: #FFCC26 !important;*/
                }

                .threadlist_title .icon-member-top:after {
                	content: \"会员置顶\";
                	margin-left: -1px;
                }
                .threadlist_title .icon-top{
              /*   background-color: #4285F5 !important;*/
                }
                .threadlist_title .icon-member-top:before,
                .threadlist_title .icon-top:before{
                	content: \"\\e154\";
                	display: inline-block;
                	transform: translateY(-0.5px) rotate(-90deg);
                }
                .threadlist_title img[src*=\"membertop_icon.png\"],
                .threadlist_title img[src*=\"zding.gif\"]{
                	background-position: 0 0;
                }

                .threadlist_title img[src*=\"tpiao.gif\"],
                .threadlist_title .icon-vote {
                	background-color: #55D45D
                }
                .threadlist_title .icon-vote:before{
                	content: \"\\e01d\";
                }
                .threadlist_title img[src*=\"tpiao.gif\"]{
                	background-position: 0 -80px;
                }

                .threadlist_title .icon-user-mask:before{
                	content: \"\\e15d\";
                	font-size: 16px;
                	margin: 0 2px;
                }
                .threadlist_title .icon-user-mask:after{
                	content: \"被屏蔽\";
                	margin-left: 0;
                }

                .threadlist_title .icon-activity:before{
                	content: \"\\e153\";
                }

                .threadlist_title img[src*=\"jing.gif\"],
                .threadlist_title .icon-good{
              /*	background-color: #FF6666 !important;*/
                }
                .threadlist_title .icon-good:before{
                	content: \"\\e838\";
                	font-size: 18px;
                	margin-right: -1px;
                }
                .threadlist_title img[src*=\"jing.gif\"]{
                	background-position: 0 -20px;
                }

                .threadlist_title .icon-notice:before{
                	content: \"\\e80b\";
                	font-size: 18px;
                }

                .threadlist_title img[src*=\"goodalbum.png\"],
                .threadlist_title .icon-good-album{
                	background-color: #FF6666;
                }
                .threadlist_title .icon-good-album:before{
                	content: \"\\e3df\";
                	font-size: 18px;
                }

                .threadlist_title img[src*=\"goodalbum.png\"],
                .threadlist_title img[src*=\"tupian.gif\"]{
                	background-position: 0 -60px;
                }

                .threadlist_title .icon-liveshow-promoter{
                	background-color: #FFA825;
                }
                .threadlist_title .icon-liveshow-promoter:after{
                	content:\"帝王贴\";
                }

                .threadlist_title .icon-idisk {
                	background-position: -254px -81px
                }
                .threadlist_title .icon-idisk:before {
                	content: \"\\e2c8\";
                   font-size: 16px;
                }
                .threadlist_title img[src*=\"idisk.gif\"]{
                	background-position: 0 -100px;
                }

                .threadlist_title img[src*=\"bakan.gif\"],
                .threadlist_title .icon-bakan {
                	background-color: #EAB021;
                }
                .threadlist_title .icon-bakan:before {
                	content: \"\\e0e0\";
                	font-size: 16px;
                }
                .threadlist_title img[src*=\"bakan.gif\"]{
                	background-position: 0 -40px;
                }

                .threadlist_title .icon-picture:before{
                	content: \"\\e3df\";
                	font-size: 18px;
                }
                .threadlist_title .icon_interview_picture:after{
                	content:\"图片话题\";
                }

                .threadlist_title .icon-zhaoji{
                	background-color: #b77df0;
                }
                .threadlist_title .icon-zhaoji:after{
                	content:\"召集\";
                }
                .threadlist_title .icon-userdefine-diamond-mall{
                	background-color: #FF6666;
                }
                .threadlist_title .icon-userdefine-diamond-mall:after{
                	content:\"夺宝\";
                }

                /*吧详情页*/
                .container_wrap .card_top_wrap{
                	padding-bottom: 10px !important;
                }
                .forum_info_wrap{
                	overflow: hidden;
                }
                /*吧广播页*/
                .container>.content{
                	width: 1002px !important;
                }

                /*帖子列表页话题*/
                .interview .threadListGroupCnt{
                	padding: 12px 0 !important;
                	background: none;
                	z-index: 4;
                }
                .interview .threadListGroupCnt .listTitleCnt{
                	display: flex;
                	margin: 0 !important;
                	margin-bottom: 10px !important;
                }
                .interview .threadListGroupCnt .listTitleCnt .listReplyNum {
                	float: none !important;
                	width: 8% !important;
                	min-width: 75px !important;
                	padding: 0 14px 0 10px !important;
                	box-sizing: border-box;
                	margin-top: -3px !important;

                	background: none !important;
                	overflow: hidden;
                	height: 24px !important;
                	line-height: 24px !important;
                	text-align: center;
                	color: #666;
                	margin: 0 !important;
                	border-radius: 12px;
                }
                .interview .threadListGroupCnt .listTitleCnt .listReplyNum:after {
                	content: \'\';
                	display: block;
                	transform: translateY(-100%);
                	background: rgba(0,0,0,.04) !important;
                	height: 24px !important;
                	border-radius: 12px;
                }
                .interview .threadListGroupCnt .listTitleCnt .listUser{
                	float: none !important;
                	display: flex;
                	width: 16% !important;
                	min-width: 155px;
                	padding: 0 !important;
                	padding-right: 20px  !important;
                	white-space: nowrap;
                	overflow: visible !important;
                	line-height: 20px !important;
                }
                .interview .threadListGroupCnt .listTitleCnt .listThreadTitle{
                	float: none !important;
                	width: 0 !important;
                	flex: 1;
                	display: flex;
                	margin-right: 20px;
                	padding: 0 !important;
                	box-sizing: border-box;
                	height: auto !important;
                	overflow: visible;
                }
                .interview .threadListGroupCnt .listUser a{
                	background: none !important;
                	padding: 0 !important;
                	display: inline-block;
                	width: auto !important;
                	overflow: hidden;
                	text-overflow: ellipsis;
                	white-space: nowrap;
                	font-size: 12px;
                	line-height: 20px !important;
                	text-decoration: none !important;
                }
                .interview .topic_thread_danmu,
                .interview .threadListGroupCnt .listDescCnt,
                .interview .threadListGroupCnt .listBtnCnt,
                .interview .threadListGroupCnt .listTalkCnt,
                .interview .threadListGroupCnt .listPostCnt,
                .interview .threadListGroupCnt .listEditorCnt {
                	margin-left: 78px;
                	margin-right: 40px;
                }
                /*#interview-share-wrapper,特殊的今日话题分享按钮*/
                .interview .threadListGroupCnt .mini .faceIcon/*,
                #liveIcon{视频直播*/{
                	display: none !important;
                }
                #interview-share-wrapper{
                    position: absolute;
                    top: 5px;
                    left: 510px;
                    border-bottom: 0px;
                }
                .btn_small/*主题贴列表点开贴子图片后，右下角的进入贴子按钮*/
                {
                	top:-10px !important;
                }
                /*.interview .threadListGroupCnt .listTitleCnt .listThreadTitle a:first-of-type:before{
                	content: \'今日话题\';
                	background-color: #4285F5;
                	height: 20px !important;
                	line-height: 20px;
                	border-radius: 4px;
                	padding: 0 4px;
                	vertical-align: top;

                	flex: 0 0 auto;
                	display: inline-block !important;
                	width: auto !important;
                	margin-top: 1px;
                	margin-right: 2px;
                	text-align: center;
                	font-size: 12px !important;
                	font-style: normal !important;
                	color: #fff !important;
                }*/
                .interview .threadListGroupCnt .listTitleCnt .listThreadTitle img[src*=\"interview_icon.gif\"]+a:first-of-type:before{
                	content: \'访谈直播\';
                }

               /*还弹幕...真的笑,笑出声*/
               /*  .opui-barrage-setup {
                	position: absolute;
                	top: 0;
                	left: 100%;
                	overflow: hidden;
                	text-indent: 0;
                	cursor: pointer;

                	width: 24px;
                	height: auto !important;
                	border-radius: 0 6px 6px 0;
                	box-shadow: -2px 2px 2px 0 rgba(0, 0, 0, 0.08);
                	background: #4879BD !important;
                	word-break: break-all;
                	padding: 10px 6px;
                	box-sizing: border-box;
                	line-height: 16px;
                	font-size: 12px;
                	color: #fff;
                }
                .opui-barrage-setup:before{
                	content: \"\\e56b\";
                	font-size: 16px;
                	font-family: \'Material Icons\';
                	font-style: normal;
                	display: inline-block;
                	height: 20px;
                	vertical-align: top;
                	margin-left: -1.5px;
                }
                .opui-barrage-setup:after{
                	content: \"展开弹幕\"
                }*/

                .interview .threadListGroupCnt .mini{
                	background: rgba(0, 0, 0, 0.04) !important;
                	border: none !important;
                	border-bottom: 4px solid rgba(0, 0, 0, .04) !important;
                }

                .interview .threadListGroupCnt .mini .placeholder:before{
                	position: absolute;
                	right: 8px;
                	top: 2px;
                	color: #aaa !important;
                }
                .interview .threadListGroupCnt .listTalkCnt,
                .interview .threadListGroupCnt .listPostCnt{
                	background: rgba(0, 0, 0, .01) !important;
                	border: 1px solid rgba(0, 0, 0, .1) !important;
                	padding: 6px 0;
                }
                .interview .threadListGroupCnt .listGroupCnt{
                	padding: 0 10px;
                }
                .interview .threadListGroupCnt .listItemCnt{
                	background: none !important;
                	border-top: 1px solid rgba(0, 0, 0, .04);
                }
                .interview .threadListGroupCnt .listItemCnt:first-of-type{
                	border-top: none;
                }
                .interview .pInfoCnt .pReply,
                .interview .pInfoCnt .pLogin,
                .interview .threadListGroupCnt .pTail .pFrom{
                	color: #999;
                	text-decoration: none !important;
                	text-transform: capitalize;
                }
                .threadListGroupCnt>.listPostCnt>.listTitle{
                    font-size:0px !important;/*特殊的今日话题吧友讨论*/
                    border-radius: unset !important;
                    border: none !important;
                }
                .threadListGroupCnt>.listBtnCnt>.slideBtn{
                    background: unset !important;/*展开特殊的今日话题吧友讨论*/
                }
                .interview .threadListGroupCnt .listTalkCnt .listTitle,
                .interview .threadListGroupCnt .listPostCnt .listTitle{
                	position: absolute;
                	z-index: 2;
                	left: -25px;
                	top: -1px;
                	width: 24px;
                	height: auto;
                	/*border-radius: 6px 0 0 6px;
                	border: 1px solid rgba(0, 0, 0, .1);*/
                	border-right: none;
                	background: #fefefe;
                	overflow: hidden;
                	word-break: break-all;
                	padding: 10px 6px;
                	box-sizing: border-box;
                	line-height: 16px;
                	font-size: 12px;
                	color: #aaa;
                }
                .interview .threadListGroupCnt .listPostCnt .listTitle:before{
                	content:\'吧友讨论\'
                }
                /*.interview .threadListGroupCnt .listTalkCnt .listTitle:before{
                	content:\'访谈内容\';
                	color: #4879BD;
                }*/

                .interview .threadListGroupCnt .listBtnCnt .slideBtn{
                	border-radius: 6px 6px 0 0;
                	border: 1px solid rgba(0,0,0,.1);
                	background: #fff;
                	color: #2D64B3;
                	width: auto;
                	height: 20px;
                	line-height: 20px;
                	margin-top: 6px;
                	padding: 0 6px;
                }
                .interview .threadListGroupCnt .listBtnCnt .slideBtn:before{
                	content: \'展开\';
                }
                .interview .threadListGroupCnt .listBtnCnt .slideBtn:after {
                	content: \'\\e313\';
                	font-family: \'Material Icons\';
                	font-size: 20px;
                	display: inline-block;
                	vertical-align: top;
                	text-indent: 0;
                	width: 16px;
                	margin-left: -2px;
                }
                .interview .threadListGroupCnt .listBtnCnt .slideBtn.down{
                	border-bottom: none;
                }
                .interview .threadListGroupCnt .listBtnCnt .slideBtn.down:before{
                	content: \'收起\';
                }
                .interview .threadListGroupCnt .listBtnCnt .slideBtn.down:after {
                	content: \'\\e316\';
                }
                .interview .listBtnCnt .list_announcement_cnt{
                	padding: 0 !important;
                	background: none !important;
                }
                .interview .listBtnCnt .list_announcement_cnt:before{
                	content: \'\\e050\';
                	font-family: \'Material Icons\';
                	font-size: 20px;
                	display: inline-block;
                	vertical-align: top;
                	text-indent: 0;
                	color: #aaa;
                	margin-right: 2px;
                }
                /*link-icon*/
                .apc_src_wrapper{
                	background:none !important;
                	padding-left: 0 !important;
                }
                .apc_src_wrapper:before{
                	content: \'\\e157\';
                	font-family: \'Material Icons\';
                	font-size: 18px;
                	display: inline-block;
                	vertical-align: top;
                	margin-right: 2px;
                }
                /*语音*/
                .voice_player a.voice_player_inner{
                	display: inline-block;
                	width: 160px;
                	height: 24px;
                	line-height: 24px;
                	padding: 3px 4px;
                	background: rgba(0,0,0,.04);
                	border: 1px solid rgba(0,0,0,.04);
                	box-shadow: none;
                	border-radius: 4px;
                	color: #666;
                	position: relative;
                }
                .voice_player_mini{
                	width: auto !important;
                	vertical-align: middle;
                }
                .voice_player_mini a.voice_player_inner{
                	width: 100px;
                }
                .voice_player .middle{
                	width: 100%;
                	white-space: nowrap;
                	background: none !important;
                	position: absolute;
                	top: 0;
                	left: 0;
                	padding: 0 4px;
                }
                .voice_player_mini .middle{
                	top: 3px;
                }
                .voice_player .time {
                	padding-right: 16px;
                	width: auto !important;
                	float: right;
                }
                .voice_player .before,
                .voice_player .after{
                	display: none !important;
                }
                .voice_player_inner.playing,
                .voice_player.playing a.voice_player_inner{
                	animation-name: breathe;
                	 animation-duration: 1s;
                	 animation-iteration-count: infinite;
                	 animation-timing-function: linear;
                	animation-direction: alternate;
                }
                @keyframes breathe {
                	from {box-shadow:inset 0 0 2px rgba(255,255,255,0);}
                	to {box-shadow:inset 0 0 10px rgba(0,0,0,.2);}
                }
                .voice_player .speaker{
                	background: none !important;
                	vertical-align: top;
                }
                .voice_player .speaker:before{
                	content: \'\\e037\';
                	font-family: \'Material Icons\';
                	font-size: 24px;
                	display: inline-block;
                }
                .loading .speaker:before{
                	content: \'\\e86a\';
                	animation-name: rotate;
                	 animation-duration: 2s;
                	 animation-iteration-count: infinite;
                	 animation-timing-function: linear;
                }
                @keyframes rotate {
                	from {transform:rotate(0deg);}
                	to {transform:rotate(360deg);}
                }
                .playing .speaker:before{
                	content: \'\\e047\';
                }
                /*发帖话题*/
                .topic_sug_box_wrapper{
                	z-index: 9999;
                	margin-top: 20px;
                	margin-left: -8px;
                }
                .tb_rich_poster .poster_body .topic_add_btn{
                	position: absolute;
                	top: 0;
                	right: 0;
                	height: 40px;
                	line-height: 40px;
                	text-align: center;
                	margin: 0 !important;
                	overflow: hidden;
                	box-sizing: border-box;
                	background: rgba(0,0,0,.04) !important;
                	border-bottom: 4px solid rgba(0, 0, 0, 0);
                	transition-property: border;
                	transition-duration: 1s;
                	transition-timing-function: ease;
                }
                .tb_rich_poster .poster_body .topic_add_btn:hover{
                	border-bottom: 4px solid rgba(0, 0, 0, .1);
                }
                .tb_rich_poster .poster_body .topic_add_btn:before{
                	content: \'#\';
                	font-family: fantasy;
                	font-size: 22px;
                	font-weight: bold;
                	color: #999 !important;
                	position: absolute;
                	left: 50%;
                	top: 50%;
                	transform: translate(-50%, -50%);
                	transition-property: transform;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .tb_rich_poster .poster_body .topic_add_btn:hover:before{
                	transform: translate(-50%, -50%) translateY(-38px);
                }
                .tb_rich_poster .poster_body .topic_add_btn:after {
                	content: \"话题\";
                	color: #666 !important;
                	font-size: 12px;
                	position: absolute;
                	left: 50%;
                	top: 50%;
                	transform: translate(-50%, -50%) translateY(38px);
                	transition-property: transform;
                	transition-duration: .5s;
                	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
                }
                .tb_rich_poster .poster_body .topic_add_btn:hover:after{
                	transform: translate(-50%, -50%);
                }
                /*帖子内页投票*/
                #voteFlashPanel .vote_buttons button{
                	text-indent: 0;
                }
                .vote_progress_base{
                	background: rgba(0,0,0,.1);
                }
                .vote_progress_bar_container {
                	height: 10px;
                	border: none !important;
                }
                .vote_progress_bar{
                	height: 10px;
                	opacity: .8;
                	border: none !important;
                }
                .spread_btn{
                	z-index: 999;
                }`;
				if (false || (new RegExp("^https?://(tieba.baidu.com|www.tieba.com)(/*|(?!/+tbmall/+).*)$")).test(document.location.href)) {
					css += `
                    /*T逗商城以外的页面*/
                    /*主体框架*/
                    .forum_info_wrap,
                    .good_list_outer,
                    .content {
                    	margin: 20px auto !important;
                    	background: #FdFdFd !important;
                    	box-shadow: 0 0 20px 2px rgba(0, 0, 0, .1);
                    	/*border: 1px solid #DBDCE0 !important;*/
                    	box-sizing: border-box !important;
                    	position: relative;
                    	margin-bottom: 0 !important;
                    	min-height: 0;
                    	border-radius: 20px;
                    }
                    .skin_2103 [id=\"pagelet_frs-header/pagelet/head\"],
                    .app_forum_body [id=\"pagelet_frs-header/pagelet/head\"],
                    .head_top,
                    .head_content,
                    .card_banner {
                    	border-radius: 20px 20px 0 0;
                    }
                    #main_wrapper #footer,
                    .pb_footer,
                    .foot,
                    .forum_foot,
                    .good_list_inner{
                    	border-radius: 0 0 20px 20px;
                    }
                    .foot,
                    .plat_skin .wrap1,
                    .skin_2103 .wrap1,
                    .app_forum_body .wrap1,
                    .head_main .head_middle,
                    .head_main .head_content,
                    .search_form_fixed,
                    .search_bright,
                    .l_container,
                    .forum_info_wrap,
                    .good_list_outer,
                    .content{
                    	width: 980px !important;
                    }
                   /*.tbui_aside_float_bar {
                  	 margin-left: 86% !important;
                     left:unset;解决右侧工具栏消失bug
                  	 margin-left: calc(985px / 2) !important;
                     margin-left: 600px !important;
                   }*/
                    .core_title_absolute_bright {
                    	width: calc(980px + 58px) !important;
                    }
                    .l_container .content{
                    	width: 100% !important;
                    	border-top-left-radius: 10px;
                    	border-top-right-radius: 10px;
                    }
                    .forum_info_wrap,
                    .good_list_outer{
                    	border-top-left-radius: 10px;
                    	border-top-right-radius: 10px;
                    }
                    .header~.content {
                    	margin: 0 auto !important;
                    	border-radius: 0;
                    	border-top: none !important;
                    	border-bottom: none !important;
                    }
                    .head_content,
                    .foot {
                    	box-shadow: 0 0 20px 2px rgba(0, 0, 0, .1);
                    	box-sizing: border-box;
                    	/*border: 1px solid #DBDCE0 !important;*/
                    	border-top: none !important;
                    }
                    #main_wrapper #footer,
                    .ibody,
                    body:not(.app_forum_body):not(.skin_2103) .head_top,
                    .app_forum_body .app-header-wrapper,
                    .skin_2103 .app-header-wrapper,
                    .forum_content,
                    .head_content,
                    .foot{
                    	background: #FdFdFd;/*!important 背景色 有bug http://tieba.baidu.com/i/i/storethread*/
                    }
                    .ibody .w750,
                    [id=\"pagelet_encourage-appforum/pagelet/head_top\"],
                    [id=\"pagelet_navigation/pagelet/navigation\"],
                    [id=\"pagelet_poster/pagelet/rich_poster\"]{
                    	/*遮盖阴影*/
                  /*	background: #FdFdFd; !important;*/
                    	position: relative;
                    	z-index: 1;
                    }
                    .head_content {
                    	border-bottom: none !important;
                    }
                    .foot {
                    	border-top: none !important;
                    	margin-bottom: 50px !important;
                    }

                    .head_content {
                    	border-bottom: none !important;
                    }
                    .good_list_outer .card_top_wrap,
                    .forum_info_wrap .card_top_wrap,
                    .plat_recom_carousel,
                    .star_head,
                    .star_banner,
                    .vertical_card_banner,
                    .content>.card_top_wrap,
                    .forum_header,
                    .plat_head,
                    .plat_banner{
                    	border-radius: inherit;
                    	border-bottom-left-radius: 0;
                    	border-bottom-right-radius: 0;
                    }
                    .head_top{
                    	margin-top: 30px !important;
                    }
                    .head_top+.head_content{
                    	border-radius: 0;
                    }
                    .plat_banner{
                    	overflow: hidden;
                    }
                    .pb_footer {
                    	width: 100% !important;
                    	background: none !important;
                    }
                    .pb_footer {
                    	border-left: none !important;
                    	border-right: none !important;
                    }
                    .forum_content {
                    	border-right: none !important;
                    	border-left: none !important;
                    	border-bottom: none !important;
                    	z-index: 3;
                    	position: relative;
                    }
                    .forum_foot {
                    	border-right: none !important;
                    	border-left: none !important;
                    	padding: 0 !important;
                    }
                    .frs_content_footer_pagelet {
                    	width: 100% !important;
                    	padding: 0 !important;
                    }
                    .forum_foot,
                    .frs_content_footer_pagelet {
                    	background:none !important;
                    }
                    .footer {
                    	clear: both;
                    	line-height: 22px;
                    	text-align: center;
                    	margin: 0 auto !important;
                    	padding: 20px 0 !important;
                    	display: block;
                    	color: #bbb !important;
                    }
                    .footer * {
                    	color: inherit !important;
                    }

                    /*全屏编辑框*/
                    .tb-ueditor-fullscreen [id=\"pagelet_poster/pagelet/rich_poster\"],
                    .tb-ueditor-fullscreen .tb_rich_poster_container{
                    	padding-top: 0 !important;
                    	z-index: 10000 !important
                    }

                    .tb-ueditor-fullscreen .poster_head,
                    .poster_clear_fullscreen{
                    	display: none !important;
                    }

                    .tb-ueditor-fullscreen #rich_ueditor_tpl{
                    	padding-top: 20px !important;
                    	width: 980px !important;
                    	background-color: #FdFdFd !important;
                    	margin: 0 auto !important;
                    	padding-bottom: 40px !important;
                    	box-shadow: 0 0 20px 2px rgba(0, 0, 0, .1);
                    	border-radius: 0 0 20px 20px;
                    }

                    .tb-ueditor-fullscreen .edui-body-container{
                    	height: 60vh;
                    }

                    .fullscreen-word-limit{
                    	height: 40px !important;
                    	line-height: 40px !important;
                    	color: #ccc !important;
                    }`;
				}
				if (false || (new RegExp("^https?://(tieba.baidu.com|www.tieba.com)(/*|(?!/+home/+).*)$")).test(document.location.href)) {
					css += `
                    /*个人主页以外的页面*/

                    .wrap1,
                    .wrap2 {
                    	background-color: transparent !important;
                    }
                    body:not(.app_forum_body):not(.skin_2103) .wrap1,
                    .wrap2{
                    	background-image: none !important;
                    }`;
				}
				if (false || (new RegExp("^https?://(tieba.baidu.com|www.tieba.com)/+p/+.*$")).test(document.location.href)) {
					css += `
                   /*帖子内页调整*/

                   .tbui_aside_float_bar {
                   	margin-bottom: 0px;
                   }

                   #container {
                   	margin-bottom: 80px !important;
                   }
                   .tb_rich_poster_container>.tb_rich_poster .poster_head_text{
                   	padding: 0 14px !important;
                   	color: #666;
                   }
                   .tb_rich_poster_container>.tb_rich_poster .poster_head_text:before{
                   	content:\"\\e253\";
                   	display: inline-block;
                   	font-family: \'Material Icons\';
                   	font-size: 16px;
                   	width: 24px;
                   	vertical-align: top;
                   	text-align: center;
                   	color: #777;
                   	margin: 0 -4px;
                   }`;
				}
				if (false || (new RegExp("^https?://(tieba.baidu.com|www.tieba.com)/+p/+\\d+.*\\?(.*&)*see_lz=[1-9]+\\d*.*$")).test(document.location.href)) {
					css += `
                    /*帖子内页-只看楼主*/

                    .core_title_btns #lzonly_cntn:before {
                    	content: \"\\e8f5\" !important;
                    	font-size: 30px !important;
                    }
                    .core_title_absolute_bright .core_title_btns #lzonly_cntn:before {
                    	font-size: 34px !important;
                    }
                    .d_lzonly_bdaside:before {
                    	content: \"取消\";
                    }
                    .louzhubiaoshi_wrap {
                    	display: none !important;
                    }`;
				}
				if (false || (new RegExp("^https?://(tieba.baidu.com|www.tieba.com)/+home/+.*$")).test(document.location.href)) {
					css += `
                    /*个人主页*/
                    /*迷之页面结构...无力吐槽....*/

                    body>.wrap1 {
                    	width: 980px;
                    	border-radius: 20px;
                    	overflow: visible !important;
                    	/*border: 1px solid #DBDCE0 !important;*/
                    	box-sizing: border-box;
                    	background-position: center -20px;
                    	margin-top: 90px;
                    	box-shadow: 0 0 20px 2px rgba(0, 0, 0, .1);
                    }
                    .headinfo_wrap {
                    	margin: 0 auto;
                    	border-radius: 20px;
                    	overflow: hidden;
                    }
                    #head {
                    	margin: 0 auto;
                    	position: absolute;
                    	top: -80px !important;
                    }
                    .search_bright{
                    	width: 982px !important;
                    }
                    .userinfo_wrap {
                    	width: 100% !important;
                    	border: none !important;
                    }
                    .container_wrap {
                    	width: 100% !important;
                    	border: none !important;
                    	background: #FdFdFd !important;
                    	border-radius: 0 0 20px 20px;
                    	position: relative;
                    }
                    .left_aside {
                    	background: none !important;
                    	border: none !important;
                    }
                    .right_aside {
                    	background: none !important;
                    	border: none !important;
                    }
                    .right_aside > * {
                    	background: none !important;
                    	z-index: 2;
                    	position: relative;
                    }
                    .right_aside:before {
                    	width: 239px;
                    	border-top: 1px solid #e0e0e0;
                    	border-left: 1px solid #e0e0e0;
                    	background: rgba(0, 0, 0, .02);
                    	z-index: 1
                    }
                    .ihome_nav_wrap {
                    	margin: 0 !important;
                    }
                    .footer {
                    	position: absolute;
                    	left: 50%;
                    	bottom: -50px;
                    	transform: translateX(-50%);
                    }
                    .content_wrap{
                    	width: 742px !important;
                    }
                    .fix-for-ie8{
                    	display: none !important;
                    }
                    /*解决返回顶部按钮显示错位问题*/
                    .tbui_aside_float_bar {
                    	margin-left: 90% !important;
                    /*	margin-left: 600px !important;*/
                    }
                    `;
				}
				if (false || (new RegExp("^https?://(tieba.baidu.com|www.tieba.com)/+(index.html.*)*([\\?#]+.*)*$")).test(document.location.href)) {
					css += `
                    /*贴吧首页*/
                    .head_right_region{
                    	width: 100% !important;
                    	padding: 0 10px !important;
                    	box-sizing: border-box;
                    	float: none !important;
                    }
                    .search_logo {
                    	position: absolute;
                    	background-position: center !important;
                    	z-index: 1;
                    	pointer-events: none;
                    }
                    .search_top:before{
                    	content: \"Desgin by Maverick\";
                    	font-size: 0;
                    	display: block;
                    	width: 60px;
                    	height: 30px;
                    	pointer-events: auto;
                    	float: none !important;
                    }

                    #spage-tbshare-container{
                    	display: none;
                    }
                    .footer,
                    .main-sec{
                    	background: #FdFdFd !important;
                    	box-shadow: 0 0 20px 2px rgba(0, 0, 0, .1);
                    	position: relative;
                    }
                    .main-sec{
                    	padding: 20px 10px !important;
                    	border-radius: 10px 10px 0 0;
                    }
                    .main-sec>div{
                    	position: relative;
                    	z-index: 3;
                    }
                    /*解决360极速浏览器在贴吧首页网页缩放130%时显示出错*/
                    .r-right-sec{
                        margin-left: unset !important;
                    }
                    .bottom-bg {
                    	bottom: 0;
                    	left: 0;
                    	position: absolute !important;
                    	height: 20px;
                    	width: 100%;
                    	z-index: 2 !important;
                    	background: #FdFdFd;
                    }
                    .footer{
                    	border: none !important;
                    	width: 1020px;
                    	padding: 0 !important;
                    	padding-top: 20px !important;
                    	border-radius:  0 0 20px 20px;
                    	margin-bottom: 20px !important;
                    }
                    .footer p {
                    	margin: 0 !important;
                    }
                    .tbui_aside_float_bar {
                    	margin-left: 510px !important;
                    }
                    .wrap2:before {
                    	display: none !important;
                    }
                    /*隐藏贴吧首页隐藏的广告位 by Tieba - Maverick 2018 [百度贴吧]*/
                    .new_list>li{
                        margin-bottom: 16px;
                        padding: 0 !important;
                        border-radius: 6px;
                        background: var(--m-block-w010) !important;
                        border: 1px solid var(--m-line-d010);
                        box-shadow: 0 2px 6px rgba(0,0,0,.06);
                    }
                    .new_list>li.home-place-item{
                        display: none !important;
                    }
                    /*贴吧首页贴子列表外观修饰 by Tieba - Maverick 2018 [百度贴吧]*/
                    .new_list li .n_right{
                        padding: 10px !important;
                        width: 100% !important;
                        position: relative;
                    }
                    .new_list li .n_right>div:first-of-type{
                        width: 100%;
                    }
                    .new_list .enter_pb_btn{
                        width: 50px;
                        position: absolute;
                        right: 25px;
                        bottom: 8px;
                        z-index: 9;
                    }
                    .new_list .title{
                        flex: 1;
                    }
                    .new_list .title{
                        color: var(--m-href-color) !important;
                        text-decoration: none !important;
                    }
                    .new_list .em{
                        color: var(--m-href-color) !important;
                        text-decoration: none !important;
                    }
                    #new_list div.n_txt
                    {
                        width: 510px;
                    }
                    /*贴吧公告板*/
                    .notice_item
                    {
                        position: relative;
                    }
                    `;
				}
				if (false || (new RegExp("^https?://(tieba.baidu.com|www.tieba.com)/+i/+.*$")).test(document.location.href)) {
					css += `
                    /*i贴吧*/
                    #main_wrapper #footer,
                    .ibody{
                    	width: 980px !important;
                    	border: none !important;
                    	position: relative;
                    }
                    #footer{/*.footer{*/
                       margin:auto;
                    	margin-bottom: 20px !important;
                    }
                    #content{
                    	position: relative;
                    	padding: 10px;
                    	padding-top: 40px;
                    	margin: 0 !important;
                    }
                    .main_header,
                    .ibody,
                    .footer{
                    	box-shadow: 0 0 20px 2px rgba(0, 0, 0, .1);
                    }
                    .main_header{
                    	margin-bottom: 0 !important;
                    	background-color: #4879BD;
                   /*	background-image: url(http://onox.qiniudn.com/maverick/lines.svg);*/
                    	background-position: right;
                    	background-repeat: no-repeat;
                    	border-radius: 6px 6px 0 0;
                    	overflow: hidden;
                    	height: 60px !important;
                    	position: relative;
                    }
                    .nav_bar{
                    	display: none !important;
                    	background: none !important;
                    	position: absolute;
                    	bottom: 0;
                    	padding: 0 2px;
                    	box-sizing: border-box;
                    }
                    .nav_bar>li{
                    	margin-right: 2px;
                    }
                    .nav_bar>li a{
                    	background: none !important;
                    	font-weight: normal !important;
                    	font-size: 12px !important;
                    	line-height: 32px  !important;
                    }
                    .nav_bar>li a:hover{
                    	background: rgba(255,255,255,.16) !important;
                    }
                    .nav_bar>li.nav_cur a{
                    	background: #f2f2f2 !important;
                    	color: #4879BD !important;
                    }
                    .a_p_title,
                    .nav_item_hot_flag,
                    .tb_icon_new{
                    	display: none !important;
                    }
                    .sub_nav{
                    	margin: 0 !important;
                    }
                    .sub_nav>ul,
                    .tab_content{
                    	position: absolute;
                    	top: 0;
                    	left: 0;
                    	width: 100%;
                    	height: auto !important;
                    	margin: 0 !important;
                    	background: #f2f2f2 !important;
                    	border-bottom: 1px rgba(0,0,0,.04) solid;
                    }
                    .sub_nav>ul>li,
                    .tab_content>li{
                    	display: inline-block !important;
                    	background: none !important;
                    	border: none !important;
                    	position: static !important;
                    	width: auto !important;
                    	height: auto !important;
                    	margin: 0 20px;
                    	float: none !important;
                    	line-height: 40px  !important;
                    	overflow: visible !important;
                    }
                    .sub_nav>ul>li a,
                    .tab_content>li a{
                    	background: none !important;
                    	font-weight: normal !important;
                    	font-size: 12px !important;
                    	line-height: inherit;
                    	padding: 0 !important;
                    	display: inline !important;

                    }
                    .sub_nav>ul>li a:hover,
                    .tab_content>li a:hover{
                    	background: rgba(255,255,255,.16) !important;
                    }
                    .sub_nav>ul>li.current a,
                    .tab_content>li.tab_cur a{
                    	color: #4879BD !important;
                    }
                    .content_aside{
                    	width: 100% !important;
                    	position: absolute;
                    	top: -60px;
                    	left: 0;
                    	height: 60px;
                    }
                    .w750{
                    	width: 100%;
                    	float: none;
                    }
                    .feed{
                    	width: 100%;
                    	padding: 0 6px;
                    	margin: 0 !important;
                    	box-sizing: border-box;
                    }
                    #xiangce{
                    	width: 100% !important;
                    	margin: 0 !important;
                    }
                    .aside_menu{
                    	float: left;
                    	margin: 0 !important;
                    	margin-top: 28px !important;
                    	padding: 0 10px!important;
                    	width: auto;
                    	height: 32px !important;
                    	line-height: 32px !important;
                    	box-sizing: border-box;
                    }
                    .aside_menu>ul>li{
                    	margin: 0 !important;
                    	padding: 0 !important;
                    	display: inline-block;
                    	line-height: inherit !important;
                    	font-size: 14px !important;
                    	font-weight: normal !important;
                    }
                    .aside_menu>ul>li a{
                    	display: inline-block;
                    	background: none !important;
                    	font: inherit !important;
                    	color: #fff;
                    	padding: 0 10px;
                    }
                    .aside_menu>ul>li a:hover{
                    	background: rgba(255,255,255,.16) !important;
                    }
                    .aside_menu>ul>li.sel{
                    	background: #f2f2f2 !important;
                    	color: #4879BD !important;
                    	padding: 0 10px !important;
                    }
                    .aside_home_li{
                    	display: none !important;
                    }
                    .aside_person_info{
                    	float: left;
                    	border: none !important;
                    	padding: 8px 10px  !important;
                    	margin: 0 !important;
                    	border-radius: 6px 0 6px 0;
                    	background-color: #4879BD;
                    	height: 40px;
                    	overflow: hidden;
                    	transition: height .4s ease;
                    	z-index: 1;
                    }
                    .aside_person_info:after{
                    	content: \'\';
                    	position: absolute;
                    	left:0;
                    	top:0;
                    	width: 100%;
                    	height: 100%;
                    	background: rgba(0,0,0,.1);
                    	opacity: 0;
                    	transition: opacity .4s ease;
                    	pointer-events: none;
                    }
                    .aside_person_info:hover{
                    	height: 115px;
                    }
                    .aside_person_info:hover:after{
                    	opacity: 1;
                    }
                    .aside_person_info>div:not(.ui_bubble_wrap){
                    	position: relative;
                    	z-index: 1;
                    }
                    .aside_p_info_head{
                    	border: none !important;
                    	z-index: 2 !important;
                    }
                    .right_set{
                    	position: absolute;
                    	left: 2px;
                    	top: 2px;
                    }
                    .right_set a{
                    	position: relative;
                    	display: block;
                    	width: 100%;
                    	height: 100%;
                    	font-size: 0;
                    	background: rgba(0,0,0,.4);
                    	opacity: 0;
                    	transition: opacity .4s ease;
                    }
                    .right_set a:hover{
                    	opacity: 1;
                    }
                    .right_set a:before{
                    	content: \'\\e8b8\';
                    	font-family: \'Material Icons\';
                    	color: #fff;
                    	font-size: 28px;
                    	position: absolute;
                    	left: 50%;
                    	top: 50%;
                    	transform: translate(-50%,-50%);
                    }
                    .aside_person_info_wraper,
                    .aside_userface_wraper,
                    #img_aside_head,
                    .aside_user_profile{
                    	margin: 0 !important;
                    	padding: 0 !important;
                    }
                    .aside_userface_wraper{
                    	position: absolute;
                    }
                    .right_set,
                    .aside_userface_border,
                    #img_aside_head{
                    	width: 40px  !important;
                    	height: 40px  !important;
                    }
                    .aside_userface_border{
                    	padding: 2px !important;
                    	border: none !important;
                    	background: rgba(255,255,255,.2) !important;
                    }
                    .aside_user_name,
                    .aside_user_info,
                    .aside_user_fans,
                    .aside_user_concern,
                    .my_tb_pmclink,
                    .my_tb_pmclink a,
                    .aside_interact_num{
                    	color: #fff !important;
                    }
                    .aside_user_name,
                    .aside_user_info{
                    	padding-left: 54px;
                    }
                    .aside_user_fans,
                    .aside_user_concern,
                    .my_tb_pmclink{
                    text-align: center;
                    margin-left: 50px;
                    }
                    .aside_user_info:empty:before{
                    	content:\'\\e016\';
                    }
                    .new_reply_num_tip{
                    	color: #fff;
                    	margin-right: 4px;
                    	padding: 0 6px;
                    	background: rgba(255,255,255,.2);
                    	border-radius: 4px;
                    }
                    .new_reply_num_tip:empty{
                    	display: none !important;
                    }
                    #featureList {
                    	width: 100%;
                    	box-sizing: border-box;
                    	margin: 0 !important;
                    	margin-top: 10px !important;
                    }
                    .sub_tab_content{
                    	background: none !important;
                    	border: none !important;
                    	margin: 8px 0 !important;
                    }
                    .sub_tab a {
                    	display: block;
                    	color: #999;
                    	padding: 0 10px;
                    	background: rgba(0,0,0,.1);
                    	border-radius: 4px;
                    	border: none !important;
                    	line-height: 22px;
                    }
                    .sub_tab_cur a{
                    	color: #fff;
                    	background: #4285F4;
                    }
                    .block,
                    .simple_block_container li,
                    .feed_item {
                    	border-bottom: 1px solid rgba(0,0,0,.06) !important;
                    }
                    .block:last-of-type,
                    .simple_block_container li:last-of-type,
                    .feed_item:last-of-type{
                    	border-bottom: none !important;
                    }
                    .feed_hover {
                    	background: rgba(0,0,0,.02);
                    }
                    .feed_item {
                    	display: flex;
                    	position: relative;
                    }
                    .feed_left {
                    	flex: 1;
                    	float: none;
                    	width: 0;
                    	padding: 20px 10px;
                    }
                    .feed_right {
                    	position: absolute;
                    	padding: 0 10px 20px 0;
                    	bottom: 0;
                    	right: 0;
                    	white-space: nowrap;
                    	line-height: 22px;
                    }
                    .feed_time,
                    .icon_reply{
                    	float: right;
                    	margin-left: 20px;
                    	padding: 0 !important;
                    	line-height: inherit;
                    }
                    .icon_reply a{
                    	color: #aaa;
                    	background: none !important;
                    	margin: 0 !important;
                    }
                    .icon_reply a:before{
                    	content: \'\\e253\';
                    	font-family: \'Material Icons\';
                    	display: inline-block;
                    	font-size: 16px;
                    	vertical-align: top;
                    	margin-right: 2px;
                    }
                    .icon_reply .reply_del:before{
                    	content: \'\\e872\';
                    	font-size: 18px;
                    }
                    .reply_del{
                    	display: inline !important;
                    	visibility: hidden;
                    }
                    .showDelBtn .reply_del{
                    	visibility: visible;
                    }
                    .goTop{
                    	background: #fefefe !important;
                    	width: 45px !important;
                    	height: 50px !important;
                    	margin-left: 490px !important;
                    	border-radius: 0 10px 10px 0;
                    	box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.08);
                    	overflow: hidden;
                    	font-size: 0;
                    	white-space: nowrap;
                    	text-indent: -45px;
                    	transition-property: text-indent;
                    	transition-duration: .6s;
                    	transition-timing-function: ease;
                    }
                    .goTop:hover {
                    	text-indent: 0px;
                    }
                    .goTop:after,
                    .goTop:before{
                    	display: inline-block;
                    	color: #ccc;
                    	width: inherit !important;
                    	height: inherit !important;
                    	box-sizing: border-box;
                    	vertical-align: top;
                    	white-space: normal;
                    	text-indent: 0;
                    }
                    .goTop:before{
                    	content: \"返回顶部\";
                    	font-size: 14px;
                    	line-height: 20px;
                    	padding-top: 5px;
                    	padding-left: 7px;
                    }
                    /*e2c4字符下,e2c6字符上*/
                    .goTop:after{
                    	content: \"\\e255\";
                    	font-size: 32px;
                    	font-family: \'Material Icons\';
                    	line-height: 50px;
                    	text-align: center;
                    	text-indent: -2px;
                    }

                    .itb_pager >*{
                    	margin-right: 4px !important;
                    }
                    .pager{
                    	float: none !important;
                    	text-align: center;
                    }
                    .pager,
                    .pager >*{
                    	font-family: inherit !important;
                    	left: 0 !important;
                    }`;
					//管用户头像栏的 http://tieba.baidu.com/i/i/*
				}
			}
			css+=`
			.tbui_fbar_props,/*右侧浮层-魔法道具,动画效果？是基于flash制作的，没有flash插件就不能正常显示*/
            .tbui_fbar_tsukkomi,/*右侧浮层-神来一句*/
			/*官方号服务中心post_head_official*/
			li.u_official
            {
              display: none !important;
            }`
		}
	}
	if (typeof GM_addStyle != "undefined") {
		GM_addStyle(css);
	} else if (typeof PRO_addStyle != "undefined") {
		PRO_addStyle(css); //有警告
	} else if (typeof addStyle != "undefined") {
		addStyle(css); //有警告
	} else {
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(css));
		var heads = document.getElementsByTagName("head");
		if (heads.length > 0) {
			heads[0].appendChild(node);
		} else {
			// no head yet, stick it whereever
			document.documentElement.appendChild(node);
		}
	}
	//百度贴吧：不登录即可看贴 by VA
	//unsafeWindow.Object.freeze = null;
	//document.addEventListener('DOMContentLoaded', function(event) {
	// try {
	//     unsafeWindow.PageData.user.is_login = 1;
	// } catch (error) {}
	// }, true);
	//梦姬贴吧助手 by jixun
	(function() {
		var w = unsafeWindow,
			_main;
		jQuery(function($) { //有警告
			var iv = setInterval(function() {
				if (w.jQuery && w.PageData && w.PageData.tbs) {
					clearInterval(iv);
					console.log('PageData loaded.');

					if (!w.bdShare) { //有警告
						w.bdShare = unsafeObject({
							ready: false
						});
					}

					w.PageData.games = unsafeObject([]); //有警告
					//有警告
					unsafeExec(function() {
						// 改进自 congxz6688 的 tieba_quote [#147]
						// 节取自 寂寞的原子 的  悬浮窗脚本 [#116]
						//2019-11-4 这个会贴吧会报错
						/*_.Module.use("common/widget/RichPoster", {},
						             function (t) {
						    t.init();
						    t.unbindScrollEvent();
						});*/
					});

					_main($, w.PageData);
				}
			}, 500);

			setTimeout(function() {
				// 15s later force kill waiting.
				clearInterval(iv);
			}, 15000);
		});

		var __type_floor = 1,
			__type_lzl = 2,
			__type_forum = 4,
			__type_postact = 8;

		var __mod_default = 0,
			__mod_enable = 1,
			__mod_disable = 2; //关掉模块

		_main = function($, wPageData) {
			// 检查是否在贴吧
			if (!wPageData.forum) return;
			var isThread = !!wPageData.thread;
			var _css = $('<style>');
			var _cssH = $('<style>').text('.ads{display:none !important;}');


			//// Function Helper
			Object.defineProperty(Function.prototype, 'extract', {
				value: function() {
					return this.toString().match(/\/\*([\s\S]+)\*\//)[1];
				}
			});

			var _function = function(foo, proto) {
				foo.prototype = proto;
				return foo;
			};

			var $conf = new(_function(function() {}, {
				get: function(m, def) {
					var val = GM_getValue(m, null);
					if (!val) return def;

					try {
						return JSON.parse(val);
					} catch (e) {
						return def;
					}
				},
				set: function(m, val) {
					return GM_setValue(m, JSON.stringify(val));
				},
				rm: function() {
					[].forEach.call(arguments, GM_deleteValue);
				},
				ls: function() {
					return GM_listValues();
				}
			}))();

			var _hide = function() {
				_cssH.prepend(Array.prototype.join.call(arguments, ',') + ',');
			};

			var _run = function(foo, name) {
				// console.groupCollapsed ('[贴吧助手]: ' + (name || '[未知区段]'));

				for (var args = [], i = 2, ret; i < arguments.length; i++) {
					args.push(arguments[i]);
				}

				try {
					ret = foo.apply(this, args);
					if (ret !== undefined) {
						console.info('[贴吧助手][返回][%s]: %s', name || '[未知区段]', ret);
					}
				} catch (err) {
					console.error('[贴吧助手][错误][%s]: %s', name || '[未知区段]', err.message);
					console.error(err);
				}
				// console.groupEnd ();

				return ret;
			};

			$.fn.getField = function() {
				// var $data = this.attr('data-field');
				var $data = this.data('field');

				if ('string' == typeof $data[1]) {
					return JSON.parse($data.replace(/'/g, '"'));
				}
				return $data;
			};

			$.goToEditor = function() {
				$('#ueditor_replace').focus();
				$.scrollTo($('#tb_rich_poster_container'), 500);
			};
			$.create = function(ele, cls, attr) {
				var r = $(document.createElement(ele));

				if (cls) {
					r.addClass(cls);
				}
				if (attr) {
					r.attr(attr);
				}

				return r;
			};
			$.stamp = function() {
				return +new Date();
			};
			$.toDateStr = function(d) {
				return d.toLocaleString();
			};

			GM_setValue("lzl_zhankai", false);
			GM_setValue("rm_user_icon", false);
			var modules = {
				"rmBottom": {
					name: '移除底部工具栏(不完美)',
					desc: '移除美化贴吧时底部出现的工具栏。',
					flag: 0,
					def: false,
					_init: function() {
						//core_title_wrap_bright clearfix  没底工具栏时
						//core_title_wrap_bright clearfix tbui_follow_fixed core_title_absolute_bright 有底工具栏时
						rmBottom = true;
						/*
                版权声明：本文为CSDN博主「养只猫」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
            原文链接：https://blog.csdn.net/qq_40816649/java/article/details/86512538
                */
						//$('#j_core_title_wrap').remove(); //core_title_wrap_bright clearfix tbui_follow_fixed core_title_absolute_bright
						//$('#j_core_title_wrap')[0].style = "position: unset !important";
						//$('#j_core_title_wrap')[0].className = "core_title_wrap_bright clearfix"; //这样关闭下工具栏不影响贴子顶的标题、收藏和回复
					}
				},
				"ads_hide": {
					name: '广告隐藏、屏蔽',
					desc: '屏蔽无用、广告内容',
					flag: ~0,
					def: true,
					_init: function() {
						var $ads = [
							// 贴吧推广
							'.spreadad, .game_frs_step1, .BAIDU_CLB_AD, .dasense, .u9_head',
							'.j_click_stats, .p_postlist>div:not(.l_post):not(.p_postlist)',
							//'[id="pagelet_frs-header/pagelet/head_content_middle"]',
							'[id="pagelet_encourage-appforum/pagelet/my_app"]',
							'.life_helper',

							// 到处插入的广告
							'[data-daid]',

							// 右下角广告
							'#game_pop_window',

							// 直播
							'#game_live_list',

							// 10 年
							'#j_ten_years',

							// 1l 下方的广告
							'#sofa_post, .banner_post',

							// 贴吧顶部广告
							'#pb_adbanner',
							'.l_banner.banner_theme',

							// 图片页面
							'.af_head_gamelink',

							// 左右侧
							'.j_couplet',

							// 右侧
							'#encourage_entry',
							'.platform_aside_tieba_partner',
							'.search_back_box',
							'.topic_list_box',

							// 客户端发贴 x 倍经验
							'.tb_poster_placeholder',

							// 语音按钮 (需要客户端)
							'.edui-btn-voice, .j_voice_ad_gif, .lzl_panel_voice',

							// 发帖请遵守 ....
							'.poster_head_surveillance',

							// 不水能死何弃疗！
							'.lzl_panel_wrapper > tbody > tr > td:first-child > p',

							// 会员相关广告
							'.doupiao_offline, .fMember_cnt',

							// 右上角 .u_mytbmall我的商城
							'.u_tshow, .u_tbmall, .u_app, .u_wallet, .u_xiu8',
							'.u_joinvip, .u_baiduPrivilege, .u_appcenterEntrance',

							// 右下角
							'#pop_frame, #__bdyx_tips, #__bdyx_tips_icon',

							// 猜拳
							'.add_guessing_btn, .guessing_watermark',

							// 帖子推荐
							'.thread_recommend',

							// 右下角广告
							'#__bdyx_tips, #__bdyx_tips_icon, .baidu-tuisong-wrap, .baidutuisong',

							// 打赏、分享
							'.reward_btn, .share_btn_wrapper',

							// 烟花
							'.firework_sender_wrap, .global_notice_wrap',
							/*.tbui_fbar_share,.tbui_fbar_props,.tbui_fbar_tsukkomi,*/
							'.tbui_fbar_square, .tbui_fbar_home',

							'#tshow_out_date_warn, #selectsearch-icon',

							// 贴吧推荐
							'#forum_recommend',

							//贴吧列表右上角的广告
							'#mediago-frs-aside',
							//贴吧列表内的广告
							'div.mediago-ad-wrapper',

							/*贴吧贴子列表顶的游击广告*/
							//".bus-top-activity-wrap",
						].join(', ');
						$($ads).remove();
						//https://tieba.baidu.com/f?kw=epic&ie=utf-8 屏蔽某些吧的背景图
						//console.log(GM_getValue("tiebameihua"));
						//console.log(window.location.href.search(/(https|http):\/\/tieba\.baidu\.com\/(f\?kw|f\?ie=utf-8&kw=)/g));
						if (GM_getValue("tiebameihua") && window.location.href.search(/(https|http):\/\/tieba\.baidu\.com\/(f\?kw|f\?ie=utf-8&kw=)/g) != -1 /*贴吧主页才执行*/ ) {
							let temp2 = $(".wrap1")[0];
							if (temp2 != null) {
								temp2.style = "background-image: none !important;";
							}
						}
						$('<style>').text($ads + /* File: ads_hide.css */
							(function() {
								/*
    {
    display:none !important;
    }

    #com_userbar_message {
    right: 30px !important;
    top: 28px !important;
    }

    #com_userbar_message > .j_ui_triangle {
    left: 65px !important;
    }
    */
							}).extract()).appendTo(document.head);

						// 只保留 [看帖、图片、精品(吧主推荐)、视频] 四个选项，贴吧有一个空白的选项 j_tbnav_tab_a 群组功能没了http*://tieba.baidu.com/f?kw=*&ie=utf-8&tab=group 贴吧已去掉群组功能 标题: 【公告】贴吧群组功能下线通知 链接：https://tieba.baidu.com/p/6698238206 百度贴吧: 贴吧意见反馈吧 发贴时间: 2020-5-22 19:24
						//$('.j_tbnav_tab').filter(function(i) { return i > 3; }).remove();
						let temp = $('.j_tbnav_tab_a');
						for (let i = 0; i < temp.length; i++) {
							//console.log(temp[i].innerHTML);
							//console.log(temp[i].parentNode);
							if (temp[i].innerHTML == "" || temp[i].innerHTML == "玩乐" || temp[i].innerHTML == "游戏" || temp[i].innerHTML.search(/游戏/g) != -1 /* || temp[i].innerHTML == undefined*占位的*/ ) {
								temp[i].parentNode.style = "display:none;";
							}
						}
						// 执行三次, 确保分隔符会消失
						for (var i = 3; i--;) {
							setTimeout(function() {
								$('.split_text').next('.split_text').remove();
								$('.split').filter(function() {
									return this.nextElementSibling === null ||
										this.nextElementSibling.className == this.className ||
										!$(this.nextElementSibling).is(':visible');
								}).remove();
							}, 3000 * i);
						}

						this.removePromoteThread();
					},

					_proc: function(floorType, args) {
						if (floorType == __type_forum) {
							if (args.thread.find('.threadlist_rep_num').text() == '推广') {
								args.thread.remove();
							}
						}
					},

					removePromoteThread: function() {
						// 清理帖子列表的推广
						var it = document.evaluate('//*[@id="thread_list"]/li/div/div/div[text()="推广"]', document.body, null, XPathResult.ANY_TYPE, null);
						var thread, threads = [];

						while (thread = it.iterateNext()) {
							threads.push(thread);
						}

						$(threads).parents('li').remove();
					}
				},
				"ads_thread_list": {
					name: '屏蔽直播贴等乱七八糟内容 (实验性)',
					desc: '并不清楚到底会屏蔽多少东西）',
					flag: ~0,
					def: false,
					_init: function() {
						var $ads = [
							// 帖子列表顶部, 如直播贴
							'#threadListGroupCnt'
						].join(', ');

						$($ads).remove();
						$('<style>').text($ads + '{display: none !important}').appendTo('head');
					}
				},
				"rm_user_icon": {
					name: '移除贴子内楼层用户头像',
					desc: '移除贴子内楼层用户头像',
					flag: 0,
					def: false,
					_init: function() {
						GM_setValue("rm_user_icon", true);
					},
					_proc: function(floorType, args) {
						GM_setValue("rm_user_icon", true);
					}
				},
				"pingbi_loucengqipao": {
					name: '屏蔽楼层气泡',
					desc: '屏蔽楼层气泡',
					flag: __type_floor,
					def: false,
					_init: function() {
						pingbi_loucengqipao = true;
						let temp1 = $(".post_bubble_top");
						let temp2 = $(".post_bubble_middle");
						let temp3 = $(".post_bubble_bottom");
						let i = 0;
						for (i = 0; i < temp1.length; i++) {
							temp1[i].style = "backgrounde:none;";
						}
						for (i = 0; i < temp2.length; i++) {
							temp2[i].style = "backgrounde:none;padding:unset;";
						}
						for (i = 0; i < temp3.length; i++) {
							temp3[i].style = "backgrounde:none;";
						}
					},
					_proc: function(floorType, args) {
						//console.log("666666666666");
					}
				},
				"qiangdiaoxinxitishi": {
					name: '强调信息提示',
					desc: '强调信息提示',
					flag: __type_floor,
					def: false,
					_init: function() {
						qiangdiaoxinxitishi = true;
						let ii = 0;
						try {
							let t = setInterval(() => {
								//let temp1 = $(".u_news_wrap span"); //浮动按钮
								//let temp2 = $(".u_notity_bd .category_item"); //浮动按钮
								let temp3 = $(".core_reply_tail"); //楼层信息
								//let temp4 = $("ul.j_category_list>li>a>span,ul.j_category_list>#u_notify_item>li>a>span"); //浮动按钮
								//let temp5 = $("ul.sys_notify_last>li>a>span"); //浮动按钮
								//let temp6 = $(".meihua"); //美化开关
								if (ii <= 59) {
									ii++;
								} else {
									clearInterval(t);
								}
								/*if (temp6[0] != null) {
								        temp6[0].style = "color:#f00 !important;font-weight:bold;white-space:normal;"; //贴吧美化开关按钮文字样式

								    }*/
								if (temp3[0] != null) {
									for (i = 0; i < temp3.length; i++) {
										temp3[i].style = "color:#000 !important;";
									}
								}
								/*if (temp1[0] != null && temp2[0] != null && temp4[0] != null && temp5[0] != null) {
								        clearInterval(t);
								        let i = 0;
								        for (i = 0; i < temp1.length; i++) {
								            temp1[i].style = "display:" + temp1[i].style["display"] + ";color:#f00 !important;";
								        }
								        for (i = 0; i < temp2.length; i++) {
								            temp2[i].style["color"] = "#f00 !important;";
								        }

								        for (i = 0; i < temp4.length; i++) {
								            temp4[i].style = "color:#f00 !important;";
								        }
								        for (i = 0; i < temp5.length; i++) {
								            temp5[i].style = "display:" + temp5[i].style["display"] + ";color:#f00 !important;";
								        }
								    }*/
							}, 1000);
						} catch (err) {
							console.log("强调信息提示:" + err);
						}
					},
					_proc: function(floorType, args) {
						//console.log("666666666666");
					}
				},
				/*"audio_download": {
				        name: '贴吧语音下载(已无效)',
				        desc: '下载贴吧语音~ 啦啦啦~',
				        flag: __type_floor | __type_lzl,
				        _proc: function(floorType, args) {
				            var _player = $('.voice_player:not(.parsed)', args._main);
				            if (!_player.size()) return '找不到语音';

				            var data = _player.parents('[data-field]').getField(),
				                pid = data.spid || data.content.post_id;

				            _player.addClass('parsed').after(
				                $('<a>').addClass('ui_btn ui_btn_m')
				                .attr({
				                    href: '/voice/index?tid=' + wPageData.thread.thread_id + '&pid=' + pid,
				                    download: '语音-' + (data.user_name || data.author.user_name) + '-' + pid + '.mp3'
				                })
				                .css({
				                    marginLeft: '1em'
				                })
				                .append($('<span>').text('下载'))
				            ).after($('<br>'));
				        }
				    },*/
				"block_post": {
					name: '贴吧贴子屏蔽(残废的)',
					desc: '根据规则屏蔽指定贴子',
					flag: __type_floor | __type_forum | __type_lzl,
					def: false,

					// 辅助函数
					_match_type: function(_M) {
						switch (_M) {
							case this.__M_REGEX:
								return 'tp_regex';
							case this.__M_PLAIN:
								return 'tp_plain';
						}

						return 'undefined_' + _M;
					},
					// 辅助函数
					_range: function(old, min, max) {
						return Math.min(Math.max(min, old), max);
					},

					// 初始化样式表
					_init: function() {
						_css
							.append('ul#jx_post_kword > li {margin-bottom: .2em}')
							.append('.jx_word { padding: 0 .5em; width: 8em } span.regex::before, span.regex::after { content: "/"; color: #777 }')
							.append('span.regex > .jx_word { border: 0; padding: 0 .2em }')
							.append('.jx_modifier { width: 4em; border: 0; padding: 0 0 0 .2em }')

						.append('.jx_post_block_stripe::before{content: "共隐藏 " attr(hide-count) " 个数据"}');


						$.extend(this, {
							// Action to take when match
							__ACT_BAR: 0,
							__ACT_OPA: 1,
							__ACT_HIDE: 2,

							// Keyword match method
							__M_REGEX: 0,
							__M_PLAIN: 1
						});

						this.config = $.extend({
							onmatch: this.__ACT_OPA,
							opacity: 30,

							kword: [{
								type: this.__M_PLAIN,
								word: '泽火革'
							}],
							user: [
								'炮弹56',
								'炮弹52'
							]
						}, $conf.get(this.id));
						this._compileRegex();

						this.$tplConfig = /* File: block_post.html */
							(function() {
								/*
    <div class="jx_autoflow">
    <h3>当匹配到时的操作</h3>
    <p>
    <select id="jx_post_match">
    <option value="0" {{#tp_bar}}selected{{/tp_bar}}>红条</option>
    <option value="1" {{#tp_opa}}selected{{/tp_opa}}>透明</option>
    <option value="2" {{#tp_hide}}selected{{/tp_hide}}>隐藏</option>
    </select>

    <label title="0 表示完全透明 (占位难看哦); 0~100"{{^tp_opa}} class="hide"{{/tp_opa}}>透明度
    <input type="number" id="jx_post_opa" class="text-center" value="{{opacity}}" style="width: 5em" />%
    </label>
    </p>
    <br />

    <h3>内容屏蔽规则</h3>
    <ul id="jx_post_kword">
    {{#kword}}
    <li>
    <select class="jx_word_type">
    <option value="0" {{#tp_regex}}selected{{/tp_regex}}>正则</option>
    <option value="1" {{#tp_plain}}selected{{/tp_plain}}>文本</option>
    </select>

    <span{{#tp_regex}} class="regex"{{/tp_regex}}><input class="jx_word" value="{{word}}" /></span><!--
    --><input class="jx_modifier{{^tp_regex}} hide{{/tp_regex}}" value="{{modi}}" />

    [ <a class="ptr jx-rm-key" >删除</a> ]
    </li>
    {{/kword}}
    </ul>
    <p><a class="ui_btn ui_btn_m" data-btn="add"><span><em>添加</em></span></a></p>
    <br />

    <h3>用户屏蔽列表</h3>
    <p>用户列表，一行一个</p>
    <!-- Hackish solution -->
    <div style="padding-right: 10px;">
    <textarea id="jx_post_user" row=5 style="width: 100%; padding: .2em">{{user}}</textarea>
    </div>
    <br />

    <p class="text-center">
    <a class="ui_btn ui_btn_m" data-btn="save"><span><em>储存</em></span></a> &nbsp;
    <a class="ui_btn ui_btn_m" data-btn="close"><span><em>放弃</em></span></a>
    </p>
    </div>
    */
							}).extract();
						this.$tplAddWord = /* File: block_post_kword.html */
							(function() {
								/*
    <li>
    <select class="jx_word_type">
    <option value="0" {{#tp_regex}}selected{{/tp_regex}}>正则</option>
    <option value="1" {{#tp_plain}}selected{{/tp_plain}}>文本</option>
    </select>

    <span{{#tp_regex}} class="regex"{{/tp_regex}}><input class="jx_word" value="{{word}}" /></span><!--
    --><input class="jx_modifier{{^tp_regex}} hide{{/tp_regex}}" value="{{modi}}" />

    [ <a class="ptr jx-rm-key" >删除</a> ]
    </li>
    */
							}).extract();

						this.css = $('<style>').appendTo(document.head);
						this._rebuildStyle();
					},

					// 重构样式表
					_rebuildStyle: function() {
						var sBuilder = '.jx_post_block_act {';
						switch (this.config.onmatch) {
							case this.__ACT_BAR:
								sBuilder += 'display: none;';
								break;
							case this.__ACT_HIDE:
								sBuilder += [
									'display: none;',
									'}',

									'.jx_post_block_stripe {',
									'display: none'
									// , '}'
								].join('');
								break;
							case this.__ACT_OPA:
								sBuilder += [
									'opacity: ' + (this.config.opacity / 100) + ';',
									'transition: opacity .5s;',
									'}',

									'.jx_post_block_act:hover {',
									'opacity: .9;',
									'}',

									'.jx_post_block_stripe {',
									'display: none'
									// , '}'
								].join('');
								break;
						}

						sBuilder += '}';
						this.css.text(sBuilder);
					},
					// 编译正则匹配
					_compileRegex: function() {
						var that = this;
						this.config.kword.forEach(function(e) {
							try {
								if (e.type === that.__M_REGEX) {
									e.regex = new RegExp(e.word, e.modi);
								}
							} catch (err) {
								console.error('编译正则表达式时出错!\n表达式: %s, 开关: %s', err.word, err.modi);
								err.regex = {
									test: function() {
										return false;
									}
								};
							}
						});
					},

					// 配置窗口回调
					_conf: function() {
						var $view = $.extend(true, {}, this.config);

						$view.tp_hide = $view.onmatch === this.__ACT_HIDE;
						$view.tp_opa = $view.onmatch === this.__ACT_OPA;
						$view.tp_bar = $view.onmatch === this.__ACT_BAR;

						for (var i = 0; i < $view.kword.length; i++) {
							$view.kword[i][this._match_type($view.kword[i].type)] = true;
						}
						$view.user = $view.user.join('\n');

						var $tpl = $(Mustache.render(this.$tplConfig, $view)); //有警告

						var $wndBlocker = $.dialog.open($tpl, {
							title: '贴子关键字屏蔽',
							width: 300,
							height: 400
						});

						var that = this;
						$tpl.on('click', 'a.jx-rm-key', function() {
							// 移除那一行
							$(this).parent().remove();
						}).on('change', '.jx_word_type', function() {
							var isRegex = parseInt(this.value) === that.__M_REGEX;

							var line = $(this).parent();
							line.find('.jx_word').parent().toggleClass('regex', isRegex);
							line.find('.jx_modifier').toggleClass('hide', !isRegex);
						}).on('change', '#jx_post_match', function() {
							$('#jx_post_opa', $tpl).parent().toggleClass('hide', parseInt(this.value) !== that.__ACT_OPA);
						}).on('click', '.ui_btn', function() {
							switch ($(this).data('btn')) {
								case 'add':
									var $tplAdd = $(Mustache.render(that.$tplAddWord, {
										tp_plain: true
									})); //有警告
									$('#jx_post_kword', $tpl).append($tplAdd);
									$tplAdd.find('.tg_focus').removeClass('.tg_focus').focus();
									break;
								case 'save':
									var newConf = {
										onmatch: parseInt($('#jx_post_match', $tpl).val()),
										opacity: that._range(parseInt($('#jx_post_opa', $tpl).val()), 0, 100),
										kword: [],
										user: $('#jx_post_user', $tpl).val().split('\n')
									};
									$('#jx_post_kword > li').each(function() {
										var rule = $(this);
										newConf.kword.push({
											type: parseInt(rule.find('select').val()),
											word: rule.find('.jx_word').val(),
											modi: rule.find('.jx_modifier').val()
										});
									});
									$conf.set(that.id, newConf);
									that.config = newConf;

									that._compileRegex();
									that._rebuildStyle();
									$wndBlocker.close();
									break;
								case 'close':
									$wndBlocker.close();
									break;
							}
						});
					},

					// 标记贴子为隐藏
					_hit: function(floor) {
						floor.addClass('jx_post_block_act');

						if (floor.prev().is('script')) {
							floor.prev().remove();
						}

						if (floor.prev().is('.jx_post_block_act')) {
							// 寻找横条
							var prev = floor.prev();
							while (!prev.is('.jx_post_block_stripe')) {
								prev = prev.prev();
							}

							prev.attr('hide-count', parseInt(prev.attr('hide-count')) + 1);
						} else {
							$('<div>').addClass('jx_post_block_stripe floor-stripe')
								.attr('hide-count', 1).insertBefore(floor);
						}
					},

					_getAuthor: function(f) {
						return f.user_name || f.author_name || (f.author ? f.author.user_name : null);
					},

					_proc: function(floorType, args) {
						// 首先检查用户名
						if (this.config.user.indexOf(this._getAuthor(args._main.getField())) !== -1) {
							this._hit(args._main);
							return;
						}

						var floorContent;
						switch (floorType) {
							case __type_forum:
								floorContent = $('.threadlist_text', args._main).text();
								break;
							case __type_floor:
								floorContent = $('.d_post_content', args._main).text();
								break;
							case __type_lzl:
								floorContent = $('.lzl_content_main', args._main).text();
								break;
						}

						// 然后循环检查关键字匹配
						for (var i = this.config.kword.length; i--;) {
							switch (this.config.kword[i].type) {
								case this.__M_REGEX:
									if (this.config.kword[i].regex.test(floorContent)) {
										this._hit(args._main);
									}
									break;

								case this.__M_PLAIN:
									if (floorContent.indexOf(this.config.kword[i].word) !== -1) {
										this._hit(args._main);
									}
									break;
							}
						}
					}
				},
				"hide_loops": {
					name: '3 天循环隐藏',
					desc: '3 天循环屏蔽指定用户的帖子, 统一封锁.',
					flag: __type_postact | __type_forum,
					def: false,

					_findUser: function(name) {
						if (0 === this.blockList.author.length) {
							return -1;
						}

						for (var i = this.blockList.author.length; i--;) {
							if (this.blockList.author[i].name == name) {
								return i;
							}
						}

						return -1;
					},
					_userExist: function(user) {
						return -1 !== this._findUser(user);
					},

					_conf: function() {
						var that = this;

						//有警告
						var $tpl = $(Mustache.render(this.tplHideAuthor, {
							author: this.blockList.author.map(function(e, i) {
								return {
									name: e.name,
									time: e.time ? $.toDateStr(new Date(e.time)) : '尚未'
								};
							})
						}));

						var $wndHideUser = $.dialog.open($tpl, {
							title: '3天循环隐藏模组配置 - 记得点一次 [全部封禁]',
							width: 370,
							height: 400
						});

						var $inp = $('#jx_new_id', $tpl);
						var cbAddName = function() {
							var user = $inp.val().trim();
							that._updList();

							if (0 === user.length || that._userExist(user)) {
								return;
							}

							$inp.val('');
							//有警告
							$(Mustache.render(that.tplNewLine, {
								name: user,
								time: '尚未'
							})).insertBefore($('#jx_last_line_of_3day_block', $tpl));
							that.blockList.author.push({
								name: user,
								time: 0
							});
							that._saveList();
						};

						// 绑定事件
						$('#jx_add', $tpl).click(cbAddName);
						$inp.keypress(function(e) {
							if (e.which === 13) {
								cbAddName();
							}
						});
						$tpl
							.on('click', '.jx_man_hide, .jx_man_rm', function(e) {
								var $l = $(e.target);
								if ($l.hasClass('text-disabled')) {
									return;
								}
								$l.addClass('text-disabled');


								var $un = $l.parent().data('name');
								that._updList();
								switch (true) {
									case $l.hasClass('jx_man_hide'):
										that.blockList.author[that._findUser($un)].time = $.stamp();
										that._hide(function() {}, $un);
										break;
									case $l.hasClass('jx_man_rm'):
										that.blockList.author.splice(that._findUser($un), 1);
										$l.parent().hide();
										break;
								}
								that._saveList();
							});

						$('#jx_close', $tpl).click($wndHideUser.close.bind($wndHideUser));
						$('#jx_all', $tpl).click(function() {
							var hideStatus = $('#jx_hide_info', $tpl).show().text('正在初始化…');

							that.hideQueue.onProgress = function(i, t) {
								hideStatus.text(Mustache.render('正在隐藏 {{i}} / {{t}}... 请勿关闭该窗口!', {
									i: i,
									t: t
								})); //有警告
							};
							that.hideQueue.onComplete = function() {
								that.hideQueue.onProgress = that.hideQueue.onComplete = null;
								hideStatus.text('全部用户已成功隐藏!');
							};
							that.hideQueue.add.apply(
								that.hideQueue,
								Array.prototype.slice.call($('a.jx.jx_man_hide:not(.text-disabled)').addClass('text-disabled').map(function(i, e) {
									return $(e).parent().data('name');
								}))
							);
						});
						return $tpl;
					},

					_hide: function(cb, author) {
						// 检查是否在列表
						this._updList();
						if (this._userExist(author)) {
							// 如果存在, 修正上次隐藏时间
							this.blockList.author[this._findUser(author)].time = $.stamp();
							this._saveList();
						}
						console.info('开始隐藏: %s', author);

						$.ajax({
							url: '/tphide/add',
							type: 'POST',
							data: {
								type: 1,
								hide_un: author,
								ie: 'utf-8'
							},
							dataType: 'json'
						}).success(cb);
					},

					_init: function() {
						this.tplHideAuthor = /* File: hide_loops_config.html */
							(function() {
								/*
    <div class="jx_autoflow">
    <h2>3 天循环隐藏的列表</h2>

    <p class="text-center">请注意: 封禁时间不会自动刷新, 请关闭后重新开启该对话框。</p>

    <ol>
    {{#author}}
    <li data-name="{{name}}"><b>{{name}}</b>
    [ 上次隐藏: <span class="text-red">{{time}}</span> | <a class="jx jx_man_hide">手动</a> | <a class="jx jx_man_rm">移除</a> ]</li>
    {{/author}}
    <li id="jx_last_line_of_3day_block">
    <input id="jx_new_id" placeholder="请输入新的需要自动封禁的 id" style="width: 20em;" />
    <br /><a class="ui_btn ui_btn_m" id="jx_add"><span><em>添加</em></span></a>
    </li>
    </ol>

    <p class="hide" id="jx_hide_info"></p>

    <div class="text-center">
    <a class="ui_btn ui_btn_m" id="jx_all"><span><em>全部封禁</em></span></a> &nbsp;
    <a class="ui_btn ui_btn_m" id="jx_close"><span><em>关闭</em></span></a>
    </div>
    </div>
    */
							}).extract();
						this.tplNewLine = /* File: hide_loops_author.html */
							(function() {
								/*
    <li data-name="{{name}}"><b>{{name}}</b>
    [ 上次隐藏: <span class="text-red">{{time}}</span> | <a class="jx jx_man_hide">手动</a> | <a class="jx jx_man_rm">移除</a> ]</li>
    */
							}).extract();
						this._updList();

						var _hide = this._hide.bind(this);
						this.hideQueue = new IntervalLoop([], _hide, 400).loop(); //有警告

						var curTime = $.stamp();
						var t3Days = 3 * 24 * 60 * 60;

						var that = this;
						this.blockList.author.forEach(function(e) {
							if (curTime - e.time > t3Days) {
								that.hideQueue.add(e.name);
							}
						});
					},

					_updList: function() {
						this.blockList = $.extend({
							author: [
								// 格式如下
								//{
								//	name: '炮弹56',
								//	lastHide: 0
								//}
							]
						}, $conf.get(this.id, {}));
					},
					_saveList: function() {
						$conf.set(this.id, this.blockList);
					},

					_findNameAndHide: function(e) {
						var floorData = $(e.target).parents('.lzl_single_post,.l_post')
							.first().getField();
						var author = floorData.user_name || floorData.author.user_name;
						if (this._userExist(author)) { //有警告
							$.dialog.alert(Mustache.render( /* File: hide_loops_already_in_list.html */
								(function() {
									/*
    用户 [<b>{{name}}</b>] 已存在于屏蔽列表!
    */
								}).extract(), {
									name: author
								}), {
								title: '3 天循环隐藏'
							});
							return;
						}
						this._updList();
						this.blockList.author.push({
							name: author,
							time: $.stamp()
						});
						this._saveList();
						this._hide(function(r) { //有警告
							$.dialog.alert(Mustache.render( /* File: hide_loop_result.html */
								(function() {
									/*
    对 <b>{{name}}</b> 的隐藏处理结果: {{msg}}({{no}})
    */
								}).extract(),
								$.extend({
									name: author
								}, r)), {
								title: '3 天循环隐藏 (楼中楼无效)'
							});
						}, author);
					},

					_menu: function(floorType, args) {
						var $act = $('.user-hide-post-action', args._main);
						var $actHidePost = $.create('a', 'jx jx-post-action');

						$actHidePost
							.text('加入 3 天循环隐藏列表')
							.appendTo($act)
							.data('jx', this.id)
							.data('eve', args._main.getField().author.user_name)
							.click(this._findNameAndHide.bind(this));
					}
				},
				"icon_hide": {
					name: '隐藏用户印记',
					desc: '将用户名下方、右方的印记集藏起来。',
					flag: ~0,
					def: false,

					_init: function() {
						_hide('.icon_wrap');
					}
				},
				/*"no_text_link": {
				    name: '屏蔽帖子内文字推广链接(过时了)',
				    desc: '将帖子内的文字推广搜索链接替换为普通文本',
				    flag: __type_lzl | __type_floor,
				    _proc: function(floorType, args) {
				        this.rmLinkText(args._main);
				    },
				    _init: function() {
				        this.rmLinkText();
				    },
				    rmLinkText: function(_p) {
				        $(_p || 'body').find('a.ps_cb').each(function() {
				            $(this).after(document.createTextNode(this.textContent));
				        }).remove();
				    }
				},*/
				"orange": {
					name: '移除会员彩名',
					desc: '全部变成变成默认链接颜色。',
					flag: __type_floor | __type_lzl | __type_forum,
					def: false,

					clsList: ['sign_highlight', 'vip_red', 'fiesta_member', 'fiesta_member_red', 'member_thread_title_frs', 'sign_highlight'],

					rmOrange: function(target) {
						var $target = $(target);

						for (var i = 1; i < this.clsList.length; i++) {
							$('.' + this.clsList[i], $target.removeClass(this.clsList[i])).removeClass(this.clsList[i]);
						}
					},

					_init: function() {
						// 标题红名移除
						this.rmOrange('body');
					},
					_proc: function(floorType, args) {
						this.rmOrange(args._main);
					}

				},
				"quote": {
					name: '引用楼层',
					desc: '引用某一层的内容',
					flag: __type_floor,
					def: true,
					_init: function() {},
					_proc: function(floorType, args) {
						//console.log("233333333333");
						//旧贴吧
						$('<li>').addClass('pad-left').append( //<li>
							$('<a>').text('#引用').addClass('jx')
							.data('jx', 'quote').data('floor', args.floorNum)
						).prependTo($('.p_tail', args._main));
						//新贴吧

						$('<li>').addClass('pad-left').append( //<li>
							$('<a>').text('#引用').addClass('jx')
							.data('jx', 'quote').data('floor', args.floorNum)
						).prependTo($('.post-tail-wrap', args._main));
						/*setTimeout(() => {
						    console.log(args);
						    var $quote2 = $('.post-tail-wrap').append($('<div>').addClass('pad-left').append( //<li>
						        $('<a>').text('#引用').addClass('jx')
						        .data('jx', 'quote').data('floor', "666")
						    ));
						}, 5000);*/
					},
					_click: function($ele, $eve) {
						var $floor = $ele.parents('.l_post');
						var $editor = $('#ueditor_replace');
						var $quote = $('<p>').appendTo($editor);

						$quote
							.append('引用 ' + $ele.data('floor') + '楼 @' + $('.p_author_name', $floor).first().text() + ' 的发言：')
							.append('<br>')
							.append('——————————')
							.append('<br>');

						$('.j_d_post_content', $floor).contents().each(function(i, ele) {
							if (ele.nodeType == 3) {
								if (ele.nodeValue.trim() !== '') {
									$quote.append(ele.nodeValue);
								}
								return;
							}

							var $ele = $(ele);
							console.log($ele)
								//console.log($ele.find('img').length)
								//console.log($ele.find('img').attr("class"))
							if ($ele.find('img').attr("class") == "BDE_Image") { //新贴吧
								$quote.append('[#图片]'); //BDE_Image
								//$quote.append($ele.text());
							} else if ($ele.find('img').attr("class") == "BDE_Smiley") {
								$quote.append('[#表情]'); //BDE_Smiley
							} else if ($ele.is('img')) { //旧贴吧
								if ($ele.attr("class") == "BDE_Image") {
									$quote.append('[#图片]'); //BDE_Image
									//$quote.append($ele.text());
								} else if ($ele.attr("class") == "BDE_Smiley") {
									$quote.append('[#表情]'); //BDE_Smiley
								}
							} else if ($ele.attr("class") == "video_src_wrapper") {
								$quote.append('[#视频]'); //video_src_wrapper
							} else if ($ele.attr("class") == "voice_player voice_player_pb") {
								$quote.append('[#语音]'); //voice_player voice_player_pb
							} else {
								$quote.append($ele.clone()) //直接复制内容
							}
						});

						$quote.append('<br>&gt; ');
						$.goToEditor();
					}
				},
				"quote_lzl": {
					name: '楼中楼帖子引用',
					desc: '引用楼中楼的回复',
					flag: __type_lzl,
					def: true,
					_init: function() { //新旧版贴吧都生效
						tupianfangda = true;
						//console.log("123")
						//_css.append('.jx_no_overflow { max-width: 100%; }');
						//this.rmImg(document);
					},
					_proc: function(floorType, args) { //仅旧版贴吧生效
						$('<a>').text('引用').addClass('jx d_tail')
							.insertBefore($('.lzl_time', args._main))
							.after($('<span>').addClass('d_tail').text(' | '))
							.data('jx', 'quote_lzl');
					},
					_click: function($ele, $eve) {
						var $editor = $('#ueditor_replace');
						var $cnt = $ele.parents('.lzl_cnt');
						var $floor = JSON.parse($ele.parents(".j_lzl_container").attr("data-field")).floor_num
							//console.log(JSON.parse($ele.parents(".j_lzl_container").attr("data-field")).floor_num)
						$('<p>').appendTo($editor)
							.append('引用' + $floor + '楼 @' + $cnt.find('.j_user_card').attr('username') + ' 在楼中楼的发言：<br>')
							.append($ele.parents('.lzl_cnt').find('.lzl_content_main').text())
							.append('<br>')
							.append('——————————')
							.append('<br> &gt;<br>');

						$.goToEditor();
					}
				},
				"real_url": {
					name: '贴吧跳转链解除(beta)', //可以用这个脚本代替 https://greasyfork.org/scripts/783-%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E4%B8%8D%E5%8F%AF%E8%83%BD%E4%BC%9A%E8%B7%B3%E8%BD%AC 去除贴吧帖子里链接的跳转
					desc: '将百度所谓安全链接改成直链。',
					flag: __type_floor | __type_lzl,
					def: false,
					_proc: function(floorType, args) {
							var $floor = $(args._main)
								//console.log($floor)
							$floor.find('a[class*="j-no-opener-url"]').each(function(i, ele) {
								var $ele = $(ele),
									$url = $ele.text();
								//console.log($ele)
								if ($url.indexOf('@') === 0) {
									// Do nothing.
									//邮箱
								} else if (/^https?:\/\//.test($url)) {
									//文本内容即是链接
									$ele.attr('href', $url);
									console.log("/^https?:\/\//:" + $url)
								} else {
									//链接时文本，需要跳转才能得到真实链接
									// HEAD 请求会变成 error ..?
									GM_xmlhttpRequest({
										method: 'GET',
										url: ele.href,
										headers: {
											Host: "jump2.bdimg.com",
										},
										onload: function(response) {
											if (response.finalUrl.indexOf('http') === 0) {
												$ele.attr('href', response.finalUrl);
												console.log("jump2.bdimg.com:" + response.finalUrl)
											}
										}
									});
								}
							});
						}
						/*_proc: function (floorType, args) {
                        var $floor = $(args._main);
                        $floor.find('a[href*="jump.bdimg.com/safecheck"]').each(function (i, ele) {
                            var $ele = $(ele),
                                $url = $ele.text();
            
                            if ($url.indexOf('@') === 0) {
                                // Do nothing.
                            } else if (/^https?:\/\//.test($url)) {
                                $ele.attr('href', $url);
                            } else {
                                // HEAD 请求会变成 error ..?
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: ele.href,
                                    headers: {
                                        // 去你的百度
                                        Referer: 'http://tieba.baidu.com/p/123456789',
                                        Range: 'bytes=0-0'
                                    },
                                    onload: function (response) {
                                        if (response.finalUrl.indexOf('http') === 0) {
                                            $ele.attr('href', response.finalUrl);
                                        }
                                    }
                                });
                            }
                        });
                    }*/
				},
				/*"rmImgFav": {
				    name: '移除图片的收藏工具栏（已失效）',
				    desc: '鼠标悬浮图片时出现的工具栏。',
				    flag: 0,
				    _init: function() {
				        $('.fav-wrapper').remove();
				    }
				},*/
				"save_face": {
					name: '隐藏挽尊卡背景图片',
					desc: '隐藏挽尊卡背景图片',
					flag: __type_floor,
					def: true,
					_init: function() {
						/*
						标题: 出一个使用挽尊卡的教程吧
						链接：http://tieba.baidu.com/p/5889895156
						*/
						//console.log("555555555555555555")
						//_css.append('.save_lz_face::before{content:attr(who) " 使用了挽尊卡"}');
						//console.log($('.save_face_post'));
						let temp = $('.save_face_post');
						//temp.before("隐藏挽尊卡图片");
						//console.log(temp.length)
						for (let i = 0; i < temp.length; i++) {
							//console.log(temp[i].style[0])
							//console.log(temp[i].children);
							temp[i].style = "background:none;margin-left:0px;color:rgba(204, 204, 204, 0.8) !important;";
							temp[i].children[3].style = "display:none;";
							temp[i].children[0].style = "top:unset;text-align:unset;font-weight:unset;";
							temp[i].children[1].style = "top:unset;text-align:unset;font-weight:unset;";
							temp[i].children[2].style = "top:unset;text-align:unset;font-weight:unset;";
							temp[i].children[0].children[0].style = "color:rgba(204, 204, 204, 0.8) !important;";
							temp[i].children[2].children[0].style = "color:rgba(204, 204, 204, 0.8) !important;";
							//temp[i].children[2].children[1].style = "color:rgba(204, 204, 204, 0.3) !important;";
						}
						//temp.remove();
					},
					_proc: function(floorType, args) { //chrome测试无效
						try {
							//jquery中判断选择器，找没找到元素用$().size()==0
							if ($('.save_face_post', args._main).size()) {
								// 发现挽尊卡
								$('<div>').addClass('floor-stripe save_lz_face')
									.attr('who', $('.p_author_name', args._main).text())
									.insertBefore(args._main);
								args._main.addClass('savedFace').hide();
							}
						} catch (error) {
							console.log("$('.save_face_post', args._main).size():" + error);
						}

					}
				},
				"rmSaveFace": {
					name: '隐藏挽尊卡会员提示',
					desc: '隐藏会员发帖的使用挽尊卡提示。',
					flag: 0,
					_init: function() {
						_hide('.save_face_bg');
					}
				},
				"rm_img_view1": {
					name: '看图模式屏蔽',
					desc: '还原为旧版贴吧点图看大图功能',
					flag: __type_floor,
					def: false,
					rmImg: function($root) {
						$('img.BDE_Image', $root).each(function() {
							var m = this.src.match(/\/sign=[a-z0-9]+\/(.+)/i);
							if (!m) return;
							var imgLink = '//imgsrc.baidu.com/forum/pic/item/' + m[1];
							$('<a>')
								.attr('href', imgLink)
								.attr('target', '_blank')
								.append($('<img>').attr('src', imgLink).addClass('jx_no_overflow'))
								.insertAfter(this);
							$(this).remove();
						});
					},
					_init: function() { //新旧版贴吧都生效
						tupianfangda = false;
						//console.log("123")
						//_css.append('.jx_no_overflow { max-width: 100%; }');
						//this.rmImg(document);
					},
					_proc: function(floorType, args) { //仅旧版贴吧生效
						tupianfangda = false;
						//console.log("456")
						//this.rmImg(args._main);
					}
				},
				"rm_img_view2": {
					name: '看图模式切换',
					desc: '切换为贴吧点图看大图功能',
					flag: __type_floor,
					def: false,
					rmImg: function($root) {
						$('img.BDE_Image', $root).each(function() {
							var m = this.src.match(/\/sign=[a-z0-9]+\/(.+)/i);
							if (!m) return;
							var imgLink = '//imgsrc.baidu.com/forum/pic/item/' + m[1];
							$('<a>')
								.attr('href', imgLink)
								.attr('target', '_blank')
								.append($('<img>').attr('src', imgLink).addClass('jx_no_overflow'))
								.insertAfter(this);
							$(this).remove();
						});
					},
					_init: function() {
						if (tupianfangda == true) {
							_css.append('.jx_no_overflow { max-width: 100%; }');
							this.rmImg(document);
						}

					},
					_proc: function(floorType, args) {
						if (tupianfangda == true) {
							this.rmImg(args._main);

						}
					}
				},
				"lzl_zhankai": {
					name: '贴子内楼中楼自动展开',
					desc: '有些展不开的楼中楼折叠是被贴吧隐藏的回复，手动点开也是空内容',
					flag: __type_floor,
					def: true,
					_init: function() {
						GM_setValue("lzl_zhankai", true);
					},
					_proc: function(floorType, args) {
						GM_setValue("lzl_zhankai", true);
					}
				}
			};

			var _menu = (function() {
				var $template = /* File: main_config.html */
					(function() {
						/*
            <div style="height: 100%; overflow-y: auto">
            <h2>启用的模组</h2>
            <div id="jx_conf_modules">
            {{#modules}}
            <label title="{{desc}}">
            <input type="checkbox" data-module="{{id}}" {{#enable}}checked{{/enable}}/> {{name}}
            </label>{{#config}}[ <a data-config="{{id}}" class="jx_conf ptr">配置</a> ]{{/config}}
            <br />
            {{/modules}}
            </div>
            <br />
            
            <!-- 按钮区 -->
            <div class="text-center">
            <a class="ui_btn ui_btn_m" id="jx_save"><span><em>储存</em></span></a> &nbsp;
            <a class="ui_btn ui_btn_m" id="jx_close"><span><em>放弃</em></span></a>
            </div>
            </div>
            */
					}).extract();

				return _run.bind({}, function() {
					var $view = {
						modules: []
					};
					for (var x in modules) {
						if (modules.hasOwnProperty(x)) {
							var isEnable = lMods.hasOwnProperty(x);
							$view.modules.push({
								id: x,
								name: modules[x].name,
								desc: modules[x].desc,
								enable: isEnable,
								config: isEnable && !!modules[x]._conf
							});
						}
					}
					var $tpl = $(Mustache.render($template, $view)); //有警告

					var $wndConfig = $.dialog.open($tpl, {
						title: '贴吧助手 - 配置窗口 <span style="color:#f00;">(警告！储存后会自动刷新！)</span>',
						height: 200
					});

					$('.jx_conf', $tpl).click(function() {
						var x = $(this).data('config');
						if (lMods.hasOwnProperty(x)) {
							_run(lMods[x]._conf.bind(lMods[x]), '模组配置 [' + lMods[x].name + ' (' + x + ')]');
						}
					});

					$('#jx_save', $tpl).click(function() {
						var newStatus = {};
						$('#jx_conf_modules>label>input', $tpl).each(function(i, inp) {
							newStatus[$(inp).data('module')] = inp.checked ? __mod_enable : __mod_disable;
						});
						$conf.set('modules', newStatus);
						$wndConfig.close();
						window.location.reload();
					});
					$('#jx_close', $tpl).click($wndConfig.close.bind($wndConfig));
				}, '助手设定界面');
			})();

			// 未登录用户可以通过 GM 菜单激活配置项
			GM_registerMenuCommand('助手设置', _menu);

			if (unsafeWindow.__YUME_DEBUG__) {
				GM_registerMenuCommand('打印模组配置', function() {
					console.info('助手设置: ');
					console.info($conf.get('modules'));
				});
			}

			_run(function() {
				var _callMenu = function($parent) {
					console.info('成功捕捉到菜单元素，传递至回调…');
					_run(function() {
						var $menuItem = $('<li>'),
							$menuLink = $('<a>').appendTo($menuItem).addClass('jx').text('助手设置');
						//$parent.find('.u_tb_profile').before($menuItem);
						$parent.find('.u_tb_profile').parent().prepend($menuItem);
						$menuLink.click(_menu);
						var $menuItem2 = $('<li>'),
							$menuLink2 = $('<a>').appendTo($menuItem2).addClass('jx meihua').text(GM_getValue("tiebameihua") ? '开启美化' : '关闭美化'); //'贴吧美化'
						$('.u_tb_profile').before($menuItem2);
						if (!GM_getValue("tiebameihua")) {
							var lis = $parent.find("ul>li");
							//console.log(lis);//在 http://tieba.baidu.com/i/i/replyme 中不生效
							lis[1].style.display = lis[2].style.display = lis[7].style.display = "none"; //取消屏蔽服务中心 = lis[6].style.display
						}
						$menuLink2.click(function() {
							GM_setValue("tiebameihua", GM_getValue("tiebameihua") ? false : true);
							location.reload();
						});
					}, '菜单召唤');
				};

				var ma = new MutationObserver(function($q) {
					try {
						$($q).each(function(i, $eve) {
							$($eve.addedNodes).each(function(i, $ele) {
								if ($ele.nodeType != 3 && $ele.className == 'u_ddl') {
									throw {
										ele: $($ele),
										name: 's'
									};
								}
							});
						});
					} catch (err) {
						if (err.ele) {
							ma.disconnect();

							_callMenu(err.ele);
							return;
						}

						throw err;
					}
				});

				setTimeout(function() {
					var _m = $('.u_setting>.u_ddl');
					if (_m.length) {
						_callMenu(_m);
					} else {
						try {
							ma.observe($('.u_setting')[0], {
								childList: true,
								subtree: true
							});
						} catch (error) {}
					}
				}, 1500);
			}, '捕捉设定');
			// console.log ($('li.u_setting .u_tb_profile'));

			var lMods = {};

			_run(function() {
				_css = $('<style>').appendTo(document.head);
				_css.append( /* File: tieba.css */
					(function() {
						/*
            .pull-right	{ float: right			}
            a.jx, .ptr	{ cursor: pointer		}
            .pad-left	{ padding-left: 0.5em	}
            
            .floor-stripe {
            background-image:
            linear-gradient(45deg,rgba(255,255,255,.15) 25%,
            transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,
            rgba(255,255,255,0.15) 75%,
            transparent 75%, transparent);
            
            background-color: #d9534f;
            background-size: 40px 40px;
            text-align: center;
            border: 1px solid #ccc;
            margin: -1px;color: #fff;
            text-shadow: #000 0 0 .5em;
            padding: .5em 0
            }
            
            .hide { display: none }
            .text-red { color: red }
            .text-center { text-align: center }
            .text-disabled { color: #666; text-decoration: line-through }
            
            .user-hide-post-action > a.jx-post-action {
            display: block;
            padding: 3px 5px 5px;
            cursor: pointer;
            color: #222;
            }
            
            .user-hide-post-action a.jx-post-action:hover {
            background: #f2f2f2;
            }
            
            .jx_autoflow {
            height: 100%;
            overflow-y: auto;
            }
            */
					}).extract());
				_cssH.insertAfter(_css);

				// 配置项更新
				switch ($conf.get('confVer', [0])[0]) {
					case 0:
						var $disabledMods = $conf.get('modules', []);
						var $modsList = {};
						$disabledMods.forEach(function(e) {
							$modsList[e] = __mod_disable;
						});
						$conf.set('modules', $modsList);
						break;

				}
				$conf.set('confVer', [1]);

				var $mods = $conf.get('modules', {});

				$.each(modules, function(mId, fMod) {
					if ($mods[mId] == __mod_disable ||
						(($mods[mId] == __mod_default || !$mods.hasOwnProperty(mId)) &&
							fMod.def === false
						)
					) return;

					lMods[mId] = fMod;
					lMods[mId].id = mId;
					if (lMods[mId]._init) {
						console.info('初始化模组: %s[%s]', mId, lMods[mId].name);
						lMods[mId]._init.call(lMods[mId]); //有警告
					}

				});
			}, 'Init. modules');

			var _event = function(floorType, otherInfo, _proc) {
				var fooCB = _proc || '_proc';
				$.each(lMods, function(mId, m) {
					if (!m[fooCB] || !(m.flag & floorType)) {
						return;
					}
					_run(m[fooCB].bind(m, floorType, otherInfo), m.name);
				});
			};

			//旧贴吧的贴子样式
			var _procLzlContainer = function(i, tailer) {
				var $tailer = $(tailer),
					_main = $tailer.parents('.l_post');

				//console.log($tailer, _main);

				_event(__type_floor, {
					_main: _main,
					floor: _main,
					// 「'」is not standard, convert to 「"」 first.
					floorNum: parseInt($tailer.getField().floor_num),
					tail: $('.p_tail', _main)
				});

				// 处理解析 lzl 帖子（…
				// $tailer.find('.lzl_single_post').each(_procLzlPost);
				return _main;
			};

			//新贴吧的贴子样式
			var _procLzlContainer2 = function(i, tailer) {
				var $tailer = $(tailer).parents('.j_lzl_container'),
					_main = $tailer.parents('.l_post');

				//console.log($tailer, _main);

				_event(__type_floor, {
					_main: _main,
					floor: _main,
					// 「'」is not standard, convert to 「"」 first.
					floorNum: parseInt($tailer.getField().floor_num),
					tail: $('.p_tail', _main)
				});

				// 处理解析 lzl 帖子（…
				// $tailer.find('.lzl_single_post').each(_procLzlPost);
				return _main;
			};

			var _procThreadList = function(i, threadlist) {
				var $thread = $(threadlist);
				_event(__type_forum, {
					_main: $thread,
					thread: $thread
				});
				return $thread;
			};

			var _procLzlPost = function(i, lzlPost) {
				var $lzl = $(lzlPost);
				_event(__type_lzl, {
					_main: $lzl,
					lzl: $lzl
				});
				return $lzl;
			};

			if (isThread) {
				//$('.j_lzl_container').each(_run.bind ({}, _procLzlContainer, '初始化帖子搜索'));//出错了
				$('.lzl_single_post').each(_run.bind({}, _procLzlPost, '初始化楼中楼搜索'));
			} else {
				$('.j_thread_list').each(_run.bind({}, _procThreadList, '初始化贴吧页帖子搜索'));
			}
			var mo = new MutationObserver(function(eve) {
				_run(function() {
					//console.log("1")
					//console.log(eve)
					$(eve).each(function(i, eve) {
						//console.log("2")

						if (!eve.addedNodes.length) return;
						//console.log("3")

						$(eve.addedNodes).each(function(i, ele) {
							// Text node.
							//console.log("3")

							if (ele.nodeType == 3) return;
							//console.log("4")

							var $ele = $(ele),
								_type = 0,
								$tmp;
							//console.log("5")

							// 单贴处理
							//console.log($ele)
							//贴子内一楼内容太长会导致不触发动作
							//j_lzl_c_b_a 
							if ($ele.hasClass('j_lzl_c_b_a')) {
								//console.log("6")
								// _type = __type_floor;
								$tmp = _procLzlContainer2(i, $ele);
								$tmp.find('.lzl_single_post').each(_procLzlPost);
							} else if ($ele.hasClass('j_lzl_container')) {
								//console.log("7")
								// _type = __type_floor;
								$tmp = _procLzlContainer(i, $ele);
								$tmp.find('.lzl_single_post').each(_procLzlPost);
							} else if ($ele.hasClass('j_thread_list')) {
								// 贴吧主页面
								_procThreadList(i, $ele);
							} else if ($ele.hasClass('lzl_single_post')) {
								// 仅限翻页时触发
								_procLzlPost(i, $ele);
							} else if ($ele.hasClass('user-hide-post-action') && !$ele.hasClass('jx_post')) {
								$ele.addClass('jx_post');
								_event(__type_postact, {
									_main: $ele.parents('.l_post'),
									_menu: $ele
								}, '_menu');
							}
						});
					});
				}, '页面元素插入');
			});

			$(document.body).on('click', '.jx', function(eve) {
				var $eve = $(eve.target);
				var $data = $eve.data('jx');
				if (!$data || !lMods[$data] || !lMods[$data]._click) return;

				_run.call(lMods[$data], lMods[$data]._click, '>> 单击助手功能: ' + $data, $eve, $eve.data('eve'));
			});
			//https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/observe
			//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
			//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
			try {
                setTimeout(()=>{
                    mo.observe($('#j_p_postlist,#thread_list').get(0), {
					childList: true,
					subtree: true
				});
            },1000)
			} catch (error) {
                //MutationObserver 接口提供了监视对 DOM 树所做更改的能力。它被设计为旧的 Mutation Events 功能的替代品，该功能是 DOM3 Events 规范的一部分。
				console.log("MutationObserver:"+error);
			}
		};
	})();

	//百度贴吧图片点击放大 by lliwhx
	//原版的点击图片进入图片列表看图，有一定概率能看到被隐藏的楼层，该楼层需要有图片，如果有文字也会部分显示出来
	//推荐和这个脚本一起使用https://greasyfork.org/ja/scripts/24204-picviewer-ce
	setTimeout(() => {
		if (tupianfangda == true) {
			(function(window) {
				"use strict";
				//CSS
				var parentElement = document.getElementById("j_p_postlist");
				GM_addStyle(".BDE_Image,.j_user_sign{cursor:alias;}#Tie_enlargeImage_parentDIV{position:fixed;z-index:1005;top:0;left:0;}.Tie_enlargeImage{position:absolute;box-shadow:1px 1px 10px #000;cursor:move;}.Tie_enlargeImage:hover{z-index:1006;}#Tie_setValue_DIV{position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;background:rgba(0,0,0,0.5);}.Tie_definedDIV{position:absolute;z-index:10000;background:#fff;top:50%;left:50%;transform:translate(-50%,-50%);}.Tie_definedDIV_title{border-bottom:1px solid #f2f2f5;line-height:40px;font-size:15px;font-weight:700;padding:0 0 0 15px;}.Tie_definedDIV_point{padding:20px 40px;}.Tie_definedDIV_groupSubtitle{font-weight:bold;}.Tie_definedDIV_configItem{line-height:30px;margin:0 20px}.Tie_definedDIV_configItem select{margin:0.5em}.Tie_definedDIV_configItem br+label{margin-left:3em}.Tie_definedDIV_configItem input{vertical-align:middle;margin-right:0.5em}#Tie_debugConfig{margin:0.5em}.Tie_debugConfig_icon{position:relative;display:inline-block;top:4px;width:16px;height:16px;background-position:-350px -100px;background-image:url('https://img.t.sinajs.cn/t6/style/images/common/icon.png');background-repeat:no-repeat;}.Tie_bubble_DIV{position:absolute;visibility:hidden;max-width:280px;top:20%}.Tie_definedDIV_configItem label:hover+.Tie_bubble_DIV{visibility:visible}.Tie_bubble_content{position:relative;background:#fff;padding:6px 13px 6px 16px;border:1px solid #ccc;border-radius:3px;}.Tie_bubble_mainTxt{line-height:18px;}.Tie_bubble_bor{position:absolute;overflow:hidden;bottom:-14px;line-height:14px;}.Tie_bubble_line{border-color:#ccc transparent transparent transparent;}.Tie_bubble_br{margin:-1px 0 0 -14px;border-color:#fff transparent transparent transparent;}.Tie_bubble_bor i,.Tie_bubble_bor em{display:inline-block;width:0;height:0;border-width:7px;border-style:solid;vertical-align:top;overflow:hidden;}.Tie_definedDIV_SaveBtn{background-color:#f2f2f5;text-align:center;padding:10px 0;}.Tie_SaveBtn_a{background:#ff8140;color:#fff;font-size:15px;display:inline-block;padding:0 15px;line-height:35px;border-radius:3px;}.Tie_SaveBtn_a:hover{background:#f7671d}");
				//数据缓存
				var imageTarget, imageMouse, imageCount, imageButton, winResize, scriptDebug, log = function() {},
					mouseWheel = /Firefox/.test(navigator.userAgent) ? "DOMMouseScroll" : "mousewheel",
					protocol = window.location.protocol || "https",
					doc = window.document,
					docHeight = doc.documentElement.clientHeight - 6,
					docWidth = doc.documentElement.clientWidth - 6,
					definedEvent = GM_getValue("definedEvent", "click,click,1,0,1").split(","),
					repairDefinedEvent = GM_getValue("repairDefinedEvent", false),
					imageEvent = {
						init: function(e) { //主事件
							var target = e.target,
								image, imageSrc;
							if (e.button === 0 && (target.className === "BDE_Image" || target.className === "j_user_sign")) {
								log("图片创建", "开始");
								imageSrc = target.src.split("?")[0] //直接清理图片链接?后面的参数
								imageSrc = imageSrc.match(/([a-z0-9]+\.[a-zA-Z]{3,4})(?:\?v=tbs)?$/); //正则表达式获取部分字符串
								//console.log(target.src)
								log("图片地址获取", function() {
									if (imageSrc) return "成功";
									else return "失败";
								}, target.src);
								if (!imageSrc) return false;
								image = doc.createElement("img");
								image.classList.add("Tie_enlargeImage");
								//作者已经出了新版，但还没移过来。。。
								//修复代码来自 https://greasyfork.org/zh-CN/forum/discussion/68104/%E5%9B%BE%E7%89%87%E7%82%B9%E5%87%BB%E6%94%BE%E5%A4%A7%E5%8A%9F%E8%83%BD%E5%A4%B1%E6%95%88-%E7%82%B9%E5%BC%80%E6%98%BE%E7%A4%BA%E6%9F%A5%E7%9C%8B%E7%9A%84%E5%9B%BE%E7%89%87%E4%B8%8D%E5%AD%98%E5%9C%A8 图片点击放大功能失效，点开显示查看的图片不存在
								//贴吧的链接现在基本都是https了
								image.src = protocol + "//tiebapic.baidu.com/forum/pic/item/" + imageSrc[1];
								image.onerror = function() {
									this.src = "https://imgsrc.baidu.com/forum/pic/item/" + imageSrc[1];
									this.onerror = function() {
										this.onerror = null;
										this.onload = null;
										imageSrc = null;
										log("图片请求", "失败");
										alert("图片获取失败\n\n如多次获取失败\n请在设置里勾选“调试脚本”打印脚本日志并截图反馈给作者，以便更好的解决问题");
									};
								};
								image.onload = function() {
									log("图片创建", "进行中");
									var target = this,
										width = target.width,
										height = target.height,
										Wboolean = width > docWidth,
										Hboolean = height > docHeight,
										X = 6,
										Y = 6;
									target.onerror = null;
									target.onload = null;
									imageSrc = null;
									if (Hboolean && !Wboolean) X = (docWidth - width) / 2;
									else if (!Hboolean && !Wboolean) {
										X = (docWidth - width) / 2;
										Y = (docHeight - height) / 2;
									} else if (!Hboolean && Wboolean) Y = (docHeight - height) / 2;
									target.imageData = {
										width: width,
										height: height,
										X: X,
										Y: Y
									}; //缓存当前图片数据
									target.style.transform = "translate(" + X + "px," + Y + "px)";
									parentDIV.appendChild(target);
									log("图片创建", function() {
										target.id = Date.now();
										if (doc.getElementById(target.id)) return "成功";
										else return "失败";
									}, target.imageData);
								};
								image = null;
							}
						},
						StopPropagation: function(e) {
							if (e.button === 0 && e.target.className === "BDE_Image") {
								e.stopPropagation(); //阻止冒泡，阻止图片原事件
								log("阻止贴吧图片原事件", "已执行");
							}
						},
						Down: function(e) {
							var target = e.target,
								imageData = target.imageData;
							imageTarget = target;
							log("鼠标down事件", function() {
								if (!target.id) target.id = Date.now();
								return "开始";
							});
							if (e.button !== 0) return false;
							e.preventDefault();
							e.stopPropagation();
							imageMouse = [e.clientX, e.clientY];
							imageCount = [imageData.X - imageMouse[0], imageData.Y - imageMouse[1], 6 - imageData.width, 6 - imageData.height]; //图片宽高的偏移量，图片左右边界预留量
							imageButton = true;
							doc.addEventListener("mousemove", imageEvent.Move);
							doc.addEventListener("mouseup", imageEvent.Up);
							log("鼠标down事件", "结束");
						},
						Move: function(e) {
							log("鼠标move事件", "开始");
							var target = imageTarget,
								X = e.clientX + imageCount[0],
								Y = e.clientY + imageCount[1];
							imageButton = false;
							log("鼠标move事件", "进行中", "X:" + X + "Y:" + Y);
							if (X < imageCount[2]) { //左边界
								target.style.transform = "translate(" + imageCount[2] + "px," + Y + "px)";
								return false;
							}
							if (X > docWidth) { //右边界
								target.style.transform = "translate(" + docWidth + "px," + Y + "px)";
								return false;
							}
							if (Y < imageCount[3]) { //上边界
								target.style.transform = "translate(" + X + "px," + imageCount[3] + "px)";
								return false;
							}
							if (Y > docHeight) { //下边界
								target.style.transform = "translate(" + X + "px," + docHeight + "px)";
								return false;
							}
							target.style.transform = "translate(" + X + "px," + Y + "px)";
							log("鼠标move事件", "结束", target.style.transform);
						},
						Up: function(e) {
							log("鼠标up事件", "开始");
							var target = imageTarget,
								RegEx;
							if (repairDefinedEvent && e.clientX - imageMouse[0] <= 1 && e.clientY - imageMouse[1] <= 1) { //尝试修复关闭图片功能
								log("尝试修复关闭图片功能", "已执行");
								imageButton = true;
							} else if ( /*scriptDebug && */ !imageButton && e.clientX - imageMouse[0] === 0 && e.clientY - imageMouse[1] === 0) {
								log("鼠标click事件判断", "\n一.操作时页面不在激活状态。请保证浏览器正在被操作，在执行一次\n二.关闭图片功能可能损坏，建议修复");
								imageButton = true; //不知道能不能解决偶尔关不掉大图片的bug
							}
							if (!imageButton) {
								RegEx = target.style.transform.match(/[-0-9.]+/g);
								target.imageData.X = parseFloat(RegEx[0]);
								target.imageData.Y = parseFloat(RegEx[1]);
							}
							imageTarget = null;
							imageMouse = null;
							imageCount = null;
							doc.removeEventListener("mousemove", imageEvent.Move);
							doc.removeEventListener("mouseup", imageEvent.Up);
							log("鼠标up事件", "结束", imageButton);
						},
						Close: function(e) {
							log("鼠标click事件", "开始");
							var target = e.target;
							if (imageButton) {
								imageButton = null;
								delete target.imageData;
								parentDIV.removeChild(target);
								log("鼠标click事件", function() {
									if (!doc.getElementById(target.id)) return "成功";
									else return "失败";
								});
							}
						},
						Wheel: function(e) {
							var target = e.target,
								imageData = target.imageData,
								wheelKey = definedEvent[3],
								width = imageData.width,
								height = imageData.height,
								Wboolean = width > docWidth,
								Hboolean = height > docHeight,
								wheelXY;
							log("鼠标wheel事件", "开始", imageData);
							e.preventDefault();
							e.stopPropagation();
							if (wheelKey !== "0") {
								if ((e.ctrlKey && wheelKey === "1") || (e.altKey && wheelKey === "2") || (e.shiftKey && wheelKey === "3")) { //判断图片缩放的组合键
									log("鼠标wheel缩放事件", "开始");
									var eX = e.clientX,
										eY = e.clientY,
										ratioX = (eX - imageData.X) / width,
										ratioY = (eY - imageData.Y) / height,
										wheelRatio = width + (e.wheelDelta || -e.detail * 40) * definedEvent[4];
									imageData.width = wheelRatio < 150 ? 150 : wheelRatio;
									imageData.height = imageData.width * height / width;
									imageData.X = eX - (imageData.width * ratioX);
									imageData.Y = eY - (imageData.height * ratioY);
									log("鼠标wheel缩放事件", "进行中", imageData);
									target.width = imageData.width;
									target.style.transform = "translate(" + imageData.X + "px," + imageData.Y + "px)"; //基于鼠标位置的缩放
									log("鼠标wheel缩放事件", "结束", target.style.transform);
									return false;
								}
							}
							if (!Hboolean && !Wboolean) {
								log("鼠标wheel滚动事件", "图片小于窗口");
								return false;
							}
							if (Hboolean) {
								wheelXY = imageData.Y + (-e.wheelDelta || e.detail * 40) * definedEvent[2];
								if (wheelXY > 0 || wheelXY < docHeight - height) {
									wheelXY = wheelXY > 0 ? 6 : docHeight - height;
								}
								imageData.Y = wheelXY;
								log("鼠标wheel垂直滚动事件", "进行中", wheelXY);
								target.style.transform = "translate(" + imageData.X + "px," + wheelXY + "px)";
								log("鼠标wheel垂直滚动事件", "结束", target.style.transform);
							} else if (Wboolean) {
								wheelXY = imageData.X + (-e.wheelDelta || e.detail * 40) * definedEvent[2];
								if (wheelXY > 0 || wheelXY < docWidth - width) {
									wheelXY = wheelXY > 0 ? 6 : docWidth - width;
								}
								imageData.X = wheelXY;
								log("鼠标wheel水平滚动事件", "进行中", wheelXY);
								target.style.transform = "translate(" + wheelXY + "px," + imageData.Y + "px)";
								log("鼠标wheel水平滚动事件", "结束", target.style.transform);
							}
						}
					};
				//图片放大设置
				var userEvent = {
					init: function() {
						this.create();
						this.Event();
					},
					create: function() {
						var definedDIV = doc.createElement("div"); //创建自定义DIV框架
						definedDIV.id = "Tie_setValue_DIV";
						definedDIV.innerHTML = "<div class='Tie_definedDIV'><div class='Tie_definedDIV_title'>图片放大设置</div><div><div class='Tie_definedDIV_point'><div class='Tie_definedDIV_groupSubtitle'>请保证鼠标在图片上进行操作(仅支持贴子内的楼层图片！)</div><div class='Tie_definedDIV_configItem'>默认支持鼠标左键拖拽图片，修改配置后刷新一下</div><div class='Tie_definedDIV_configItem'>查看图片<select name='Tie_setValue'><option value='click'>单击</option><option value='dblclick'>双击</option></select></div><div class='Tie_definedDIV_configItem'>关闭图片<select name='Tie_setValue'><option value='click'>单击</option><option value='dblclick'>双击</option></select>若条件允许，推荐选择双击以兼容鼠标移动图片<br><label><input id='Tie_repairValue' type='checkbox'>尝试修复关闭图片功能</label></div><div class='Tie_definedDIV_configItem'>滚动图片<select name='Tie_setValue'><option value='1'>滚轮向上，上移/左移</option><option value='-1'>滚轮向下，上移/左移</option></select></div><div class='Tie_definedDIV_configItem'>缩放图片<select name='Tie_setValue'><option value='0'>关闭</option><option value='1'>Ctrl</option><option value='2'>Alt</option><option value='3'>Shift</option></select>+<select name='Tie_setValue'><option value='1'>滚轮向上放大</option><option value='-1'>滚轮向下放大</option></select></div><div class='Tie_definedDIV_configItem'>调试脚本<label><input id='Tie_debugConfig' type='checkbox'><i class='Tie_debugConfig_icon'></i></label><div class='Tie_bubble_DIV'><div class='Tie_bubble_content'><div class='Tie_bubble_mainTxt'>如果您的脚本出现问题，您可以打开调试功能。<strong>在页面进行平常的图片操作，将操作过后在浏览器控制台（快捷键：F12）输出的脚本日志截图反馈给作者</strong>，以便更好的解决问题。<br>注意，<strong>调试功能打开即生效。并且只在当前页面生效一次，刷新或关闭页面都会取消调试功能，需重新打开</strong>。<br>打开调试功能可能会增加内存占用、降低网页的反应速度甚至导致浏览卡顿。仅供维护使用，不建议一般用户打开调试功能。</div><div><span class='Tie_bubble_bor'><i class='Tie_bubble_line'></i><em class='Tie_bubble_br'></em></span></div></div></div></div></div></div><div class='Tie_definedDIV_SaveBtn'><a id='Tie_setValue_a' class='Tie_SaveBtn_a' href='javascript:void(0);'><span>确定</span></a></div></div>";
						doc.body.appendChild(definedDIV);
						definedDIV = null;
					},
					Event: function() {
						var definedDIV = doc.getElementById("Tie_setValue_DIV"),
							repairValue = doc.getElementById("Tie_repairValue"),
							debugConfig = doc.getElementById("Tie_debugConfig"),
							parentElement = doc.getElementById("j_p_postlist"),
							setValue = doc.getElementsByName("Tie_setValue"),
							oldDefinedEvent = definedEvent; //备份旧设置
						for (var i = 0; i < 5; i++) {
							setValue[i].value = oldDefinedEvent[i];
						}
						if (setValue[3].value === "0") setValue[4].style.visibility = "hidden";
						setValue[3].onchange = function() {
							setValue[4].style.visibility = this.value === "0" ? "hidden" : "visible";
						};
						repairValue.checked = repairDefinedEvent;
						debugConfig.checked = scriptDebug;
						doc.getElementById("Tie_setValue_a").onclick = function() {
							definedEvent = [setValue[0].value, setValue[1].value, setValue[2].value, setValue[3].value, setValue[4].value];
							repairDefinedEvent = repairValue.checked;
							scriptDebug = debugConfig.checked;
							if (oldDefinedEvent[0] !== definedEvent[0]) {
								if (!parentElement) {} else {
									parentElement.removeEventListener(oldDefinedEvent[0], imageEvent.init, true);
									parentElement.addEventListener(definedEvent[0], imageEvent.init, true);
								}
							}
							if (oldDefinedEvent[1] !== definedEvent[1]) {
								if (!parentElement) {} else {
									parentDIV.removeEventListener(oldDefinedEvent[1], imageEvent.Close);
									parentDIV.addEventListener(definedEvent[1], imageEvent.Close);
								}
							}
							log = scriptDebug && function(text, types, data) { //脚本调试，日志
								if (typeof types === "function") {
									types = types();
								}
								if (data === undefined) console.log(text, types);
								else console.log(text, types, data);
							} || function() {};
							log("图片放大设置", "已执行", definedEvent + "," + repairDefinedEvent);
							this.onclick = null;
							setValue[3].onchange = null;
							doc.body.removeChild(definedDIV);
							GM_setValue("definedEvent", definedEvent.toString());
							GM_setValue("repairDefinedEvent", repairDefinedEvent);
							definedDIV = null;
							repairValue = null;
							debugConfig = null;
							parentElement = null;
							setValue = null;
							oldDefinedEvent = null;
						};
					}
				};
				GM_registerMenuCommand("图片放大设置", function() {
					if (!doc.getElementById("Tie_setValue_DIV")) {
						userEvent.init();
					}
				});
				if (!parentElement) {
					return;
				}
				//创建父DIV
				var parentDIV = doc.createElement("div");
				parentDIV.id = "Tie_enlargeImage_parentDIV";
				doc.body.appendChild(parentDIV);
				//事件委托
				parentElement.addEventListener("click", imageEvent.StopPropagation, true);
				parentElement.addEventListener(definedEvent[0], imageEvent.init, true);
				parentDIV.addEventListener("mousedown", imageEvent.Down);
				parentDIV.addEventListener(definedEvent[1], imageEvent.Close);
				parentDIV.addEventListener(mouseWheel, imageEvent.Wheel);
				//释放缓存
				parentElement = null;

				if (!GM_getValue("definedEvent")) {
					userEvent.init();
				}
				window.addEventListener("resize", function() {
					if (typeof winResize !== undefined) {
						clearTimeout(winResize);
					}
					winResize = setTimeout(function() {
						docHeight = doc.documentElement.clientHeight - 6;
						docWidth = doc.documentElement.clientWidth - 6;
					}, 334);
				});
			})(window);
		}
	}, 2000);

	/*(function () { //强制转换部分跳转链接
	    var locationHref = location.href;
    
	    function decode(url, target) {
	        GM_xmlhttpRequest({
	            method: 'HEAD',
	            url: url,
	            headers: {
	                "Referer": locationHref,
	            },
	            onload: function (response) {
	                var newUrl = response.finalUrl;
	                //console.log(newUrl);
	                target.setAttribute('href', newUrl);
	            }
	        });
	    }
    
	    function run() {
	        var urls = document.querySelectorAll('a[href^="http://jump.bdimg.com/safecheck"]');
	        for (var i = 0; i < urls.length; i++) {
	            if (urls[i].parentNode.className == "apc_src_wrapper") {
	                decode(urls[i], urls[i]);
	            } else {
	                var url = urls[i].childNodes[0].nodeValue;
	                if (url.indexOf("http") < 0) {
	                    url = "http://" + url;
	                }
	                console.log(url);
	                urls[i].setAttribute("href", url);
	            }
	        }
	    }
    
	    function addMutationObserver(selector, callback) {
	        var watch = document.querySelector(selector);
	        if (!watch) return;
    
	        var observer = new MutationObserver(function (mutations) {
	            var nodeAdded = mutations.some(function (x) {
	                return x.addedNodes.length > 0;
	            });
	            if (nodeAdded) {
	                // observer.disconnect();
	                callback();
	            }
	        });
	        observer.observe(watch, {
	            childList: true,
	            subtree: true
	        });
	    }
	    run();
	    addMutationObserver('#j_p_postlist', run);
	})();*/

	//查看发帖 by 文科 2022-1-16 这个失效了，现在强制跳转到https://tieba.baidu.com/index.html
	/*window.addEventListener('DOMContentLoaded', function () {
	    var $ = unsafeWindow.$;
    
	    function getUserHistory(e) {
	        var userName = (JSON.parse(e.target.getAttribute('data'))).un;
	        var barName = "";
	        if ("全贴吧发言记录" != e.target.textContent) {
	            barName = prompt('输入贴吧名', $("#wd1").attr("value"));
	            if (!barName) return;
	        }
	        if (barName == null) barName = "";
	        window.open("http://tieba.baidu.com/f/search/ures?ie=utf-8&kw=" + encodeURIComponent(barName) + "&qw=&rn=100&un=" + encodeURIComponent(userName) + "&sm=1", "_blank");
	    }
	    (function addBtn() {
	        $('.d_author .p_author').each(function () {
	            var data = this.querySelector('.p_author_name').getAttribute('data-field');
	            $(this).append('<li class="user_post_li" style="margin-top:4px"><a style="cursor: pointer;color:#FF6600;" data=' + data + '>全贴吧发言记录</a></li>')
	            $(this).append('<li class="user_post_li" style="margin-top:4px"><a style="cursor: pointer;color:#FF6600;" data=' + data + '>某贴吧发言记录</a></li>')
	            this.querySelectorAll('.user_post_li a')[0].addEventListener('click', getUserHistory)
	            this.querySelectorAll('.user_post_li a')[1].addEventListener('click', getUserHistory)
	        });
	    })();
	}, false);*/

	//百度贴吧排序
	//百度贴吧按发帖时间（帖子ID）排序 by NULL
	//关于回复量的排序 https://greasyfork.org/zh-CN/scripts/33145-%E8%B4%B4%E5%90%A7%E5%8A%A9%E6%89%8B-%E5%B1%8F%E8%94%BD-%E6%8E%92%E5%BA%8F-beta
	(function() {
		//不在主题贴列表就不执行
		if (!/^https?:\/\/tieba\.baidu\.com\/f\?.*$/.test(location.href)) return;
		var backupshunxun = new Array() //用来备份贴吧默认的贴子排列顺序，用于回复时间排序
		var yipaixun2 = false;

		const action = (event) => {
			//console.log(event.animationName)
			const {
				target
			} = event;
			const {
				classList
			} = target
			//console.log(target.getAttribute("paixun"))
			if (classList.contains("threadlist_title")) {
				if (yipaixun2 == false && target.getAttribute("paixun") == null) { //使其只可以执行一次
					yipaixun2 = true
					console.log(target)
					backupshunxun = new Array()
					var parentNodex = document.getElementById('thread_list');
					if (parentNodex != null) {
						var threadsx = parentNodex.querySelectorAll('.j_thread_list:not(.thread_top)'); //默认排除置顶贴
						if (GM_getValue("select3") == true) {
							threadsx = parentNodex.querySelectorAll('.j_thread_list'); //默认排除置顶贴
						}
						for (let i = 0; i < threadsx.length; i++) {
							//console.log(threadsx[i]);
							backupshunxun.push(threadsx[i]);
						}
					}
					sortById(GM_getValue("select1"))
					let t = setTimeout(() => {
						yipaixun2 = false
						clearTimeout(t)
						t = null
					}, 3000);
				}
			}
			target.setAttribute('paixun', '1')
		}

		function sortById(yipaixun) {
				var parentNode = document.getElementById('thread_list');
				if (parentNode == null) {
					return;
				}
				var threads = parentNode.querySelectorAll('.j_thread_list:not(.thread_top)');
				//var $lis = $("#thread_list>.j_thread_list:not(.thread_top)");//获取所有排序的li           
				if (GM_getValue("select3") == true) {
					threads = parentNode.querySelectorAll('.j_thread_list');
					//$lis = $("#thread_list>.j_thread_list");//获取所有排序的li
				}
				if (yipaixun == 0) { //发贴时间顺序
					var threadArray = [];
					for (var thread of threads) {
						try {
							threadArray.push({
								id: JSON.parse(thread.getAttribute('data-field')).id,
								thread: thread
							});
							parentNode.removeChild(thread);
						} catch (e) {
							console.log(e);
						}
					}
					threadArray.sort((a, b) => {
						return b.id - a.id;
					});
					console.log("排序后:", threadArray);
					for (var thread2 of threadArray) {
						parentNode.appendChild(thread2.thread);
					}
				} else if (yipaixun == 1) { //发贴时间倒序
					var threadArray = [];
					for (var thread of threads) {
						try {
							threadArray.push({
								id: JSON.parse(thread.getAttribute('data-field')).id,
								thread: thread
							});
							parentNode.removeChild(thread);
						} catch (e) {
							console.log(e);
						}
					}
					threadArray.sort((a, b) => {
						return a.id - b.id;
					});
					console.log("排序后:", threadArray);
					for (var thread2 of threadArray) {
						parentNode.appendChild(thread2.thread);
					}
				} else if (yipaixun == 2) { //回复时间顺序
					for (let thread of threads) {
						try {
							parentNode.removeChild(thread);
						} catch (e) {
							console.log(e);
						}
					}
					console.log("排序后:", backupshunxun);
					for (let i = 0; i < backupshunxun.length; i++) {
						parentNode.appendChild(backupshunxun[i]);
					}
				} else if (yipaixun == 3) { //回复时间倒序
					for (let thread of threads) {
						try {
							parentNode.removeChild(thread);
						} catch (e) {
							console.log(e);
						}
					}
					console.log("排序后:", backupshunxun);
					for (let i = backupshunxun.length - 1; i >= 0; i--) {
						parentNode.appendChild(backupshunxun[i]);
					}
				} else if (yipaixun == 4) { //回复量顺序
					var liArray = []; //用于排序的容器
					for (var thread of threads) {
						try {
							liArray.push({
								count: thread.querySelectorAll("span.threadlist_rep_num.center_text")[0].textContent,
								thread: thread
							});
							//parentNode.removeChild(thread);
						} catch (e) {
							console.log(e);
						}
					}
					/*$lis.each(function (index, item) {
					    var replyCount = $(item).find("span.threadlist_rep_num.center_text").text();
					    liArray.push({ 'count': replyCount, 'li': item });
					    try {
					        parentNode.removeChild(item);
					    } catch (e) {
					        console.log(e);
					    }
					})*/
					liArray.sort(function(a, b) {
						return b.count - a.count;
					})

					console.log("排序后:", liArray);
					for (var thread2 of liArray) {
						parentNode.appendChild(thread2.thread);
					}
					/*$(liArray).each(function (index, item) {
					    parentNode.appendChild(item.li);
					})*/
				} else if (yipaixun == 5) { //回复量倒序
					var liArray = []; //用于排序的容器
					for (var thread of threads) {
						try {
							liArray.push({
								count: thread.querySelectorAll("span.threadlist_rep_num.center_text")[0].textContent,
								thread: thread
							});
							//parentNode.removeChild(thread);
						} catch (e) {
							console.log(e);
						}
					}

					liArray.sort(function(a, b) {
						return a.count - b.count;
					})

					console.log("排序后:", liArray);
					for (var thread2 of liArray) {
						parentNode.appendChild(thread2.thread);
					}
				}
				//排序后 重新绑定懒加载图片
				//console.log($(".thumbnail.vpic_wrap>img"))
				this.$(".thumbnail.vpic_wrap>img").lazyload(); //只有用贴吧自己的jQuery才有lazyload,用this就是使用贴吧的jQuery
				GM_setValue("select1", yipaixun)
			}
			//setInterval(() => {
			//    try {
			//        $("div.search_back_box")[0].classList.remove("search-back-fixed");
			//        $("div.topic_list_box")[0].classList.remove("topic-search-back-fixed");
			//    } catch (error) { /*alert(error);*/ }
			//}, 500);
		setTimeout(() => {
			var parentNodex = document.getElementById('thread_list');
			if (parentNodex != null) {
				var threadsx = parentNodex.querySelectorAll('.j_thread_list:not(.thread_top)'); //默认排除置顶贴
				if (GM_getValue("select3") == true) {
					threadsx = parentNodex.querySelectorAll('.j_thread_list'); //默认排除置顶贴
				}
				for (let i = 0; i < threadsx.length; i++) {
					//console.log(threadsx[i]);
					backupshunxun.push(threadsx[i]);
				}
			}
			let s = ['按发贴时间排序(贴子ID)', '发贴时间倒序', '按回复时间顺序(这是PC端默认)', '按回复时间倒序', '按回复量顺序', '按回复量倒序']
			var a = document.createElement('select')
			a.setAttribute('id', 'select1');
			var option = document.createElement("option")
			option.text = s[0]
			option.setAttribute('value', 0);
			a.appendChild(option)
			for (let i = 1; i < s.length; i++) {
				option = document.createElement("option")
				option.text = s[i]
				if (i == 2) {
					option.setAttribute('selected', 'selected');
				}
				option.setAttribute('value', i);
				a.appendChild(option)
			}
			var b = document.createElement('input')
			b.setAttribute('type', 'checkbox');
			b.setAttribute('id', 'select2');
			var c = document.createElement('p')
			c.textContent = "翻页保持/排序是否包含置顶贴"
			c.setAttribute('style', 'position: absolute;left: 3px;top: 30px;')
			c.appendChild(b)
			var d = document.createElement('input')
			d.setAttribute('type', 'checkbox');
			d.setAttribute('id', 'select3');
			c.appendChild(d)
			var f = document.createElement('div')
			f.setAttribute('style', 'position: absolute;left: 480px;float: right;top: 12px;')
			f.appendChild(a)
			f.appendChild(c)
				//var paixun = false
			a.addEventListener('change', e => {
				//console.log(JSON.stringify(e))//{"isTrusted":true}
				let temp = document.getElementById("select1").value
				console.log(document.getElementById("select1").value)
					//if (yipaixun2 == false) {
					//  yipaixun2 = true;
					//   let i = 0;
					//  if (paixun == false) {
					//     paixun = true
				sortById(temp)
					/*let t = setInterval(() => { //滑动条自动下拉看完网页，以解决排序后图片无法加载的问题
					    if (i <= document.body.scrollHeight) {
					        window.scrollTo(0, i);
					        i += 300;
					    } else {
					        clearInterval(t);
					        paixun = false;
					        sortById(temp);
					        window.scrollTo(0, 0);
					    }
					}, 100);*/
					// }
					//} else {
					//   sortById(temp);
					// }
			}, false)
			b.addEventListener('change', e => {
				if (document.getElementById("select2").checked == true) {
					GM_setValue("select2", true)
				} else {
					GM_setValue("select2", false)
				}
			}, false)
			d.addEventListener('change', e => {
				if (document.getElementById("select3").checked == true) {
					GM_setValue("select3", true)
				} else {
					GM_setValue("select3", false)
				}
			}, false)
			a.addEventListener('dblclick', e => {
				//if (yipaixun2 == true) {
				let temp = document.getElementById("select1").selectedIndex
				console.log("dblclick:" + temp);

				sortById(temp)
					//}
			}, false)
			try {
				let temp=document.getElementsByClassName('card_infoNum')[0]
				if(temp!=undefined)
				{
					temp.parentNode.appendChild(f);
				}
				else
				{
					let temp2=document.getElementsByClassName('app_header_focus_btn')[0]
					temp2.parentNode.appendChild(f);
				}
			} catch (err) {
				console.log("贴子排序按钮添加错误:"+err);
			} finally {
				if (GM_getValue("select2") == true) {
					document.getElementById("select1").selectedIndex = GM_getValue("select1")
					document.getElementById("select2").checked = true
					sortById(GM_getValue("select1"))
				}
				if (GM_getValue("select3") == true) {
					document.getElementById("select3").checked = true
				}
				//用于刷新网页时，阻止动画事件触发导致重复备份贴子列表顺序导致按回复时间排序出错
				[].forEach.call(document.querySelectorAll(".threadlist_title"), node => {
					node.setAttribute('paixun', '1')
				});
				PrefixedEvent(document, "AnimationStart", action); //开始
			}
		}, 3000);
	})();

	(function() {
		let jishu = 0;
		let t = setInterval(() => {
			if (jishu < 60) {
				let i = 0;
				$(".u_tb_profile>a").attr("href", "http://tieba.baidu.com/i/i/profile"); //修复贴吧设置按钮无效bug
				let temp2 = $(".post_bubble_bottom");
				if (temp2.length > 0) {
					for (let i = 0; i < temp2.length; i++) {
						if (temp2[i].style["background-image"] == 'url("//tb1.bdstatic.com/tb/cms/post/bubble/huiyuanai_03.png")') //修复一个楼层背景气泡内部有白线
						{
							temp2[i].style = 'background:url(//tb1.bdstatic.com/tb/cms/post/bubble/huiyuanai_03.png) no-repeat -0px  -4px;height: 111px;'
						}
					}
				}
				if (!GM_getValue("tiebameihua") /*贴吧美化*/ ) {
					//以下为尝试解决右上角的浮动按钮文字超出按钮问题(已彻底解决)
					//u_username_wrap
					//u_news_wrap
					//u_setting_wrap
					/*document.querySelector("a.u_username_wrap").addEventListener("mouseover", () => {
					    console.log("1");
					});*/
					/*let temp = $(".u_ddl_con li a"); //a.j_cleardata,u_notify_item
					if (temp.length > 0) {
					    //console.log(temp);
					    //console.log(temp.length);
					    //console.log(temp[2]);
					    for (i = 0; i < temp.length; i++) {
					        if (temp[i].getAttribute("style") == null) {
					            temp[i].style = "white-space:normal;";
					        }
					    }
					}
					let temp = $("#u_notify_item>li>a"); //a.j_cleardata,u_notify_item
					if (temp.length > 0) {
					    for (i = 0; i < temp.length; i++) {
					        if (temp[i].getAttribute("style") == null) {
					            temp[i].style = "white-space:normal;";
					        }
					    }
					}
					temp = $("ul.sys_notify_last>li>a"); //a.j_cleardata,u_notify_item
					if (temp.length > 0) {
					    for (i = 0; i < temp.length; i++) {
					        if (temp[i].getAttribute("style") == null) {
					            temp[i].style = "white-space:normal;";
					        }
					    }
					}*/
				} else {
					let temp = $(".u_menu_item"); //尝试解决旧版贴吧右上角选项按钮显示偏前
					if (temp.length > 0) {
						//console.log(temp);
						//console.log(temp.length);
						//console.log(temp[2]);
						for (i = 0; i < temp.length; i++) {
							if (temp[i].getAttribute("style") == null) {
								temp[i].style = "padding: 4px 8px 7px;";
							}
						}
					}
				}
				jishu++;
			} else {
				clearInterval(t);
			}
		}, 2000);
		setTimeout(() => {
			//把https链接转到http，因为我的收藏页面并不支持https
			if ($("#u_notify_item").children("li.category_item").children("a.j_cleardata")[5] != null) {
				let temp = $("#u_notify_item").children("li.category_item").children("a.j_cleardata")[5].href.split("https")[1];
				$("#u_notify_item").children("li.category_item").children("a.j_cleardata")[5].href = "http" + temp;
			}
			//let i = 0;
			//let temp = $("span.is_show_create_time"); //显示主题贴列表里的主题贴创建时间。备注：贴吧自带的创建日期，缺失年或日
			//if (temp.length > 0) {
			//    for (i = 0; i < temp.length; i++) {
			//        temp[i].style = "position: relative;display: block;/*top: -20px;right: 10px;*/width:60px;";
			//    }
			//}
			//备忘,还有招募图标显示(已修复)
			if (!GM_getValue("tiebameihua")) { //贴吧美化
				/*   temp = $(".icon-good"); //显示精品贴，精华贴标识
				   if (temp.length > 0) {
				       for (i = 0; i < temp.length; i++) {
				           temp[i].style = "background-color: #FF6666;";
				       }
				   }
				   temp = $(".icon-top"); //显示置顶标识
				   if (temp.length > 0) {
				       for (i = 0; i < temp.length; i++) {
				           temp[i].style = "background:none;background-color: #4285F5;";
				       }
				   }
				   temp = $(".icon-member-top"); //显示会员置顶标识
				   if (temp.length > 0) {
				       for (i = 0; i < temp.length; i++) {
				           temp[i].style = "background:none;background-color: #FFCC26;";
				       }
				   }*/
				//$("ul.tbui_aside_float_bar")[0].style = "margin-left: 92% !important;left:unset;"; //解决右侧工具栏消失bug。不设置也行
				//$("ul.tbui_aside_float_bar")[0].style = "left:50%;margin-left: 498px;"; //解决右侧工具栏消失bug。不设置也行
				try {
					//console.log($(".listEditorCnt"));
					if ($(".listEditorCnt")[0] != null) {
						$(".listEditorCnt").click(() => {
							//console.log("2333");
							let temp1 = $(".qp_interview_insertsmiley")[0]; //主题贴列表的话题贴回复框表情按钮修复
							if (temp1 != null) {
								temp1.style = "background:none !important;";
							}
							let temp2 = $(".j_banned_tip")[0];
							if (temp2 != null) {
								temp2.style = "top:0px;";
							}
						});
					}

				} catch (err) {
					console.log(err);
				}
				try {
					let temp = $(".nav_wrap")[0];
					if (temp != null) {
						let temp2 = temp.parentNode.parentNode.children[0]; //querySelectorAll("div#pagelet_entertainment-game/pagelet/game_head_middle")[0];
						//console.log(temp2.getAttribute('id'));
						if (temp2.getAttribute('id') == "pagelet_entertainment-game/pagelet/game_head_middle") { //某些游戏类贴吧有特殊头图，例如三国杀吧
							temp.style = "background:#eeeff3 !important;" //background-image:-webkit-linear-gradient(top,#eeeff3 0,#eaeef1 100%);"
						}
					}
				} catch (err) {
					console.log(err);
				}
			}
			try {
				/*
            尝试兼容别人的"贴吧黑夜模式"样式https://userstyles.org/styles/124770/tieba-maverick-2018   https://userstyles.org/styles/161224/maverick-demo-styles
            以下推荐用文本编辑器去查找在那里
            tieba-maverick-2018样式还需要修改
            threadlist_bright .threadlist_author {
    float: none !important;
    //display: flex;
    width: 16% !important;
    min-width: 155px;
    padding-right: 20px;
    white-space: nowrap;
    //font-size: 0 !important;
    overflow: visible !important;
    }
    maverick-demo-styles样式还需要修改（这个不用文本编辑器，要在样式脚本管理器里面改）
    --m-href-color: hsl(0, 0%, 95%);
    --m-href-visited: hsl(0, 0%, 60%);
            */
				//$(".meihua")[0].style = "color:#999 !important;font-weight:bold;white-space:normal;"; //贴吧美化开关按钮文字样式
				//$("#frs_list_pager")[0].style = "position: relative;left: 1px; width: 968px;border: 1px solid #e4e6eb;padding: 5px;";
				let temp2 = $(".j_tbnav_tab>a"); //为了兼容这个吧？https://greasyfork.org/ja/scripts/33145-%E8%B4%B4%E5%90%A7%E5%8A%A9%E6%89%8B-%E5%B1%8F%E8%94%BD-%E6%8E%92%E5%BA%8F-beta 贴吧助手(屏蔽，排序) beta
				if (temp2.length > 0) {
					temp2[temp2.length - 1].style = "width: 100px !important;color:#777 !important;";
					temp2[temp2.length - 2].style = "color:#777 !important;";
				}
				if (window.location.href.split("?")[0].split("/")[3] == "f") //如果是在某个贴吧的主题贴列表，就会删掉右边固定悬浮栏的分享按钮
				{
					$('.tbui_fbar_share').remove();
				}
			} catch (err) {
				console.log(err);
			}
		}, 5000);
	})();

	(function() { //参考显示用户名和贴子屏蔽检测脚本 https://greasyfork.org/scripts/31207-%E8%B4%B4%E5%90%A7%E6%98%BE%E7%A4%BA%E7%9C%9F%E5%AE%9Eid https://greasyfork.org/zh-CN/scripts/383981-%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B
		var tiebadongtai = "";
		tiebadongtai = `
        /* 使用 animation 监测 DOM 变化 */
        @-webkit-keyframes __tieba_action__ {}
        @-moz-keyframes __tieba_action__ {}
        @keyframes __tieba_action__ {}
        @keyframes tiebaaction {
            from {
                clip: rect(1px, auto, auto, auto);
            }
            to {
                clip: rect(0px, auto, auto, auto);
            }
        }
        .t_con,/*.threadlist_lz,*/.l_post,/*.pager_theme_4,*/.thread_theme_5,.l_posts_num,.icon-member-top,.u_menu_username,.u_news,.u_setting,.user>.right,#main_aside,.u_login,.p_postlist,.tbui_aside_float_bar,.j_d_post_content>.replace_div,
        .tieba-link-anchor,.imgtopic_album,.icon_interview_picture,.listThreadTitle,.userbar,#j_userhead,#user_info,img.m_pic,div.dialog_block,.video_src_wrap_main,.media_disp,#j_more_hotFeed{
            animation-duration: 0.001 s;
            animation-name: tiebaaction;
        }
        /* 主题贴 */
        .t_con,/*自己的贴子无法触发事件*/
        /*.threadlist_lz,*/
        /* 楼层 */
        .l_post,
        /*贴子内页*/
        /*.pager_theme_4,*/
        .thread_theme_5,
        .l_posts_num,
        /*会员置顶图标*/
        .icon-member-top,
        /*个人主页按钮的头像*/
        .u_menu_username,
        /*消息按钮*/
        .u_news,
        /*设置按钮*/
        .u_setting,
        /*移除粉丝按钮*/
        .user>.right,
        /*删除某些页面会出现的错误头像*/
        .userbar,
        /*右上角包住登陆按钮的大框架*/
        #main_aside,
        /*登陆按钮*/
        .u_login,
        /*贴子内容列表框架*/
        .p_postlist,
        /*侧工具栏*/
        .tbui_aside_float_bar,
        /*展开长图片*/
        .j_d_post_content>.replace_div,
        /*展开楼层气泡中的长图片*/
        .j_d_post_content>.post_bubble_middle>.post_bubble_middle_inner>.replace_div,
        /*复制链接按钮*/
        .tieba-link-anchor,
        /*图片话题贴*/
        .imgtopic_album,
        /*话题贴 图片和文字*/
        /*修复极罕见的我的贴吧和贴吧主页的头像bug*/
        #j_userhead,
        #user_info,
        /*修复我的贴吧-热门动态-图片显示*/
        img.m_pic,
        /*清理标签*/
        div.dialog_block,
        /*让视频贴可以下载视频*/
        .video_src_wrap_main,
        .media_disp,
        .media_box,
        /*个人主页下方的贴子加载按钮*/
        #j_more_hotFeed,
        .icon_interview_picture,.listThreadTitle{
            -webkit-animation: __tieba_action__;
            -moz-animation: __tieba_action__;
            animation: __tieba_action__;
        }
        .zhankaichangtupian{
            height:auto;
        }
        .zhankaichangtupian2{
            display:none;
        }
        .yincangcebianlan{
            width: 2px;
            height: 20px;
            position: fixed;
            right: 0px;
            bottom: 200px;
            padding: 5px;
            z-index: 1005;
            background-color: rgb(0,0,0,0.05);
            border: none;
            color: #999;
        }
        .yincangcebianlan:hover{
            background-color: rgb(0,0,0,0.5);
            width: 30px;
            color: #fff;
        }
        /*解决主题列表回复人名字和发贴人名字不对齐问题，兼容新版、旧版及美化版贴吧*/
        tb_icon_author_rely>a {
            position: absolute;
        }
        /*图片话题*/
        /*进入贴子按钮*/
        .j_enter_pb_wrapper
        {
            min-width: 50px;
        }
        .j_enter_pb_wrapper>a
        {
            position: absolute;
            left: -40px;
        }
        /*主题贴高度框架*/
        .imgtopic_gallery{
            width: auto !important;
            height:200px !important;
        }
        /*滚动长框架*/
        .imgtopic_album{
            width:850px !important;
            height:200px !important;
        }
        /*包裹图片*/
        .imgtopic_gallery>.thread_pic_show{
            width: 200px!important;
            height: 200px !important;
            /*visibility:visible;*/
            /*display:flex !important;*/
            /*overflow:auto !important;*/
        }
        /*图片*/
        .imgtopic_gallery>.thread_pic_show>.threadlist_pic{
            width: -webkit-fill-available !important;
            height: -webkit-fill-available !important;
        }
        /*左右切换图片区域*/
        .j_display_pre,.j_display_next{
            top: 60px !important;
        }
    `;
		if (!GM_getValue("tiebameihua") /*贴吧美化*/ ) {
			//let t = setTimeout(() => {
			//   clearTimeout(t);
			//                if (document.querySelectorAll("#liveIcon")[0].getAttribute("src").search("interview_live_tv_icon.gif") == -1) {
			//                  tiebadongtai += `
			//            #liveIcon{/*各种话题贴图标*/
			//              display: none !important;
			//        }`;
			//      } else {
			//        tiebadongtai += `
			//  #liveIcon{/*各种话题贴图标*/
			//     height: 17px !important;
			// }`;
			// }
			// }, 5000);

			tiebadongtai += `
            #liveIcon{/*各种话题贴图标*/
                margin-top: 2px !important;
                height: 19px !important;
            }
            /*.interview .threadListGroupCnt .listTitleCnt .listThreadTitle a:first-of-type:before{
                content: \'今日话题\';
                background-color: #4285F5;
                height: 20px !important;
                line-height: 20px;
                border-radius: 4px;
                padding: 0 4px;
                vertical-align: top;

                flex: 0 0 auto;
                display: inline-block !important;
                width: auto !important;
                margin-top: 1px;
                margin-right: 2px;
                text-align: center;
                font-size: 12px !important;
                font-style: normal !important;
                color: #fff !important;
            }*/
            .threadlist_btn_play{
                top: 15px !important;/*特殊的今日话题有视频*/
                left: -1px !important;
            }
        /*图片工具栏*/
        .media_pic_control{
            padding-top: 10px !important;
            margin-top: 15px;
        }
    .icon_retract,.icon_ypic,.icon_turnleft,.icon_turnright{
        animation-duration: 0.001 s;
        animation-name: tiebaaction;
    }
    /*图片工具栏_收起，查看大图，向左转，向右转*/
        .icon_retract,.icon_ypic,.icon_turnleft,.icon_turnright{
            -webkit-animation: __tieba_action__;
            -moz-animation: __tieba_action__;
            animation: __tieba_action__;
        }
.threadlist_img>span.tieba-link-anchor{
margin-top: 20px;
            }
            .btn_default{/*主题贴列表点开图片后右下角的按钮*/
                left: -6px !important;
            }
    `;
		} else {
			tiebadongtai += `
            .threadlist_btn_play{
                top: 15px !important;/*特殊的今日话题有视频*/
            }
            .threadlist_img>span.all_num{
                position: absolute;
            }
           /*图片话题贴，点开图片，调整复制链接按钮的位置*/
            .threadlist_img>span.tieba-link-anchor{
                position: absolute;
                left: 670px;
            }
            .btn_default {
                left: -4px !important;
                width: 50px;
            }
            `;
		}
		if (typeof GM_addStyle != "undefined") {
			GM_addStyle(tiebadongtai);
		} else if (typeof PRO_addStyle != "undefined") {
			PRO_addStyle(tiebadongtai); //有警告
		} else if (typeof addStyle != "undefined") {
			addStyle(tiebadongtai); //有警告
		} else {
			var node = document.createElement("style");
			node.type = "text/css";
			node.appendChild(document.createTextNode(tiebadongtai));
			var heads = document.getElementsByTagName("head");
			if (heads.length > 0) {
				heads[0].appendChild(node);
			} else {
				// no head yet, stick it whereever
				document.documentElement.appendChild(node);
			}
		}
		const tieba_action = async(event) => {
			const {
				target
			} = event;
			const {
				classList
			} = target;
			//console.log(target);
			if (classList.contains('core_reply_tail')) {
				if (qiangdiaoxinxitishi == true) {
					//console.log(target.querySelectorAll(".core_reply_tail")[0])
					target.style = "color:#000 !important;"; //强调信息显示。楼层的时间。对旧版贴吧作用一般。
				}
				if (!GM_getValue("tiebameihua")) { //贴吧美化
					//console.log(target.querySelectorAll("ul.p_reply>li>a"));
					let temp1 = target.querySelectorAll(".p_reply_first") //新贴吧的贴子
					let temp2 = target.querySelectorAll("ul.p_reply>li>a"); //老贴吧的贴子样式特殊
					if (temp1[0] != null) {
						temp1[0].style = "font-size:10px !important;";
						//console.log(temp1[0].classList[0]);
						if (temp1[0].classList[1] == "p_reply_first") {
							temp1[0].innerHTML = "回复楼主";
						} else {
							temp1[0].innerHTML = "回复";
						}
					}
					if (temp2[0] != null) {
						temp2[0].style = "font-size:10px !important;";
						//console.log(temp1[0].classList[1]);
						if (temp2[0].classList[0] == "p_reply_first") {
							temp2[0].innerHTML = "回复楼主";
							temp2[0].parentNode.style = "width:auto !important;";
						} else {
							temp2[0].innerHTML = "回复";
						}
					}
				}
			}
			if (event.animationName !== '__tieba_action__') {
				return;
			}
			/*图片话题贴*/
			if (classList.contains('icon_interview_picture')) {
				//console.log(target.parentNode.parentNode.parentNode.parentNode);
				let tid = JSON.parse(target.parentNode.parentNode.parentNode.parentNode.getAttribute('tid'));
				let time = await getWaptiebaxinxi(tid).then(result => {
					if (result) {
						return result;
					} else {
						return "";
					}
				});
				let temp = time;
				if (temp != "") {
					temp = temp.split('<div class="i">1楼.')[1].split('<span class="b">')[1].split("</span>")[0];
					if (temp.split("-").length == 2 && temp.search(/(\d{4})-((0?([1-9]))|(1[1|2]))/) == -1) //只有月，没有年
					{
						temp = new Date().getFullYear().toString() + "-" + temp //2020-2-2
					} else if (temp4.split(":").length == 2) { //只有时间，没有年月
						temp = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate() + " " + temp //2020-02-02 02:00
					}
					let temp2 = document.createElement("span");
					temp2.setAttribute('class', 'createtimecsss');
					temp2.setAttribute('style', 'position: absolute;text-align: center;top: -5px;width: 70px;left: 0px;color: #999;');
					if (GM_getValue("tiebameihua") /*贴吧美化后*/ ) {
						temp2.setAttribute('style', 'text-align: center;top: -5px;width: 70px;left: 10px;top:10px;color: #999;position: absolute');
						target.parentNode.parentNode.parentNode.parentNode.querySelectorAll(".threadlist_rep_num")[0].style = "top: 60px;position: absolute;";
					}
					temp2.innerHTML = temp;
					target.parentNode.parentNode.parentNode.parentNode.querySelectorAll(".threadlist_rep_num")[0].before(temp2);
					//console.log(temp);
				}
			}
			/*文字话题贴*/
			if (classList.contains('listThreadTitle')) {
				//console.log(target.parentNode.querySelectorAll(".listReplyNum")[0]);
				//console.log(target.querySelectorAll(".word_live_title")[0].href.split("/p/")[1]);
				let tid = JSON.parse(target.querySelectorAll(".word_live_title")[0].href.split("/p/")[1]);
				let time = await getWaptiebaxinxi(tid).then(result => {
					if (result) {
						return result;
					} else {
						return "";
					}
				});
				let temp = time;
				if (temp != "") {
					temp = temp.split('<div class="i">1楼.')[1].split('<span class="b">')[1].split("</span>")[0];
					if (temp.split("-").length == 2 && temp.search(/(\d{4})-((0?([1-9]))|(1[1|2]))/) == -1) //只有月，没有年
					{
						temp = new Date().getFullYear().toString() + "-" + temp //2020-2-2
					} else if (temp.split(":").length == 2) { //只有时间，没有年月
						temp = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate() + " " + temp //2020-02-02 02:00
					}
					let temp2 = document.createElement("span");
					temp2.setAttribute('class', 'createtimecsss');
					temp2.setAttribute('style', 'position: absolute;text-align: center;top:40px;width: 70px;left: 0px;color: #999;');
					if (GM_getValue("tiebameihua") /*贴吧美化后*/ ) {
						temp2.setAttribute('style', 'text-align: center;top: 40px !important;width: 70px;left: 10px;top:10px;color: #999;position: absolute');
					}
					temp2.innerHTML = temp;
					target.parentNode.querySelectorAll(".listReplyNum")[0].before(temp2);
					//console.log(temp);
				}
			}
			if (classList.contains('icon_retract') || classList.contains('icon_ypic') || classList.contains('icon_turnleft') || classList.contains('icon_turnright')) {
				target.style = "display:none !important;"
			}
			/*图片话题贴清理多余图片工具栏标签+修复大图模式切换图片功能*/
			var page = 1;
			var suo2 = false;
			if (classList.contains('imgtopic_album')) {
				console.log("整个图片标签刷新");
				$(".imgtopic_gallery>.thread_pic_show>.threadlist_pic").click((e) => {
					let t = setTimeout(() => {
						clearTimeout(t);
						console.log("点击图片");
						let temp = $(".j_media_box");
						if (temp.length > 1) {
							for (let i = 1; i < temp.length; i++) {
								temp[i].remove(); //清理无限自增的多余标签
							}
						}
						page = parseInt($(".j_display_next")[0].getAttribute("cur"));
						if (suo2 == false) {
							suo2 = true;
							/*$(".j_retract").click((e) => {
							    console.log("关闭");
							});*/
							$(".j_display_pre").click((e) => {
								let target = e.target;
								console.log("上一页");
								let t2 = setTimeout(() => {
									clearTimeout(t2);
									//console.log(target.getAttribute("cur"));
									//console.log(target.getAttribute("total"));
									page = page - 1;
									let temp1 = $(".j_display_pre");
									for (let i = 0; i < temp1.length; i++) {
										//console.log(temp2[i]);
										temp1[i].setAttribute("cur", page);
									}
									let temp2 = $(".j_display_next");
									for (let i = 0; i < temp2.length; i++) {
										//console.log(temp2[i]);
										temp2[i].setAttribute("cur", page);
									}
								}, 0);
							});
							$(".j_display_next").click((e) => {
								let target = e.target;
								console.log("下一页");
								let t2 = setTimeout(() => {
									clearTimeout(t2);
									//console.log(target.getAttribute("cur"));
									//console.log(target.getAttribute("total"));
									page = page + 1;
									let temp1 = $(".j_display_pre");
									for (let i = 0; i < temp1.length; i++) {
										//console.log(temp2[i]);
										temp1[i].setAttribute("cur", page);
									}
									let temp2 = $(".j_display_next");
									for (let i = 0; i < temp2.length; i++) {
										//console.log(temp2[i]);
										temp2[i].setAttribute("cur", page);
									}
								}, 0);
							});
						}
					}, 0);
				});
			}
			if (classList.contains('replace_div')) {
				/*展开长图片*/
				//console.log(target);
				target.classList.add("zhankaichangtupian");
				target.children[1].classList.add("zhankaichangtupian2");
				//console.log(target.children[1]);
			}
			if (classList.contains('tieba-link-anchor')) { //调整复制链接按钮在旧版贴吧的位置
				if (!GM_getValue("tiebameihua") /*贴吧美化*/ ) {
					if (target.parentNode.className == "core_title_btns") {
						target.style = "position: absolute;left: 440px;top: 0px;";
					}
				}
			}
			/*贴子内页楼层列表*/
			if (classList.contains('p_postlist')) {
				let t = setTimeout(() => {
					clearTimeout(t);
					$('#thread_theme_5')[0].classList.remove("thread_theme_bright_absolute");
				}, 1000);
				/*
                修复贴子内下工具栏点翻页按钮后，不再显示翻页列表
    目标标签class p_thread thread_theme_5
    加个thread_theme_bright_absolute
                */
			}
			if (classList.contains('u_login')) {
				$("li.u_login").click(() => { //解决贴子刚加载后，点不出登陆弹窗
					if (tieba_custom_pass_login != null && tieba_custom_pass_login != false) {
						clearInterval(tieba_custom_pass_login);
						tieba_custom_pass_login = null;
					}
				});
				console.log("未登陆");
				//百度贴吧：不登录即可看贴 by VA
				if (!GM_getValue("tiebameihua")) { //贴吧美化
					if (!GM_getValue("tiebameihua") /*贴吧美化*/ ) { //隐藏侧边栏
						if (GM_getValue("yincangcebianlan") == true) { //隐藏侧边栏
							let temp3 = $("div.userbar")[0];
							yincangcebianlanx = true;
							$("#yincangcebianlan")[0].value = "<<";
							if (temp3 != null) {
								temp3.style = "display:none;";
							}
							console.log("全局隐藏侧边栏1");
						}
					}
				}
				let killlogin = 6;
				tieba_custom_pass_login = setInterval(() => {
					if (killlogin == 0) {
						clearInterval(tieba_custom_pass_login);
						tieba_custom_pass_login = null;
					}
					try {
						document.querySelectorAll('div[class="tieba-custom-pass-login"]')[0].remove(); //解决未登陆贴吧看贴会弹窗的问题
					} catch (e) {}
					killlogin--;
				}, 1000);
			}
			if (classList.contains('userbar')) {
				console.log("不登陆看贴")
				unsafeWindow.PageData.user.is_login = 1
			}
			/*侧工具栏*/
			/*下半部分单独处理以避免偶尔隐藏失败*/
			if (classList.contains('tbui_aside_float_bar')) {
				//$("li.tbui_fbar_favor")[0].before();
				//console.log(target);
				if (!GM_getValue("tiebameihua")) { //贴吧美化
					if (!GM_getValue("tiebameihua") /*贴吧美化*/ ) { //隐藏侧边栏
						if (GM_getValue("yincangcebianlan") == true) { //隐藏侧边栏
							if (yincangcebianlanx == false) {
								yincangcebianlanx = true;
								$("#yincangcebianlan")[0].value = "<<";
							}
							target.style = "display:none;";
							console.log("全局隐藏侧边栏2");
						}
					}
				}
				//给贴子和我的贴吧添加一个刷新按钮
				//https://tieba.baidu.com/home/main?id=
				//if ((new RegExp("^https?://(tieba.baidu.com|www.tieba.com)/+p/+.*$")).test(document.location.href) || (new RegExp("^(https|http)?://(tieba.baidu.com|www.tieba.com)/home/main\\?id\\=.*$")).test(document.location.href)) {
				let fuzuodian1 = target.querySelectorAll(".tbui_fbar_down")[0] || target.querySelectorAll(".tbui_fbar_top")[0]; //tbui_fbar_top .tbui_fbar_down下载app按钮
				let fuzuodian2 = target.querySelectorAll(".tbui_fbar_top")[0];
				if (target.querySelectorAll(".tbui_fbar_refresh")[0] == undefined) {
					let refresh1 = document.createElement("li"); //创建节点<li/>
					let refresh2 = document.createElement("a"); //创建节点<a/>
					refresh1.setAttribute('class', 'tbui_aside_fbar_button tbui_fbar_refresh');
					refresh1.appendChild(refresh2);
					fuzuodian1.before(refresh1);
					refresh2.addEventListener('click', (e) => {
						window.location.reload();
					});
				}
				let bottom1 = document.createElement("li"); //创建节点<li/>
				let bottom2 = document.createElement("a"); //创建节点<a/>
				//temp2.setAttribute('href', '#');//这个会导致强制拉到页面最上面
				bottom1.setAttribute('class', 'tbui_aside_fbar_button tbui_fbar_bottom');
				bottom1.appendChild(bottom2);
				fuzuodian2.after(bottom1);
				bottom2.addEventListener('click', (e) => {
					window.scrollTo(0, document.body.scrollHeight);
					/*let i = document.documentElement.scrollTop;
					let t = setInterval(() => {
					    //console.log(document.documentElement.scrollTop)
					    if (i <= document.body.scrollHeight) {
					        window.scrollTo(document.documentElement.scrollTop, i);
					        i += 500;
					    } else {
					        clearInterval(t);
					    }
					}, 40);*/
				});
				//快速到底按钮动画效果
				window.addEventListener("scroll", function(e) {
					let temp = document.querySelectorAll(".tbui_fbar_bottom")[0]
					if (temp != undefined) {
						//console.log(document.documentElement.scrollTop)
						//console.log(document.body.scrollHeight- 1000)
						//console.log(window.scrollY)
						if (window.scrollY >= document.body.scrollHeight - 1000) {
							temp.setAttribute("style", "visibility: hidden;")
						} else {
							temp.setAttribute("style", "visibility: visible;")
						}
					}
				});
				//}
			}
			//let checker;
			//console.log(target);
			//console.log(classList.contains('j_thread_list'))
			if (classList.contains('u_menu_username')) {
				//console.log(target);
				// @returns {number|""} 是否登录，不登陆为0或"",为了适配不登陆看贴功能
				//console.log(localStorage.getItem("userid"));
				var getIsLogin2 = unsafeWindow.PageData.user.id || unsafeWindow.PageData.user.user_id; //获取用户id
				if (localStorage.getItem("userid") == null || localStorage.getItem("userid") != "" || localStorage.getItem("userid") != undefined) { //可能没用？
					localStorage.setItem("userid", getIsLogin2)
				}
				//console.log(getIsLogin2)
				if (getIsLogin2 != 0 && getIsLogin2 != "" && getIsLogin2 == localStorage.getItem("userid") && !GM_getValue("tiebameihua") /*关闭贴吧美化后，不显示大头像*/ ) {
					//console.log($("div.edui-icon-bold")[0]);
					/*if ($("div.edui-btn-bold")[0] != null && $("div.edui-btn-red")[0] != null && suo == false) {
					    //console.log($("div.edui-icon-bold")[0]);
					    suo = true;
					    $("div.edui-btn-bold")[0].style = "display:block;" //让发贴文本编辑器的字体加粗按钮和文字变红按钮一定能显示出来。2020-2-27经测试确定该功能已失效。
					    $("div.edui-btn-red")[0].style = "display:block;"
					}*/
					//贴吧右上角的用户头像
					if (tieziurl.search(/(https|http):\/\/tieba\.baidu\.com\/f\/search\//g) == -1) {
						let t = setTimeout(async() => { //增加延时以提高右上角按钮显示用户头像的成功率
							clearTimeout(t);
							let userimg = "";
							let userportrait = unsafeWindow.PageData.user.portrait; //.replace(/\?t=.*/, "");
							//https://sign.52fisher.cn/93.html 常用贴吧接口 April 15, 2016
							if (userportrait == ""|| userportrait == undefined) { //解决无法获取到portrait的情况
								var c = {
									'un': unsafeWindow.PageData.user.name || unsafeWindow.PageData.user.user_name
								};
								await $.get("/home/get/panel", c,
									function(o) {
										if (o != null) {
											console.log("/home/get/panel: " + o.data.portrait);
											userimg = "https://himg.bdimg.com/sys/portrait/item/" + o.data.portrait;
										}
									}, "json");
							} else {
								if (userportrait.search("http") == -1) {
									userimg = "https://himg.bdimg.com/sys/portrait/item/" + userportrait
								} else {
									userimg = userportrait //有些页面是完整的链接，例如贴吧热议https://tieba.baidu.com/hottopic/browse/hottopic?topic_id=xxxxxx&topic_name=xxxxx
								}
							}
							/*
                            贴吧用户头像
                            PC网页端贴吧，自定义头像一天只能更换3次，贴吧默认头像应该不限制次数
                            时间戳/1000  应该可以选头像
                            需要填上时间戳才能保证头像显示正确
                            一般默认显示64*64
        https://gss0.bdstatic.com/一串大小写字母数字/sys/portrait/item/[PageData.user.portrait]?t=时间戳/1000 110*110
        https://gss0.baidu.com/一串大小写字母数字/sys/portraith/item/[PageData.user.portrait]?t=时间戳/1000 大图 960*960，580*580
        https://himg.bdimg.com/sys/portrait/item/[PageData.user.portrait]?t=时间戳/1000 110*110
        http://tb.himg.baidu.com/sys/portrait/item/[PageData.user.portrait]?t=时间戳/1000 110*110
        https://himg.baidu.com/sys/portraitl/item/[PageData.user.portrait]?t=时间戳/1000                        */
							//console.log(userimg);
							if ($("img.u_username_avatar")[0] == null && $("span.u_username_title")[0] != null) {
								$("span.u_username_title").before('<img class="u_username_avatar" src=' + userimg + '>');
							}
						}, 1000);
					}
				}
			}
			if (classList.contains('u_news')) {
				//console.log(target);
				try {
					let ii = 0;
					let t = setInterval(() => {
							if (qiangdiaoxinxitishi == true) {
								let temp1 = $(".u_news_wrap span"); //浮动按钮
								let temp2 = $(".u_notity_bd .category_item"); //浮动按钮
								let temp4 = $("ul.j_category_list>li>a>span,ul.j_category_list>#u_notify_item>li>a>span"); //浮动按钮
								let temp5 = $("ul.sys_notify_last>li>a>span"); //浮动按钮
								//console.log(temp1);
								//console.log(temp2);
								//console.log(temp4);
								//console.log(temp5);
								if (ii <= 59) {
									ii++;
								} else {
									clearInterval(t);
								}
								if (temp1[0] != null && temp2[0] != null && temp4[0] != null && temp5[0] != null) {
									clearInterval(t);
									let i = 0;
									for (i = 0; i < temp1.length; i++) {
										temp1[i].style = "display:" + temp1[i].style["display"] + ";color:#f00 !important;";
									}
									for (i = 0; i < temp2.length; i++) {
										temp2[i].style["color"] = "#f00 !important;";
									}

									for (i = 0; i < temp4.length; i++) {
										temp4[i].style = "color:#f00 !important;";
									}
									for (i = 0; i < temp5.length; i++) {
										temp5[i].style = "display:" + temp5[i].style["display"] + ";color:#f00 !important;";
									}
								}
							}

						},
						1000);
				} catch (err) {
					console.log("强调信息提示:" + err);
				}
			}
			if (classList.contains('u_setting')) {
				//console.log(target);
				if (!GM_getValue("tiebameihua") /*贴吧美化*/ ) { //隐藏侧边栏
					if (GM_getValue("yincangcebianlan") == true) { //隐藏侧边栏
						let temp3 = $("div.userbar ")[0];
						//let temp4 = $("ul.tbui_aside_float_bar")[0];
						yincangcebianlanx = true;
						$("#yincangcebianlan")[0].value = "<<";
						if (temp3 != null) {
							temp3.style = "display:none;";
						}
						/*if (temp4 != null) {
						    temp4.style = "display:none;";
						}*/
						console.log("全局隐藏侧边栏0");
					}
				}
			}
			if (classList.contains('icon-member-top')) {
				if (!GM_getValue("tiebameihua") /*贴吧美化*/ ) {
					target.style = "background:none;background-color: #FFCC26;";
				}
			}
			if (classList.contains("t_con")) {
				//console.log("t_con:" + target);
				let temp6 = target.querySelectorAll(".col2_left")[0]; //主题贴列表添加发贴时间 https://tieba.baidu.com/f?kw=%E6%8A%95%E6%B1%9F%E7%9A%84%E9%B1%BC&ie=utf-8,某些远古贴存在错误发布时间问题
				let temp9 = target.querySelectorAll(".icon-good")[0]; //显示精品贴，精华贴标识
				let temp10 = target.querySelectorAll(".icon-top")[0]; //显示置顶标识
				//let temp11 = target.querySelectorAll(".icon-member-top")[0]; //显示会员置顶标识
				//console.log("temp6:" + temp6[0])
				//console.log("temp9:" + temp9)
				//console.log("temp10:" + temp10)
				//console.log(temp6.childNodes);
				if (temp6.querySelectorAll(".createtimecsss")[0] != null) {
					return false;
				}
				if (temp6.children.length != 0) //有些贴子没有创建时间，例如招募吧主置顶公告贴,话题贴
				{
					let temp7 = document.createElement("span");
					temp7.setAttribute('class', 'createtimecsss');
					if (temp6.parentNode.querySelectorAll(".icon-member-top")[0] == null && temp6.parentNode.querySelectorAll(".icon-top")[0] == null) {
						temp7.setAttribute('style', 'position: absolute;text-align: center;top: 0px;width: 70px;left: 0px;color: #999;');
						temp6.children[0].setAttribute('style', 'position: absolute;width: 51px !important;top: 20px;');
					} else {
						if (!GM_getValue("tiebameihua") /*贴吧美化后*/ ) {
							temp7.setAttribute('style', 'position: absolute;text-align: center;top: -5px;width: 70px;left: 0px;color: #999;');
							temp6.children[0].setAttribute('style', 'position: absolute;width: 51px !important;top: 13px;');
						} else {
							temp7.setAttribute('style', 'text-align: center;top: -5px;width: 70px;left: 0px;color: #999;');
							temp6.children[0].setAttribute('style', 'width: 51px !important;top: 13px;');
						}
					}
					//console.log(temp6.parentNode.querySelectorAll("span.is_show_create_time")[0].innerHTML)
					let temp8 = target.querySelectorAll(".is_show_create_time")[0].innerHTML;
					//console.log(temp6.parentNode.querySelectorAll(".icon-member-top"))
					//console.log(temp6.parentNode.querySelectorAll(".icon-top"))
					if (temp8.split("-").length == 2 && temp8.search(/(\d{4})-((0?([1-9]))|(1[1|2]))/) == -1) {
						temp8 = new Date().getFullYear().toString() + "-" + temp8
					}
					temp7.innerHTML = temp8;
					//console.log(temp8)
					temp6.children[0].before(temp7);
				}
				if (!GM_getValue("tiebameihua") /*贴吧美化*/ ) {
					if (temp9 != null) {
						temp9.style = "background-color: #FF6666;";
					}
					if (temp10 != null) {
						temp10.style = "background:none;background-color: #4285F5;";
					}
					// if (temp11 != null) {
					//     temp11.style = "background:none;background-color: #FFCC26;";
					// }
				}
			}
			if (classList.contains('l_post')) {
				try {
					//console.log(target);
				} catch (err) {
					console.log("l_post:" + err)
				}
				//console.log(target.querySelectorAll(".is_show_create_time")[0].innerHTML);
				//console.log(target.querySelectorAll(".col2_left")[0]);
				if (pingbi_loucengqipao == true) {
					let temp1 = target.querySelectorAll(".post_bubble_top")[0];
					let temp2 = target.querySelectorAll(".post_bubble_middle")[0];
					let temp3 = target.querySelectorAll(".post_bubble_bottom")[0];
					if (temp1 != null && temp1 != null && temp1 != null) {
						temp1.style = "backgrounde:none;";
						temp2.style = "backgrounde:none;padding:unset;";
						temp3.style = "backgrounde:none;";
					}
				}
			}
			/*if (classList.contains('pager_theme_4')) {
			}*/
			/*if (classList.contains('l_posts_num') || classList.contains('thread_theme_5')) { //贴子内只动态执行一次 thread_theme_5只在第一次打开贴子时执行，翻页执行 ||classList.contains('pager_theme_4')
			    //$("div.replace_div>div.replace_tip").click()
			            by tency
			            https://greasyfork.org/zh-CN/scripts/396083-%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%B8%96%E5%AD%90%E7%9A%84%E5%9B%BE%E7%89%87
			            自动展开百度贴吧帖子的图片
			            自动展开百度贴吧帖子的图片，方便浏览图片帖
			            version    0.2
			            copyright  2014+, LYY
			}*/
			if (classList.contains('right')) { //显示移除粉丝按钮
				//console.log(target);
				//console.log(target.children[0].querySelectorAll("div")[1]);
				let temp = target.children[0].querySelectorAll("div")[1];
				if (temp != null) {
					temp.style = "padding:4px 0 0 14px;display:block !important;";
				}
			}
			if (target.getAttribute('id') == "main_aside") { //显示移除粉丝按钮
				//console.log(target);
				if ((window.location.href.search("/i/i/fans") != -1 || window.location.href.search("/i/i/concern") != -1) && !GM_getValue("tiebameihua")) {
					target.remove(); //这两个页面出错后的临时解决方案，直接删了出问题标签23333
					//http://tieba.baidu.com/i/i/fans?u=XXXXX，http://tieba.baidu.com/i/i/concern?u=XXXXX
				}
			}
			//修复贴吧头像bug1
			if (target.getAttribute('id') == "j_userhead") {
				//if (/https:\/\/tieba\.baidu\.com\/home\/main\/.*/.test(window.location.href) == true) {
				let t = setTimeout(() => {
					clearTimeout(t);
					$("#j_userhead>a>img")[0].setAttribute("src", unsafeWindow.ihome.Userinfo.portraitRoot.MIDDLE + $("#j_userhead")[0].getAttribute("data-sign")); //重设头像链接
				}, 1000);
				// }
			}
			//修复贴吧头像bug1
			if (target.getAttribute('id') == "user_info") {
				//if (/https:\/\/tieba\.baidu\.com\//.test(window.location.href) == true) {
				let t = setTimeout(() => {
					clearTimeout(t);
					$("#user_info>a>img")[0].setAttribute("src", "https://himg.bdimg.com/sys/portrait/item/" + unsafeWindow.PageData.user.portrait); //重设头像链接
				}, 1000);
				// }
			}
			///*修复我的贴吧-热门动态-图片显示*/
			if (classList.contains('m_pic')) {
				let i = 0;
				let t = setInterval(() => {
					if (target.style[0] != undefined) { //等待图片加载完成
						target.style = "width: 100px; height: 100px;";
						clearInterval(t);
						t = null;
					}
					if (i == 10) { //超时处理
						target.style = "width: 100px; height: 100px;";
						clearInterval(t);
						t = null;
					}
					i++;
				}, 2000);
				//document.querySelectorAll("ul.new_list>div>div>ul>li>img.m_pic").forEach(pic => pic.style = "width: 100px; height: 100px;");//浏览器开发者工具可用
			}
			if (classList.contains('dialog_block')) {
				target.remove();
			}
			if (classList.contains('video_src_wrap_main') || classList.contains('media_disp') || classList.contains('media_box')) {
				//让视频贴可以下载视频,video_src_wrap_main是贴子内的，media_disp是贴子列表简介的
				let temp = target.querySelectorAll("video")[0]
				if (temp != undefined) {
					console.log("video:" + target.querySelectorAll("video")[0].outerHTML)
					temp.setAttribute("controlslist", "download")
				}
			}
			//个人主页下方的贴子加载按钮
			if (target.getAttribute('id') == "j_more_hotFeed") {
				//https://tieba.baidu.com/home/main?id=
				//"\\"让?和=作为字符串存在，可以用于匹配
				//$("#j_more_hotFeed>a")[0].click()
				//如果瞬移到网页底部可能会失效
				if (window.location.href.search("/home/main\\?id\\=") != -1) {
					console.log("j_more_hotFeed" + target.outerHTML);
					let t = setTimeout(() => {
						target.querySelectorAll("a")[0].click()
						clearTimeout(t)
						t = null
					}, 1000)
				}
			}
		}
		const initListener = () => {
			PrefixedEvent(document, "AnimationStart", tieba_action); //开始
			//document.addEventListener('webkitAnimationStart', tieba_action, false);
			//document.addEventListener('MSAnimationStart', tieba_action, false);
			//document.addEventListener('animationstart', tieba_action, false);
		};
		var yingcang = false;
		window.addEventListener("transitionend", function(e) { //解决刷新贴子自动跳转到某个位置可能无法隐藏下工具栏问题，缓解工具栏偶尔出现不隐藏问题
			const {
				target
			} = e;
			const {
				classList
			} = target;
			//console.log(target);
			let temp = $('#j_core_title_wrap'); //主体框架
			if (temp[0] != null) {
				if (rmBottom == true) {
					if (classList.contains('l_thread_info') == true) {
						$('.core_title_bg')[0].style = "display:none !important;";
						$('.core_title_txt')[0].style = "display:none !important;";
						$('.core_title_btns')[0].style = "display: none !important;";
						$('#thread_theme_5')[0].style = "display:none !important;";
					}
				} else {

				}

			}
		});
		var scrollY1 = window.scrollY;
		window.addEventListener("scroll", function(e) {
			//const { target } = e;
			//const { classList } = target;
			//console.log(target);
			let temp = $('#j_core_title_wrap'); //主体框架
			//core_title_bg 背景框
			//core_title_txt 标题
			//core_title_btns display: none !important; 按钮
			//p_thread thread_theme_5 页码，页数
			if (temp[0] != null) { //慢速上下移动网页时，偶尔有工具栏闪烁问题
				//console.log(temp[0].style["top"]);
				if (window.scrollY - scrollY1 < 0) {
					//console.log("向上滚动");
					if (temp[0].className != "core_title_wrap_bright clearfix tbui_follow_fixed core_title_absolute_bright" && temp[0].className != "core_title_wrap core_title_wrap_bright tbui_follow_fixed core_title_absolute_bright" /*旧版贴吧有这个*/ ) {
						yingcang = false
					}
					//window.scrollTo(window.scrollY, window.scrollY+10);
				}
				if (window.scrollY - scrollY1 > 0) { //当向下滚动时
					//console.log("向下滚动");
					if (temp[0].className == "core_title_wrap_bright clearfix tbui_follow_fixed core_title_absolute_bright" || temp[0].className == "core_title_wrap core_title_wrap_bright tbui_follow_fixed core_title_absolute_bright" /*旧版贴吧有这个*/ ) {
						yingcang = true;
					}
				}
				//console.log(window.scrollY);
				if (yingcang == true) {
					if (rmBottom == true) { //隐藏下工具栏
						$('.core_title_bg')[0].style = "display:none !important;";
						$('.core_title_txt')[0].style = "display:none !important;";
						$('.core_title_btns')[0].style = "display: none !important;";
						$('#thread_theme_5')[0].style = "display:none !important;";
						//temp[0].style = "display:none !important;";//会产生滚动迟滞卡顿+无法滚动到底
					}
					$('#thread_theme_5')[0].classList.add("thread_theme_bright_absolute");
				} else {
					if (rmBottom == true) { //隐藏下工具栏
						$('.core_title_bg')[0].style = "display:block !important;";
						$('.core_title_txt')[0].style = "display:block !important;";
						$('.core_title_btns')[0].style = "display:block !important;";
						$('#thread_theme_5')[0].style = "display:block !important;";
					}
					$('#thread_theme_5')[0].classList.remove("thread_theme_bright_absolute")
						/*
    修复贴子内下工具栏点翻页按钮后，不再显示翻页列表
    目标标签class p_thread thread_theme_5
    加个thread_theme_bright_absolute
    */
				}
				scrollY1 = window.scrollY;
				//console.log($('#j_core_title_wrap')[0].className);
			}

		});
		initListener();
		if (window.location.href.search(/http:\/\/tieba\.baidu\.com\/bawu2\/platform\/listTools\?word=.*/g) != -1) {
			//console.log("版块分区1");
			let t = setTimeout(() => {
				clearTimeout(t);
				$("#sectionPartitionApp").click(() => {
					//console.log("版块分区2");
					let t2 = setTimeout(() => {
						clearTimeout(t2);
						$(".dialogJtxt")[0].parentNode.parentNode.querySelectorAll(".dialogJbody")[0].style = "height:450px;"
					}, 1000);
				});
			}, 1000);
		}
	})();
	/*
	            参考
	            https://greasyfork.org/scripts/375218-%E8%B4%B4%E5%90%A7%E5%9B%9E%E5%A4%8D%E4%BF%AE%E6%AD%A3 贴吧回复修正
	            https://github.com/indefined/UserScripts/tree/master/tiebaPostAdjustment
	            已知问题继承
	            展开的被折叠楼层会显示隐藏提示（有意没有去掉它）
	            展开的被隐藏楼中楼需要点击两次数字才能收起该层楼中楼（暂时无法解决）
	            可能对某些帖子不管用，如果出现这种情况请反馈准确帖子链接
	            ---
	            https://github.com/FirefoxBar/userscript/raw/master/Tieba_Blocked_Detect/Tieba_Blocked_Detect.user.js 贴吧贴子屏蔽检测
	            */
	// @version      0.011
	// @description  还原被折叠隐藏的楼层、楼中楼，附带自动展开楼中楼的查看更多
	(function() {
		'use strict';
		const getTriggerStyle = () => {
			return `
        /* 使用 animation 监测 DOM 变化 */
        @-webkit-keyframes __tieba_zhankai__ {}
        @-moz-keyframes __tieba_zhankai__ {}
        @keyframes __tieba_zhankai__ {}
        /* 楼中楼 */
        /*在回复层主标签元素那块*/
        .lzl_li_pager,.j_lzl_l_p,.lzl_li_pager_s,#content_leftList{
        -webkit-animation: __tieba_zhankai__;
        -moz-animation: __tieba_zhankai__;
        animation: __tieba_zhankai__;
        }
        `;
		};

		//强调信息提示+修http://tieba.baidu.com/i/i/网页背景
		try {
			let ii = 0;
			let t = setInterval(() => {
					if (ii <= 59) {
						ii++;
					} else {
						clearInterval(t);
					}
					if (!GM_getValue("tiebameihua") /*贴吧美化*/ ) {
						let temp = $("div.ibody"); //我的回复网页背景 http://tieba.baidu.com/i/i/replyme
						if (temp[0] != null) {
							temp[0].style = "background:#fff;";
						}
					}
					if (qiangdiaoxinxitishi == true) {
						let temp6 = $(".meihua"); //美化开关
						if (temp6[0] != null) {
							clearInterval(t);
							temp6[0].style = "color:#f00 !important;font-weight:bold;white-space:normal;"; //贴吧美化开关按钮文字样式
						}
					}

				},
				1000);
		} catch (err) {
			console.log("强调信息提示:" + err);
		}

		function unfoldPost() { //楼层内容折叠展开
			[].forEach.call(document.querySelectorAll('[style="display:;"]>.p_forbidden_post_content_fold'), node => {
				console.log("unfoldPost1:" + node)
				node.click();
			});
		}
		var louzhonglousuo = false

		function unfoldPost2() { //楼层内容和楼中楼内容折叠展开，暴力查询版
			try {
				unfoldPost(); //楼层内容折叠展开
				[].forEach.call(document.querySelectorAll('div>.j_lzl_container.core_reply_wrapper[style="min-height: 0px; display: none;"]'), node => {
					if (JSON.parse(node.getAttribute("data-field")).total_num > 0) {
						node.style = "min-height: 1px; display:block;" //和原来的样式有所不同，这样就可以人为收起来楼中楼了。。！
							//node.parentNode.children[0].children[0].children[0].click();
							//node.classList.add("_yizhankai_");
					}
					//console.log("unfoldPost2:"+JSON.stringify(node))
					//console.log(JSON.parse(node.getAttribute("data-field")).total_num)
					//JSON.parse(json).XXXX
					//https://blog.csdn.net/weixin_39889465/article/details/86220538 js通过'data-xxx'自定义属性获取dom元素
					//https://www.cnblogs.com/landeanfen/p/5159911.html JS组件系列——使用HTML标签的data属性初始化JS组件
					//https://www.w3school.com.cn/tags/att_global_data.asp HTML data-* 属性
				});
				//console.log(GM_getValue("lzl_zhankai"))
				let temp1 = document.querySelectorAll("ul.j_lzl_m_w")
					//console.log("temp1:" + temp1.length)
				let temp2 = document.querySelectorAll(".l_post")
					//console.log("temp2:" + temp2.length)
				if (GM_getValue("lzl_zhankai") == true) {
					//console.log(target)'
					if (temp1.length > 0 && louzhonglousuo == false) {
						for (let i = 0; i < temp1.length; i++) {
							//console.log(temp1[i])
							let temp3 = temp1[i].querySelectorAll(".lzl_post_hidden")[0]
							if (temp3 != undefined) {
								//console.log(temp2.getAttribute("style"))
								if (temp3.getAttribute("style") != "display:block") {
									temp3.setAttribute('style', 'display:block')
									temp1[i].querySelectorAll(".lzl_more")[0].setAttribute('style', 'display:none')
									temp1[i].querySelectorAll(".lzl_pager")[0].setAttribute('style', 'display:block')
								}

							} //被贴吧隐藏的回复就是undefined,实际手动点击展开回复也是空的 
						}
						/*console.log(target.parentNode)
						console.log(target.parentNode.querySelectorAll(".lzl_post_hidden")[0])
						console.log(target.parentNode.querySelectorAll(".lzl_more")[0])
						console.log(target.parentNode.querySelectorAll(".lzl_pager")[0])*/
					}
					if (temp1.length == temp2.length) {
						louzhonglousuo = true
					} else {
						louzhonglousuo = false
					}
				}
				if (GM_getValue("rm_user_icon") == true) {
					$('ul.p_author .icon').remove();
					$('.p_content').each(function(i, e) {
						e.style = 'min-height:0;padding:3px 0 0 3px !important;'
					});
					$('.p_content > br').remove();
				}
			} catch (e) {
				console.error("unfoldPost2:" + e);
				clearInterval(louzhonglou);
			}
		}
		const unfoldPost3 = (event) => { //楼中楼楼层太长折叠展开，动态版
			if (event.animationName !== '__tieba_zhankai__') {
				return;
			}
			const {
				target
			} = event;
			const {
				classList
			} = target

			//console.log(GM_getValue("lzl_zhankai"))
			if (GM_getValue("lzl_zhankai") == true) {
				//console.log(target)
				if (classList.contains('lzl_li_pager')) {
					let temp = target.parentNode.querySelectorAll(".lzl_post_hidden")[0]
					if (temp != undefined) {
						temp.setAttribute('style', 'display:block')
						target.parentNode.querySelectorAll(".lzl_more")[0].setAttribute('style', 'display:none')
						target.parentNode.querySelectorAll(".lzl_pager")[0].setAttribute('style', 'display:block')
					} //被贴吧隐藏的回复就是undefined,实际手动点击展开回复也是空的
					/*console.log(target.parentNode)
					console.log(target.parentNode.querySelectorAll(".lzl_post_hidden")[0])
					console.log(target.parentNode.querySelectorAll(".lzl_more")[0])
					console.log(target.parentNode.querySelectorAll(".lzl_pager")[0])*/
				}
			}
			if (GM_getValue("rm_user_icon") == true) {
				$('ul.p_author .icon').remove();
				$('.p_content').each(function(i, e) {
					e.style = 'min-height:0;padding:3px 0 0 3px !important;'
				});
				$('.p_content > br').remove();
			}
			//console.log(target.children[1].children[1])
			//document.querySelectorAll(".lzl_li_pager")[0].children[1].children[1].click()
		}
		let liebiao2 = 0;

		function unfoldPost4() { //要定时循环查找才能找全整个贴吧列表的贴子。。!直接搜索+动态加载一起用
				try {
					if (liebiao2 <= 29) {
						liebiao2++;
					} else {
						clearInterval(liebiao);
						liebiao = null;
					}
					//console.log("xxx:" + tieziurl.search(/(https|http):\/\/tieba\.baidu\.com\/f\?kw=/g))
					let temp6 = document.querySelectorAll(".col2_left"); //主题贴列表添加发贴时间 https://tieba.baidu.com/f?kw=%E6%8A%95%E6%B1%9F%E7%9A%84%E9%B1%BC&ie=utf-8,某些远古贴存在错误发布时间问题
					let temp9 = document.querySelectorAll(".icon-good"); //显示精品贴，精华贴标识
					let temp10 = document.querySelectorAll(".icon-top"); //显示置顶标识
					//let temp11 = document.querySelectorAll(".icon-member-top")[0]; //显示会员置顶标识
					//console.log("temp6x:" + temp6.length)
					//console.log("temp9:" + temp9)
					//console.log("temp10:" + temp10)
					//console.log(temp6.childNodes);
					let i = 0;
					if (!GM_getValue("tiebameihua") /*贴吧美化*/ ) {
						if (temp9 != null) {
							for (i = 0; i < temp9.length; i++) {
								temp9[i].style = "background-color: #FF6666;";
							}
						}
						if (temp10 != null) {
							for (i = 0; i < temp10.length; i++) {
								temp10[i].style = "background:none;background-color: #4285F5;";
							}
						}
						// if (temp11 != null) {
						//     temp11.style = "background:none;background-color: #FFCC26;";
						// }
					}
					if (temp6 != null) {
						for (i = 0; i < temp6.length; i++) {
							if (temp6[i].children.length != 0) //有些贴子没有创建时间，例如招募吧主置顶公告贴,话题贴
							{
								if (temp6[i].querySelectorAll(".createtimecsss")[0] == null) {
									let temp7 = document.createElement("span");
									temp7.setAttribute('class', 'createtimecsss');
									console.log("temp6:" + temp6[i].outerHTML)
									if (temp6[i].parentNode.querySelectorAll(".icon-member-top")[0] == null && temp6[i].parentNode.querySelectorAll(".icon-top")[0] == null) {
										temp7.setAttribute('style', 'position: absolute;text-align: center;top: 0px;width: 70px;left: 0px;color: #999;');
										temp6[i].children[0].setAttribute('style', 'position: absolute;width: 51px !important;top: 20px;');
									} else {
										if (!GM_getValue("tiebameihua") /*贴吧美化后*/ ) {
											temp7.setAttribute('style', 'position: absolute;text-align: center;top: -5px;width: 70px;left: 0px;color: #999;');
											temp6[i].children[0].setAttribute('style', 'position: absolute;width: 51px !important;top: 13px;');
										} else {
											temp7.setAttribute('style', 'text-align: center;top: -5px;width: 70px;left: 0px;color: #999;');
											temp6[i].children[0].setAttribute('style', 'width: 51px !important;top: 13px;');
										}
									}
									//console.log(temp6[i].parentNode.querySelectorAll("span.is_show_create_time")[0].innerHTML)
									let temp8 = temp6[i].parentNode.querySelectorAll(".is_show_create_time")[0].innerHTML; //得到创建时间
									//console.log(temp6[i].parentNode.querySelectorAll(".icon-member-top"))
									//console.log(temp6[i].parentNode.querySelectorAll(".icon-top"))
									if (temp8.split("-").length == 2 && temp8.search(/(\d{4})-((0?([1-9]))|(1[1|2]))/) == -1) {
										temp8 = new Date().getFullYear().toString() + "-" + temp8
									}
									temp7.innerHTML = temp8;
									//console.log(temp8)
									temp6[i].children[0].before(temp7);
								}
							}
						}
					}
					//console.log("unfoldPost4");
				} catch (e) {
					console.error("unfoldPost4:" + e);
					clearInterval(liebiao);
				}
			}
			/**
			 * 初始化样式
			 */
		const initStyle = () => {
			const style = document.createElement('style');
			style.textContent = getTriggerStyle();
			document.head.appendChild(style);
		};

		/**
		 * 初始化事件监听
		 *
		 */
		const initListener = () => {
			// 使用 animation 事件，方便处理贴吧 ajax 加载数据
			PrefixedEvent(document, "AnimationStart", unfoldPost3); //开始
			//document.addEventListener('webkitAnimationStart', unfoldPost3, false);
			// document.addEventListener('MSAnimationStart', unfoldPost3, false);
			// document.addEventListener('animationstart', unfoldPost3, false);
		};
		if (tieziurl.search(/(https|http):\/\/tieba\.baidu\.com\/f\?kw=/g) != -1 || tieziurl.search(/(https|http):\/\/tieba\.baidu\.com\/f\?ie=utf-8&kw=/g) != -1) {
			var liebiao = setInterval(unfoldPost4, 2000); //要定时循环查找才能找全整个贴吧列表的贴子。。!
		}
		if (tieziurl.search(/(https|http):\/\/tieba\.baidu\.com\/p\/.*/g) != -1) {
			var louzhonglou = setInterval(unfoldPost2, 2000); //要定时循环查找才能找全整个贴子的楼中楼。。!
		}
		initListener();
		initStyle();
	})();
	(function() {
		if (!GM_getValue("tiebameihua") /*贴吧美化*/ ) { //隐藏侧边栏
			let temp = document.createElement("input"); //创建节点<input/>
			temp.setAttribute('type', 'button');
			temp.setAttribute('id', "yincangcebianlan");
			temp.setAttribute('class', 'yincangcebianlan');
			temp.setAttribute('value', ">>");
			document.body.appendChild(temp);
			temp.addEventListener('click', (e) => {
				const {
					target
				} = e;
				//console.log(target);
				let temp3 = $("div.userbar ")[0];
				let temp4 = $("ul.tbui_aside_float_bar")[0];
				if (yincangcebianlanx == false) {
					yincangcebianlanx = true;
					GM_setValue("yincangcebianlan", true)
					target.value = "<<";
					if (temp3 != null) {
						temp3.style = "display:none;";
					}
					if (temp4 != null) {
						temp4.style = "display:none;";
					}
				} else {
					yincangcebianlanx = false;
					GM_setValue("yincangcebianlan", false)
					target.value = ">>";
					if (temp3 != null) {
						temp3.style = "display:block;z-index: 10005;";
					}
					if (temp4 != null) {
						temp4.style = "display:block;";
					}
				}
				console.log("隐藏侧边栏");
			});
		}
	})();
})($);
(function($) {
	function closemeihua() {
		GM_setValue("tiebameihua", GM_getValue("tiebameihua") ? false : true);
		window.location.reload(); //刷新网页
	}
	GM_registerMenuCommand(GM_getValue("tiebameihua") ? "开启贴吧美化" : "关闭贴吧美化", closemeihua);
})($);
//备份3212行 "	background: transparent !important;",
//备份3538行 "	content: \"\\e160\";",
/*https://www.jb51.net/article/147217.htm
js监听html页面的上下滚动事件方法
var scrollFunc = function(e) {
        e = e || window.event;
        if (e.wheelDelta) { //第一步：先判断浏览器IE，谷歌滑轮事件
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
                console.log("滑轮向上滚动");
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时
                console.log("滑轮向下滚动");
            }
        } else if (e.detail) { //Firefox滑轮事件
            if (e.detail > 0) { //当滑轮向上滚动时
                console.log("滑轮向上滚动");
            }
            if (e.detail < 0) { //当滑轮向下滚动时
                console.log("滑轮向下滚动");
            }
        }
    }
    //给页面绑定滑轮滚动事件
if (document.addEventListener) { //firefox
    document.addEventListener('DOMMouseScroll', scrollFunc, false);
}
//滚动滑轮触发scrollFunc方法 //ie 谷歌
window.onmousewheel = document.onmousewheel = scrollFunc;
                获取坐标： IE  (event.x  event.y)
获取滚动条位置：
     document.body.scrollTop （滚动条离页面最上方的距离）

     document.body.scrollLeft   （滚动条离页面最左方的距离）

当我用js获取当前垂直或者水平方向滚动条位置的时候，使用"document.body.scrollTop"或者"document.body.scrollLeft"是无效的，得到的数值永远是0。但是，当写在“onscroll”事件里面的时候，上述方法可以获得当前滚动条的位置。

当网页最前面有以下内容：

<! DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
     document.documentElement.scrollTop （滚动条离页面最上方的距离）

     document.documentElement.scrollLeft   （滚动条离页面最左方的距离）
所以为了准确取得当前滚动条的位置，正确的使用方法是：

      document.documentElement.scrollTop：垂直方向
     document.documentElement.scrollLeft：水平方向
     https://blog.csdn.net/gimsoft/article/details/4424781
                */