// ==UserScript==
// @name               Kill Baidu AD(非官方修改)(beta)
// @name:zh-CN         百度广告(首尾推广及右侧广告)清理(非官方修改)(beta)
// @namespace          hoothin
// @version            0.86(0.21)
// @description        Just Kill Baidu AD
// @description:zh-CN  彻底清理百度搜索(www.baidu.com)结果首尾的推广广告、二次顽固广告与右侧广告，并防止反复
// @author             hoothin
// @include            http*://www.baidu.com/*
// @include            http*://m.baidu.com/*
// @include            http*://baike.baidu.com/item/*
// @grant              none
// @run-at             document-body
// @license            MIT License
// @compatible         chrome 测试通过
// @compatible         firefox 测试通过
// @compatible         opera 未测试
// @compatible         safari 未测试
// @contributionURL    https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=rixixi@sina.com&item_name=Greasy+Fork+donation
// @contributionAmount 1
// ==/UserScript==
//修改了右边的捕捉节点.ec-pl-container,.hint_right_middle,.ad-block,.ad-block-0
// @run-at             document-start
(function()
 {
    'use strict';
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function(records)
    {
        clearAD();
    });
    var option = {
        'childList': true,
        'subtree': true
    };
    document.onreadystatechange = function()
    {
        if(document.readyState == "interactive")
        {
            observer.observe(document.body, option);
        }
    };

    function clearAD()
    {
        try
        {
            var mAds=document.querySelectorAll(".ec_wise_ad,.ec_youxuan_card"),i;
            if(mAds[0]!=null)
            {
                for(i=0;i<mAds.length;i++)
                {
                    var mAd=mAds[i];
                    mAd.setAttribute('style','display:none;');
                    //mAd.remove();
                }
            }
            var list=document.body.querySelectorAll("#content_left>div,#content_left>table");
            if(list[0]!=null)
            {
                for(i=0;i<list.length;i++)
                {
                    let item = list[i];
                    //item.remove();
                    let s = item.getAttribute("style");
                    if (s && /display:(table|block)\s!important/.test(s))
                    {
                        item.setAttribute('style','display:none;');
                        //item.remove();
                    }
                    else
                    {
                        var span=item.querySelector("div>span");
                        if(span && span.innerHTML=="广告")
                        {
                            item.setAttribute('style','display:none;');
                            //item.remove();
                        }
                        [].forEach.call(item.querySelectorAll("a>span"),function(span){
                            if(span && (span.innerHTML=="广告" || span.getAttribute("data-tuiguang")))
                            {
                                item.setAttribute('style','display:none;');
                                //item.remove();
                            }
                        });
                    }
                }
            }
            var eb = document.querySelectorAll(".ec-pl-container,.hint_right_middle");//右边上广告
            if(eb[0]!=null)
            {
                for(i=0;i<eb.length;i++)
                {
                    let d = eb[i];
                    d.setAttribute('style','display:none;');
                    //alert(d.id);
                    //if (d.id!="con-ar") {
                    //d.remove();
                    // }
                }
            }
            var eb2 = document.querySelectorAll(".ad-block,.ad-block-0");//右边下广告
            if(eb2[0]!=null)
            {
                for(i=0;i<eb2.length;i++)
                {
                    let d = eb2[i];
                    d.setAttribute('style','display:none;');
                    //d.remove();
                }
            }
            eb2 = document.querySelectorAll("div#side_box_unionAd");//百度百科右边下广告
            if(eb2[0]!=null)
            {
                eb2[0].setAttribute('style','display:none;');//隐藏广告
            }
        }
        catch(error)
        {
            alert(error);
        }
    }
    clearAD();
    //setTimeout(()=>{clearAD();},1000);
})();