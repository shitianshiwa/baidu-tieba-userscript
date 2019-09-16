// ==UserScript==
// @name         修复百度电脑端贴吧一些bug(beta)
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  修复超高楼层主题贴里的超长楼层选择列表导致的‘贴子管理’和‘删除主题’按钮显示异位，仅对吧务有用（吧主，小吧主，语音小编）
// @author       shitianshiwa
// @include      http*://tieba.baidu.com/p/*
// @grant        none
// @downloadURL  https://github.com/shitianshiwa/baidu-tieba-userscript/
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    try
    {
        var temp1= $("div.l_thread_manage")[0];
        if(temp1!=null)
        {
            temp1.style="position: relative;margin-right: 10px;"//修改样式
        }
    }
    catch(error)
    {
        alert(error);
    }
})();