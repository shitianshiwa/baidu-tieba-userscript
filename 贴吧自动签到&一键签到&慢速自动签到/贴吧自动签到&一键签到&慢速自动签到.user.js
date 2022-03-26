// ==UserScript==
// @name         贴吧自动签到&一键签到&慢速自动签到
// @version      0.7
// @description  ’一键签到‘支持的贴吧数量有限，除非开会员，因为是直接用贴吧电脑端的api,和电脑端贴吧主页那里点击一键签到一个效果（每日北京时间0:00至1:00无法使用）。慢速自动签到目前还没什么用。
// @author       shitianshiwa
// @include      http*://tieba.baidu.com/p/*
// @include      http*://tieba.baidu.com/f?*
// @include      http*://tieba.baidu.com/f/good?kw=*
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL  https://github.com/shitianshiwa/baidu-tieba-userscript/
// @license      MIT
// ==/UserScript==
//慢速自动签到目前还没什么用
(function() {
    var $ = unsafeWindow.jQuery; // @grant        不能为none，否则不能用
    var PageData = unsafeWindow.PageData;
    'use strict';
    const IE = "utf-8";
    const css1 = `
/*固定到网页右边*/
.miaoqiandaocss1
{
width:140px;
height:120px;
position: fixed;
left:30px;
bottom:420px;
z-index: 1005;
color:#f00;
font-size:10px;
font-weight:bold;
}
`;
    const style = document.createElement('style'); //创建新样式节点
    style.textContent = css1; //添加样式内容
    document.head.appendChild(style); //给head头添加新样式节点
    var t;
    //捕捉class用.，id对象用#?,$=document.getElementById?
    //alert("233");
    //自动签到
    //localStorage.removeItem("miaoerror");//报错后使用，使用完要再注释掉，用来防止频繁发生命令的标识,清空浏览器数据也可以
    var t1;
    var errorx = "";

    function resetx() {
        try {
            localStorage.removeItem("miaoerror");
            alert("已经恢复自动签到");
        } catch (error) {
            alert(error);
        }
    }

    try {
        errorx = localStorage.getItem("miaoerror");
        //alert(errorx);
        if ($("a.j_signbtn")[0] == null || $('#j_head_focus_btn')[0] == null) {
            return;
        }
        if ($("a.j_signbtn")[0].title == "签到" && $('#j_head_focus_btn')[0].className == "focus_btn cancel_focus" && $('span.userlike_prisoned')[0] == undefined) //未签到和已经关注该吧及未被封禁才能条件通过
        {
            t = setTimeout(qiandao, 1000); //延迟1s签到
            //qiandao();
            //alert($(".j_signbtn")[0].title);
        } else {
            //alert("233");
        }
    } catch (error) {
        console.log("签到:"+error);
    }

    function qiandao() //自动签到对超级会员，会员，年费会员似乎一次不能成功,超会签到class="sign_box_member_bright,又可以一次签到成功了？"除了网络问题导致的签到失败外，就只有签到后外观不是会员样式的问题了。
    {
        clearTimeout(t);
        var url = "/sign/add";
        try {
            if ($("a.j_signbtn")[0] == null) {
                return;
            }
            var TBS = PageData.tbs || PageData.user.tbs;
            var KW = PageData.forum.name || PageData.forum.forum_name;
            var c = { 'tbs': TBS, 'kw': KW, 'ie': "utf-8" }; //加个''2019-8-24,个别情况下只有PageData.forum.forum_name可以得到贴吧名
            if ($("a.j_signbtn")[0].className == "j_signbtn sign_btn_bright j_cansign" && errorx == null && TBS != null && KW != null) //第二次判断是否未签到。。！及未被记录过出错误
            {
                $.post(url, c, function(o) {
                    if (o.no != 0) {
                        let s = "no:" + o.no + ",nerr_code:" + o.err_code + ",nerror:" + o.error;
                        alert(s + ",出现错误请关闭插件！频繁发送命令可能很危险，贴吧正常情况下不会有连续签到的命令出现"); //频繁发送命令可能很危险，贴吧正常情况下不会有连续签到的命令出现
                        localStorage.setItem("miaoerror", s);
                    } else {
                        //alert(PageData.forum.name+"吧签到成功，"+o.data.sign_version);
                        $("#signstar_wrapper")[0].className = "j_sign_box sign_box_bright sign_box_bright_signed"; //改签到为已签到 j_sign_box sign_box_bright sign_box_member_bright sign_box_member_bright_signed sign_box_bright_signed
                        $("a.j_signbtn")[0].setAttribute('id', 'j_signbtn'); //添加节点需要id，所以先捕捉class，再添加id
                        $("a.j_signbtn")[0].title = "签到完成"
                        $("a.j_signbtn")[0].classList.add("signstar_signed"); //signstar_signed来自 https://github.com/shitianshiwa/baidu-tieba-userscript/tree/master/%E8%B4%B4%E5%90%A7%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B 贴吧全能脚本的已签到样式。需要有安装这个脚本才会有效果
                        let a1 = document.getElementById("j_signbtn"); //捕捉id
                        let a2 = document.createElement("span"); //创建节点<span></span>
                        let day1 = o.data.uinfo.cont_sign_num; //获取连续签到天数
                        a2.setAttribute('class', 'sign_keep_span'); //为span添加属性<span class="sign_keep_span"></span>
                        a2.innerHTML = "连续" + day1 + "天"; //已连续签到天数 <span class="sign_keep_span">连续天数</span>
                        //alert(o.data.uinfo.cont_sign_num);
                        a1.appendChild(a2); //添加节点显示天数
                        let c3 = { 'kw': PageData.forum.name, 'ie': "utf-8" };
                        $.post("/sign/loadmonth", c3, function(o) {
                            if (o.no != 0) {
                                let s = "no:" + o.no + ",nerr_code:" + o.err_code + ",nerror:" + o.error;
                                alert(s + ",出现错误请关闭插件！频繁发送命令可能很危险"); //频繁发送命令可能很危险
                                localStorage.setItem("miaoerror", s);
                            } else {
                                $("span.j_sign_month_lack_days")[0].innerHTML = o.data.resign_info.mon_miss_sign_num; //修改漏签天数标签
                                //alert(o.data.resign_info.mon_miss_sign_num);
                            }
                        }, "json");
                        //window.location.reload();//刷新网页显示已签到，为了节省流量注释掉了
                    }
                }, "json");
            } else {
                alert("得到的参数不完整或未恢复自动签到，tbs=" + TBS + ",kw=" + KW);
            }
        } catch (error) {
            alert(error);
        }
    }

    function HH() //一键签到，一键签到有时间段限制，每日0:00至1:00无法使用
    {
        try {
            if (localStorage.getItem("miaoerror") != null) {
                alert("已经启动慢速自动签到或者出现其它错误了！点‘报错后重启’");
                return;
            }
            let s = "/tbmall/onekeySignin1";
            let c = { 'tbs': PageData.tbs || PageData.user.tbs, 'ie': IE };
            postpost(s, c);
        } catch (error) {
            alert(error);
        }
    }

    var tt1, tt2, failtemp = "";

    function HH2() //慢速自动签到（目前电脑端贴吧有单位时间内签到贴吧数量上限限制）
    {
        try {
            if (localStorage.getItem("miaoerror") != null) {
                alert("已经启动慢速自动签到或者出错了！点‘报错后重启’");
                return;
            }
            //$("div.miaoqiandaocss1").remove();
            localStorage.setItem("miaoerror", "suo");
            alert("开始自动签到贴吧！刷新可中断");
            var c = { 'tn': "bdFBW", 'tab': "favorite" };
            var u = "/mo/q-----1-1-0----/m";
            $.get(u, c, function(data) {
                sessionStorage.setItem("HH2temp", $(data.body)[0].innerText.split("."));
            }, "xml");
            var temp2 = new Array(),
                ii = 0,
                time = 0;

            function xianshi() {
                clearTimeout(tt1);
                var temp = sessionStorage.getItem("HH2temp").split(",");
                for (var i = 1; i < temp.length; i++) {

                    temp2[ii] = temp[i].split("等级")[0];
                    //console.log(temp[i].split("等级")[0]);
                    ii++;
                }
                $.post("/dc/common/tbs", "", function(o) { sessionStorage.setItem("miaousertbs", o.tbs); }, "json"); //获取用户tbs口令号并储存在sessionStorage中，待使用
                $("body").append('<div class="miaoqiandaocss1"><span id="miaoqiandaocount1">签到中（刷新可中断）</span></div>');
                time = 2000 + parseInt(Math.random() * 1000); //至少延迟1s以上，否则会被贴吧系统要求输入验证码,停止很长一段时间后大概能解除限制
                tt2 = setTimeout(xianshi2, time);
                //alert(temp2);
            }
            tt1 = setTimeout(xianshi, 1000);
            var url = "/sign/add";

            function xianshi2() {
                clearTimeout(tt2);
                if (localStorage.getItem("miaoerror") == null) {
                    $("div.miaoqiandaocss1").remove();
                    failtemp = "";
                    alert("意外结束自动签到贴吧！");
                    return;
                }
                $("#miaoqiandaocount1").html("签到中（刷新可中断）<br/>剩余贴吧数：" + (ii) + "<br/>签到失败的贴吧：<br/>" + failtemp);
                if (ii > 0) {
                    //console.log(ii);
                    ii--;
                } else {
                    failtemp = "";
                    localStorage.removeItem("miaoerror");
                    alert("结束自动签到贴吧！");
                    return;
                }
                //console.log(temp2[ii]);
                var c = { 'tbs': sessionStorage.getItem("miaousertbs"), 'kw': temp2[ii], 'ie': "utf-8" };
                $.post(url, c, function(o) {
                    if (o.no == 0) //签到成功
                    {
                        console.log(temp2[ii] + ",OK," + time + "s");
                        //return;
                    } else if (o.no == 1010) //贴吧目录出问题啦，请到贴吧签到吧反馈
                    {
                        console.log(temp2[ii] + ",贴吧目录出问题啦，请到贴吧签到吧反馈," + time + "s");
                        failtemp += temp2[ii] + "<br/>";
                    } else if (o.no == 1101) //亲，你之前已经签过了
                    {
                        console.log(temp2[ii] + ",亲，你之前已经签过了," + time + "s");
                    } else {
                        console.log(temp2[ii] + ",no:" + o.no + "nerr_code:" + o.err_code + "nerror:" + o.error + "," + time + "s");
                        failtemp += temp2[ii] + "<br/>";
                    }
                }, "json");
                $.get("/dc/common/tbs", "", function(o) { sessionStorage.setItem("miaousertbs", o.tbs); }, "json"); //获取用户tbs口令号并储存在sessionStorage中，待使用
                time = 2000 + parseInt(Math.random() * 1000);
                tt2 = setTimeout(xianshi2, time);
            }
        } catch (error) {
            alert(error);
        }
    }

    function postpost(a, b) {
        $.post(a, b, function(o) {
            if (o.no != 0) {
                alert("no:" + o.no + "nerr_code:" + o.err_code + "nerror:" + o.error);
            } else {
                alert("OK");
            }
        }, "json");
    }

    GM_registerMenuCommand("一键签到", HH);
    //GM_registerMenuCommand("慢速自动签到(获取贴吧名，逐个自动签到)", HH2);//不可用。因为单位时间内有签到数量限制，超过一定数量后需要输入验证码
    GM_registerMenuCommand("报错后重启", resetx); // @grant        GM_registerMenuCommand
    //http://tieba.baidu.com/mo/q-----1-1-0----/sign?tbs=xxxxx&fid=xxxxxx&kw=xxxxx  wap贴吧签到可能能绕开系统验证码处罚


    //注释：null 表示无值，而 undefined 表示一个未声明的变量，或已声明但没有赋值的变量，或一个并不存在的对象属性。
    //下面未使用
    //JavaScript 时间戳转日期
    //作者: 王And木 时间: 2018-08-08 分类: Web 阅读：1216次
    function timestampToTime(timestamp) {
        var time_var = timestamp;
        if (String(time_var).length === 10) {
            time_var = time_var * 1000;
        }
        var date = new Date(Number(time_var));
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ' ';
        var v_time = Y + M + D + h + m;
        var date_n = new Date();
        Y = date_n.getFullYear() + '-';
        M = (date_n.getMonth() + 1 < 10 ? '0' + (date_n.getMonth() + 1) : date_n.getMonth() + 1) + '-';
        D = (date_n.getDate() < 10 ? '0' + (date_n.getDate()) : date_n.getDate()) + ' ';
        return D; //返回日数
    }
    //JavaScript 时间戳转换时间的代码，如果是当前日期，只会返回小时与分钟。
    //本站如无特别说明即为原创，转而告知：(http://www.iwonmo.com/archives/1355.html)
})();

