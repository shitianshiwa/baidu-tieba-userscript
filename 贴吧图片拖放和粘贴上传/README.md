# 源项目相关
- [源脚本来自GreasyFork](https://greasyfork.org/en/scripts/633-pasteanddragimageintotiebaeditor)
- [搜到的GitHub项目](https://github.com/jaredsohn/userscript/blob/46fcc9811c161584eedc87b49b08a2ee95fae6a0/scripts/1/162380.user.js)
- 贴吧图片拖放和粘贴上传
- 标题:你们的粘贴传图脚本失效了吗？我的又失效了，数字君那个
- 链接：http://tieba.baidu.com/p/3259214565
- 标题:不推荐用UC脚本管理器加载脚本和XUL
- 链接：http://tieba.baidu.com/p/3474414995
# 安装这里的脚本
-[从GitHub下载脚本并安装](https://github.com/shitianshiwa/baidu-tieba-userscript/raw/master/%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E6%8B%96%E6%94%BE%E5%92%8C%E7%B2%98%E8%B4%B4%E4%B8%8A%E4%BC%A0/%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E6%8B%96%E6%94%BE%E5%92%8C%E7%B2%98%E8%B4%B4%E4%B8%8A%E4%BC%A0.user.js)
# 备注
* 粘贴图片可能无效，因为的浏览器为了安全考虑不允许直接访问本地路径（完全获取不到信息）
* 新增图片太大无法上传提示（大概在4MB以上？），贴吧正常的图片上传会自动压缩图片，但这个脚本没有压缩图片功能
* 兼容了贴吧新的图片链接（新的链接:tiebapic.baidu.com/forum/pic/item/,旧的链接:http://imgsrc.baidu.com/forum/pic/item/）
* 解决跨域访问问题
* 完善了报错处理
# 其它参考
- Tampermonkey 的 GM_xmlhttpRequest 如何在 onload 回调函数中访问到传入的 url。
- https://www.v2ex.com/t/228121
