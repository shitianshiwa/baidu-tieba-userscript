# 源项目
* [Tieba_Blocked_Detect(贴吧贴子屏蔽检测)](https://github.com/FirefoxBar/userscript/tree/master/Tieba_Blocked_Detect)
# 安装
- [Install From GitHub](https://github.com/shitianshiwa/baidu-tieba-userscript/raw/master/%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B/%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B(%E5%85%BC%E5%AE%B9%E7%89%88)/%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B(%E5%85%BC%E5%AE%B9%E7%89%88).user.js)
# 还需要额外安装一个脚本,否则跳页后不能检测。
* [修复电脑端贴吧主题贴内的楼层列表,让楼中楼和吧友头像可以正常加载(beta)](https://github.com/shitianshiwa/baidu-tieba-userscript/tree/master/%E4%BF%AE%E5%A4%8D%E7%94%B5%E8%84%91%E7%AB%AF%E8%B4%B4%E5%90%A7%E4%B8%BB%E9%A2%98%E8%B4%B4%E5%86%85%E7%9A%84%E6%A5%BC%E5%B1%82%E5%88%97%E8%A1%A8%2C%E8%AE%A9%E6%A5%BC%E4%B8%AD%E6%A5%BC%E5%92%8C%E5%90%A7%E5%8F%8B%E5%A4%B4%E5%83%8F%E5%8F%AF%E4%BB%A5%E6%AD%A3%E5%B8%B8%E5%8A%A0%E8%BD%BD(beta))
* [贴吧贴子屏蔽检测(非官方修改1)](https://github.com/shitianshiwa/baidu-tieba-userscript/tree/master/%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B/%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B(%E9%9D%9E%E5%AE%98%E6%96%B9%E4%BF%AE%E6%94%B91))]和[贴吧贴子屏蔽检测(非官方修改2)](https://github.com/shitianshiwa/baidu-tieba-userscript/tree/master/%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B/%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B(%E9%9D%9E%E5%AE%98%E6%96%B9%E4%BF%AE%E6%94%B92))应该没有这个缺陷
# 说明
* 测试中（重点）
* 无用户名贴吧账号，后来补用户名，原本就有用户名的都可以运行
* 修改为只在各个贴吧的主题列表和主题贴内运行
* 这个会消耗额外的流量，使用wap贴吧的api来判断贴子是否显示（只能判断自己的贴子是否被隐藏）
* 发主题贴或回贴后，屏蔽样式会消失，刷新贴吧即可
* 发现有时会因为网络问题导致判断出错(应该修好了)
* 点击主题贴列表或楼层列表按钮后会导致本脚本无效化（原版，非官方版没有这个问题）
* 发贴后可能会误判断，刷新一下贴吧应该可以解决
* 2019-12-15才发现我改的脚本的缓存功能是失效的，而作者的是有用的(刚发现本来当时就是失效的233)。没有缓存功能，就刷新一次网页请求N个wap贴吧贴子，如果疯狂刷新网页的话，不知道。。!

