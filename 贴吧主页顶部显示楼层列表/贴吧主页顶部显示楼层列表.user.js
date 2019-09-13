// ==UserScript==
// @name         贴吧主页顶部显示楼层列表
// @namespace    http://tampermonkey.net/
// @version      测试(beta)0.35
// @description  让电脑端贴吧使用起来更便利点.增加了顶部楼层列表，跳转按钮
// @include      http*://tieba.baidu.com/p/*
// @include      http*://tieba.baidu.com/f?*
// @author       shitianshiwa
// @grant        none
// @run-at       document-idle
// @downloadURL  https://github.com/shitianshiwa/baidu-tieba-userscript/
// ==/UserScript==
/**/
(function($)
 {
    'use strict';
    var t1,t2,t3;
    var hrefs=window.location.href;
    const css1=`
/*按钮样式*/
.miaocss01
{
display: inline-block;
cursor: pointer;
line-height: normal;
text-decoration: none;
padding: 5px 9px;
font-size: 12px;
background: #fff;
color: #666;
border: 1px solid #e6e6e6;
}
.miaocss02
{
display: inline-block;
cursor: pointer;
line-height: normal;
text-decoration: none;
padding: 5px 9px;
font-size: 12px;
background: #fff;
color: #333;
border: 1px solid #ccc;
background-image: linear-gradient(to bottom,#fcfcfc 0,#f2f2f2 100%);
}
.miaocss03
{
position: relative;
top:0px;
display: inline-block;
width: 45px;
height: 45px;
font-size: 15px;
font-family:"黑体";
font-weight:bold;
background: #ecf2fc;
color: #89a0c5;
border: 1px solid #e6e6e6;
}
.miaocss04
{
position: relative;
top:-5px;
display: inline-block;
width: 48px;
height: 48px;
font-size: 15px;
font-family:"黑体";
font-weight:bold;
background: #fff;
color: #999;
border: 1px solid #e6e6e6;
}
/*鼠标移动到按钮上显示的样式*/
.miaocss01:hover,.miaocss02:hover,.miaocss03:hover,.miaocss04:hover
{
background: #fff;
color: #3e89fa;
border: 1px solid #3e89fa;
}
`;
    const style = document.createElement('style');//创建新样式节点
    style.textContent = css1;//添加样式内容
    document.head.appendChild(style);//给head头添加新样式节点
    //const text0='跳到 <input  class="miaojump1" type="text" style="width:40px;" value="1"/> 页&nbsp;<input  class="miaojump2" type="button" value="确定"/>';
    function louceliebiao()
    {
        try
        {
            //clearTimeout(t2);
            //1-------------------------------------------------
            if(hrefs.split("?")[0].split("/")[3]=="f"||hrefs.indexOf("tab=album")==-1)//解决非主题列表和贴吧图片区报错
            {
                if($("input.miaojump2")[0]!=null)//用来解决翻页后，上下楼层列表不一致的问题,删除上面的，然后再生成一次
                {
                    if($("input.miaojump2")[0].className=="miaojump2 miaocss01")//用跳转确认按钮的class来作条件
                    {
                        $("div.miaoliebiao").remove();
                        //alert("45000000000000000");
                    }
                }
                if($("div.miaoliebiao")[0]==null)
                {
                    if($("#frs_list_pager").html()!=null)
                    {
                        let text1='<div class="miaoliebiao"><div id="frs_list_pager" class="pagination-default clearfix" style="position:relative;left:1px;width:968px;background: #FEFEFE;border:1px solid #e4e6eb;padding:5px;">&nbsp;&nbsp;&nbsp;&nbsp;'+$("#frs_list_pager").html()+'</div></div>';
                        $("div.head_content").append(text1);//电脑端贴吧主页主题贴列表顶部增加楼层列表
                    }
                }
                $("div.pagination-default").children("a").each(
                    function()//主题贴列表
                    {
                        let a=false;
                        for(let i=0;i<$(this)[0].classList.length;i++)
                        {
                            //alert($(this)[0].classList[i]);
                            if($(this)[0].classList[i]=="miaosuo01")//使用class来判断是否注册过事件，如果注册了就会检测到
                            {
                                a=true;
                                break;
                            }
                        }
                        //alert($(this)[0].className);
                        if(a==false)
                        {
                            $(this)[0].classList.add("miaosuo01");//添加class
                            $(this).click(function()
                                          {
                                $("input.miaojump2").remove();//跳转确认按钮
                                $("div.miaoliebiao").remove();//上面的楼层列表
                                //alert("4500");
                            });
                        }
                        //let a=$.data($(this)[0],"events");
                        //a["click"];//在脚本管理器中没用
                    });

                //2--------------------------------------------------------
                $("div.frs_good_nav_wrap").children("span").children("a").each(
                    function()//精品区列表按钮
                    {
                        //alert("2233");
                        let a=false;
                        for(let i=0;i<$(this)[0].classList.length;i++)
                        {
                            //alert($(this)[0].classList[i]);
                            if($(this)[0].classList[i]=="miaosuo02")
                            {
                                a=true;
                                break;
                            }
                        }
                        if(a==false)
                        {
                            $(this)[0].classList.add("miaosuo02");
                            $(this).click(function()
                                          {
                                // alert("6666");
                                clearInterval(t2);//清除计时器，反正网页跳转没有完成前，又自动添加楼层列表
                                $("div.miaoliebiao").remove();
                                t2=setInterval(()=>{louceliebiao();},1000);//延迟1s工作
                            });
                        }
                    });

                //3--------------------------------------------------
                $("input.miaojump2").each(
                    function()//跳转楼层
                    {
                        let a=false;
                        for(let i=0;i<$(this)[0].classList.length;i++)
                        {
                            //alert($(this)[0].classList[i]);
                            if($(this)[0].classList[i]=="miaosuo03")
                            {
                                a=true;
                                break;
                            }
                        }
                        if(a==false)
                        {
                            $(this)[0].classList.add("miaosuo03");
                            $(this).click(
                                function(event)
                                {
                                    //alert("3333");
                                    //alert(String(event.target.previousElementSibling.value));//event.target.parentNode.childNodes.length-2
                                    clearInterval(t2);//没有原因，反正先关掉计时器
                                    let temp=window.location.href;//得到该网页的链接
                                    if(temp.indexOf("pn")!=-1)//用来解决链接无效变长问题，防止无限增加&pn=xxx，https://tieba.baidu.com/f?kw=xxxx&ie=utf-8&tp=0&pn=0&tp=0&pn=0&tp=0&pn=0&tp=0&pn=0
                                    {
                                        let temp2=temp.split("&");//字符串切割
                                        let temp3=temp2[0];
                                        for(let i=1;i<temp2.length-1;i++)//字符串数组不要最后一个
                                        {
                                            temp3=temp3+"&"+temp2[i];//字符串合成
                                            //alert(temp2[i]);
                                        }
                                        //alert(temp3);
                                        window.location.href=temp3+"&pn="+String(event.target.previousElementSibling.value-1)*50;//得到按钮所在地,前一个文本框的内容
                                    }
                                    else
                                    {
                                        window.location.href=temp+"&pn="+String(event.target.previousElementSibling.value-1)*50;
                                    }
                                });
                            //alert($("#miaojump1")[0].value);
                            //alert(String(window.location.href).split("&")[0]);
                            //alert(String(window.location.href).split("&")[0]+"&pn="+String(($("#miaojump1")[0].value-1)*50));
                        }
                    });
                for(var i=0;i<2;i++)
                {
                    if($("input.miaojump1")[i]==null&&$("div.pagination-default")[0]!=null)//只有class可以捕捉多个标签，id不行
                    {
                        let temp1=document.createElement("input");//创建节点<input/>
                        temp1.setAttribute('class','miaojump1');//为input添加属性<input class="miaojump1"/>
                        temp1.setAttribute('type','text');//<input class="miaojump1" type="text"/>
                        temp1.setAttribute('style','width:40px;');//<input class="miaojump1" type="text" style="width:40px;"/>
                        temp1.setAttribute('value','1');//<input class="miaojump1" type="button" value="1" style="width:40px;"/>
                        //---------------------------------------------------
                        let temp2=document.createElement("input");//创建节点<input/>
                        temp2.setAttribute('class','miaojump2 miaocss01');//为input添加属性<input class="miaojump2 miaocss01"/>//贴吧自带的楼层跳转链接样式class为pagination-item
                        temp2.setAttribute('type','button');//<input  class="miaojump2 miaocss01" type="button"/>
                        temp2.setAttribute('value','确定');//<input  class="miaojump2 miaocss01" type="button" value="确定"/>
                        let temp3=document.querySelectorAll("div.pagination-default");
                        //---------------------------------------------------
                        temp3[i].append(" 跳到: ");
                        temp3[i].append(temp1);//添加跳转文本框和确认按钮
                        temp3[i].append(" 页 ");
                        temp3[i].append(temp2);
                    }
                }
            }
        }
        catch(error)
        {
            clearInterval(t2);
            alert(error+",贴吧主页顶部显示楼层列表已停止运行");
        }
    }
    //louceliebiao();使用这个的话，重复切换楼层后，上面就不显示楼层列表了
    t2=setInterval(louceliebiao,1000);//延迟1s工作，等网页基本加载完毕
    //t2=setInterval(()=>{louceliebiao();},1000);//延迟1s工作，等网页基本加载完毕
})($);
/*
Jquery attr()方法 属性赋值和属性获取详解
jquery中用attr()方法来获取和设置元素属性,attr是attribute（属性）的缩写，在jQuery DOM操作中会经常用到attr()，attr()有4个表达式。

1.  attr( 属性名 )//获取属性的值（取得第一个匹配元素的属性值。通过这个方法可以方便地从第一个匹配元素中获取一个属性的值。如果元素没有相应属性，则返回 undefined ）

2.  attr( 属性名, 属性值 )//设置属性的值 （为所有匹配的元素设置一个属性值。）

3.  attr( 属性名 , 函数值 )//设置属性的函数值  （为所有匹配的元素设置一个计算的属性值。不提供值，而是提供一个函数，由这个函数计算的值作为属性值。）

4. attr(properties)//给指定元素设置多个属性值，即：{属性名一: “属性值一” , 属性名二: “属性值二” , … … }。(这是一种在所有匹配元素中批量设置很多属性的最佳方式。 注意，如果你要设置对象的class属性，你必须使用'className' 作为属性名。或者你可以直接使用'class'或者'id'。)

    //var hrefx=window.location.href.split(":")[0];
    //var p=window.location.href.split("/")[3];
//4--------------------------------------------------
        try
        {
            //4---------------------------------------------------
            if($("input.miaotop")[0]==null&&$("input.miaobottom")[0]==null)//主题贴列表滚动条到底
            {
                //$("div.miaoliebiao").children("div.pagination-default").append('    <input type="button" class="miaobottom  miaocss01" value="到网页底部"/>');//增加空格让按钮与前面的按钮隔开点
                if(hrefx=="https"||(hrefx=="http"&&p!="p"))
                {
                    $("li.tbui_fbar_top").remove();//删掉贴吧自带的到顶
                    $("ul.tbui_aside_float_bar").append('<input type="button" class="miaotop  miaocss03" value="到顶↑"/><br/>');//增加回车换行
                    $("ul.tbui_aside_float_bar").append('<input type="button" class="miaobottom  miaocss03" value="到底↓"/>');
                    event_registration();
                }
                else if(hrefx=="http"&&p=="p")
                {
                    t3=setTimeout(delayed_action,1000);//延迟1s发动动作
                }

            }

            if($("input.miaobottom2")[0]==null&&$("ul.l_posts_num")[0]!=null)////主题贴滚动条到底
            {
                //$("ul.l_posts_num")[0].append('    <input type="button" class="miaobottom2" value="到网页底部"/>');//为了可以定位添加节点(一键到底只有贴子顶部有用，一键到顶贴吧自带有)，所以使用下面的添加节点方法
                let temp2=document.createElement("input");
                let temp3=document.querySelectorAll("ul.l_posts_num");
                temp2.setAttribute('class','miaobottom2 miaocss02');//btn-sub btn-small贴吧自带的主题贴确定按钮样式
                temp2.setAttribute('type','button');
                temp2.setAttribute('style','position:relative;left:5px;');
                temp2.setAttribute('value','到网页底部');
                temp3[0].append(temp2);
                $("input.miaobottom2").click(function()
                {
                    window.scrollTo(0,document.body.scrollHeight);
                });
            }
        }
        catch(error)
        {
            alert(error+",主题贴列表滚动条到底未正常运行");
        }
function delayed_action()//延迟动作
    {
        clearTimeout(t3);
        $("li.tbui_fbar_top").remove();//删掉贴吧自带的到顶
        $("ul.tbui_aside_float_bar").append('<input type="button" class="miaotop  miaocss04" value="到顶↑"/><br/>');//增加回车换行
        $("ul.tbui_aside_float_bar").append('<input type="button" class="miaobottom  miaocss04" value="到底↓"/>');
        event_registration();
    }
    function event_registration()//事件注册
    {
        $("input.miaotop").click(
            function()
            {
                window.scrollTo(0,0);//到顶
            });
        $("input.miaobottom").click(
            function()//到底
            {
                window.scrollTo(0,document.body.scrollHeight);
            });
    }
*/
