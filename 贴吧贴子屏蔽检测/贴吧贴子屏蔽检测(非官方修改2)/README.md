# 原作者的脚本
- [Install From GitHub](https://github.com/FirefoxBar/userscript/raw/master/Tieba_Blocked_Detect/Tieba_Blocked_Detect.user.js)
- [Install From GreasyFork](https://greasyfork.org/zh-CN/scripts/383981)
# 源项目
* [Tieba_Blocked_Detect(贴吧贴子屏蔽检测)](https://github.com/FirefoxBar/userscript/tree/master/Tieba_Blocked_Detect)
# 作者已修复bug，推荐直接用作者的(屏蔽显示样式没有我的那么刺眼，如果仍需要的话，可以把这个"background: rgba(255, 0, 0, 0.05);"改成"background: rgba(255, 0, 0, 0.3);")
# 源项目
* [Tieba_Blocked_Detect(贴吧贴子屏蔽检测)](https://github.com/FirefoxBar/userscript/tree/master/Tieba_Blocked_Detect)
# 安装
- [Install From GitHub](https://github.com/shitianshiwa/baidu-tieba-userscript/raw/master/%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B/%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B(%E9%9D%9E%E5%AE%98%E6%96%B9%E4%BF%AE%E6%94%B92)/%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B(%E9%9D%9E%E5%AE%98%E6%96%B9%E4%BF%AE%E6%94%B92).user.js)
# 修改
* 无用户名的贴吧账号无法正常运行此脚本（经修复，贴吧账号无用户名，后来补用户名，原本就有用户名的都可以运行）
* 修改为只在各个贴吧的主页和主题贴里运行
* 修改了屏蔽显示样式，已避免特殊情况下，导致楼层错位（'position: absolute;'改为'position: relative;''）
* 这个会消耗额外的流量，使用wap贴吧的api来判断贴子是否显示（只能判断自己的贴子是否被隐藏）
* 发主题贴或回贴后，屏蔽样式可能会消失，刷新贴吧即可
* 用portrait代替用户名 http://tieba.baidu.com/f/user/json_userinfo
现在是两种方式取用户id，先网页，网页取不到用贴吧api取，都取不到就不能正常运行。
* api参考 
* https://t.52fisher.cn/tb-remind.html
* https://t.52fisher.cn/js/remind.user.js
* 开始使用时，不一定会马上见效，重复刷新几次网页看看（也许修好了？）
* 发贴后可能会误判断，刷新一下贴吧应该可以解决
