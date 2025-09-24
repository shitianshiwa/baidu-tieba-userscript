// ==UserScript==
// @name         获取贴吧客户端贴子内容
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  test
// @run-at       document-idle
// @include      http*://tieba.baidu.com/p/*
/// @require      https://greasyfork.org/scripts/32927-md5-hash/code/MD5%20Hash.js?version=225078
// @require      http://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
//const $ = unsafeWindow.jQuery;

//==
// ==UserScript==
// @name         MD5 Hash
// @version      1.0
// @description  MD5 hashing framework
// @author       A Meaty Alt
// @match        /fairview\.deadfrontier\.com/
// @grant        none
// @homepage    https://update.greasyfork.org/scripts/32927/225078/MD5%20Hash.js
// ==/UserScript==

//==外部资源引用开始
//MAGIC HASH BEGINING
var hex_chr = "0123456789abcdef";
var SKeyGen = "y27bigaOAA1";
function MD5(str) {
    var _local2 = str;
    var x = str2blks_MD5(_local2);
    var a = 1732584193 /* 0x67452301 */;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878 /* 0x10325476 */;
    var i = 0;
    while (i < x.length) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = ff(c, d, a, b, x[i + 10], 17, -42063);
        b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = hh(a, b, c, d, x[i + 5], 4, -378558);
        d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = addme(a, olda);
        b = addme(b, oldb);
        c = addme(c, oldc);
        d = addme(d, oldd);
        i = i + 16;
    }
    return(((rhex(a) + rhex(b)) + rhex(c)) + rhex(d));
}
function ff(_arg6, _arg1, _arg3, _arg2, _arg7, _arg5, _arg4) {
    return(cmn(bitAND(_arg1, _arg3) | bitAND(~_arg1, _arg2), _arg6, _arg1, _arg7, _arg5, _arg4));
}
function gg(_arg6, _arg2, _arg3, _arg1, _arg7, _arg5, _arg4) {
    return(cmn(bitAND(_arg2, _arg1) | bitAND(_arg3, ~_arg1), _arg6, _arg2, _arg7, _arg5, _arg4));
}
function hh(_arg6, _arg1, _arg3, _arg2, _arg7, _arg5, _arg4) {
    return(cmn((_arg1 ^ _arg3) ^ _arg2, _arg6, _arg1, _arg7, _arg5, _arg4));
}
function ii(_arg6, _arg1, _arg3, _arg2, _arg7, _arg5, _arg4) {
    return(cmn(_arg3 ^ (_arg1 | (~_arg2)), _arg6, _arg1, _arg7, _arg5, _arg4));
}
function cmn(_arg5, _arg4, _arg2, _arg6, _arg3, _arg1) {
    return(addme(rol(addme(addme(_arg4, _arg5), addme(_arg6, _arg1)), _arg3), _arg2));
}
function addme(_arg4, _arg3) {
    var _local1 = bitAND(_arg4, 65535) + bitAND(_arg3, 65535);
    var _local2 = ((_arg4 >> 16) + (_arg3 >> 16)) + (_local1 >> 16);
    return((_local2 << 16) | bitAND(_local1, 65535));
}
function bitAND(_arg2, _arg1) {
    if ((_arg2 < 0) && (_arg1 < 0)) {
        var _local3 = (_arg2 & 1) & (_arg1 & 1);
        var _local4 = (_arg2 >>> 1) & (_arg1 >>> 1);
        return((_local4 << 1) | _local3);
    }
    return(_arg2 & _arg1);
}
function rhex(_arg1) {
    var str = "";
    var j = 0;
    while (j <= 3) {
        str = str + (hex_chr.charAt(bitAND(_arg1 >> ((j * 8) + 4), 15)) + hex_chr.charAt(bitAND(_arg1 >> (j * 8), 15)));
        j++;
    }
    return(str);
}
function str2blks_MD5(_arg1) {
    var nblk = ((_arg1.length + 8) >> 6) + 1;
    var blks = new Array(nblk * 16);
    var i = 0;
    while (i < (nblk * 16)) {
        blks[i] = 0;
        i++;
    }
    i = 0;
    while (i < _arg1.length) {
        blks[i >> 2] = blks[i >> 2] | (_arg1.charCodeAt(i) << ((i % 4) * 8));
        i++;
    }
    blks[i >> 2] = blks[i >> 2] | (128 << ((i % 4) * 8));
    blks[(nblk * 16) - 2] = _arg1.length * 8;
    return(blks);
}
function rol(_arg1, _arg2) {
    return((_arg1 << _arg2) | (_arg1 >>> (32 - _arg2)));
}
function hash(params){
    var a = params.split("&");
    var b = [];
    for(var i=0;i<a.length;i++)b.push(a[i].split("="));
    var c = SKeyGen;
    for(let i=0;i<b.length;i++)c+=b[i][1];
    return MD5(c);
}
//MAGIC HASH END
//==外部资源引用结束

