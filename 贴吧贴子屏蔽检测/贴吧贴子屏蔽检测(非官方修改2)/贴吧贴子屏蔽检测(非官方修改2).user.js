// ==UserScript==
// @name        贴吧贴子屏蔽检测(非官方修改2)
// @version     1.0(非官方修改2beta0.34)
// @description 贴吧都快凉了，过去的痕迹都没了，你为什么还在刷贴吧呢？你们建个群不好吗？
// @include     http*://tieba.baidu.com/p/*
// @include     http*://tieba.baidu.com/f?*
// @grant       none
// @author      shitianshiwa,864907600cc(原项目作者)
// @icon        https://secure.gravatar.com/avatar/147834caf9ccb0a66b2505c753747867
// @namespace   http://ext.ccloli.com
// @license     GPL-3.0
// @namespace   https://github.com/FirefoxBar/userscript/tree/master/Tieba_Blocked_Detect
// @downloadURL  https://github.com/shitianshiwa/baidu-tieba-userscript/tree/master/%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B/%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B(%E9%9D%9E%E5%AE%98%E6%96%B9%E4%BF%AE%E6%94%B9)
// ==/UserScript==
/*
1.无用户名的贴吧账号无法正常运行此脚本（经修复，贴吧账号无用户名，后来补用户名，原本就有用户名的都可以运行）
2.修改为只在各个贴吧的主页和主题贴里运行
3.修改了屏蔽显示样式，已避免特殊情况下，导致楼层错位（'position: absolute;'改为'position: relative;''）
4.用portrait代替贴吧帐号用户名(http://tieba.baidu.com/f/user/json_userinfo),api参考(https://t.52fisher.cn/tb-remind.html)
5.发贴后可能会误判断，刷新一下贴吧应该可以解决
*/
'use strict';

/*
原页面中已引入 jQuery, 但是 tampermonkey 编辑器中总是提示

$ is not defined

虽然不影响实际运行，但是看上去非常不爽。

在代码头部插入

var $ = unsafeWindow.jQuery;
即可解决。

tampermonkey $ is not defined - Tampermonkey - 大象笔记
https://www.sunzhongwei.com/tampermonkey-dollar-is-not-defined?from=sidebar_related

另一种情况，确实是没有引入 jQuery
例如， unsafeWindow.jQuery 也是 null，说明页面并没有引入 jQuery。

这时就需要在 tampermonkey 中指定引入 jQuery。例如：

// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
*/

var $ = window.jQuery;
const threadCache = {};
const replyCache = {};

//if(sessionStorage.getItem("miaouserid")==null)//用这个的话，切换贴吧账号后id不会变成新的，导致屏蔽检测失效，贴吧自己在刷新时也会再次调用这个api233
//{
$.get("/f/user/json_userinfo","",
      function(o)
      {
    if(o!=null)
    {
        sessionStorage.setItem("miaouserid",o.data.user_portrait);
    }
},"json");//参考了贴吧自己的使用方式，电脑浏览器网页开发者工具可见。
//}
/*
获取portrait,需要传递用户cookie，用户未登录返回null。
各贴吧首页主题贴列表和各个贴子的网页代码的head标签里的script标签里json代码里的portrait与贴子，楼层，楼中楼有差异，所以不取。

百度贴吧使用的jquery版本为1.7.2
https://cdn.staticfile.org/jquery/1.7.2/jquery.min.js
$.fn.jquery
$.prototype.jquery
这两种方式都可以获取到jquery的版本号
获取jQuery版本号 - fullStack-yang - 博客园
https://www.cnblogs.com/fullstack-yang/p/6101650.html
*/

/**
 * 精简封装 fetch 请求，自带请求 + 通用配置 + 自动 .text()
 *
 * @param {string} url - 请求 URL
 * @param {object} [options={}] - fetch Request 配置
 * @returns {Promise<string>} fetch 请求
 */
const request = (url, options = {}) => fetch(url, Object.assign({
    credentials: 'omit',
    // 部分贴吧（如 firefox 吧）会强制跳转回 http
    redirect: 'follow',
    // 阻止浏览器发出 CORS 检测的 HEAD 请求头
    mode: 'same-origin',
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
}, options)).then(res => res.text());


/**
 * 获取当前用户是否登录
 *
 * @returns {number|boolean} 是否登录，若已登录，贴吧页为 1，贴子页为 true
 */
const getIsLogin = () => window.PageData.user.is_login;

/**
 * 获取当前用户的用户名
 *
 * @returns {string} 用户名
 */
const getUsername = () => sessionStorage.getItem("miaouserid")||"";
//decodeURI(document.querySelectorAll("div.user_name>a")[0].href);//得到我的贴吧链接；window.PageData.user.name || window.PageData.user.user_name;
/**
encodeURI(URIstring)
http://www.w3school.com.cn/My first/
http://www.w3school.com.cn/My%20first/
decodeURI(URIstring)
http://www.w3school.com.cn/My%20first/
http://www.w3school.com.cn/My first/
定义和用法
decodeURI() 函数可对 encodeURI() 函数编码过的 URI 进行解码。
 * 获取 \u 形式的 unicode 字符串
 *
 * @param {string} str - 需要转码的字符串
 * @returns {string} 转码后的字符串
 */