/*

                https://www.cnblogs.com/polk6/p/5512979.html
                sessionStorage 是HTML5新增的一个会话存储对象
                1) 同源策略限制。若想在不同页面之间对同一个sessionStorage进行操作，这些页面必须在同一协议、同一主机名和同一端口下。(IE 8和9存储数据仅基于同一主机名，忽略协议（HTTP和HTTPS）和端口号的要求)
                2) 单标签页限制。sessionStorage操作限制在单个标签页中，在此标签页进行同源页面访问都可以共享sessionStorage数据。
                3) 只在本地存储。seesionStorage的数据不会跟随HTTP请求一起发送到服务器，只会在本地生效，并在关闭标签页后清除数据。(若使用Chrome的恢复标签页功能，seesionStorage的数据也会恢复)。
                4) 存储方式。seesionStorage的存储方式采用key、value的方式。value的值必须为字符串类型(传入非字符串，也会在存储时转换为字符串。true值会转换为"true")。
                5) 存储上限限制：不同的浏览器存储的上限也不一样，但大多数浏览器把上限限制在5MB以下。

                可访问 http://dev-test.nemikor.com/web-storage/support-test/ 测试浏览器的存储上限。
                1.3 浏览器最小版本支持
                支持sessionStorage的浏览器最小版本：IE8、Chrome 5。

                1.4 适合场景
                sessionStorage 非常适合SPA(单页应用程序)，可以方便在各业务模块进行传值。
                web storage和cookie的区别
                Web Storage的概念和cookie相似，区别是它是为了更大容量存储设计的。Cookie的大小是受限的，并且每次你请求一个新的页面的时候Cookie都会被发送过去，这样无形中浪费了带宽，另外cookie还需要指定作用域，不可以跨域调用。

                除此之外，Web Storage拥有setItem,getItem,removeItem,clear等方法，不像cookie需要前端开发者自己封装setCookie，getCookie。

                但是Cookie也是不可以或缺的：Cookie的作用是与服务器进行交互，作为HTTP规范的一部分而存在 ，而Web Storage仅仅是为了在本地“存储”数据而生（来自@otakustay 的纠正）
                https://www.cnblogs.com/yuzhongwusan/archive/2011/12/19/2293347.html

                https://www.runoob.com/jsref/prop-win-sessionstorage.html
                localStorage 和 sessionStorage 属性允许在浏览器中存储 key/value 对的数据。
                sessionStorage 用于临时保存同一窗口(或标签页)的数据，在关闭窗口或标签页之后将会删除这些数据。
                localStorage 用于长久保存整个网站的数据，保存的数据没有过期时间，直到手动去删除。
                localStorage 属性是只读的。
                提示: 如果你只想将数据保存在当前会话中，可以使用 sessionStorage 属性， 改数据对象临时保存同一窗口(或标签页)的数据，在关闭窗口或标签页之后将会删除这些数据。
                语法
                window.localStorage
                保存数据语法：
                localStorage.setItem("key", "value");
                读取数据语法：
                var lastname = localStorage.getItem("key");
                删除数据语法：
                localStorage.removeItem("key");

*/