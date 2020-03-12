// ==UserScript==
// @name         Copy Tieba Link
// @version      1.1(0.0133)
// @description  复制贴吧的贴子标题与链接
// @match        *://tieba.baidu.com/*
// @include      *://tieba.baidu.com/*
// @author       864907600cc
// @icon         https://secure.gravatar.com/avatar/147834caf9ccb0a66b2505c753747867
// @run-at       document-idle
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @namespace    http://ext.ccloli.com
// @downloadURL  https://github.com/shitianshiwa/baidu-tieba-userscript/
// ==/UserScript==
//document-start
var setting = {
    title: true,
    author: true,
    with_at: false,
    tiebaming: true,
    link: true,
    neirong_l: true,
    neirong_lzl: true,
    split: "\n",
    tips: true,
    tips_time: 5
};
// 是否复制标题，默认为 true
// 是否复制作者（复制楼中楼时则为楼中楼作者），默认为 false
// 若复制作者，则是否需要添加 @，默认为 true
// 是否复制贴吧名，默认为 true
// 是否复制链接，默认为 true
// 是否楼层的内容，默认为true
// 是否楼中楼的内容，默认为true
// 分隔符，默认为换行符 \n
// 是否显示提示信息，默认为 true
// 提示显示时间，默认为 5（秒）
var linkAnchor = document.createElement('a');
linkAnchor.className = 'tieba-link-anchor';
linkAnchor.textContent = '[复制链接]';

