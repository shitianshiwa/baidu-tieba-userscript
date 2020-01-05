// ==UserScript==
// @name         Copy Tieba Link
// @version      1.1(0.01)
// @description  复制贴吧的贴子标题与链接
// @match        *://tieba.baidu.com/*
// @include      *://tieba.baidu.com/*
// @author       864907600cc
// @icon         https://secure.gravatar.com/avatar/147834caf9ccb0a66b2505c753747867
// @run-at       document-start
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @namespace    http://ext.ccloli.com
// @downloadURL  https://github.com/shitianshiwa/baidu-tieba-userscript/
// ==/UserScript==

var setting = {
    title: true,
    author: true,
    with_at: false,
    link: true,
    split: "\n",
    tips: true,
    tips_time: 5
};
// 是否复制标题，默认为 true
// 是否复制作者（复制楼中楼时则为楼中楼作者），默认为 false
// 若复制作者，则是否需要添加 @，默认为 true
// 是否复制链接，默认为 true
// 分隔符，默认为换行符 \n
// 是否显示提示信息，默认为 true
// 提示显示时间，默认为 5（秒）
var linkAnchor = document.createElement('a');
linkAnchor.className = 'tieba-link-anchor';
linkAnchor.textContent = '[复制链接]';

var linkPath = 'http://tieba.baidu.com/p/';


