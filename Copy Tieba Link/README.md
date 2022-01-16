# 源项目
* [Copy Tieba Link(复制贴吧的贴子标题与链接)](https://greasyfork.org/en/scripts/17375-copy-tieba-link)
# 反馈
- [在贴吧的反馈贴](https://tieba.baidu.com/p/6393045120)
# 安装
- [Install From openuserjs](https://openuserjs.org/scripts/shitianshiwa/Copy_Tieba_Link)
# 功能：
支持复制主题列表的贴子简介，楼层，楼中楼的链接和内容
默认设置的复制内容有
1、复制贴子简介默认为：标题、楼主、简介内容、链接、贴吧名、发贴时间
2、使用贴子内置顶复制链接按钮默认为：标题、楼主、链接、贴吧名、发贴时间
3、复制楼层简介默认包括：标题、楼主/回贴人、楼层内容、签名档图片链接、链接、贴吧名、发贴时间
4、复制楼中楼默认包括：标题、回贴人、楼中楼内容、链接、贴吧名、发贴时间

# 注意：
1、 无用户名的账号会自动用portrait代替(可以粘在这个链接后面，访问我的贴吧 https://tieba.baidu.com/home/main?id= )
2、会自动判断是不是楼主发贴
3、 如果会点javascript的话，可以在这里调整复制内容 https://github.com/shitianshiwa/baidu-tieba-userscript/blob/master/Copy%20Tieba%20Link/Copy%20Tieba%20Link.user.js#L30

```
更新日志:
2022-1-16
1、第N次修复首次进入贴子标题右边不加载复制按钮和不加载楼层的复制按钮bug
2、解决某些老贴吧复制第一层内容出错问题
3、增加可以控制保留和关闭复制内容提示框功能
4、修复代码错误导致计时器无法停止运行
5、修改简介
6、更新到jquery3.6.0
```
# 备注：
存在无法判断无用户贴吧账号(来源是直接用手机号注册百度账号且不设置贴吧用户名)是否是楼主的可能，因为是直接从楼层用户标签那里判断的，如果第二页开始楼主不回复就无法判断。
