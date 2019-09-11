// ==UserScript==
// @name        贴吧贴子屏蔽检测(兼容版)
// @version     测试(beta)0.3
// @description 1.可能支持无用户名的贴吧账号（楼中楼未完全验证过）2.修改为只在各个贴吧的主题列表和主题贴内运行 3.发主题贴后，屏蔽样式会消失，刷新贴吧即可
// @include     http*://tieba.baidu.com/p/*
// @include     http*://tieba.baidu.com/f?*
// @grant       none
// @license     GPL-3.0
// @author      shitianshiwa,864907600cc(原项目作者)
// @namespace   https://github.com/FirefoxBar/userscript/tree/master/Tieba_Blocked_Detect
// @downloadURL  https://github.com/shitianshiwa/baidu-tieba-userscript/tree/master/%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B(%E5%85%BC%E5%AE%B9%E7%89%88)
// ==/UserScript==

//可能支持无用户名的贴吧账号（楼中楼未完全验证过）
//修改为只在各个贴吧的主题列表和主题贴内运行
//发主题贴或回贴后，屏蔽样式会消失，刷新贴吧即可

(function($)
 {
    'use strict';
    const threadCache = {};
    const replyCache = {};
    var t1,t2,t3,t4;//计时器`
    const css1=`
/*固定到网页右边*/
.miaocsss2
{
width:120px;
height:120px;
position: fixed;
right:30px;
bottom:440px;
z-index: 1005;
color:#f00;
font-size:10px;
font-weight:bold;
}
`;
    /**
 * 精简封装 fetch 请求，自带请求 + 通用配置 + 自动 .text()
 *
 * @param {string} url - 请求 URL
 * @param {object} [options={}] - fetch Request 配置
 * @returns {Promise<string>} fetch 请求
 */
    const request = (url, options = {}) => fetch(url, Object.assign(
        {
            credentials: 'omit',
            // 部分贴吧（如 firefox 吧）会强制跳转回 http
            redirect: 'follow',
            // 阻止浏览器发出 CORS 检测的 HEAD 请求头
            mode: 'same-origin',
            headers:
            {
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
 * 获取当前用户的id
 *
 * @returns {string} id
 */
    const getUserid = () => window.PageData.user.id;
    /**
 * 获取当前用户的用户名
 *
 * @returns {string} 用户名
 */
    const getUsername = () => window.PageData.user.name || window.PageData.user.user_name;
    /**
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
    const getTriggerStyle = (username) =>
    {
        const escapedUsername = getEscapeString(username).replace(/\\/g, '\\\\');

        return `
/* 使用 animation 监测 DOM 变化 */
@-webkit-keyframes __tieba_blocked_detect__ {}
@-moz-keyframes __tieba_blocked_detect__ {}
@keyframes __tieba_blocked_detect__ {}

/* 主题贴 */
#thread_list .j_thread_list[data-field*='"author_name":"${escapedUsername}"'],
/* 回复贴 */
#j_p_postlist .l_post[data-field*='"user_name":"${escapedUsername}"'],
/* 楼中楼 */
.j_lzl_m_w .lzl_single_post[data-field*="'user_name':'${username}'"] {
-webkit-animation: __tieba_blocked_detect__;
-moz-animation: __tieba_blocked_detect__;
animation: __tieba_blocked_detect__;
}

/* 被屏蔽样式 */
.__tieba_blocked__,
.__tieba_blocked__ .d_post_content_main {
background: rgba(255, 0, 0, 0.1);
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
    //主题贴列表
    const detectBlocked0 = () =>
    {
        //$(".tb_icon_author").parents('li.j_thread_list')
        //JSON.parse($(".tb_icon_author").attr("data-field")).user_id
        clearTimeout(t1);
        var TID1=new Array();
        var tizi1=new Array();
        var index1=0;
        $(".tb_icon_author").each(
            function()
            {
                //alert(JSON.parse($(this).attr("data-field")).user_id+","+getUserid());
                if(JSON.parse($(this).attr("data-field")).user_id==getUserid()&&$(this)[0].classList.contains("__tieba_blocked__")==false)
                {
                    const tid = $(this).parents('li.j_thread_list').attr('data-tid');//子节点找父节点
                    TID1[index1]=tid;
                    tizi1[index1]=$(this);
                    index1++;
                }
            });
        t4=setInterval(tzaction,400);
        function tzaction()
        {
            $("#miaocount1").html("1.剩余检测贴子数："+index1);
            if(index1>0)
            {
                index1--;
            }
            else
            {
                clearInterval(t4);
                return;
            }
            let checker;
            const tid = TID1[index1]
            if (threadCache[tid])
            {
                checker = threadCache[tid];
            }
            else
            {
                checker = getThreadBlocked(tid).then(result =>{
                    threadCache[tid] = result;
                    saveCache('thread');
                    return result;
                });
            }
            if (checker)
            {
                Promise.resolve(checker).then(result =>{
                    if (result)
                    {
                        tizi1[index1].parents('li.j_thread_list')[0].classList.add("__tieba_blocked__");//子节点找父节点
                        //alert(result);
                        //alert("460");
                    }
                });
            }
        }
    }

    //楼层
    const detectBlocked = () =>
    {
        //document.querySelectorAll(".l_post")[0].classList.add("__tieba_blocked__")//添加屏蔽样式
        //JSON.parse(($(".l_post")).attr('data-field')).author.user_id
        //j_thread_list clearfix 主题贴列表
        //l_post l_post_bright j_l_post clearfix  楼层
        //lzl_single_post 楼中楼

        clearTimeout(t2);
        var TID2=new Array();
        var PID2=new Array();
        var tizi2=new Array();
        var index2=0;
        $("div.l_post").each(
            function()
            {
                if(JSON.parse(($(this)).attr('data-field')).author.user_id==getUserid()&&$(this)[0].classList.contains("__tieba_blocked__")==false)
                {
                    const tid = window.PageData.thread.thread_id; //const tid = JSON.parse(($(".l_post")).attr('data-field')).content.thread_id;
                    const pid = $(this).attr('data-pid')|| '';
                    TID2[index2]=tid;
                    PID2[index2]=pid;
                    tizi2[index2]=$(this);
                    index2++;
                    //console.log(tizi2.length);
                    //alert("233");
                    //console.log(tid);
                    //console.log(pid);
                }
            });
        t3=setInterval(lcaction,500);
        function lcaction()
        {
            //alert("2333");
            $("#miaocount2").html("2.剩余检测楼层数："+index2);
            if(index2>0)
            {
                index2--;
            }
            else
            {
                clearInterval(t3);
                return;
            }
            const tid = TID2[index2]
            const pid = PID2[index2]
            let checker;
            if (!pid)
            {
                // 新回复可能没有 pid
                return;
            }
            if (replyCache[pid])
            {
                checker = replyCache[pid];
            }
            else
            {
                checker = getReplyBlocked(tid, pid).then(result =>{
                    //console.log("233");
                    replyCache[pid] = result;
                    saveCache('reply');
                    //alert(result)
                    return result;
                });
            }
            if (checker)
            {
                Promise.resolve(checker).then(result =>{
                    if (result)
                    {
                        tizi2[index2][0].classList.add("__tieba_blocked__");
                        //console.log(index2);
                        //alert(result);
                        //alert("460");
                    }
                });
            }
        }
    };
    //alert(checker);
    //楼中楼
    const detectBlocked2 = (event) =>
    {
        if (event.animationName !== '__tieba_blocked_detect__')
        {
            return;
        }
        //detectBlocked();
        const { target } = event;
        const { classList } = target;
        let checker;
        if (classList.contains('lzl_single_post'))
        {
            //alert("450");
            const field = target.dataset.field || '';
            const parent = target.parentElement;
            const pageNumber = parent.querySelector('.tP');
            if (pageNumber && pageNumber.textContent.trim() !== '1')
            {
                // 翻页后的楼中楼不会显示屏蔽的楼中楼，所以命中的楼中楼一定是不会屏蔽的，不需要处理
                return;
            }
            const tid = window.PageData.thread.thread_id;
            const pid = (field.match(/'pid':'?(\d+)'?/) || [])[1];
            const spid = (field.match(/'spid':'?(\d+)'?/) || [])[1];
            if (!spid)
            {
                // 新回复没有 spid
                return;
            }
            if (replyCache[spid])
            {
                checker = replyCache[spid];
            }
            else
            {
                checker = getLzlBlocked(tid, pid, spid).then(result =>{
                    replyCache[spid] = result;
                    saveCache('reply');
                    return result;
                });
            }
        }
        if (checker)
        {
            Promise.resolve(checker).then(result =>{
                if (result)
                {
                    classList.add("__tieba_blocked__");
                    //alert(result);
                    //alert("460");
                }
            });
        }
    };
    //https://www.cnblogs.com/yunfeifei/p/4453690.html

    /**
* 初始化样式
*
* @param {string} username - 用户名
*/
    const initStyle = (username) =>
    {
        const style = document.createElement('style');
        style.textContent = getTriggerStyle(username);
        document.head.appendChild(style);
    };

    /**
 * 初始化事件监听
 *
 */
    const initListener = () =>
    {
        document.addEventListener('webkitAnimationStart',detectBlocked2, false);//这个事件只对自己的贴子起作用(楼中楼)
        document.addEventListener('MSAnimationStart', detectBlocked2, false);
        document.addEventListener('animationstart', detectBlocked2, false);
    };
    /*
    http://www.softwhy.com/article-9936-1.html
    JavaScript animationStart 事件
    （1）.IE10+浏览器支持此事件。
    （2）.谷歌浏览器支持此事件（当前需要加webkit前缀）。
    （3）.火狐浏览器支持此事件（当前需要加moz前缀）。
    （4）.opera浏览器支持此事件（当前需要加o前缀）。
    （5）.safria浏览器支持此事件（当前需要加webkit前缀）。
    定义和用法
    animationstart 事件在 CSS 动画开始播放时触发。
    CSS 动画播放时，会发生以下三个事件：
    animationstart - CSS 动画开始后触发
    animationiteration - CSS 动画重复播放时触发
    animationend - CSS 动画完成后触发
    true - 事件句柄在捕获阶段执行
    false- 默认。事件句柄在冒泡阶段执行
*/

    /**
* 加载并没有什么卵用的缓存
*
*/
    const loadCache = () =>
    {
        const thread = sessionStorage.getItem('tieba-blocked-cache-thread');
        const reply = sessionStorage.getItem('tieba-blocked-cache-reply');
        if (thread)
        {
            try
            {
                threadCache = JSON.parse(thread);
            }
            catch (error)
            {
                //alert(error);
            }
        }
        if (reply)
        {
            try
            {
                replyCache = JSON.parse(reply);
            }
            catch (error)
            {
                //alert(error);
            }
        }
    }

    /**
* 保存并没有什么卵用的缓存
*
* @param {string} key - 缓存 key
*/
    const saveCache = (key) =>
    {
        if (key === 'thread')
        {
            sessionStorage.setItem('tieba-blocked-cache-thread', JSON.stringify(threadCache));
        }
        else if (key === 'reply')
        {
            sessionStorage.setItem('tieba-blocked-cache-reply', JSON.stringify(replyCache));
        }
    }

    /**
* 初始化执行
*
*/
    const init = () =>
    {
        if (getIsLogin())
        {
            const username = getUsername();
            loadCache();
            initStyle(username);
            t1=setTimeout(detectBlocked0,1000);//主题贴列表
            t2=setTimeout(detectBlocked,1000);//主题贴里的楼层
            initListener();//主题贴里的楼层里的楼中楼
            const style = document.createElement('style');//创建新样式节点
            style.textContent = css1;//添加样式内容
            document.head.appendChild(style);//给head头添加新样式节点
            $("body").append('<div class="miaocsss2"><span>贴子屏蔽检测</span><br/><span id="miaocount1">1.剩余检测贴子数:</span><br/><span id="miaocount2">2.剩余检测楼层数:</span></div>');
        }
    }
    init();
})($);