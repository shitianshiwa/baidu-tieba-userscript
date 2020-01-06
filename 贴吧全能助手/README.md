# 贴吧全能助手
* 原作者的发布链接
[https://greasyfork.org/en/scripts/26992-贴吧全能助手](https://greasyfork.org/en/scripts/26992-贴吧全能助手)<br/>
# 安装
* [Install From GitHub](https://github.com/shitianshiwa/baidu-tieba-userscript/raw/master/%E8%B4%B4%E5%90%A7%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B/%E8%B4%B4%E5%90%A7%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B.user.js)
# 由于贴吧的图片链接有变动，所以点击图片放大功能失效-2019-12-29 (现在贴吧存在两种大图链接：tiebapic.baidu.com/forum/pic/item/+XXXX.jpg和imgsrc.baidu.com/forum/pic/item/+XXXX.jpg)
# 修改
* 注释或删除了一些功能（让会员置顶按钮可以显示，关掉了发贴按时间排列，修改了一些变量名字，增加了一些｛｝,修改了主题贴列表的发贴人名和回贴人名，回贴时间样式，修改了样式里的一些链接（把http改成https）等）
$('.j_lzl_container').each(_run.bind ({}, _procLzlContainer, '初始化帖子搜索'));//注释掉了
document.getElementsByClassName('card_infoNum')[0].parentNode.appendChild(a);//发贴按时间排列注释掉了
# 备注
* 这里的脚本有图片功能经常失效bug，引用功能只有贴子链接为http的才会有效
* 有些贴吧账号PC端贴吧有夜间模式可选，这个会导致样式显示不正常

