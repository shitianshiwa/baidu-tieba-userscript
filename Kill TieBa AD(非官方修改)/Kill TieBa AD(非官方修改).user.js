// ==UserScript==
// @name         Kill TieBa AD(非官方修改)
// @name:zh-CN   貼吧廣告清理(非官方修改)
// @name:zh-TW   貼吧廣告去除(非官方修改)
// @namespace    hoothin
// @version      1.3.2((beta)0.32)
// @description        Just Kill TieBa AD
// @description:zh-CN  清理百度貼吧（tieba.baidu.com）内的列表僞裝，帖内僞裝，觸點廣告，頁首廣告，推薦應用等各類廣告
// @description:zh-TW  去除百度貼吧（tieba.baidu.com）内的列表偽裝，帖內偽裝，觸點廣告，頁首廣告，推薦應用等各類廣告
// @author       hoothin
// @include      http*://tieba.baidu.com/p/*
// @include      http*://tieba.baidu.com/f?*
// @exclude      http*://tieba.baidu.com/
// @exclude      http*://tieba.baidu.com/index.html
// @run-at       document-idle
// @grant        none
// @supportURL   http://www.hoothin.com
// @license     MIT License
// @compatible        chrome
// @compatible        firefox
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=rixixi@sina.com&item_name=Greasy+Fork+donation
// @contributionAmount 1
// ==/UserScript==
//增加简体中文条件判断
//非官方修改！
(function()
 {
    'use strict';
    function killad()
    {
        try
        {
	        if(t!=null)
	 	   	{
        		clearTimeout(t);
    		}
            //alert("233");
            var observer, option;
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            var tcss = ".j_encourage_entry,#video_frs_head,#encourage_entry,.tpoint-skin,#pb_adbanner,.iframe_wrapper,div.tpoint-skin,.j_click_stats,#thread_list>li:not(.j_thread_list):not(.thread_top_list_folder),#j_p_postlist>.clearfix:not([data-field*=post_id]){display:none !important;}";
            var snod = document.createElement('style');
            snod.innerHTML = tcss;
            document.getElementsByTagName("head")[0].appendChild(snod);
            var content = document.querySelector("#content");
            if(content)
            {
                delAD("#thread_list","LI");
                observer = new MutationObserver(function(records)
                                                {
                    delAD("#thread_list","LI");
                });
                option = {
                    'childList': true,
                    'subtree': true
                };
                observer.observe(content, option);
            }
            else
            {
                content=document.querySelector(".l_container");
                if(content)
                {
                    delAD("#j_p_postlist","DIV");
                    observer = new MutationObserver(function(records)
                                                    {
                        delAD("#j_p_postlist","DIV");
                    });
                    option = {
                        'childList': true,
                        'subtree': true
                    };
                    observer.observe(content, option);
                }
                else
                {
                    content=document.querySelector(".post_list");
                    if(content)
                    {
                        delAD(".threads_list","LI");
                        observer = new MutationObserver(function(records){
                            delAD(".threads_list","LI");
                        });
                        option = {
                            'childList': true,
                            'subtree': true
                        };
                        observer.observe(content, option);
                    }
                }
            }
            var easyAD, easyADs=document.querySelectorAll("span.label_text"),i;
            for(i=0;i<easyADs.length;i++)
            {
                easyAD = easyADs[i];
                if(easyAD.innerHTML==("广告") && easyAD.parentNode && easyAD.parentNode.parentNode)
                {
                    //easyAD.parentNode.parentNode.style="display:none;";
                    easyAD.parentNode.parentNode.removeChild(easyAD.parentNode);
                }
                if(easyAD.innerHTML==("廣告") && easyAD.parentNode && easyAD.parentNode.parentNode)
                {
                    //easyAD.parentNode.parentNode.style="display:none;";
                    easyAD.parentNode.parentNode.removeChild(easyAD.parentNode);
                }
            }
            easyADs=document.querySelectorAll("span.ti_time");
            for(i=0;i<easyADs.length;i++)
            {
                easyAD = easyADs[i];
                if(easyAD.innerHTML==("广告") && easyAD.parentNode && easyAD.parentNode.parentNode && easyAD.parentNode.parentNode.parentNode)
                {
                    //easyAD.parentNode.parentNode.parentNode.style="display:none;";
                    easyAD.parentNode.parentNode.parentNode.removeChild(easyAD.parentNode.parentNode);
                }
                if(easyAD.innerHTML==("廣告") && easyAD.parentNode && easyAD.parentNode.parentNode && easyAD.parentNode.parentNode.parentNode)
                {
                    //easyAD.parentNode.parentNode.parentNode.style="display:none;";
                    easyAD.parentNode.parentNode.parentNode.removeChild(easyAD.parentNode.parentNode);
                }
            }
            //class="l_banner banner_theme"

            //easyADs=document.querySelectorAll("#banner_pb_customize");//贴子内的吧背景图顶偶然发现的广告
            //alert(easyADs[0])
            //if(easyADs[0]!=null)
            //{
            //  easyADs[0].remove();
            // }
            /*easyADs=$("div.cps_wrap")//主题贴内右边贴吧热议榜下面的广告
            if(easyADs.children("span.media_ad")[0]!=null)
            {
                if(easyADs.children("span.media_ad")[0].innerHTML=="广告"||"廣告")
                {
                    easyADs.children("img.cps_img")[0].style="display:none;";//删掉似乎会影响贴子内容加载，所以用样式隐藏起来
                    easyADs.children("span.media_ad")[0].style="display:none;";
                }
            }
            */
            easyADs=document.querySelectorAll("span.media_ad");
            if(easyADs[0]!=null)
            {
                if(easyADs[0].innerHTML=="广告"||"廣告")
                {
                    document.querySelectorAll("img.cps_img")[0].style="display:none;";//删掉似乎会影响贴子内容加载，所以用样式隐藏起来
                    easyADs[0].style="display:none;";
                }
            }
        }
        catch(error)
        {
            alert(error);
        }
        function delAD(a,b)//会执行多次
        {
            var threadList = document.querySelector(a+">"+a),i;
            if(!threadList) threadList = document.querySelector(a);
            if(!threadList) return;
            var delList = [];
            for(i=0;i<threadList.childNodes.length;i++)
            {
                let thread = threadList.childNodes[i];
                if(thread.tagName == "STYLE")
                {
                    delList.push(thread);
                    var previousSibling = thread.previousSibling;
                    previousSibling = previousSibling.tagName == b?previousSibling:previousSibling.previousSibling;
                    if(previousSibling.innerHTML.indexOf("广告") != -1)
                    {
                        delList.push(previousSibling);
                    }
                    if(previousSibling.innerHTML.indexOf("廣告") != -1)
                    {
                        delList.push(previousSibling);
                    }
                }
                else
                {
                    if(thread.getAttribute && thread.getAttribute("data-field"))
                    {
                        var tpointTagType=thread.querySelector(".tpoint-tag-type");
                        if(tpointTagType && tpointTagType.innerHTML.indexOf("广告") != -1)delList.push(thread);
                        if(tpointTagType && tpointTagType.innerHTML.indexOf("廣告") != -1)delList.push(thread);
                        let tdata=JSON.parse(thread.getAttribute("data-field")),pContent=thread.querySelector(".p_content_fix");
                        if(tdata.content && tdata.content.pb_tpoint && tdata.content.pb_tpoint.is_tpoint==1 && pContent)
                        {
                            pContent.classList.remove("p_content_fix");
                        }
                    }
                    else
                    {
                        if(thread.classList && thread.classList.length==2)
                        {
                            delList.push(thread);
                        }
                    }
                }
            }
            for(i=0;i<delList.length;i++)
            {
                let del = delList[i];
                if(del.parentNode)
                {
                    //del.style="display:none;";
                    del.parentNode.removeChild(del);
                }
            }
        }
    }
    killad();
    var t=setTimeout(killad,1000);
})();//运行