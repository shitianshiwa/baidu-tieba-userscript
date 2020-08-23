// ==UserScript==
// @name         贴吧贴子版块分区修改(仅吧主有用)
// @namespace    http://tampermonkey.net/
// @version      0.03
// @description  修改贴子的版块分区，仅吧主可用。备注：并无法看到贴子的版块分区，也就是需要配合贴吧客户端使用才行（贴吧客户端还支持批量操作，而这个脚本仅支持单个贴子。这脚本有用吗？233）
// @author       shitianshiwa
// @run-at       document-idle
// @include      http*://tieba.baidu.com/p/*
// @require      https://greasyfork.org/scripts/32927-md5-hash/code/MD5%20Hash.js?version=225078
// @require      http://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// ==/UserScript==
//const $ = unsafeWindow.jQuery;
(function() {
    'use strict';
    console.log("New Userscript jquery版本号：" + $.fn.jquery);
    const patt = /^\d+$/; //判断是否全是数字的正则表达式
    async function BB() {
        let temp3 = await $.post("/bawu2/platform/listForumTab?word=" + unsafeWindow.PageData.forum.name + "&tbs=" + (unsafeWindow.PageData.tbs || unsafeWindow.PageData.user.tbs).toString() + "&ie=utf-8", "", function(o) {
            //console.log(o.errno);
            if (o.errno == 0) {
                console.log("listForumTab：ok");
                //return o;
            } else {
                console.log("listForumTab:" + o);
                //return null;
            }
        }, "json");
        console.log(temp3)
        if (temp3.errno == 0) {
            if (temp3 != null) {
                let temp = temp3.data.tab_list;
                let temp2 = new Array();
                for (let i = 0; i < temp.length; i++) {
                    temp2.push(temp[i]['rank'] + "," + temp[i]['tab_name'] + "," + temp[i]['tab_id']);
                }
                temp2.push("9,没有分区,0\n");
                console.log(temp2);
                return temp2;
            } else {
                return null;
            }
        }
        return null;

    }
    async function AA() //添加板块分区
    {
        let a2 = String(window.location.href).split("/"); //第一次分割
        let s = "/c/c/bawu/moveTabThread";
        let a4 = await BB();
        let a5;
        let a6;
        //alert(a4);
        if (a4 != null) {
            let a7 = "";
            for (let i = 0; i < a4.length; i++) {
                a7 += a4[i] + "\n";
            }
            a5 = prompt(a7 + "请输入该贴子的现有分区号：");
            a6 = prompt(a7 + "请输入该贴子的目标分区号：");
            if (a5 == "" || a5 == null) {
                a5 = "0";
            }
        } else {
            alert("获取版块分区信息失败！")
        }
        //console.log(a5+","+a6)
        if (a5 != null && a5 != "" && patt.test(a5) == true && a6 != null && a6 != "" && patt.test(a6) == true) {
            if ((parseInt(a5) >= 0 && parseInt(a5) <= 9) && (parseInt(a6) >= 0 && parseInt(a6) <= 9)) {
                //console.log("ok"+a4[a5].split(",")[2]+a4[a6].split(",")[2]);
                let b;
                if (a5 == 0) {
                    b = '[{"thread_id":"' + unsafeWindow.PageData.thread.thread_id + '","from_tab_id":' + 0 + ',"to_tab_id":' + a4[a6 - 1].split(",")[2] + '}]';

                } else if (a6 == 0) {
                    b = '[{"thread_id":"' + unsafeWindow.PageData.thread.thread_id + '","from_tab_id":' + a4[a5 - 1].split(",")[2] + ',"to_tab_id":' + 0 + '}]';

                } else {
                    b = '[{"thread_id":"' + unsafeWindow.PageData.thread.thread_id + '","from_tab_id":' + a4[a5 - 1].split(",")[2] + ',"to_tab_id":' + a4[a6 - 1].split(",")[2] + '}]';
                }
                let c = {
                    "_client_version": "11.6.0.0",
                    "forum_id": unsafeWindow.PageData.forum.id.toString(),
                    "tbs": (unsafeWindow.PageData.tbs || unsafeWindow.PageData.user.tbs).toString(),
                    'threads': b,
                    "timestamp": new Date().getTime().toString()
                };
                //https://www.cnblogs.com/xuejianxiyang/p/10221930.html js dictionary字典 遍历
                let d = "";
                for (let key in c) {
                    //console.log(key);
                    if (key == "threads") {
                        d += key + "=[{";
                        d += '"thread_id":"' + unsafeWindow.PageData.thread.thread_id + '",';
                        if (a5 == 0) {
                            d += '"from_tab_id":' + 0 + ',';
                            d += '"to_tab_id":' + a4[a6 - 1].split(",")[2];
                        } else if (a6 == 0) {
                            d += '"from_tab_id":' + a4[a5 - 1].split(",")[2] + ',';
                            d += '"to_tab_id":' + 0;
                        } else {
                            d += '"from_tab_id":' + a4[a5 - 1].split(",")[2] + ',';
                            d += '"to_tab_id":' + a4[a6 - 1].split(",")[2];
                        }
                        d += "}]";
                    } else {
                        d += key + "=";
                        d += c[key];
                    }
                }
                d += "tiebaclient!!!";
                c['sign'] = MD5(d);
                $.post(s, c, function(o) {
                    if (o.error_code == 0) {
                        alert("OK");
                    } else {
                        console.log(o);
                    }
                }, "json");
                console.log(c);
                console.log(d);
            } else {
                alert("填写信息无效！")
            }
        } else {
            console.log("获取版块分区信息失败！")
        }
        //console.log(c["threads"][0]);
    }
    GM_registerMenuCommand("修改贴子的板块分区", AA); // @grant        GM_registerMenuCommand
})();