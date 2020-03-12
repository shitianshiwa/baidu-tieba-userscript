# 源项目
* [Copy Tieba Link(复制贴吧的贴子标题与链接)](https://greasyfork.org/en/scripts/17375-copy-tieba-link)
# 安装
- [Install From GitHub](https://github.com/shitianshiwa/baidu-tieba-userscript/raw/master/Copy%20Tieba%20Link/Copy%20Tieba%20Link.user.js)
# 功能
- 支持复制主题列表，贴子，楼层，楼中楼链接
- 默认包括标题、发贴人、链接和贴吧名。楼层和楼中楼还会包括内容
- 无用户名的账号用portrait代替(可以粘在这个链接后面，访问我的贴吧 http://tieba.baidu.com/home/main?id= )
- 会自动判断是不是楼主发贴
- 如果会点javascript的话，可以在这里调整复制内容 https://github.com/shitianshiwa/baidu-tieba-userscript/blob/master/Copy%20Tieba%20Link/Copy%20Tieba%20Link.user.js#L16
# 备注
- 暂时解决不了复制内容会夹杂无关网页标签的问题
- 存在无法判断无用户贴吧账号是否是楼主的可能，因为是直接从楼层用户标签那里判断的，如果第二页开始楼主不回复就无法判断。
