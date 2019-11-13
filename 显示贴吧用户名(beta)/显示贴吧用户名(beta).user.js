// ==UserScript==
// @name         显示贴吧用户名(beta)
// @namespace    http://tampermonkey.net/
// @version      0.24
// @description  显示主题贴列表,楼层,楼中楼的贴吧用户名，仅支持电脑端贴吧
// @author       shitianshiwa
// @include      http*://tieba.baidu.com/p/*
// @include      http*://tieba.baidu.com/f?*
// @grant        GM_registerMenuCommand
// @downloadURL  https://github.com/shitianshiwa/baidu-tieba-userscript/
// ==/UserScript==
//发现不兼容的贴子链接 https://tieba.baidu.com/f?kz=xxxxxxxx  是远古贴吧的贴子链接？


(function() {
    'use strict';
    var $ = unsafeWindow.jQuery;// @grant        不能为none，否则不能用
    //var $ = window.jQuery;
    var names=new Array();
    var names2=new Array();
    //var namesi=0;
    var hrefs=window.location.href;
    function showName0()//主题贴列表
    {
        //alert(hrefs.indexOf("tab=album"));
        try
        {
            if(hrefs.split("?")[0].split("/")[3]!="f"||hrefs.indexOf("tab=album")!=-1)//解决非主题列表和贴吧图片区报错
            {
                return;
            }
            if($("a.frs-author-name").parents('div.threadlist_author').children('p.miao01')[0]!=null)//主题贴列表最后一个贴子
            {
                return;
            }
            //console.log($("a.frs-author-name").parents('div.threadlist_author').children('p.miao01')[0]);
            $("a.j_user_card").each(function()
                                    {
                //alert("233");
                //alert("a.j_user_card").parents('div.threadlist_author').children('p.miao01')[0]);
                if($(this).parents('div.threadlist_author').children('p.miao01')[0]==null)
                {
                    $(this).parents('.tb_icon_author').after('<p class="miao01" style="color:#999;font-size:12px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(' +JSON.parse(($(this)).attr('data-field')).un+')</p>');
                }
                if($(this).parents('div.threadlist_author').children('p.miao02')[0]==null)
                {
                    $(this).parents('.tb_icon_author_rely').after('<p class="miao00002" style="color:#999;font-size:12px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(' +JSON.parse(($(this)).attr('data-field')).un+')</p>');
                }
            });
        }
        catch(error)
        {
            clearTimeout(t3);
            alert(error+",1.显示贴吧用户名(beta)已停止运行");
        }
    }
    function showName1()//楼层
    {
        //alert("66666666");
        try
        {
            //alert(hrefs.split("/")[3])
            if(hrefs.split("/")[3]!="p")
            {
                return;
            }
            if($("a.p_author_name.j_user_card").parents('li.d_name').children('p.p_author_name')[0]!=null)//楼层列表最后一个贴子
            {
                return;
            }
            //console.log(233);
            //$("a.p_author_name.j_user_card").parents('li.d_name').children('a.p_author_name')[15].innerHTML
            $("a.p_author_name.j_user_card").each(function()
                                                  {
                if($(this).parents('li.d_name').children('p.p_author_name')[0]==null)
                {
                    let s1=$(this).parents('li.d_name').children('a.p_author_name')[0].innerHTML;//获取昵称名+表情图标签
                    let s2=JSON.parse($(this).attr('data-field')).un;
                    $(this).after('<p class="p_author_name" style="color:#999;font-size:12px;">(' + s2 +')</p>');
                    names[s1]=s2;//昵称作为索引
                    names2[s2]=s2;//用户名作为索引
                    //sessionStorage.setItem(s1,s2);//储存用户昵称 真名
                    //save(s1);
                    //alert(s1);
                }
            });
        }
        catch(error)
        {
            clearTimeout(t3);
            alert(error+",2.显示贴吧用户名(beta)已停止运行");
        }
        //j_thread_list clearfix
        //threadlist_author pull_right
        //tb_icon_author no_icon_author
        //alert("233");
        //+JSON.parse($(".l_post,.l_post_bright,.j_l_post clearfix").attr('data-pid'))
    }
    function showName2()//楼中楼
    {
        showName0();
        showName1();
        try
        {
            //$('div.lzl_cnt').children('a.at')[0]//第一个
            //$('div.lzl_cnt').children('a.at').attr('username')
            //alert(hrefs.split("/")[3])
            if(hrefs.split("/")[3]!="p")
            {
                return;
            }
            $("div.lzl_cnt").each(function()//楼中楼xx:
                                  {
                if($(this).children('span.miao1')[0]==null)
                {
                    //$("div.lzl_cnt").children("a.at")[0].text//获取昵称
                    let s1=$(this).children("a.at.j_user_card")[0].innerHTML;//获取昵称名+表情图标签
                    let s2=String($(this).children('a.at').attr('username'));//获取真名
                    //console.log(s1);
                    $(this).append('<span class="miao1"></span>');
                    names[s1]=s2;//昵称作为索引
                    names2[s2]=s2;//用户名作为索引
                    //sessionStorage.setItem(s1,s2);//储存用户昵称 真名
                    //save(s1);
                }
            });
            //楼中楼xx
            //j_lzl_m_w
            //$("span.lzl_content_main").parents('ul.j_lzl_m_w').children('a.at.j_user_card')
            //$("span.lzl_content_main").children("a.at.j_user_card")[0].text//获取昵称
            //$("span.lzl_content_main").children("a.at.j_user_card").attr("portrait");
            $("div.lzl_cnt").children("a.at.j_user_card").each(function()//找子节点
                                                               {
                if($(this).parents("div.lzl_cnt").children('span.miao2')[0]==null)
                {
                    let s1=$(this)[0].innerHTML;
                    let s2=names[s1]||names2[s1];//先尝试用昵称取用户名，为null后用户名取用户名
                    //sessionStorage.getItem(s1)
                    if(s1!=s2)
                    {
                        if(s2!=null)
                        {
                            $(this).after('<span class="miao2" style="color:#999;font-size:10px;">( ' +s2+')</span>');
                        }
                        else
                        {
                            $(this).after('<span class="miao2" style="color:#999;font-size:10px;">(null)</span>');
                        }
                    }
                    else
                    {
                        $(this).after('<span class="miao2" style="color:#999;font-size:10px;"></span>');
                    }
                }
            });
            //找子节点 //楼中楼xx 回复 xx span.lzl_content_main
            $("div.lzl_cnt").children("span.lzl_content_main").children("a.at").each(function()
                                                                                     {
                if($(this).parents("span.lzl_content_main").children('span.miao3')[0]==null)
                {
                    let s1=$(this)[0].innerHTML;//获取用户名字(可能是昵称，也可能是用户名)
                    let s3=s1.split('@')[1];
                    let s2=names[s1]||names[s3]||names2[s3]||names2[s1];//对付带@的用户名或者昵称的楼中楼回复,纯@人可能在该网页无法找到用户名,可以判断无用户名账号
                    //console.log(s3);
                    //sessionStorage.getItem(s1)
                    if(s1!=s2)//一般来说肯定会有昵称，但不一定有用户名，昵称应该可以取到的
                    {
                        if(s2!=null)
                        {
                            $(this).after('<span class="miao3" style="color:#999;font-size:10px;">( ' +s2+')</span>');
                        }
                        else
                        {
                            $(this).after('<span class="miao3" style="color:#999;font-size:10px;">(null)</span>');//九成以上概率说明这位没有回过贴子,这网页里不存在其用户名
                        }
                    }
                    else
                    {
                        $(this).after('<span class="miao3" style="color:#999;font-size:10px;"></span>');
                    }
                }
            });
            //alert(namesi)
            if(names.length>10000)//定量清理缓存数据
            {
                names = [];//清空数组
                names=new Array();
                /* for(let x=0;x<names.length;x++)
                {
                    sessionStorage.removeItem(names[x]);
                }
                namesi=0;*/
            }
            if(names2.length>10000)//定量清理缓存数据
            {
                names2 = [];//清空数组
                names2=new Array();
                /* for(let x=0;x<names.length;x++)
                {
                    sessionStorage.removeItem(names[x]);
                }
                namesi=0;*/
            }
        }
        catch(error)
        {
            clearTimeout(t3);
            alert(error+",3.显示贴吧用户名(beta)已停止运行");
        }
    }
    /*function save(s)//避免重复储存
    {
        let b=false;
        for(let x=0;x<names.length;x++)
        {
            if(names[x]==s)
            {
                b=true;
                continue;
            }
        }
        if(b==false)
        {
            names[namesi]=s;
            namesi++;
        }
    }*/
    function stop()
    {
        alert("显示贴吧用户名(beta)已关闭");
        clearInterval(t3);
    }
    var t3=setInterval(showName2,2000);//每一秒启动一次
    GM_registerMenuCommand("关闭楼中楼真名显示计时器(不再新增真名,但已有真名保留)", stop);
})();
/*
function initListener()
    {
        document.addEventListener('webkitAnimationStart',superBawu.showName0, false);
        document.addEventListener('MSAnimationStart',superBawu.showName0, false);
        document.addEventListener('animationstart',superBawu.showName0, false);
    }
*/
//var t1=setTimeout(superBawu.showName0,1000);//显示主题贴列表用户真实贴吧名字
//var t2=setTimeout(superBawu.showName,1000)//显示楼层用户真实贴吧名字
//var t4=setTimeout(initListener,1000)
//initListener();
//alert(window.location.href);得到网页链接
//clearTimeout(t1)
//superBawu.showName2();