const getEscapeString = str => escape(str).replace(/%/g, '\\').toLowerCase();

/**
 * 获取主题贴的移动端地址
 *
 * @param {number} tid - 贴子 id
 * @returns {string} URL
 */
const getThreadMoUrl = tid => `//tieba.baidu.com/mo/q-----1-1-0----/m?kz=${tid}`;//主题贴判断

/**
 * 获取回复贴的移动端地址
 *
 * @param {number} tid - 贴子 id
 * @param {number} pid - 回复 id
 * @param {number} [pn=0] - 页码
 * @returns {string} URL
 */
const getReplyMoUrl = (tid, pid, pn = 0) => `//tieba.baidu.com/mo/q-----1-1-0----/flr?pid=${pid}&kz=${tid}&pn=${pn}`;//楼层判断

/**
 * 获取回复贴的 ajax 地址
 *
 * @param {number} tid - 贴子 id
 * @param {number} pid - 主回复 id
 * @param {number} spid - 楼中楼回复 id
 * @param {number} [pn=0] - 页码
 * @returns {string} URL
 */
const getReplyUrl = (tid, pid, pn = 0) => `//tieba.baidu.com/p/comment?tid=${tid}&pid=${pid}&pn=${pn}&t=${Date.now()}`;//楼中楼判断

/**
 * 从页面内容判断贴子是否直接消失
 *
 * @param {string} res - 页面内容
 * @returns {boolean} 是否被屏蔽
 */
const threadIsNotExist = res => res.indexOf('您要浏览的贴子不存在') >= 0;

/**
 * 获取主题贴是否被屏蔽
 *
 * @param {number} tid - 贴子 id
 * @returns {Promise<boolean>} 是否被屏蔽
 */
const getThreadBlocked = tid => request(getThreadMoUrl(tid))
.then(threadIsNotExist);

/**
 * 获取回复贴是否被屏蔽
 *
 * @param {number} tid - 贴子 id
 * @param {number} pid - 回复 id
 * @returns {Promise<boolean>} 是否被屏蔽
 */
const getReplyBlocked = (tid, pid) => request(getReplyMoUrl(tid, pid))
.then(res => threadIsNotExist(res) || res.indexOf('刷新</a><div>楼.&#160;<br/>') >= 0);

/**
 * 获取楼中楼是否被屏蔽
 *
 * @param {number} tid - 贴子 id
 * @param {number} pid - 主回复 id
 * @param {number} spid - 楼中楼回复 id
 * @returns {Promise<boolean>} 是否被屏蔽
 */
const getLzlBlocked = (tid, pid, spid) => request(getReplyUrl(tid, pid))
// 楼中楼 ajax 翻页后被屏蔽的楼中楼不会展示，所以不需要考虑 pn，同理不需要考虑不在第一页的楼中楼
.then(res => threadIsNotExist(res) || res.indexOf(`<a rel="noopener" name="${spid}">`) < 0);

/**
 * 获取触发 CSS 样式
 *
 * @param {string} username - 用户名
 * @returns {string} 样式表
 */
const getTriggerStyle = (username,username2) => {
    //const escapedUsername = getEscapeString(username).replace(/\\/g, '\\\\');//把\uXXXX转成中文
    if(username==null||username2==null)
    {
        //console.log("贴吧贴子屏蔽检测未正常运行");
        alert("贴吧贴子屏蔽检测未正常运行");
        return;
    }
    return `
/* 使用 animation 监测 DOM 变化 */
@-webkit-keyframes __tieba_blocked_detect__ {}
@-moz-keyframes __tieba_blocked_detect__ {}
@keyframes __tieba_blocked_detect__ {}

/* 主题贴 */
#thread_list .j_thread_list[data-field*='"author_portrait":"${username}"'],
/* 回复贴 */
#j_p_postlist .l_post[data-field*='"portrait":"${username2}"'],
/* 楼中楼 */
.j_lzl_m_w .lzl_single_post[data-field*="'portrait':'${username}'"] {
-webkit-animation: __tieba_blocked_detect__;
-moz-animation: __tieba_blocked_detect__;
animation: __tieba_blocked_detect__;
}

/* 被屏蔽样式 */
.__tieba_blocked__,
.__tieba_blocked__ .d_post_content_main {
background: rgba(255, 0, 0, 0.3);
position: relative;
}
.__tieba_blocked__.core_title {
background: #fae2e3;
}
.__tieba_blocked__::after {
background: #f22737;
position: relative;
padding: 5px 10px;
color: #ffffff;
font-size: 14px;
line-height: 1.5em;
z-index: 399;
}
.__tieba_blocked__.lzl_single_post {
margin-left: -15px;
margin-right: -15px;
margin-bottom: -6px;
padding-left: 15px;
padding-right: 15px;
padding-bottom: 6px;
}

.__tieba_blocked__.j_thread_list::after,
.__tieba_blocked__.core_title::after {
content: '该贴已被屏蔽';
right: 0;
top: 0;
}
.__tieba_blocked__.l_post::after {
content: '该楼层已被屏蔽';
right: 0;
top: 0;
}
.__tieba_blocked__.lzl_single_post::after {
content: '该楼中楼已被屏蔽';
left: 0;
bottom: 0;
}
`;
};