(function () {
    'use strict';
    console.log("New Userscript jquery版本号：" + $.fn.jquery);
    const patt = /^\d+$/; //判断是否全是数字的正则表达式
    if (GM_getValue("_client_id",) == null) {
        //GM_setValue("_client_id","wappc_${initTime}_${Math.round(Math.random() * 1000).toInt()}");
    }
    async function AA() //添加板块分区
    {
        //http://c.tieba.baidu.com/c/f/pb/page
        /*
    floor_rn=3
from=tieba
kz=贴子id
lz=0
mark=0
net_type=1
pn=1
rn=30
stErrorNums=1
stMethod=1
stMode=1
stSize=409
stTime=198
stTimesNum=1
st_type=tb_frslist
timestamp=时间戳
with_floor=1
tiebaclient!!!
        */
        let a2 = String(window.location.href).split("/"); //第一次分割
        let s = "/c/f/pb/page";
        let a5 = 1;
        let a6 = 1;
        //console.log(a5+","+a6)
        if ((parseInt(a5) >= 0 && parseInt(a5) <= 9) && (parseInt(a6) >= 0 && parseInt(a6) <= 9)) {
            //console.log("ok"+a4[a5].split(",")[2]+a4[a6].split(",")[2]);
            //var num = ThreadLocalRandom.current().nextInt(100, 850)
            let pn = $(".pager_theme_4 ").parent().find(".l_reply_num>span")[1].innerHTML
            if (parseInt(pn) > 1) {
                pn = $(".pager_theme_4 ").find("span.tP")[0].innerHTML
            }
            console.log("pn:" + pn)
            let c = {
                "_client_id": "wappc_1646373611858_182",
                "_client_type": "2",
                "_client_version": "9.9.8.32",
                "back": "0",
                "floor_rn": "10",
                "from": "tieba",
                'kz': unsafeWindow.PageData.thread.thread_id.toString(),
                "lz": "0",
                "mark": "0",
                "net_type": "1",
                "pn": pn,
                "rn": "30",
                "stErrorNums": "1",
                "stMethod": "1",
                "stMode": "1",
                "stSize": "409",
                "stTime": "198",
                "stTimesNum": "1",
                "st_type": "tb_frslist",
                "timestamp": new Date().getTime().toString(),
                "with_floor": "1"
            };
            /*
             "stErrorNums": "1",
                "stMethod": "1",
                "stMode": "1",
                "stSize": "409",
                "stTime": "198",
                "stTimesNum": "1",
                有顺序要求

            private val initTime = System.currentTimeMillis()
    private val clientId = "wappc_${initTime}_${Math.round(Math.random() * 1000).toInt()}"

                        val num = ThreadLocalRandom.current().nextInt(100, 850)
                    var stErrorNums = "0"
                    var stMethod: String? = null
                    var stMode: String? = null
                    var stTimesNum: String? = null
                    var stTime: String? = null
                    var stSize: String? = null
                    if (num !in 100..120) {
                        stErrorNums = "1"
                        stMethod = if (method) "2" else "1"
                        stMode = "1"
                        stTimesNum = "1"
                        stTime = num.toString()
                        stSize = ((Math.random() * 8 + 0.4) * num).roundToInt().toString()
                    }*/
            //https://www.cnblogs.com/xuejianxiyang/p/10221930.html js dictionary字典 遍历
            let d = "";
            for (let key in c) {
                //console.log(key);
                d += key + "=";
                d += c[key];
            }
            d += "tiebaclient!!!";
            c['sign'] = MD5(d);
            //console.log(MD5(""))
            console.log(d);
            console.log(c);
            setTimeout(() => {
                $.post(s, c, function (o) {
                    if (o.error_code == 0) {
                        console.log(o)
                        console.log(JSON.parse(JSON.stringify(o)).post_list)
                        let temp = JSON.parse(JSON.stringify(o)).post_list
                        let louceng = new Array()
                        let lzl = new Array()
                        for (let i = 0; i < temp.length; i++) {
                            //console.log(temp[i].id)
                            //console.log(temp[i].content[0].voice_md5)//楼层
                            if (temp[i].content[0].voice_md5 != undefined) {
                                louceng[temp[i].id] = temp[i].content[0].voice_md5//pid

                            }
                            //console.log(console.log(temp[i].sub_post_list))
                            let temp2 = temp[i].sub_post_list
                            if (temp2 != undefined) {
                                let temp3 = temp2.sub_post_list
                                if (temp3 != undefined) {
                                    for (let ii = 0; ii < temp3.length; ii++) {
                                        let temp4 = temp3[ii].content
                                        //console.log(temp4[iii].id)//楼中楼
                                        if (temp4.length > 1) {
                                            for (let iii = 0; iii < temp4.length; iii++) {
                                                //console.log(temp4[iii].voice_md5)//楼中楼
                                                if (temp4[iii].voice_md5 != undefined) {
                                                    lzl[temp3[ii].id] = temp4[iii].voice_md5
                                                }
                                            }
                                        }
                                        else {
                                            if (temp4[0].voice_md5 != undefined) {
                                                lzl[temp3[ii].id] = temp4[0].voice_md5//spid
                                            }
                                            //console.log(temp4[0].voice_md5)
                                        }
                                    }
                                }
                            }
                        }
                        let voice = document.querySelectorAll("div.voice_player")
                        console.log(voice)
                        for (let i = 0; i < voice.length; i++) {
                            if (voice[i].getAttribute("voice") == null) {
                                //console.log(voice[i].parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-pid"))
                                //document.querySelectorAll("div.voice_player")[2].parentNode.parentNode.parentNode.getAttribute("data-field")
                                //JSON.parse(document.querySelectorAll("div.voice_player")[2].parentNode.parentNode.parentNode.getAttribute("data-field").replace(/"/g,'').replace(/'/g,'"')).spid
                                let temp = voice[i].parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-pid")//let post = $(".l_post").getAttribute("data-pid")
                                let temp2 = voice[i].parentNode.parentNode.parentNode.getAttribute("data-field")
                                let temp3 = null
                                //console.log(voice[i].parentNode.parentNode.parentNode.getAttribute("data-field"))
                                let css = "display:block !important;"//贴吧有可能会强制隐藏语音标签
                                let timecss=""
                                if (temp != undefined) {
                                    if (louceng[temp] != undefined) {//楼层
                                        temp3 = louceng[temp]
                                        console.log("louceng1:" + temp)
                                        console.log("louceng2:" + louceng[temp])
                                        timecss="position: relative;left: 310px;top: -45px;"
                                    }
                                } else if (temp2 != undefined) {//楼中楼
                                    //console.log(JSON.parse(voice[i].parentNode.parentNode.parentNode.getAttribute("data-field").replace(/"/g, '').replace(/'/g, '"')).spid)
                                    let temp4 = JSON.parse(voice[i].parentNode.parentNode.parentNode.getAttribute("data-field").replace(/"/g, '').replace(/'/g, '"')).spid
                                    if (lzl[temp4] != undefined) {
                                        temp3 = lzl[temp4]
                                        css = `float: left;top: -30px;left: 115px;position: relative;width: 250px;height: 40px;`
                                        timecss="position: relative;left: 120px;top: -20px;float: left;"
                                        console.log("lzl1:" + temp4)
                                        console.log("lzl2:" + lzl[temp4])
                                    }
                                }
                                if (temp3 != null) {
                                    let audio = document.createElement('audio')
                                    audio.setAttribute('controls', 'controls');
                                    audio.setAttribute('controlslist', 'download');
                                    audio.setAttribute('style', css);
                                    audio.setAttribute('src', "https://tieba.baidu.com/mg/o/runVoice?md5=" + temp3);
                                    audio.innerText = "你的浏览器不支持audio标签"
                                    //$(".voice_player>.voice_player_inner>.middle>span.time")[0].innerText
                                    voice[i].after(audio)
                                    let time = voice[i].querySelectorAll("span.time")[0]
                                    console.log(time)
                                    if (time != undefined) {
                                        time = time.innerText.replace('"', "")
                                        let time2 = document.createElement('p')
                                        time2.innerText = "语音时长" + time + "秒"
                                        time2.setAttribute("style",timecss)
                                        audio.after(time2)
                                    }
                                    voice[i].setAttribute('voice', '1')
                                    voice[i].remove()
                                }
                            }
                        }
                        console.log(louceng)
                        console.log(lzl)
                    } else {
                        console.log(o);
                    }
                }, "json");
            }, 1000)

        } else {
            alert("填写信息无效！")
        }
        //console.log(c["threads"][0]);
    }
    AA()
})();