// ==UserScript==
// @name         查询贴吧周报
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  查看某个吧的贴吧周报(以7天为周期),全局上似乎已经不会更新数据了?但每个吧最后更新进度可能不一致。也许api参数变了我还不知道？
// @author       shitianshiwa
// @include      http*://tieba.baidu.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.min.js
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @license      MIT
// ==/UserScript==
//https://www.52fisher.cn/93.html 常用贴吧接口 April 15, 2016 http://tieba.baidu.com/sign/info?kw=&ie=utf-8
//https://tieba.baidu.com/mo/q/weeklybazhuview?fid=&beginTime=1590768000 贴吧周报api
//https: //tieba.baidu.com/mo/q/weeklybazhuview?fid=26497728&beginTime=1617984000
(function($) {
    'use strict';

    function AA() //贴吧周报
    {
        let a = prompt("请输入贴吧名：", unsafeWindow.PageData.forum.forum_name || unsafeWindow.PageData.forum.name || "");
        let t0 = parseInt(new Date().getTime() / 1000); //获取当前的时间戳
        let step = parseInt((t0 - 1590768000) / 604800); //获取周数
        let t1 = new Array(); //从2020-05-30 00:00:00开始,到最新的时间戳除以7天604800
        let t;
        for (let i = 0; i < step; i++) {
            t = new Date((1590768000 + 604800 * i) * 1000); //毫秒
            t1.push("日期:" + t.getFullYear() + "年" + (t.getMonth() + 1) + "月" + t.getDate() + "日" + (t.getUTCHours() + 8).toString().replace("24", "0") + "时" + t.getMinutes() + "分" + t.getSeconds() + "秒,时间戳:" + t.getTime() / 1000 + "\n");
        }
        let z = document.createElement("div"); //创建节点<input/>
        /* z.setAttribute('id', 'div1');
        z.setAttribute('class', 'divstyle');
        z.setAttribute('style', "background:#66ccff;width:500px;heigth:500px;");*/
        console.log(t1);
        let t2 = prompt(t1 + "请输入一个时间戳：", t1[t1.length - 1].split("时间戳:")[1].replace("\n", ""));
        //document.body.append(z);
        a = a.trim(); //去掉首尾空格
        if (a != null && a != "") {
            let b = "/sign/info";
            let c = { 'kw': a, 'ie': 'utf-8' };
            $.post(b, c, function(o) {
                if (o.no == 0) {
                    let temp = o.data.forum_info.forum_info.forum_id;
                    let t = new Date(t2 * 1000 /*(1590768000+604800)*1000*/ ); //毫秒
                    alert(t.getFullYear() + "年" + (t.getMonth() + 1) + "月" + t.getDate() + "日" + (t.getUTCHours() + 8) + "时" + t.getMinutes() + "分" + t.getSeconds() + "秒")
                    window.open("https://tieba.baidu.com/mo/q/weeklybazhuview?fid=" + temp + "&beginTime=" + t.getTime() / 1000); //2020-05-30 01:00:00，604800 7天
                } else {
                    alert("no:" + o.no + "error:" + o.error);
                }
            }, "json");
        } else {
            alert("贴吧名为空" + a);
        }
    }
    GM_registerMenuCommand("查询吧周报", AA); // @grant        GM_registerMenuCommand
})($);