/**
 * 检测贴子/回复屏蔽回调函数
 *
 * @param {AnimationEvent} event - 触发的事件对象
 */
const detectBlocked = (event) => {
    if (event.animationName !== '__tieba_blocked_detect__') {
        return;
    }

    const { target } = event;
    const { classList } = target;
    let checker;

    if (classList.contains('j_thread_list')) {
        const tid = target.dataset.tid;
        if (threadCache[tid]) {
            checker = threadCache[tid];
        }
        else {
            checker = getThreadBlocked(tid).then(result => {
                threadCache[tid] = result;
                saveCache('thread');

                return result;
            });
        }
    }
    else if (classList.contains('l_post')) {
        const tid = window.PageData.thread.thread_id;
        const pid = target.dataset.pid || '';
        if (!pid) {
            // 新回复可能没有 pid
            return;
        }

        if (replyCache[pid]) {
            checker = replyCache[pid];
        }
        else {
            checker = getReplyBlocked(tid, pid).then(result => {
                replyCache[pid] = result;
                saveCache('reply');
                try {
                    if (result && JSON.parse(target.dataset.field).content.post_no === 1) {
                        document.querySelector('.core_title').classList.add('__tieba_blocked__');
                    }
                }
                catch (err) { }

                return result;
            });
        }
    }
    else if (classList.contains('lzl_single_post')) {
        const field = target.dataset.field || '';
        const parent = target.parentElement;
        const pageNumber = parent.querySelector('.tP');
        if (pageNumber && pageNumber.textContent.trim() !== '1') {
            // 翻页后的楼中楼不会显示屏蔽的楼中楼，所以命中的楼中楼一定是不会屏蔽的，不需要处理
            return;
        }

        const tid = window.PageData.thread.thread_id;
        const pid = (field.match(/'pid':'?(\d+)'?/) || [])[1];
        const spid = (field.match(/'spid':'?(\d+)'?/) || [])[1];
        if (!spid) {
            // 新回复没有 spid
            return;
        }

        if (replyCache[spid]) {
            checker = replyCache[spid];
        }
        else {
            checker = getLzlBlocked(tid, pid, spid).then(result => {
                replyCache[spid] = result;
                saveCache('reply');

                return result;
            });
        }
    }

    if (checker) {
        Promise.resolve(checker).then(result => {
            if (result) {
                classList.add('__tieba_blocked__');
            }
        });
    }
};

/**
 * 初始化样式
 *
 * @param {string} username - 用户名
 */
const initStyle = (username,username2) => {
    const style = document.createElement('style');
    style.textContent = getTriggerStyle(username,username2);
    document.head.appendChild(style);
};

/**
 * 初始化事件监听
 *
 */
const initListener = () => {
    document.addEventListener('webkitAnimationStart', detectBlocked, false);
    document.addEventListener('MSAnimationStart', detectBlocked, false);
    document.addEventListener('animationstart', detectBlocked, false);
};

/**
 * 加载并没有什么卵用的缓存
 *
 */
const loadCache = () => {
    const thread = sessionStorage.getItem('tieba-blocked-cache-thread');
    const reply = sessionStorage.getItem('tieba-blocked-cache-reply');
    if (thread) {
        try {
            threadCache = JSON.parse(thread);
        }
        catch (error)
        {
            //alert(error);//一定报错
        }
    }
    if (reply) {
        try {
            replyCache = JSON.parse(reply);
        }
        catch (error)
        {
            //alert(error);//一定报错
        }
    }
}

/**
 * 保存并没有什么卵用的缓存
 *
 * @param {string} key - 缓存 key
 */
const saveCache = (key) => {
    if (key === 'thread') {
        sessionStorage.setItem('tieba-blocked-cache-thread', JSON.stringify(threadCache));
    }
    else if (key === 'reply') {
        sessionStorage.setItem('tieba-blocked-cache-reply', JSON.stringify(replyCache));
    }
}

/**
 * 初始化执行
 *
 */
const init = () => {
    clearTimeout(t);
    if (getIsLogin()) {
        const username = (getUsername().split("?t=")[0])||null;//没登陆贴吧就是返回null，null就是没有作用
        const username2 =getUsername()||null;
        loadCache();
        initListener();
        initStyle(username,username2);
        //let temp=$("div.user_name").children("a.")[0].href.split("id=")[1].split("&")[0];
        //temp||sessionStorage.getItem("miaouserid").split("?")[0]||null;getUsername().split("id=")[1].split("&")[0];
        //temp||sessionStorage.getItem("miaouserid")||null;改用id(portrait)来判断,来来注册样式事件？
        //alert(username);
        //alert(username2);
    }
};

var t=setTimeout(init,1000);//延迟1s,感觉没用？
//init();