/*
 https://www.cnblogs.com/snandy/archive/2011/04/04/2005156.html
JavaScript中清空数组的三种方式
方式1，splice

1
2
3
var ary = [1,2,3,4];
ary.splice(0,ary.length);
console.log(ary); // 输出 []，空数组，即被清空了

方式2，length赋值为0

这种方式很有意思，其它语言如Java，其数组的length是只读的，不能被赋值。如

1
2
int[] ary = {1,2,3,4};
ary.length = 0;
Java中会报错，编译通不过。而JS中则可以，且将数组清空了，

1
2
3
var ary = [1,2,3,4];
ary.length = 0;
console.log(ary); // 输出 []，空数组，即被清空了

目前 Prototype中数组的 clear 和mootools库中数组的 empty 使用这种方式清空数组。

方式3，赋值为[]

1
2
var ary = [1,2,3,4];
ary = []; // 赋值为一个空数组以达到清空原数组
这里其实并不能说是严格意义的清空数组，只是将ary重新赋值为空数组，之前的数组如果没有引用在指向它将等待垃圾回收。
Ext库Ext.CompositeElementLite类的 clear 使用这种方式清空。

方式2 保留了数组其它属性，方式3 则未保留。很多人认为方式2的效率很高些，因为仅仅是给length重新赋值了，而方式3则重新建立个对象。经 测试 恰恰是方式3的效率高。测试代码：

1
2
3
4
5
6
7
8
9
var a = [];
for (var i=0; i< 1000000; i++){
    a.push(i);
}
var start = new Date();
//a = [];
a.length = 0;
var end = new Date();
alert(end - start);
测试结果：



以上结果可看到:方式3更快，效率更高。因此如果不保留原数组的其它属性Ext采用的方式更值得推荐。


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

                let s=$(this)[0].getAttribute("data-citename");
                找子节点
                s=$(this).parents('span.lzl_content_main')[0].getAttribute("data-citename")//找父节点
                alert(s);
                $(this).after('<span class="" style="color:#333;font-size:10px;">( ' +s+')</span>');
                alert($(this).children('span.miao')[0]);
                clearInterval(t3);
                at j_user_card
                alert("233");
                document.querySelectorAll(".lzl_content_main")
                $("span.lzl_content_main").children('span.miao2')[0]
                $("span.lzl_content_main>a.at").each(function()

                color:rgba(0,0,0,0)
                1.css3新增的一个属性rgba,语法
                  R：红色值。正整数 | 百分数
                  G：绿色值。正整数 | 百分数
                  B：蓝色值。正整数| 百分数
                  A：透明度。取值0~1之间
               2.设置透明度是不会被继承的，所以不用头疼继承的问题.字体透明度便设置成color:rgba(0,0,0,0.5);边框：border:5px solid rgba(0,0,0,0.5);或者背景都可以。
               3.兼容性。支持ie9及以上的浏览器
*/