function copyLink() {
    var textGroup = [];
    var text;
    var parent = this.parentElement;
    //console.log(parent.parentNode.parentNode);
    if (this.dataset.linkText) text = this.dataset.linkText;
    else {
        switch (this.dataset.anchorType) {
            case '0': // 贴吧主题贴列表获取贴子链接
                if (setting.title) textGroup.push(parent.getElementsByClassName('j_th_tit')[0].getAttribute('title'));
                if (setting.author) textGroup.push((setting.with_at ? '楼主:@' : '楼主:') + parent.nextElementSibling.getElementsByClassName('j_user_card')[0].textContent + ' ');
                if (setting.link) textGroup.push(parent.getElementsByClassName('j_th_tit')[0].href);
                break;
            case '1': // 贴子内页获取贴子链接
                if (setting.title) textGroup.push(unsafeWindow.PageData.thread.title);
                if (setting.author) textGroup.push((setting.with_at ? '楼主:@' : '楼主:') + unsafeWindow.PageData.thread.author + ' ');
                if (setting.link) textGroup.push(linkPath + unsafeWindow.PageData.thread.thread_id);
                break;
            case '2': // 贴子内页获取楼层链接
                var floorData = JSON.parse(parent.parentElement.parentElement.parentElement.dataset.field);
                if (setting.title) textGroup.push(unsafeWindow.PageData.thread.title + ' #' + floorData.content.post_no);
                if (setting.author) textGroup.push((setting.with_at ? '层主:@' : '层主:') + floorData.author.user_name + ' ');
                if (setting.link) textGroup.push(linkPath + unsafeWindow.PageData.thread.thread_id + '?pid=' + floorData.content.post_id + '#' + floorData.content.post_id);
                break;
            case '3': // 贴子楼中楼获取链接
                //获取楼层数 兼容http和https的贴子
                var floorData0 = parent.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-field") || parent.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-field");
                //获取用户名和回复贴spid
                var floorData1 = JSON.parse(floorData0.replace(/'/g, '"')); //JSON.parse必须用"才行，例如：{"XXX":"XXXX"}
                var floorData2 = JSON.parse(parent.parentNode.parentNode.getAttribute("data-field").replace(/'/g, '"')); //JSON.parse(parent.parentElement.parentElement.parentElement.dataset.field);
                var floorData3 = JSON.parse(parent.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-field").replace(/'/g, '"')); //楼层pid
                if (setting.title) textGroup.push(unsafeWindow.PageData.thread.title + ' #' + floorData1.floor_num + ' 楼中楼');
                if (setting.author) textGroup.push((setting.with_at ? '回复人:@' : '回复人:') + floorData2.user_name + ' ');
                if (setting.link) textGroup.push(linkPath + unsafeWindow.PageData.thread.thread_id + '?pid=' + floorData3.pid + "&cid=" + floorData2.spid + '#' + floorData2.spid);
                //贴吧自带的楼中楼回复定位只能定到楼层那里，楼中楼的回复具体位置要自己去找
                //console.log(parent.parentNode.parentNode.parentNode);
                //console.log(parent.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
                //console.log(parent.parentNode.parentNode.parentNode.parentNode.parentNode);//获取楼层pid
                //console.log(parent.parentNode.parentNode.getAttribute("data-field").replace(/'/g,'"'));//https://www.runoob.com/jsref/jsref-replace.html JavaScript replace() 方法
                //console.log(floorData2);
                //if (setting.author) textGroup.push((setting.with_at ? '@' : '') + floorData.author.user_name + ' ');
                //if (setting.link) textGroup.push(linkPath + unsafeWindow.PageData.thread.thread_id + '?pid=' + floorData.content.post_id + '#' + floorData.content.post_id);
                break;
        }
        console.log(textGroup);
        text = textGroup.join(setting.split);
        this.setAttribute('data-link-text', text);
    }

    GM_setClipboard(text);
    if (setting.tips) showTips('以下内容已复制到剪贴板：\n\n' + text);
}

function showTips(text) {
    var text2 = text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');

    var node = document.createElement('div');
    node.className = 'tieba-link-tips';
    node.innerHTML = text2;
    document.body.appendChild(node);

    setTimeout(function() {
        document.body.removeChild(node);
    }, setting.tips_time * 1000);
}

function catchLinkTarget(event) {
    if (event.animationName !== 'tiebaLinkTarget') return;

    var target = event.target;
    var classList = target.classList;

    var curAnchor = linkAnchor.cloneNode(true);
    curAnchor.addEventListener('click', copyLink);

    if (classList.contains('threadlist_title')) { //贴吧主题贴列表
        curAnchor.setAttribute('data-anchor-type', '0');
        target.insertBefore(curAnchor, target.getElementsByClassName('j_th_tit')[0]);
    } else if (classList.contains('core_title_btns') && document.querySelectorAll("ul.core_title_btns>a.tieba-link-anchor")[0] == null) { // $("ul.core_title_btns>a.tieba-link-anchor")[0]
        curAnchor.setAttribute('data-anchor-type', '1'); //贴子内的标题
        target.appendChild(curAnchor);
    } else if (classList.contains('core_reply_tail')) { //core_title
        curAnchor.setAttribute('data-anchor-type', '2'); //楼层
        target.appendChild(curAnchor);
    } else if (classList.contains('lzl_content_reply')) { //threadlist_title 楼中楼
        curAnchor.setAttribute('data-anchor-type', '3');
        target.appendChild(curAnchor); //target.getElementsByClassName('j_th_tit')[0] insertBefore('','')
    }

}

// 使用 animation 事件，方便处理贴吧 ajax 加载数据
document.addEventListener('animationstart', catchLinkTarget, false);
document.addEventListener('MSAnimationStart', catchLinkTarget, false);
document.addEventListener('webkitAnimationStart', catchLinkTarget, false);

GM_addStyle(`
@-webkit-keyframes tiebaLinkTarget {}
@-moz-keyframes tiebaLinkTarget {}
@keyframes tiebaLinkTarget {}

@-webkit-keyframes tiebaLinkTips {
from {
opacity: 0;
bottom: -75px;
}
20% {
opacity: 1;
bottom: 10px;
}
80% {
opacity: 1;
bottom: 10px;
}
to {
opacity: 0;
bottom: -75px;
}
}
@-moz-keyframes tiebaLinkTips {
from {
opacity: 0;
bottom: -75px;
}
20% {
opacity: 1;
bottom: 10px;
}
80% {
opacity: 1;
bottom: 10px;
}
to {
opacity: 0;
bottom: -75px;
}
}
@keyframes tiebaLinkTips {
from {
opacity: 0;
bottom: -75px;
}
20% {
opacity: 1;
bottom: 10px;
}
80% {
opacity: 1;
bottom: 10px;
}
to {
opacity: 0;
bottom: -75px;
}
}

.tieba-link-anchor {
display: none;
color: #f74d4a !important;
cursor: pointer;
float: right;
}

.j_thread_list:hover .tieba-link-anchor,
.l_post:hover .tieba-link-anchor,
.core_title:hover .tieba-link-anchor,
.tieba-link-anchor:hover {
display: inline-block;
}

.lzl_content_reply,
.core_reply_tail,
.core_title_btns,
.threadlist_title
{
-webkit-animation: tiebaLinkTarget;
-moz-animation: tiebaLinkTarget;
animation: tiebaLinkTarget;
}

.core_title:hover .core_title_txt {
width: 420px !important;
}

.tieba-link-tips {
background: #ff7f3e;
font-size: 14px;
padding: 10px;
border-radius: 3s;
position: fixed;
right: 10px;
color: #ffffff;
z-index: 99999999;
pointer-events: none;
-webkit-animation: tiebaLinkTips ` + setting.tips_time + `s;
-moz-animation: tiebaLinkTips ` + setting.tips_time + `s;
animation: tiebaLinkTips ` + setting.tips_time + `s;
}
`);