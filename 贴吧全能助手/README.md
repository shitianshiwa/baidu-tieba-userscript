# 贴吧全能助手
* 原作者的发布链接
[https://greasyfork.org/en/scripts/26992-贴吧全能助手](https://greasyfork.org/en/scripts/26992-贴吧全能助手)<br/>
# 安装
* [Install From GitHub](https://github.com/shitianshiwa/baidu-tieba-userscript/raw/master/%E8%B4%B4%E5%90%A7%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B/%E8%B4%B4%E5%90%A7%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B.user.js)
* [Install From greasyfork](https://greasyfork.org/zh-CN/scripts/398404-%E8%B4%B4%E5%90%A7%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B-%E7%AC%AC%E4%B8%89%E6%96%B9%E4%BF%AE%E6%94%B9)
# 由于贴吧的图片链接有变动，所以点击图片放大功能失效-2019-12-29 (现在贴吧存在两种大图链接：tiebapic.baidu.com/forum/pic/item/+XXXX.jpg和imgsrc.baidu.com/forum/pic/item/+XXXX.jpg)
# 修改
* 支持显示用户头像，然而如果切换到其它贴吧号会残留上一个用户的头像，暂时在脚本管理器那里加了清除头像按钮来更新新头像
* 注释或删除了一些功能（让会员置顶按钮可以显示，修改了一些变量名字，增加了一些｛｝,修改了主题贴列表的发贴人名和回贴人名，回贴时间样式，修改了样式里的一些链接（把http改成https）等）
$('.j_lzl_container').each(_run.bind ({}, _procLzlContainer, '初始化帖子搜索'));//注释掉了
* 并入了[自动展开百度贴吧帖子的图片](https://greasyfork.org/zh-CN/scripts/396083-%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%B8%96%E5%AD%90%E7%9A%84%E5%9B%BE%E7%89%87)自动展开百度贴吧帖子的图片，方便浏览图片帖
* 显示主题贴列表里的主题贴创建时间。备注：贴吧自带的创建日期，缺失年或日
* 未完。。。
# 备注
* 已关闭所有图片功能，因为很不稳定容易失效，引用功能只有贴子链接为http的才会有效
* 有些贴吧账号PC端贴吧有夜间模式可选，这个会导致样式显示不正常
* 在tieba.baidu.com/i/i/fans这个页面有显示bug
* 尝试兼容别人的"贴吧黑夜模式"样式https://userstyles.org/styles/124770/tieba-maverick-2018   https://userstyles.org/styles/161224/maverick-demo-styles
* 以下推荐用文本编辑器去查找在那里
* tieba-maverick-2018样式还需要修改
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
* maverick-demo-styles样式还需要修改（这个不用文本编辑器，要在样式脚本管理器里面改）
	--m-href-color: hsl(0, 0%, 95%);
	--m-href-visited: hsl(0, 0%, 60%);