var linkPath = 'http://tieba.baidu.com/p/';
var tieba = PageData.forum.name;
var louzhu1 = $("div.l_post").children("div.d_author").children("div.louzhubiaoshi_wrap")[0]; //获取楼主的portrait，这个在我的贴吧链接可直接找到(id=xxxxxxxx)
var louzhu2;
if (louzhu1 != undefined) {
    louzhu2 = JSON.parse(louzhu1.parentNode.parentNode.getAttribute("data-field").replace(/'/g, '"')).author.portrait.split("?")[0];
} else {
    louzhu2 = "";
}

function copyLink() {
    var textGroup = [];
    var text;
    var parent = this.parentElement;
    //console.log(parent.parentNode.children[2].innerHTML);
    //console.log(parent.parentNode.parentNode.children[0].children[1].children[1].innerHTML);//楼层除了第一层
    //console.log(parent.parentNode.parentNode.parentNode.children[1].children[0].children[3].children[1].innerHTML);//楼层第1层
    //console.log(parent.parentNode.children[2].children[0].innerHTML);
    //console.log(parent.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
    //console.log(parent.parentNode.parentNode.children[0].children[1].children[1]);//楼层除了第一层
    //console.log(parent.parentNode.parentNode.children[0].children[3].children[1]);//旧版贴吧楼层第一层
    if (this.dataset.linkText) text = this.dataset.linkText;
    else {
        switch (this.dataset.anchorType) {
            case '0': // 贴吧主题贴列表获取贴子链接
                var temp = JSON.parse(parent.nextElementSibling.getElementsByClassName('j_user_card')[0].getAttribute("data-field"));
                if (setting.title) textGroup.push("标题: " + parent.getElementsByClassName('j_th_tit')[0].getAttribute('title') + " ");
                if (setting.author) textGroup.push((setting.with_at ? '楼主: @' : '楼主: ') + (temp.un != "" && temp.un != "null" ? temp.un : temp.id) + ' ');
                //parent.nextElementSibling.getElementsByClassName('j_user_card')[0].textContent//旧的复制用户名，会复制昵称
                if (setting.link) textGroup.push("链接：" + parent.getElementsByClassName('j_th_tit')[0].href + " ");
                if (setting.tiebaming) textGroup.push("百度贴吧: " + tieba + "吧 ");
                break;
            case '1': // 贴子内页获取贴子链接
                //console.log($("div.l_post").children("div.d_author").children("div.louzhubiaoshi_wrap")[0]);
                //console.log(JSON.parse($("div.l_post").children("div.d_author").children("div.louzhubiaoshi_wrap")[0].parentNode.parentNode.getAttribute("data-field").replace(/'/g, '"')).author.portrait.split("?")[0]);

                if (setting.title) textGroup.push("标题: " + unsafeWindow.PageData.thread.title + " ");
                if (setting.author) textGroup.push((setting.with_at ? '楼主: @' : '楼主: ') + (unsafeWindow.PageData.thread.author != "" ? unsafeWindow.PageData.thread.author : louzhu2) + ' '); //portrait
                if (setting.link) textGroup.push("链接：" + linkPath + unsafeWindow.PageData.thread.thread_id + " ");
                if (setting.tiebaming) textGroup.push("百度贴吧: " + tieba + "吧 ");
                break;
            case '2': // 贴子内页获取楼层链接
                //获取楼层的内容
                var floorData00 = parent.parentNode.parentNode.children[0].children[1].children[1] || parent.parentNode.parentNode.children[0].children[3].children[1] || parent.parentNode.parentNode.parentNode.children[1].children[0].children[3].children[1];
                var floorData = JSON.parse(parent.parentElement.parentElement.parentElement.dataset.field);
                var floorData02 = parent.parentNode.parentNode.parentNode.children[0].children[0].getAttribute("class");
                //console.log(parent.parentNode.parentNode.parentNode.children[0].children[0].getAttribute("class"))判断是不是楼主
                if (setting.title) textGroup.push("标题: " + unsafeWindow.PageData.thread.title + ' #' + floorData.content.post_no + " ");
                if (setting.author) textGroup.push((floorData.content.post_no == 1 || floorData02 == "louzhubiaoshi_wrap" ? (setting.with_at ? '楼主: @' : '楼主: ') : (setting.with_at ? '层主: @' : '层主: ')) + (floorData.author.user_name != "" && floorData.author.user_name != "null" ? floorData.author.user_name : floorData.author.portrait) + ' ');
                if (setting.neirong_l) textGroup.push("内容: " + floorData00.innerHTML + " ");
                if (setting.link) textGroup.push("链接：" + linkPath + unsafeWindow.PageData.thread.thread_id + '?pid=' + floorData.content.post_id + '#' + floorData.content.post_id + " ");
                if (setting.tiebaming) textGroup.push("百度贴吧: " + tieba + "吧 ");
                break;
            case '3': // 贴子楼中楼获取链接
                //获取楼层pid、楼层数 兼容http和https的贴子
                var floorData0 = parent.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-field") || parent.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-field");
                //获取用户名和回复贴spid

                var floorData1 = JSON.parse(floorData0.replace(/'/g, '"')); //JSON.parse必须用"才行，例如：{"XXX":"XXXX"}

                var floorData2 = JSON.parse(parent.parentNode.parentNode.getAttribute("data-field").replace(/'/g, '"')); //spid JSON.parse(parent.parentElement.parentElement.parentElement.dataset.field);
                var floorData3 = JSON.parse(floorData0.replace(/'/g, '"')); //楼层pid
                if (setting.title) textGroup.push("标题: " + unsafeWindow.PageData.thread.title + ' #' + floorData1.floor_num + ' 楼中楼 ');
                if (setting.author) textGroup.push(((floorData2.user_name == unsafeWindow.PageData.thread.author && floorData2.user_name != "" && floorData2.user_name != "null") || floorData2.portrait == louzhu2 ? (setting.with_at ? '楼主: @' : '楼主: ') : (setting.with_at ? '回复人: @' : '回复人: ')) + (floorData2.user_name != "" && floorData2.user_name != "null" ? floorData2.user_name : floorData2.portrait) + ' ');
                //应该不会有用户名是null的吧？
                if (setting.neirong_lzl) textGroup.push("内容: " + (parent.parentNode.children[2].getAttribute("class") == "lzl_content_main" ? parent.parentNode.children[2].innerHTML : parent.parentNode.children[3].innerHTML) + " ");
                //console.log(parent.parentNode.children[3].getAttribute("class"));
                /*
                普通的 #j_p_postlist > div:nth-child(25) > div.d_post_content_main > div.core_reply.j_lzl_wrapper > div.j_lzl_container.core_reply_wrapper > div.j_lzl_c_b_a.core_reply_content > ul > li:nth-child(2) > div.lzl_cnt > span.lzl_content_main
                会员的 #j_p_postlist > div:nth-child(25) > div.d_post_content_main > div.core_reply.j_lzl_wrapper > div.j_lzl_container.core_reply_wrapper > div.j_lzl_c_b_a.core_reply_content > ul > li.lzl_single_post.j_lzl_s_p.first_no_border > div.lzl_cnt > span.lzl_content_main
                */
                if (setting.link) textGroup.push("链接：" + linkPath + unsafeWindow.PageData.thread.thread_id + '?pid=' + floorData3.pid + "&cid=" + floorData2.spid + '#' + floorData2.spid + " ");
                if (setting.tiebaming) textGroup.push("百度贴吧: " + tieba + "吧 ");
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
    if (setting.tips) showTips('以下内容已复制到剪贴板：\n' + text);
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

    if (classList.contains('threadlist_title') && target.querySelectorAll(".tieba-link-anchor").length == 0) { //贴吧主题贴列表
        curAnchor.setAttribute('data-anchor-type', '0');
        target.appendChild(curAnchor);
        //target.insertBefore(curAnchor, target.getElementsByClassName('j_th_tit')[0]);
    } else if (classList.contains('core_title_btns') && target.querySelectorAll(".tieba-link-anchor").length == 0) { // $("ul.core_title_btns>a.tieba-link-anchor")[0] && document.querySelectorAll(".core_title_btns>a.tieba-link-anchor")[0] == null
        curAnchor.setAttribute('data-anchor-type', '1'); //贴子内的标题
        target.appendChild(curAnchor);
        //console.log(target.querySelectorAll(".tieba-link-anchor"));
    } else if (classList.contains('core_reply_tail') && target.querySelectorAll(".tieba-link-anchor").length == 0) { //core_title
        curAnchor.setAttribute('data-anchor-type', '2'); //楼层
        target.appendChild(curAnchor);
    } else if (classList.contains('lzl_content_reply') && target.querySelectorAll(".tieba-link-anchor").length == 0) { //threadlist_title 楼中楼 && document.querySelectorAll(".lzl_content_reply>a.tieba-link-anchor")[0] == null
        curAnchor.setAttribute('data-anchor-type', '3');
        target.appendChild(curAnchor); //target.getElementsByClassName('j_th_tit')[0] insertBefore('','')
        //console.log(target.querySelectorAll(".tieba-link-anchor"));
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
display: inline-block;
color: #f74d4a !important;
cursor: pointer;
float: right;
}

.j_thread_list:hover .tieba-link-anchor,
.l_post:hover .tieba-link-anchor,
.core_title:hover .tieba-link-anchor,
.tieba-link-anchor:hover {

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