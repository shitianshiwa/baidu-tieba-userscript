// ==UserScript==
// @name         激活yandex手机浏览器上的百度贴吧电脑端网页发贴文本编辑器和修改置顶展开按钮样式javascript脚本(beta)
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  用来在yandex手机浏览器激活百度贴吧电脑端网页发贴文本编辑器的(注意运行环境限定)。这里也提示下，这个浏览器上的贴吧置顶贴折叠后无法再展开（因为展开折叠按钮点不到，在显示界面外，可以清除浏览器数据恢复原样。这里修改了置顶展开按钮样式来显示按钮)。激活的原理？不清楚！但发主题贴的文本编辑器点标题文本框可以达到激活显示效果，不过贴子里的文本编辑器是没有标题文本框的，所以加一个没有任何作用的文本框以供点击。备注:即使点了文本框，文本编辑器可能一时半会也出不了。。！(猜测是yandex手机浏览器加载网页是动态的，文本编辑器因未知原因显示不出来,而查看问题网页的源代码发现少了文本编辑器的html代码)   这个javascript脚本需要使用浏览器脚本管理器(例如tampermonkey)或浏览器开发者工具，github上搜FirefoxBar可以了解更多(http://team.firefoxcn.net/)  2019-7-24
// @author       shitianshiwa
// @include      http*://tieba.baidu.com/p/*
// @include      http*://tieba.baidu.com/f?*
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL  https://github.com/shitianshiwa/baidu-tieba-userscript/
// ==/UserScript==
//用try-catch错误处理代替判断链接，只有贴吧主页有展开置顶按钮可以捕捉，贴子里面捉不到，返回为null
//// @require    http://code.jquery.com/jquery-1.11.0.min.js

(function() {
    'use strict';
    var $ = window.jQuery;
    //捕捉class用.，id对象用#?,$=document.getElementById?
    //alert("233");
    var t1;
    //注释：null 表示无值，而 undefined 表示一个未声明的变量，或已声明但没有赋值的变量，或一个并不存在的对象属性。
    function fixyandextieba()
    {
        clearTimeout(t1);
        //alert("233");
        //激活发贴文本编辑器
        var c='<input type="text" name="" value="点击激活文本编辑器" style="width:110px;font-weight:bold;"/>';//文本框
        //改变置顶展开按钮样式
        var cc1="display: none; position: absolute; left: 0px; z-index: 399;"//z-index元素图层高度？absolute相对定位
        var cc2="display: block; position: absolute; left: 0px; z-index: 399;"
        try
        {
            let a=$(".old_style_wrapper");
            let b = document.getElementById("thread_top_folder");//找到展开置顶按钮div，和$(".old_style_wrapper")功能一样用来搜索定位div
            if(a[0]!=null)
            {
                $(".old_style_wrapper").append(c);//搜索<div class="old_style_wrapper">添加文本框
            }
            //alert(b);
            if(b!=null)
            {
                //alert(b.style.display);
                if(b.style.display=="")//如果原来没有点折叠用none不显示，点了折叠用block显示按钮
                {
                    b.style.cssText=cc1;//改变样式
                }
                else
                {
                    b.style.cssText=cc2;
                }
            }
        }
        catch(error)
        {
            alert(error);
        }
    }
    t1=setTimeout(()=>{fixyandextieba();},2000);//延迟2s工作
})();
/*
一、js获取子节点的方式
1.通过获取dom方式直接获取子节点
其中test的父标签id的值，div为标签的名字。getElementsByTagName是一个方法。返回的是一个数组。在访问的时候要按数组的形式访问。

var a = document.getElementById("test").getElementsByTagName("div");
1
2.通过childNodes获取子节点
使用childNodes获取子节点的时候，childNodes返回的是子节点的集合，是一个数组的格式。他会把换行和空格也当成是节点信息。

var b =document.getElementById("test").childNodes;
1
为了不显示不必须的换行的空格，我们如果要使用childNodes就必须进行必要的过滤。通过正则表达式式取掉不必要的信息。下面是过滤掉

//去掉换行的空格
for(var i=0; i<b.length;i++){
    if(b[i].nodeName == "#text" && !/\s/.test(b.nodeValue)){
        document.getElementById("test").removeChild(b[i]);
    }
}
//打印测试
for(var i=0;i<b.length;i++){
    console.log(i+"---------")
    console.log(b[i]);
}
//补充 document.getElementById("test").childElementCount;  可以直接获取长度 同length
1
2
3
4
5
6
7
8
9
10
11
12
4.通过children来获取子节点
利用children来获取子元素是最方便的，他也会返回出一个数组。对其获取子元素的访问只需按数组的访问形式即可。

var getFirstChild = document.getElementById("test").children[0];
1
5.获取第一个子节点
firstChild来获取第一个子元素，但是在有些情况下我们打印的时候会显示undefined，这是什么情况呢？？其实firstChild和childNodes是一样的，在浏览器解析的时候会把他当换行和空格一起解析，其实你获取的是第一个子节点，只是这个子节点是一个换行或者是一个空格而已。那么不要忘记和childNodes一样处理呀。

var getFirstChild = document.getElementById("test").firstChild;
1
6.firstElementChild获取第一个子节点
使用firstElementChild来获取第一个子元素的时候，这就没有firstChild的那种情况了。会获取到父元素第一个子元素的节点 这样就能直接显示出来文本信息了。他并不会匹配换行和空格信息。

var getFirstChild = document.getElementById("test").firstElementChild;
1
7.获取最后一个子节点
lastChild获取最后一个子节点的方式其实和firstChild是类似的。同样的lastElementChild和firstElementChild也是一样的。不再赘余。

 var getLastChildA = document.getElementById("test").lastChild;
 var getLastChildB = document.getElementById("test").lastElementChild;
1
2
二、js获取父节点的方式
1.parentNode获取父节点
获取的是当前元素的直接父元素。parentNode是w3c的标准。

var p  = document.getElementById("test").parentNode;
1
2.parentElement获取父节点
parentElement和parentNode一样，只是parentElement是ie的标准。

var p1 = document.getElementById("test").parentElement;
1
3.offsetParent获取所有父节点
一看offset我们就知道是偏移量 其实这个是于位置有关的上下级 ，直接能够获取到所有父亲节点， 这个对应的值是body下的所有节点信息。

var p2 = document.getElementById("test").offsetParent;
1
三、js获取兄弟节点的方式
1.通过获取父亲节点再获取子节点来获取兄弟节点
var brother1 = document.getElementById("test").parentNode.children[1];
1
2.获取上一个兄弟节点
在获取前一个兄弟节点的时候可以使用previousSibling和previousElementSibling。他们的区别是previousSibling会匹配字符，包括换行和空格，而不是节点。previousElementSibling则直接匹配节点。

var brother2 = document.getElementById("test").previousElementSibling;
var brother3 = document.getElementById("test").previousSibling;
1
2
3.获取下一个兄弟节点
同previousSibling和previousElementSibling，nextSibling和nextElementSibling也是类似的。

var brother4 = document.getElementById("test").nextElementSibling;
var brother5 = document.getElementById("test").nextSibling;
---------------------
版权声明：本文为CSDN博主「-老K-」的原创文章，遵循CC 4.0 by-sa版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/laok_/article/details/75760572
*/