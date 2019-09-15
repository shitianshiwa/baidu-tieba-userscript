# 源项目
* [Tieba_Blocked_Detect(贴吧贴子屏蔽检测)](https://github.com/FirefoxBar/userscript/tree/master/Tieba_Blocked_Detect)
# 安装
- [Install From GitHub](https://github.com/shitianshiwa/baidu-tieba-userscript/raw/master/%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B/%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B(%E9%9D%9E%E5%AE%98%E6%96%B9%E4%BF%AE%E6%94%B9)/%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B(%E9%9D%9E%E5%AE%98%E6%96%B9%E4%BF%AE%E6%94%B9).user.js)
# 修改
* 无用户名的贴吧账号无法正常运行此脚本（经修复，无用户名，补用户名，有用户名都可以运行）
* 修改为只在各个贴吧的主页和主题贴里运行
* 修改了屏蔽显示样式，已避免特殊情况下，导致楼层错位（'position: absolute;'改为'position: relative;''）
* 这个会消耗额外的流量，使用wap贴吧的api来判断贴子是否显示（只能判断自己的贴子是否被隐藏）
* 用portrait代替用户名 http://tieba.baidu.com/f/user/json_userinfo
* api参考 
* https://t.52fisher.cn/tb-remind.html
* https://t.52fisher.cn/js/remind.uesr.js