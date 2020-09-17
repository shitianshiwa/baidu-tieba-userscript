# 贴吧全能助手
- 原作者的发布链接： https://greasyfork.org/en/scripts/26992-贴吧全能助手 by 忆世萧遥
- 百度贴吧按发帖时间（帖子ID）排序 by NULL
- 查看发帖 by 文科
- 百度贴吧图片点击放大 by lliwhx
- 百度贴吧：不登录即可看贴 by VA
- 梦姬贴吧助手 by jixun
- 引用脚本库 https://greasyfork.org/scripts/2657/code/tieba_ui.js ,Interval_Looper.js,gm2_port_v103.js by Jixun.Moe
- 脚本主题样式 https://userstyles.org/styles/124770/tieba-maverick-2018 TieBa - Maverick by Onox
- 待补充完整。。。

- 贴吧发贴技巧提示：
- 0、贴吧现在有屏蔽审核贴子系统，系统认为贴子内容有问题即隐藏贴子为仅自己可见，外人无法看见。
- 1、新发出的主题贴如果自己点击收藏失败则为被隐藏了。
- 2、楼层和楼中楼一般情况下只能依靠另开一个未登录的浏览器看自己的贴子来确认是否被隐藏了，楼中楼二楼及之后被隐藏回复自己也看不到。
- 3、贴吧客户端可以尝试点赞自己，然后退出刷新再进看看是否点赞成功了，没有成功则为被隐藏（未测试过）
- 4、被隐藏的贴子或回复过一段时间后可能会过审自己显示出来，不想反复删发可以尝试等待。
- 5、图片相对不容易被隐藏，只要处理过（仅适合发长文）

# 只测试了Google Chrome 75.0.3770.142（正式版本） （64 位）
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
* 引用功能只有在旧版贴吧才会有效（不开脚本贴子UI看起来比较老的样子）
* 有些贴吧账号PC端贴吧有夜间模式可选，这个会导致样式显示不正常
* 在tieba.baidu.com/i/i/fans这个页面有显示bug
* 尝试兼容别人的"贴吧黑夜模式"样式https://userstyles.org/styles/124770/tieba-maverick-2018   https://userstyles.org/styles/161224/maverick-demo-styles
* 要选择"夜间模式"才是基本全黑的，否则发主题帖的编辑器会有点亮。。！
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
#footer {
margin-bottom: 20px !important;
background-color:#000 !important;
}
.forum_foot{
border-radius: 0 0 var(--m-radius) var(--m-radius);
background-color:#000 !important;
}
不修改以上两个，贴吧底部可能会有点亮
* maverick-demo-styles样式还需要修改（这个不用文本编辑器，要在样式脚本管理器里面改）
	--m-href-color: hsl(0, 0%, 95%);
	--m-href-visited: hsl(0, 0%, 60%);

