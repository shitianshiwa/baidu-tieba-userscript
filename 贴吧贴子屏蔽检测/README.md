# 原作者的脚本
- [Install From GitHub](https://github.com/FirefoxBar/userscript/raw/master/Tieba_Blocked_Detect/Tieba_Blocked_Detect.user.js)
- [Install From GreasyFork](https://greasyfork.org/zh-CN/scripts/383981)
# 源项目
* [Tieba_Blocked_Detect(贴吧贴子屏蔽检测)](https://github.com/FirefoxBar/userscript/tree/master/Tieba_Blocked_Detect)
# 作者已修复bug，已使用版本1或版本2的，都推荐直接用作者的(屏蔽显示样式没有我的那么刺眼，如果仍需要的话，可以把这个"background: rgba(255, 0, 0, 0.05);"改成"background: rgba(255, 0, 0, 0.3);"版本3，不知道。。！)

# 2019年12月4日，经简单观察，贴吧屏蔽似乎已经很弱了，大部分贴子最终都能显示出来。

# 最新情况。2019年10月26日经初版测试，百度贴吧系统没有再自动屏蔽长串数字和链接了，可能几天前就解除了屏蔽？（发的贴子别人看不到，只有自己可以看见）。
* 补充：并没有完全解除，百度网盘仍会被屏蔽掉。而且，即使链接成功发出来了，仍可能被系统延迟删除。新浪的短链接会被屏蔽掉。

# 修改版
* 版本1（非官方修改）：修改为只在各个贴吧的主页和主题贴里运行。修改了屏蔽显示样式，已避免特殊情况下，导致楼层错位（'position: absolute;'改为'position: relative;''）,加深了屏蔽颜色

* 版本2（非官方修改）：修改为只在各个贴吧的主页和主题贴里运行。修改了屏蔽显示样式，已避免特殊情况下，导致楼层错位（'position: absolute;'改为'position: relative;''）,加深了屏蔽颜色。用portrait代替用户名 
http://tieba.baidu.com/f/user/json_userinfo
现在是两种方式取用户id，先网页，网页取不到用贴吧api取，都取不到就不能正常运行。
api参考
https://t.52fisher.cn/tb-remind.html
https://t.52fisher.cn/js/remind.user.js
* 版本3（兼容版）：测试中！修改为只在各个贴吧的主页和主题贴里运行。修改了屏蔽显示样式，已避免特殊情况下，导致楼层错位（'position: absolute;'改为'position: relative;''）,加深了屏蔽颜色。用portrait代替用户名
http://tieba.baidu.com/f/user/json_userinfo
* api参考
https://t.52fisher.cn/tb-remind.html
https://t.52fisher.cn/js/remind.user.js
