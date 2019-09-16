// ==UserScript==
// @name         删除自己的贴子,封禁可用(beta)
// @namespace    http://tampermonkey.net/
// @version      0.32
// @description  自清黑历史用,可用于清理楼中楼被隐藏的贴子(我的贴吧http://tieba.baidu.com/i/i/my_tie),2017年以前还在隐藏中只能自己高级搜索出的贴子(http://tieba.baidu.com/f/search/adv)(删别人的贴子没用,是吧务也不会误伤到(因为缺少参数))
// @include      http*://tieba.baidu.com/i/i/*
// @include      http*://tieba.baidu.com/f/search/*
// @author       shitianshiwa
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL  https://github.com/shitianshiwa/baidu-tieba-userscript/
// ==/UserScript==
//删除自己的贴子，封禁可用
//@include      http*://tieba.baidu.com/*
//http://tieba.baidu.com/f/search/adv
//http://tieba.baidu.com/i/i/my_tie
//删帖必须同时有tid和pid

(function() {
    'use strict';
    var $ = window.jQuery;
    const css1=`
/*按钮样式*/
.miaocss02
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
/*鼠标移动到按钮上显示的样式*/
.miaocss02:hover
{
background: #fff;
color: #3e89fa;
border: 1px solid #3e89fa;
}
`;
    const patt =/^\d+$/;//判断是否全是数字的正则表达式
    const IE="utf-8";//编码
    const style = document.createElement('style');//创建新样式节点
    style.textContent = css1;//添加样式内容
    document.head.appendChild(style);//给head头添加新样式节点
    $.post("/dc/common/tbs","",function(o){sessionStorage.setItem("miaousertbs",o.tbs);},"json");//获取用户tbs口令号并储存在sessionStorage中，待使用
    function xianshi()//显示贴子链接和删除按钮
    {
        clearTimeout(t2);
        try//用来解决无法捕捉到标签导致javascript出错无法运行下
        {
            //http*://tieba.baidu.com/i/i/*
            //($("a.b_reply")).attr("href")
            $("a.b_reply").each(function()
                                {
                //alert("233");
                //$("input.j_deltag1").attr("title")
                //添加删除按钮
                $(this).parents("div.wrap_container").after('<input class="j_deltag1 miaocss02" type="button" id="" value="删贴" title="https://tieba.baidu.com'+$(this).attr("href")+'"/>');//我的贴子
                //-------------------
                //添加显示链接
                $(this).parents("div.wrap_container").after('<p class="" style="color:#F00;font-size:12px;font-weight:bold;">https://tieba.baidu.com' +$(this).attr("href")+'</p>');//我的贴子
                //-------------------
                //添加删除按钮
                $(this).parents("div.b_right_up>nobr").after('<input class="j_deltag2 miaocss02" type="button" id="" value="删贴" title="https://tieba.baidu.com'+$(this).attr("href")+'"/>');//我的回复的回复
                //-------------------
                //添加显示链接
                $(this).parents("div.b_right_up>nobr").after('<p class="" style="color:#F00;font-size:12px;font-weight:bold;">https://tieba.baidu.com' +$(this).attr("href")+'</p>');//我的回复的回复
                //-------------------
                //添加删除按钮
                //$(this).parents("div.common_source_main").after('<input class="j_deltag3" type="button" id="" value="删贴" title="https://tieba.baidu.com'+$(this).attr("href")+'">');//我的回复的主题贴，无法获得pid,这个没用
                //-------------------
                //添加显示链接
                $(this).parents("div.common_source_main").after('<p class="" style="color:#999;font-size:12px;">https://tieba.baidu.com' +$(this).attr("href")+'</p>');//我的回复的主题贴
                //-------------------

            });
            //event.target.title事件获取到按钮，获取title值
            $("input.j_deltag1,input.j_deltag2").click(function(event)
                                                       {
                if(window.prompt('确认要删除贴子？输入"1"继续')=="1")
                {
                    Del1(event);
                }
            });//我的贴子
            //$("input.j_deltag1").click(function(event){Del1(event.target.title);});//我的贴子
            //$("input.j_deltag2").click(function(event){Del1(event.target.title);});//我的回复的回复
            //$("input.j_deltag3").click(function(event){Del1(event.target.title);});//我的回复的主题贴,没有pid所以不用了
        }
        catch(error)
        {
            alert(error);
        }
        try//用来解决无法捕捉到标签导致javascript出错无法运行下
        {
            //高级搜索
            //http*://tieba.baidu.com/f/search/*
            //$("div.s_post").children("span.p_title").children("a.bluelink").attr("href")
            $("div.s_post").each(function()
                                 {
                //alert("233");
                //添加删除按钮
                $(this).children("span.p_title").after('<input class="j_deltag4 miaocss02" type="button" id="" value="删贴" title="https://tieba.baidu.com'+$(this).children("span.p_title").children("a.bluelink").attr("href")+'"/>');
                //-------------------
                //添加显示链接
                $(this).children("span.p_title").after('<p class="" style="color:#F00;font-size:12px;font-weight:bold;">https://tieba.baidu.com' +$(this).children("span.p_title").children("a.bluelink").attr("href")+'</p>');
                //-------------------

            });
            $("input.j_deltag4").click(function(event)
                                       {
                if(window.prompt('确认要删除贴子？输入"1"继续')=="1")
                {
                    Del1(event);
                }
            });//高级搜索
        }
        catch(error)
        {
            alert(error);
        }
        /*try//主题贴列表
        {
            //JSON.parse(($("li.j_thread_list")).attr('data-field')).first_post_id
            $("li.j_thread_list").each(function()
            {
                //alert("233");
                $(this).children("div.t_con").after('<p class="" style="color:#999;font-size:2px;">tid='+JSON.parse(($(this)).attr('data-field')).id+',pid=' +JSON.parse(($(this)).attr('data-field')).first_post_id+'</p>');

            });
        }
        catch(error)
        {
            alert(error);
        }*/
        /*try//贴子列表
        {
            //JSON.parse(($("div.l_post")).attr('data-field')).content.post_id
            $("div.l_post").each(function()
            {
                //alert("233");
                $(this).children("div.d_author").after('<p class="" style="color:#999;font-size:2px;">pid=' +JSON.parse(($(this)).attr('data-field')).content.post_id+'</p>');

            });
        }
        catch(error)
        {
            alert(error);
        }*/
    }
    function Del1(obj)
    {
        //alert(sessionStorage.getItem("miaousertbs"));
        //let href=prompt("输入要删除的贴子链接");
        //alert(obj.target.title);
        try
        {
            var href=obj.target.title;
            var temp1=href.split("/")[4];
            var temp2=temp1.split("?");
            if(temp2.length>1)
            {
                var temp3=temp2[1].split("&");
                var TID=temp2[0];
                //alert(temp3[1].split("=")[1].split("#")[0]);
                for(let x in temp3)
                {
                    if(temp3[x].indexOf("cid")!=-1)
                    {
                        var PID=temp3[x].split("=")[1].split("#")[1];//取链接#后面的数字，放入pid中，https://tieba.baidu.com/p/XXXXXXX?pid=XXXXXX&cid=XXXXXXX#XXXXXXX
                        break;
                    }
                    //alert(x);
                    /*if(temp3[x].indexOf("pid")!=-1)
                    {
                        var PID=temp3[x].split("=")[1];
                        //break;
                    }*/
                }
                //alert(TID+","+PID+","+CID);
                //alert(TID+","+PID);
                if(window.prompt('tid='+TID+',pid(删楼中楼是取cid值)='+PID+',确认后输入"1"继续')=="1")
                {
                    //alert(TID+","+PID);
                    //let a=prompt("输入要删除的贴子tid(数字)（tieba.baidu.com/p/xxxxxxxxx）");
                    //let b=prompt("请输入pid(数字)(主题贴,楼层，楼中楼均必填)");
                    if(TID!=null&&TID!=""&&PID!=null&&PID!=""&&patt.test(TID)==true&&patt.test(PID)==true)//不能为空和null,必须全是数字
                    {
                        let s="/f/commit/post/delete";
                        let c={tbs:sessionStorage.getItem("miaousertbs"),tid:TID,pid:PID,ie:IE};//kw:PageData.forum.name,fid:PageData.forum.id
                        $.post(s,c,function(o)
                               {
                            if(o.no!=0)
                            {
                                alert("no:"+o.no+"nerr_code:"+o.err_code+"nerror:"+o.error);
                            }
                            else
                            {
                                alert("OK");
                                obj.target.value="已删除";
                                obj.target.style="color:#999;"
                                obj.target.disabled=true;
                            }
                        },"json");
                    }
                    else
                    {
                        alert("tid="+TID+",pid(删楼中楼是取cid值)="+PID);
                    }
                }
            }
            else
            {
                alert("只有tid="+temp2+",没有pid和cid(删楼中楼是取cid值)");
            }
            //alert("已启用.");
        }
        catch(error)
        {
            alert(error);
        }
    }
    function Del2()
    {
        try
        {
            if($("div.dialogJmodal")[0]!=null)
            {
                $("div.dialogJmodal").remove();//删掉深灰色背景,提示这是通用标签
            }
            if($("div.dialogJ")[0]!=null)
            {
                $("div.dialogJ").remove();//删掉弹窗，提示这是通用标签,会把退出账号弹窗也删掉
            }
            if($("div.j_itb_block")[0]!=null)
            {
                $("div.j_itb_block").remove();//删掉灰色背景，提示这是通用标签
            }
        }
        catch(error)
        {
            alert("清除封禁提示已关闭");
            clearInterval(t3);
            alert(error);
        }
    }
    function Del3()
    {
        alert("清除封禁提示已关闭");
        clearInterval(t3);
    }
    var t2=setTimeout(xianshi,2000);//延迟2s启动
    var t3=setInterval(Del2,1000);//每一秒启动一次
    GM_registerMenuCommand("关掉清除封禁提示(账号被封时才有使用，会把退出账号弹窗也删掉）", Del3);
})();