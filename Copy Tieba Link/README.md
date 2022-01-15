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
1、 无用户名的账号会自动用portrait代替(可以粘在这个链接后面，访问我的贴吧 http://tieba.baidu.com/home/main?id= )
2、会自动判断是不是楼主发贴
3、 如果会点javascript的话，可以在这里调整复制内容 https://github.com/shitianshiwa/baidu-tieba-userscript/blob/master/Copy%20Tieba%20Link/Copy%20Tieba%20Link.user.js#L30

# 备注：
存在无法判断无用户贴吧账号是否是楼主的可能，因为是直接从楼层用户标签那里判断的，如果第二页开始楼主不回复就无法判断。
