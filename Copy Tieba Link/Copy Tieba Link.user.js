// ==UserScript==
// @name         复制贴吧贴子内容
// @version      1.2.2.7
/// @name        Copy Tieba Link
/// @version     1.1(0.013465)
// @description  复制贴吧的贴子标题与链接
// @include      http*://tieba.baidu.com/f?kw=*
// @include      http*://tieba.baidu.com/f/good?kw=*
// @include      http*://tieba.baidu.com/p/*
// @include      http*://tieba.baidu.com/f?kz=*
// @include      http*://tieba.baidu.com/f?ie=utf-8&kw=*
// @include      http*://tieba.baidu.com/f?fr=wwwt&kw=*
// @exclude      http*://tieba.baidu.com/f?kw=*&ie=utf-8&tab=album
// @exclude      http*://tieba.baidu.com/f?kw=*&ie=utf-8&tab=video
/// @exclude     http*://tieba.baidu.com/f?kw=*&ie=utf-8&tab=group 贴吧已去掉群组功能 标题: 【公告】贴吧群组功能下线通知 链接：https://tieba.baidu.com/p/6698238206 百度贴吧: 贴吧意见反馈吧 发贴时间: 2020-5-22 19:24
// @exclude      http*://tieba.baidu.com/f?kw=*&ie=utf-8&tab=tuan
// @author       shitianshiwa && 864907600cc     
/// @icon        https://secure.gravatar.com/avatar/147834caf9ccb0a66b2505c753747867
// @require      http://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @run-at       document-idle
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM.xmlHttpRequest
/// @grant        GM_xmlHttpRequest
/// @namespace    http://ext.ccloli.com
// @license      MIT
///这个脚本的维护地址 https://github.com/shitianshiwa/baidu-tieba-userscript/
///原脚本地址：https://greasyfork.org/zh-CN/scripts/17375-copy-tieba-link https://github.com/ccloli
///【噗通一声跪下】求大神发布一个PC端一键复制帖子标题和链接脚本
///@狐狸已经乱了
///http://tieba.baidu.com/p/4371750793
// ==/UserScript==
//仅支持有图片的贴子获取最后回复时间
//语音和表情内容不好处理
//未来计划增加一个UI界面
//目前本脚本不适合复制贴吧里面的代码，容易少复制内容！
//document-start
console.log("jquery版本号: " + $.fn.jquery);
console.log("Copy Tieba Link版本号: 1.2.2.7");
if (document.body.className == "page404") {
    return
}
var setting = {
    title: true,
    author: true,
    with_at: false,
    tiebaming: true,
    link: true,
    neirong_liebiao: true,
    neirong_l: true,
    neirong_lzl: true,
    qianmingdang: true,
    createtime: true,
    lasthuifutime: true,
    huifushu: true,
    split: "\n",
    tips: true,
    tips_time: 5
};
// 是否复制标题，默认为 true
// 是否复制作者（复制楼中楼时则为楼中楼作者），默认为 false
// 若复制AT作者，则是否需要添加 @，默认为 true
// 是否复制贴吧名，默认为 true
// 是否复制链接，默认为 true
// 是否复制主题贴列表里选择的贴子简介内容，默认为true
// 是否复制楼层的内容，默认为true
// 是否复制楼中楼的内容，默认为true
// 是否复制发贴时间，默认为true
// 是否复制最后回复时间，默认为true（仅支持有图片的贴子获取最后回复时间）
// 是否复制回复数，默认为true
// 分隔符，默认为换行符 \n
// 是否显示提示信息，默认为 true
// 提示显示时间，默认为 5（秒）

/**
 * 精简封装 fetch 请求，自带请求 + 通用配置 + 自动 .text()
 *
 * @param {string} url - 请求 URL
 * @param {object} [options={}] - fetch Request 配置
 * @returns {Promise<string>} fetch 请求
 */
//const $ = unsafeWindow.jQuery;
//console.log("jquery版本号：" + $.fn.jquery);
//https://github.com/FirefoxBar/userscript/raw/master/Tieba_Blocked_Detect/Tieba_Blocked_Detect.user.js
//参考贴吧屏蔽检测脚本的代码 https://greasyfork.org/zh-CN/scripts/383981-%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B
const request = (url, options = {}) => fetch(url, Object.assign({
    credentials: 'omit',
    // 部分贴吧（如 firefox 吧）会强制跳转回 http（2020年已经全改成https了）
    redirect: 'follow',
    // 阻止浏览器发出 CORS 检测的 HEAD 请求头
    mode: 'same-origin',
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
}, options)).then(res => res.text());
const ajaxGetAuthor = (url) => { //参考 https://greasyfork.org/ja/scripts/30307-%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E8%B4%B4%E5%90%A7%E5%8E%9F%E5%9B%BE
    var GM_download = GM.xmlHttpRequest || GM_xmlHttpRequest;
    return new Promise(function (resolve, reject) {
        GM_download({
            method: 'GET',
            responseType: 'json',
            url: url,
            //redirect: 'follow',
            // 阻止浏览器发出 CORS 检测的 HEAD 请求头
            //mode: 'same-origin',
            onreadystatechange: function (responseDetails) {
                //console.log(responseDetails.status)
                //                console.log(responseDetails)

                if (responseDetails.readyState === 4) {
                    if (responseDetails.status === 200 /* || responseDetails.status === 304 || responseDetails.status === 0*/) {
                        console.log(responseDetails.response)
                        resolve(responseDetails.response);
                    } else {
                        console.log("onreadystatechange: " + responseDetails.status);
                        resolve(null);
                    }
                }
            },
            onerror: function (responseDetails) {
                console.log("onerror: " + responseDetails.status);
                resolve(null);
            }
        });
    });
}

/**
 * 获取主题贴的移动端地址
 *
 * @param {number} tid - 贴子 id
 * @returns {string} URL
 * src: 1
 * z: 贴子 id
 * pn: 1
 * frsrn: 1
 * pbrn: 1
 * 需要登陆才能显示30楼
 */
const getThreadMoUrl = tid => `//tieba.baidu.com/mo/q-----1-1-0----/m?kz=${tid}`;
const getAuthorMoUrl = tid => `//tieba.baidu.com/photo/bw/picture/toplist?tid=${tid}&ie=utf-8`; //存在抽风，导致楼主和最后回复人位置交换？
/**
 * 返回wap贴吧信息
 *
 * @param {string} res - 页面内容
 */
const threadreturnxinxi = res => res;
/**
 *
 * @param {number} tid - 贴子 id
 */
const getWaptiebaxinxi = tid => request(getThreadMoUrl(tid))
    .then(threadreturnxinxi);
const getAuthor = tid => ajaxGetAuthor(getAuthorMoUrl(tid))

var linkAnchor = document.createElement('a');
linkAnchor.className = 'tieba-link-anchor';
linkAnchor.textContent = '[复制链接]';

var linkPath = 'https://tieba.baidu.com/p/'; //贴吧的贴子已全面支持https
var tieba = unsafeWindow.PageData.forum.name || unsafeWindow.PageData.forum.forum_name; //获取贴吧名
var louzhu1 = $("div.l_post").children("div.d_author").children("div.louzhubiaoshi_wrap")[0]; //获取楼主的标识
var louzhu2;
if (louzhu1 != undefined) {
    try {
        louzhu2 = JSON.parse(louzhu1.parentNode.parentNode.getAttribute("data-field") /*.replace(/'/g, '"')*/).author.portrait.split("?")[0]; //把这里的'换成"会导致json转换失败 onclick=\"Stats.sendRequest('fr=tb0_forum&st_mod=pb&st_value=atlink');\"
    } catch (err) {
        console.log("变量louzhu2位置报错:" + err);
        louzhu2 = "";
    }
} else {
    louzhu2 = "";
}

let tieziurl = window.location.href;
if (tieziurl.search(/(https|http):\/\/c\.tieba\.baidu\.com\/p\//g) != -1 /*发现这种链接即跳转*/ || tieziurl.search(/(https|http):\/\/jump2\.bdimg\.com\/p\//g) != -1) {
    let temp = /(https|http):\/\/c\.tieba\.baidu\.com\/p\/(\d+)/.exec(tieziurl) || /(https|http):\/\/jump2\.bdimg\.com\/p\/(\d+)/.exec(tieziurl);
    //console.log(temp[2]);
    window.location.href = "https://tieba.baidu.com/p/" + temp[2]; //贴子跳转
}

//首次进入贴子时暴力寻找位置安插复制按钮
if (tieziurl.search(/(https|http):\/\/tieba\.baidu\.com\/p\//g) != -1) {
    var T2 = 0;
    var T3 = 0;
    let TTT = setTimeout(() => { //延迟1秒等待页面加载得更完整些，减少捕获标签失败可能
        var T = setInterval(() => {
            if (T2 <= 29) {
                T2++;
            } else {
                clearInterval(T);
                T = null;
            }
            try {
                //core_title_btns 新贴吧是span标签，旧贴吧是ul标签，这里干脆不指定标签了
                let temp2 = $("div#j_core_title_wrap")[0];
                if (temp2.querySelectorAll(".core_title_btns")[0].querySelectorAll(".tieba-link-anchor").length == 0) {
                    //console.log(temp2.querySelectorAll(".core_title_btns")[0].querySelectorAll(".tieba-link-anchor").length);
                    let curAnchor2 = linkAnchor.cloneNode(true);
                    curAnchor2.addEventListener('click', copyLink);
                    curAnchor2.setAttribute('data-anchor-type', '1'); //贴子内的标题
                    //console.log($("div#j_core_title_wrap")[0].querySelectorAll("span.pull-right").length)
                    if (temp2.querySelectorAll("span.pull-right").length == 1) { //($("div#j_core_title_wrap")[0].querySelectorAll("span.pull-right").length == 1) { //!= "pull-right"
                        curAnchor2.setAttribute('style', 'width:80px !important;'); //贴子内的标题
                    } else {
                        curAnchor2.setAttribute('style', 'width:80px !important;position: absolute;left: 510px;top: 22px;'); //贴子内的标题,老贴吧用这个
                    }
                    temp2.querySelectorAll(".core_title_btns")[0].appendChild(curAnchor2);
                    clearInterval(T); //首次进入贴子
                    T = null;
                } else {
                    clearInterval(T); //刷新贴子
                    T = null;
                }
                console.log("j_core_title_wrap:" + temp2.outerHTML);
            } catch (e) {
                console.log("T2:" + e);
                clearInterval(T);
                T = null;
            }
        }, 1000);
        clearTimeout(TTT);
        TTT = null;
    }, 1000);
    var TT = setInterval(() => {
        if (T3 <= 29) {
            T3++;
        } else {
            clearInterval(TT);
            TT = null;
        }
        try {
            let temp3 = $("div.core_reply_tail");
            //暂时解决有时第一次进贴不显示楼层复制按钮问题
            //依然很后面的代码依然保有动态加载按钮功能
            //下面会自动清除计时器
            for (let i = 0; i < temp3.length; i++) {
                if (temp3[i].querySelectorAll(".tieba-link-anchor").length == 0) { //core_title
                    let curAnchor3 = linkAnchor.cloneNode(true);
                    curAnchor3.addEventListener('click', copyLink);
                    curAnchor3.setAttribute('data-anchor-type', '2'); //楼层
                    temp3[i].appendChild(curAnchor3);
                    console.log("core_reply_tail:" + temp3[i].outerHTML);
                }
            }
            console.log("core_reply_tail:" + temp3.length);
        } catch (e) {
            console.log("T3:" + e);
            clearInterval(TT);
            TT = null;
        }
    }, 1000);
}


async function copyLink() {
    var textGroup = [];
    var text;
    var parent = this.parentElement;
    //console.log(parent.parentNode.children[2].innerHTML);
    //console.log(parent.parentNode.parentNode.children[0].children[1].children[1].innerHTML);//楼层除了第一层
    //console.log(parent.parentNode.parentNode.parentNode.children[1].children[0].children[3].children[1].innerHTML);//楼层第1层
    //console.log(parent.parentNode.children[2].children[0].innerHTML);
    //console.log(parent.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
    //console.log(parent.parentNode.parentNode.children[0].children[1].children[1]);//楼层除了第一层
    //console.log(parent.parentNode.parentNode.children[0].children[3].children[1]);//旧版贴吧楼层第一层
    //console.log("this.dataset.linkText:" + JSON.stringify(this.dataset));
    //https://www.cnblogs.com/jijm123/p/15357924.html 关于JAVASCRIPT中的DATASET
    if (this.dataset.linkText) {
        //直接使用储存的合成文本
        text = this.dataset.linkText;
        console.log("this.dataset.linkText:" + text);
    }
    else {
        switch (this.dataset.anchorType) {
            case '0': // 贴吧主题贴列表获取贴子链接
                //console.log(parent.querySelectorAll(".icon-bazhupublicity")[0]);
                /*if (parent.querySelectorAll(".icon-bazhupublicity")[0] != null) {
                    textGroup.push("吧主招募公式贴没有内容可复制！");
                    break;
                }*/
                var temp1 = parent.nextElementSibling.getElementsByClassName('j_user_card')[0];
                if (temp1 != null) {
                    //console.log(parent.parentNode.querySelectorAll("span.is_show_create_time")[0].innerHTML)
                    let temp2 = JSON.parse(temp1.getAttribute("data-field"));
                    let temp3 = null;
                    if (setting.createtime || setting.huifushu) {
                        temp3 = await getWaptiebaxinxi(parent.getElementsByClassName('j_th_tit')[0].href.split("/p/")[1]).then(result => {
                            if (result) {
                                return result;
                            } else {
                                return "";
                            }
                        });
                    }
                    if (setting.title) {
                        let temp = parent.children[0].className;
                        //console.log(temp);
                        if (temp == "icon-vote") {
                            textGroup.push("投票贴: " + parent.getElementsByClassName('j_th_tit')[0].getAttribute('title') + " ");
                        } else if (temp == "icon-good") {
                            textGroup.push("精品贴: " + parent.getElementsByClassName('j_th_tit')[0].getAttribute('title') + " ");
                        } else if (temp == "icon-top" || temp == "icon-member-top") {
                            let temp2 = parent.children[1].className;
                            if (temp2 == "icon-good") {
                                textGroup.push("置顶精品贴: " + parent.getElementsByClassName('j_th_tit')[0].getAttribute('title') + " ");
                            } else {
                                textGroup.push("置顶贴: " + parent.getElementsByClassName('j_th_tit')[0].getAttribute('title') + " ");
                            }

                        } else {
                            textGroup.push("标题: " + parent.getElementsByClassName('j_th_tit')[0].getAttribute('title') + " ");
                        }
                    }
                    if (setting.author) textGroup.push((setting.with_at ? '楼主: @' : '楼主: ') + (temp2.un != "" && temp2.un != "null" ? temp2.un : temp2.id) + ' ');
                    //parent.nextElementSibling.getElementsByClassName('j_user_card')[0].textContent//旧的复制用户名，会复制昵称
                    if (setting.neirong_liebiao) {
                        //console.log(parent.parentNode.parentNode.querySelectorAll("div.threadlist_text")[0]);
                        //console.log(parent.parentNode.parentNode.querySelectorAll("div.threadlist_abs")[0].innerHTML);
                        let temp = "";
                        let x0 = parent.parentNode.parentNode.querySelectorAll(".voice_player")[0];
                        //console.log(x0)
                        if (x0 != null) {
                            //console.log(x1[0].innerHTML);
                            temp += "(语音)";
                        }
                        let x01 = parent.parentNode.parentNode.querySelectorAll(".threadlist_video")[0];
                        //console.log(x0)
                        if (x01 != null) {
                            //console.log(x01.innerHTML);
                            temp += "视频封面：" + x01.innerHTML.match(/(http|https):\/\/((tiebapic|imgsa)\.baidu\.com\/forum\/pic\/item\/.*jpg?|gss3\.baidu\.com\/.*\/tieba-video-frame\/.*\.jpg)/g) + "\n";
                            let temp2 = x01.innerHTML.match(/data-video=".*" data-vsrc="/g);
                            if (temp2 != null) {
                                temp += "视频链接: " + temp2.toString().replace('data-video="', "").toString().replace('" data-vsrc="', "").replace("视频来自：百度贴吧", "").replace('true controlslist\\= download', "").replace(' true  controlslist= nodownload  ', "") + "\n";
                            }
                            //console.log(x01.innerHTML.match(/(http|https):\/\/tiebapic\.baidu\.com\/forum\/pic\/item\/.*jpg/g));
                            //console.log(x01.innerHTML.match(/(http|https):\/\/gss3\.baidu\.com\/.*\/tieba-smallvideo-transcode-crf\/.*\.mp4/g));
                        }
                        let x1 = parent.parentNode.parentNode.querySelectorAll("div.threadlist_abs");
                        if (x1[0] != null) {
                            //console.log(x1[0].innerHTML);
                            temp += x1[0].innerHTML;
                        }
                        // console.log(parent.parentNode.parentNode.querySelectorAll("div.threadlist_text")[0].querySelectorAll("a.vpic_wrap"));
                        let x2 = parent.parentNode.parentNode.querySelectorAll("div.threadlist_text")[0]
                        if (x2 != null) {
                            let x3 = x2.querySelectorAll("a.vpic_wrap>img");
                            if (x3 != null) {
                                for (let i = 0; i < x3.length; i++) {
                                    //document.querySelectorAll("a.vpic_wrap>img")[0].getAttribute("bpic");
                                    let temp1 = x3[i].getAttribute("bpic"); //x3[i].innerHTML.match(/(https|http):\/\/imgsa.baidu.com\/forum\/.*\.?jpg/g);
                                    //let temp2=//x3[i].innerHTML.match(/(https|http):\/\/tiebapic.baidu.com\/forum\/.*\.?jpg/g);
                                    //console.log(x3[i].getAttribute('bpic'));
                                    if (temp1 != null) {
                                        temp1 = temp1.replace(/(http|https):\/\/tiebapic.baidu.com\/forum\/.*\/sign=.*\//g, "http://tiebapic.baidu.com/forum/pic/item/");
                                        temp1 = temp1.replace(/(http|https):\/\/imgsa.baidu.com\/forum\/.*\/sign=.*\//g, "http://imgsa.baidu.com/forum/pic/item/");
                                        temp += temp1 + "\n";
                                    }
                                    /*if(temp2!=null)
                                    {
                                        //console.log(temp2);
                                        temp+=temp2+"\n";
                                    }*/
                                }
                            }
                        }
                        if (temp != "") {
                            //兼容这个脚本https://greasyfork.org/ja/scripts/400724-b%E7%AB%99%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BD%AC
                            temp = temp.replace(/<a.*href="?/g, "").replace(/<\/a>/g, "").replace(/<a.*href="?/g, "").replace(/">/g, " ");
                            temp = temp.replace(/<span class="topic-tag".*?>/g, "").replace(/<\/span>/g, ""); //清理#XXX#话题插入
                            textGroup.push("内容:" + temp.trim() + " ");
                        }
                    }
                    if (setting.link) {
                        textGroup.push("链接：" + parent.getElementsByClassName('j_th_tit')[0].href + " ");
                    }
                    if (setting.tiebaming) {
                        textGroup.push("百度贴吧: " + tieba + "吧 ");
                    }
                    if (setting.createtime) {
                        let temp4 = temp3;
                        if (temp4 != "") {
                            try {
                                //let temp3 = parent.parentNode.querySelectorAll("span.is_show_create_time")[0].innerHTML;
                                temp4 = temp4.split('<div class="i">1楼.')[1].split('<span class="b">')[1].split("</span>")[0]; //.indexOf('您要浏览的贴子不存在') >= 0 || res.indexOf('(共0贴)') >= 0;
                                //console.log(temp3);
                                if (temp4.split("-").length == 2 && temp4.search(/(\d{4})-((0?([1-9]))|(1[1|2]))/) == -1) //只有月，没有年
                                {
                                    temp4 = new Date().getFullYear().toString() + "-" + temp4 //2020-2-2
                                } else if (temp4.split(":").length == 2) { //只有时间，没有年月
                                    temp4 = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate() + " " + temp4 //2020-02-02 02:00
                                }
                                textGroup.push("发贴时间: " + temp4 + " ");
                            } catch (err) {
                                console.log("发贴时间: " + err);
                                textGroup.push("贴子可能已被删除");
                            }

                        }
                        //console.log(getWaptiebaxinxi(parent.getElementsByClassName('j_th_tit')[0].href.split("/p/")[1]));
                        //let temp5="";
                        /*if (temp4) {
                            temp5=await Promise.resolve(temp4).then(result => {
                                if (result) {
                                     return result;
                                }
                            });
                        }*/
                    }
                    if (setting.lasthuifutime) {
                        let temp4 = await getAuthor(parent.getElementsByClassName('j_th_tit')[0].href.split("/p/")[1]);
                        if (temp4 != null) { //有可能获取失败
                            let newDate = new Date();
                            newDate.setTime(temp4.data.thread.last_time * 1000);
                            //console.log(newDate.toLocaleDateString()); // 2014年6月18日
                            //console.log(newDate.toLocaleString()); // 2014年6月18日 上午10:33:24
                            //console.log(newDate.toLocaleTimeString()); // 上午10:33:24
                            //版权声明：本文为CSDN博主「拼搏的小叔」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
                            //原文链接：https://blog.csdn.net/js_admin/java/article/details/76973074
                            textGroup.push("最后回复时间: " + newDate.toLocaleString().replace(/\//g, "-"));
                        }

                    }
                    if (setting.huifushu) {
                        let temp4 = temp3;
                        if (temp4 != "") {
                            if (temp4.match(/<div class="h">.*<\/div>/g) != null) {
                                let temp = parseInt(temp4.match(/<div class="h">.*<\/div>/g).toString().split("第")[1].split("页")[0].split("/")[1]);
                                if (parseInt(temp / 3) == 0) //因为api调用的wap网页只能显示10层楼，这会导致页数*3
                                {
                                    temp4 = 1;
                                } else {
                                    if (temp % 3 == 0) {
                                        temp4 = temp / 3;
                                    } else {
                                        temp4 = parseInt(temp / 3) + 1;
                                    }
                                }
                            } else {
                                temp4 = 1;
                            } //console.log(temp4);
                            //(最大30层楼显示)
                            textGroup.push("贴子页数:" + temp4 + " , 回复数: " + parent.parentNode.parentNode.parentNode.querySelectorAll(".threadlist_rep_num")[0].innerHTML + " ");
                            //console.log(parent.parentNode.parentNode.parentNode.querySelectorAll(".threadlist_rep_num")[0].innerHTML);
                        }
                    }
                } else {
                    let temp3 = null;
                    if (setting.createtime || setting.huifushu) {
                        temp3 = await getWaptiebaxinxi(parent.querySelectorAll(".word_live_title")[0].getAttribute('href').split("/p/")[1]).then(result => {
                            if (result) {
                                return result;
                            } else {
                                return "";
                            }
                        });
                    }
                    //console.log("https:"+parent.querySelectorAll(".word_live_title")[0].getAttribute('href'));//话题贴链接
                    //console.log(parent.querySelectorAll(".word_live_title")[0].getAttribute('title'));//话题贴标题
                    //console.log(parent.children[2].children[0].getAttribute('href').split("un=")[1].split("&")[0]);//话题贴作者
                    if (setting.title) {
                        textGroup.push("今日话题: " + parent.querySelectorAll(".word_live_title")[0].getAttribute('title') + " ");
                    } //话题贴标题
                    if (setting.author) {
                        textGroup.push((setting.with_at ? '楼主: @' : '楼主: ') + parent.querySelectorAll("span.listUser>a")[0].getAttribute('href').split("un=")[1].split("&")[0] + ' ');
                    } //话题贴作者
                    //parent.nextElementSibling.getElementsByClassName('j_user_card')[0].textContent//旧的复制用户名，会复制昵称
                    if (setting.neirong_liebiao) {
                        textGroup.push("内容: " + parent.parentNode.querySelectorAll(".listDescCnt")[0].innerHTML + " ");
                    }
                    if (setting.link) {
                        textGroup.push("链接：https:" + parent.querySelectorAll(".word_live_title")[0].getAttribute('href') + " "); //话题贴链接
                    }
                    if (setting.tiebaming) textGroup.push("百度贴吧: " + tieba + "吧 ");
                    if (setting.createtime) {
                        //let temp3 = parent.parentNode.querySelectorAll("span.is_show_create_time")[0].innerHTML;
                        let temp4 = temp3;
                        if (temp4 != "") {
                            try {
                                temp4 = temp4.split('<div class="i">1楼.')[1].split('<span class="b">')[1].split("</span>")[0]; //.indexOf('您要浏览的贴子不存在') >= 0 || res.indexOf('(共0贴)') >= 0;
                                //console.log(temp3);
                                if (temp4.split("-").length == 2 && temp4.search(/(\d{4})-((0?([1-9]))|(1[1|2]))/) == -1) //只有月，没有年
                                {
                                    temp4 = new Date().getFullYear().toString() + "-" + temp4 //2020-2-2
                                } else if (temp4.split(":").length == 2) { //只有时间，没有年月
                                    temp4 = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate() + " " + temp4 //2020-02-02 02:00
                                }
                                textGroup.push("发贴时间: " + temp4 + " ");
                            } catch (err) {
                                console.log("发贴时间: " + err);
                                textGroup.push("贴子可能已被删除");
                            }
                        }
                    }
                    if (setting.lasthuifutime) {
                        let temp4 = await getAuthor(parent.querySelectorAll(".word_live_title")[0].getAttribute('href').split("/p/")[1]);
                        if (temp4 != null) {
                            let newDate = new Date();
                            newDate.setTime(temp4.data.thread.last_time * 1000);
                            //console.log(newDate.toLocaleDateString()); // 2014年6月18日
                            //console.log(newDate.toLocaleString()); // 2014年6月18日 上午10:33:24
                            //console.log(newDate.toLocaleTimeString()); // 上午10:33:24
                            //版权声明：本文为CSDN博主「拼搏的小叔」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
                            //原文链接：https://blog.csdn.net/js_admin/java/article/details/76973074
                            textGroup.push("最后回复时间: " + newDate.toLocaleString().replace(/\//g, "-"));
                        }
                    }
                    if (setting.huifushu) {
                        let temp4 = temp3;
                        if (temp4 != "") {
                            if (temp4.match(/<div class="h">.*<\/div>/g) != null) {
                                let temp = parseInt(temp4.match(/<div class="h">.*<\/div>/g).toString().split("第")[1].split("页")[0].split("/")[1]);
                                if (parseInt(temp / 3) == 0) //因为api调用的wap网页只能显示10层楼，这会导致页数*3
                                {
                                    temp4 = 1;
                                } else {
                                    if (temp % 3 == 0) {
                                        temp4 = temp / 3;
                                    } else {
                                        temp4 = parseInt(temp / 3) + 1;
                                    }
                                }
                            } else {
                                temp4 = 1;
                            }
                            //(最大30层楼显示)
                            textGroup.push("贴子页数:" + temp4 + " , 回复数: " + parent.parentNode.querySelectorAll(".listReplyNum")[0].innerHTML + " ");
                            //console.log(parent.parentNode.parentNode.parentNode.querySelectorAll(".threadlist_rep_num")[0].innerHTML);
                        }
                    }
                }
                break;
            case '1': // 贴子内页获取贴子链接
                //console.log($("div.l_post").children("div.d_author").children("div.louzhubiaoshi_wrap")[0]);
                //console.log(JSON.parse($("div.l_post").children("div.d_author").children("div.louzhubiaoshi_wrap")[0].parentNode.parentNode.getAttribute("data-field").replace(/'/g, '"')).author.portrait.split("?")[0]);
                if (setting.title) {
                    textGroup.push("标题: " + unsafeWindow.PageData.thread.title + " ");
                }
                if (setting.author) {
                    textGroup.push((setting.with_at ? '楼主: @' : '楼主: ') + (unsafeWindow.PageData.thread.author != "" ? unsafeWindow.PageData.thread.author : louzhu2) + ' ');
                } //portrait
                if (setting.link) {
                    textGroup.push("链接：" + linkPath + unsafeWindow.PageData.thread.thread_id + " ");
                }
                if (setting.tiebaming) {
                    textGroup.push("百度贴吧: " + tieba + "吧 ");
                }
                if (setting.createtime) {
                    //let temp3 = parent.parentNode.querySelectorAll("span.is_show_create_time")[0].innerHTML;
                    let temp3 = await getWaptiebaxinxi(unsafeWindow.PageData.thread.thread_id).then(result => {
                        if (result) {
                            try {
                                return result.split('<div class="i">1楼.')[1].split('<span class="b">')[1].split("</span>")[0]; //.indexOf('您要浏览的贴子不存在') >= 0 || res.indexOf('(共0贴)') >= 0;
                            } catch (err) {
                                console.log("发贴时间: " + err);
                                return "";
                            }
                        } else {
                            return "";
                        }
                    });
                    //console.log(temp3);
                    if (temp3 != "") {
                        if (temp3.split("-").length == 2 && temp3.search(/(\d{4})-((0?([1-9]))|(1[1|2]))/) == -1) //只有月，没有年
                        {
                            temp3 = new Date().getFullYear().toString() + "-" + temp3 //2020-2-2
                        } else if (temp3.split(":").length == 2) { //只有时间，没有年月
                            temp3 = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate() + " " + temp3 //2020-02-02 02:00
                        }
                        textGroup.push("发贴时间: " + temp3 + " ");
                    } else {
                        textGroup.push("贴子可能已被删除");
                    }
                    //console.log(getWaptiebaxinxi(parent.getElementsByClassName('j_th_tit')[0].href.split("/p/")[1]));
                    //let temp5="";
                    /*if (temp4) {
                        temp5=await Promise.resolve(temp4).then(result => {
                            if (result) {
                                 return result;
                            }
                        });
                    }*/
                }
                if (setting.lasthuifutime) {
                    let temp4 = await getAuthor(unsafeWindow.PageData.thread.thread_id);
                    //console.log(temp4);
                    if (temp4 != undefined) {
                        let newDate = new Date();
                        newDate.setTime(temp4.data.thread.last_time * 1000);
                        //console.log(newDate.toLocaleDateString()); // 2014年6月18日
                        //console.log(newDate.toLocaleString()); // 2014年6月18日 上午10:33:24
                        //console.log(newDate.toLocaleTimeString()); // 上午10:33:24
                        //版权声明：本文为CSDN博主「拼搏的小叔」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
                        //原文链接：https://blog.csdn.net/js_admin/java/article/details/76973074
                        textGroup.push("最后回复时间: " + newDate.toLocaleString().replace(/\//g, "-"));
                    }
                }
                if (setting.huifushu) {
                    let temp = parent.parentNode.parentNode.parentNode.parentNode.querySelectorAll(".thread_theme_5>.l_thread_info")[0] || parent.parentNode.parentNode.parentNode.parentNode.parentNode.querySelectorAll(".thread_theme_5")[0];
                    //console.log(parent.parentNode.parentNode.parentNode.parentNode.querySelectorAll(".thread_theme_5")[0]);//新版贴吧的贴子
                    //console.log(parent.parentNode.parentNode.parentNode.parentNode.parentNode.querySelectorAll(".thread_theme_5")[0]);//旧版贴吧的贴子
                    if (temp != null) {
                        temp = temp.querySelectorAll(".l_reply_num>span");
                        textGroup.push("贴子页数:" + temp[1].innerHTML + " , 回复数: " + temp[0].innerHTML + " ");
                    }
                }
                break;
            case '2': // 贴子内页获取楼层链接
                //获取楼层的内容
                console.log(parent.parentNode.parentNode.parentNode.querySelectorAll(".d_post_content.j_d_post_content")[0])
                var floorData00 = parent.parentNode.parentNode.parentNode.querySelectorAll(".d_post_content.j_d_post_content")[0]//parent.parentNode.parentNode.children[0].children[1].children[1] || parent.parentNode.parentNode.children[0].children[3].children[1] || parent.parentNode.parentNode.parentNode.children[1].children[0].children[3].children[1];//d_post_content j_d_post_content 
                var floorData = JSON.parse(parent.parentElement.parentElement.parentElement.dataset.field);
                //console.log(parent.parentNode.parentNode.parentNode.querySelectorAll(".louzhubiaoshi_wrap")[0].getAttribute("class"))
                var floorData02 = parent.parentNode.parentNode.parentNode.querySelectorAll(".louzhubiaoshi_wrap")[0];
                if (floorData02 != null) {
                    floorData02 = floorData02.getAttribute("class");
                }
                //var floorData02 = (parent.parentNode.parentNode.parentNode.children[0].children[0] || parent.parentNode.parentNode.parentNode.children[1].children[0]).getAttribute("class");
                //console.log(parent.parentNode.parentNode.parentNode.children[0].children[0].getAttribute("class"))判断是不是楼主
                /*if (floorData.content.post_no == 1) {
                    //console.log("1楼")
                    //console.log(parent)
                }*/
                //console.log(floorData00)
                //console.log(floorData00.innerHTML.replace(/<a.*?">/g,"").replace(/<img.*?src=/g,"").replace(/<br>/g,"\n").replace(/" size.*?">/g,"").replace(/">/g," ").replace(/<\/a>/g,"").replace(/</g,"").replace(/"/g," "))
                if (setting.title) {
                    textGroup.push("标题: " + unsafeWindow.PageData.thread.title + ' #' + floorData.content.post_no + " ");
                }
                if (setting.author) {
                    textGroup.push((floorData.content.post_no == 1 || floorData02 == "louzhubiaoshi_wrap" ? (setting.with_at ? '楼主: @' : '楼主: ') : (setting.with_at ? '层主: @' : '层主: ')) + (floorData.author.user_name != "" && floorData.author.user_name != "null" ? floorData.author.user_name : floorData.author.portrait) + ' ');
                }
                if (setting.neirong_l) {
                    //console.log(temp.replace(/<div class="replace_div.*?px;">/g,"").replace(/<div class="replace_tip.*?px;">/g,"").replace(/<img.*?src=/g,"").replace(/" size.*?">/g,"").replace(/<i class="icon-expand"><\/i>点击展开，查看完整图片<\/div><\/div>/g,"").replace(/<br>/g,"\n").replace(/"/g," ").replace(/<div class= post_bubble_top.*<div class= post_bubble_middle_inner/g,"").replace(/<\/div <\/div <div class= post_bubble_bottom.*<\/div>/g,"").replace(/>/g," "))
                    let temp = floorData00.innerHTML.replace(/<div class="replace_div.*?px;">/g, "").replace(/<div class="replace_tip.*?px;">/g, "").replace(/<img.*?src=/g, "").replace(/" size.*?">/g, "").replace(/<i class="icon-expand"><\/i>点击展开，查看完整图片<\/div><\/div>/g, "").replace(/<br>/g, "\n").replace(/"/g, " ").replace(/<div class= post_bubble_top.*<div class= post_bubble_middle_inner/g, "").replace(/<div class= post_bubble_bottom.*<\/div/g, "").replace(/<a.*?>|<a.*?">/g, "").replace(/<\/a>/g, " ").replace(/<\/div>/g, " ").replace(/<span class= edit_font_color/g, "");
                    //console.log(temp.replace(/<div class= replace_tip.*>.*<\/div>/g,"").replace(/<div class= replace_div.*px;/g,"").replace(/<a.*?">/g,"").replace(/<img.*?src=/g,"").replace(/<br>/g,"\n").replace(/" size.*?">/g,"").replace(/">/g," ").replace(/<\/a>/g,"").replace(/</g,"").replace(/"/g," "))
                    //console.log(temp.replace(/(http|https):\/\/tiebapic.baidu.com\/forum\/.*\/sign=.*\//g,"http://tiebapic.baidu.com/forum/pic/item/"))
                    //console.log(temp.replace(/(http|https):\/\/imgsa.baidu.com\/forum\/.*\/sign=.*\//g,"http://imgsa.baidu.com/forum/pic/item/"))
                    temp = temp.replace(/<div class= voice_player.*>/g, "(语音)").replace(/<span class= speaker.*>/g, "").replace(/<span class= time.*>/g, "").replace(/<span class= second.*>/g, "").replace(/<span class= minute.*>/g, "").replace(/<span class= before.*>/g, "").replace(/<span class= middle.*>/g, "").replace(/<span class= after.*>/g, "");
                    temp = temp.replace(/<\/span>/g, "").replace(/<strong>/g, "").replace(/<\/strong>/g, "").replace(/<\/em>/g, "").replace(/>/g, " ").replace(/\[url\]/g, "").replace(/\[\/url\]/g, "").replace(/&nbsp;/g, "");
                    temp = temp.replace(/(http|https):\/\/tiebapic.baidu.com\/forum\/.*?\/sign=.*?\//g, "http://tiebapic.baidu.com/forum/pic/item/");
                    temp = temp.replace(/(http|https):\/\/imgsa.baidu.com\/forum\/.*?\/sign=.*?\//g, "http://imgsa.baidu.com/forum/pic/item/"); //替换为大图链接
                    temp = temp.replace(/http/g, " http");
                    temp = temp.replace(/https/g, " https"); //加个空格
                    temp = temp.replace(/<span class= txt  点击展开，查看完整图片/g, "");
                    temp = temp.replace(/<em class= expand/g, "");
                    temp = temp.replace(/<div class= video_src_wrapper/g, "视频链接: ").replace(/<div class= video_src_wrap_main/g, "").replace(/<video style= width: .*px; height: .*px; background:.*;  src=/g, "").replace(/data-threadid=.*data-md5=.*controls=.*autoplay=/g, "").replace(/<\/video  <span class= apc_src_wrapper/g, "").replace("视频来自：百度贴吧", "").replace(' true  controlslist= download  ', "").replace(' true  controlslist= nodownload  ', "")
                    temp = temp.replace(/style=/g, "");
                    temp = temp.trim();
                    textGroup.push("内容: " + temp + " ");
                }
                if (setting.link) {
                    textGroup.push("链接：" + linkPath + unsafeWindow.PageData.thread.thread_id + '?pid=' + floorData.content.post_id + '#' + floorData.content.post_id + " ");
                }
                if (setting.qianmingdang) {
                    //console.log(parent.parentNode.parentNode.querySelectorAll(".j_user_sign")[0].getAttribute("src"));
                    let temp = parent.parentNode.parentNode.querySelectorAll(".j_user_sign")[0];
                    if (temp != null) {
                        textGroup.push("签名档: " + temp.getAttribute("src"));
                    }
                }
                if (setting.tiebaming) {
                    textGroup.push("百度贴吧: " + tieba + "吧 ");
                }
                if (setting.createtime) {
                    //console.log(parent.parentNode.querySelectorAll("span.tail-info")[0].innerHTML);
                    //console.log(parent.parentNode.querySelectorAll("span.tail-info")[0].innerHTML.search(/来自/g));
                    if (parent.parentNode.querySelectorAll("span.tail-info")[1] == null) {
                        textGroup.push("发贴时间: " + parent.parentNode.querySelectorAll("ul.p_tail")[0].querySelectorAll("span")[1].innerHTML + " "); //旧版贴吧
                    } else { //新版贴吧
                        if (parent.parentNode.querySelectorAll("span.tail-info")[0].innerHTML.search(/来自/g) == 0) {
                            textGroup.push("发贴时间: " + parent.parentNode.querySelectorAll("span.tail-info")[2].innerHTML + " "); //特殊贴子处理
                        } else {
                            textGroup.push("发贴时间: " + parent.parentNode.querySelectorAll("span.tail-info")[1].innerHTML + " ");
                        }
                    }
                }
                break;
            case '3': // 贴子楼中楼获取链接
                //获取楼层pid、楼层数 兼容http和https的贴子
                var floorData0 = parent.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-field") || parent.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-field");
                //获取用户名和回复贴spid
                var floorData1 = JSON.parse(floorData0.replace(/'/g, '"')); //JSON.parse必须用"才行，例如：{"XXX":"XXXX"}
                var floorData2 = JSON.parse(parent.parentNode.parentNode.getAttribute("data-field").replace(/'/g, '"')); //spid JSON.parse(parent.parentElement.parentElement.parentElement.dataset.field);
                var floorData3 = JSON.parse(floorData0.replace(/'/g, '"')); //楼层pid
                if (setting.title) {
                    textGroup.push("标题: " + unsafeWindow.PageData.thread.title + ' #' + floorData1.floor_num + ' 楼中楼 ');
                }
                if (setting.author) {
                    textGroup.push(((floorData2.user_name == unsafeWindow.PageData.thread.author && floorData2.user_name != "" && floorData2.user_name != "null") || floorData2.portrait == louzhu2 ? (setting.with_at ? '楼主: @' : '楼主: ') : (setting.with_at ? '回复人: @' : '回复人: ')) + (floorData2.user_name != "" && floorData2.user_name != "null" ? floorData2.user_name : floorData2.portrait) + ' ');
                }
                //应该不会有用户名是null的吧？
                if (setting.neirong_lzl) {
                    let temp = (parent.parentNode.children[2].getAttribute("class") == "lzl_content_main" ? parent.parentNode.children[2].innerHTML /*贴吧超级会员的楼中楼*/ : parent.parentNode.children[1].innerHTML /*普通用户*/);
                    temp = temp.replace(/<a.*?">/g, "").replace(/<img.*?src=/g, " ").replace(/<br>/g, "\n").replace(/">/g, " ").replace(/<\/a>/g, "").replace(/"/g, " ").replace(/\[url\]/g, "").replace(/\[\/url\]/g, "");
                    temp = temp.replace(/<div class= voice_player.*>/g, "(语音)").replace(/<span class= speaker.*>/g, "").replace(/<span class= time.*>/g, "").replace(/<span class= second.*>/g, "").replace(/<span class= minute.*>/g, "").replace(/<span class= before.*>/g, "").replace(/<span class= middle.*>/g, "").replace(/<span class= after.*>/g, "");
                    temp = temp.replace(/class= nicknameEmoji/g, "") //昵称
                    temp = temp.replace(/\/\/tb1.bdstatic.com\/tb\/cms\/nickemoji\//g, "http://tb1.bdstatic.com/tb/cms/nickemoji/"); //用户名昵称
                    temp = temp.replace(/style=/g, "");
                    temp = temp.replace(/width:.*?px;height:.*?px/g, "");
                    temp = temp.replace(/http/g, " http");
                    temp = temp.replace(/https/g, " https"); //加个空格
                    temp = temp.trim();
                    //console.log(temp.replace(/<a.*?">/g, "").replace(/<img.*?src=/g, " ").replace(/<br>/g, "\n").replace(/">/g, " ").replace(/[</a>]/g, "").replace(/"/g, " "));
                    //temp=temp.replace(/(http|https):\/\/tiebapic.baidu.com\/forum\/.*\/sign=.*\//g,"http://tiebapic.baidu.com/forum/pic/item/");
                    //temp=temp.replace(/(http|https):\/\/imgsa.baidu.com\/forum\/.*\/sign=.*\//g,"http://imgsa.baidu.com/forum/pic/item/");
                    textGroup.push("内容: " + temp + " ");
                }
                console.log(parent.parentNode.children[2]) //.children[3].getAttribute("class"));
                /*
                                普通的 #j_p_postlist > div:nth-child(25) > div.d_post_content_main > div.core_reply.j_lzl_wrapper > div.j_lzl_container.core_reply_wrapper > div.j_lzl_c_b_a.core_reply_content > ul > li:nth-child(2) > div.lzl_cnt > span.lzl_content_main
                                会员的 #j_p_postlist > div:nth-child(25) > div.d_post_content_main > div.core_reply.j_lzl_wrapper > div.j_lzl_container.core_reply_wrapper > div.j_lzl_c_b_a.core_reply_content > ul > li.lzl_single_post.j_lzl_s_p.first_no_border > div.lzl_cnt > span.lzl_content_main
                                */
                if (setting.link) {
                    textGroup.push("链接：" + linkPath + unsafeWindow.PageData.thread.thread_id + '?pid=' + floorData3.pid + "&cid=" + floorData2.spid + '#' + floorData2.spid + " ");
                }
                if (setting.tiebaming) {
                    textGroup.push("百度贴吧: " + tieba + "吧 ");
                }
                if (setting.createtime) {
                    //console.log(parent.parentNode.querySelectorAll("span.tail-info")[1].innerHTML);
                    textGroup.push("发贴时间: " + parent.parentNode.querySelectorAll("span.lzl_time")[0].innerHTML.replace(/&nbsp;/g, " ") + " ");
                }
                //贴吧自带的楼中楼回复定位只能定到楼层那里，楼中楼的回复具体位置要自己去找
                //console.log(parent.parentNode.parentNode.parentNode);
                //console.log(parent.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
                //console.log(parent.parentNode.parentNode.parentNode.parentNode.parentNode);//获取楼层pid
                //console.log(parent.parentNode.parentNode.getAttribute("data-field").replace(/'/g,'"'));//https://www.runoob.com/jsref/jsref-replace.html JavaScript replace() 方法
                //console.log(floorData2);
                //if (setting.author) textGroup.push((setting.with_at ? '@' : '') + floorData.author.user_name + ' ');
                //if (setting.link) textGroup.push(linkPath + unsafeWindow.PageData.thread.thread_id + '?pid=' + floorData.content.post_id + '#' + floorData.content.post_id);
                break;
            case '4':
                //console.log(JSON.parse(parent.parentNode.parentNode.parentNode.parentNode.querySelectorAll("#pic_theme_list")[0].getAttribute('data-field')).id);
                //console.log(parent.parentNode.children[0].querySelectorAll("#pic_post_title")[0].getAttribute('title'));
                var temp = JSON.parse(parent.parentNode.parentNode.parentNode.parentNode.querySelectorAll("#pic_theme_list")[0].getAttribute('data-field'));
                var temp6;
                if (setting.createtime || setting.huifushu) {
                    temp6 = await getWaptiebaxinxi(temp.id).then(result => {
                        if (result) {
                            return result;
                        } else {
                            return "";
                        }
                    });
                }
                var temp4 = await getAuthor(temp.id);
                if (setting.title) {
                    textGroup.push("图片话题: " + parent.parentNode.children[0].querySelectorAll("#pic_post_title")[0].getAttribute('title') + " ");
                } //图片话题贴标题
                //if (setting.author) {
                //    textGroup.push((setting.with_at ? '楼主: @' : '楼主: ') + parent.children[2].children[0].getAttribute('href').split("un=")[1].split("&")[0] + ' ');
                //} //图片话题贴无法直接获取到作者
                //console.log(temp4.data);
                //console.log(temp4.data.thread.name);
                //console.log(temp4.data.thread.last_time);
                if (setting.neirong_liebiao) {
                    let temp2 = parent.parentNode.parentNode.parentNode.querySelectorAll(".imgtopic_gallery")[0].querySelectorAll(".thread_pic_show");
                    let temp3 = "图片数: " + parent.parentNode.querySelectorAll("span.all_num")[0].innerHTML + "\n"
                    for (let i = 0; i < temp2.length; i++) {
                        if (temp2[i].getAttribute('content') != "") {
                            temp3 += temp2[i].children[0].getAttribute('bpic') + " ";
                            temp3 += temp2[i].getAttribute('content') + "\n";
                        } else {
                            temp3 += temp2[i].children[0].getAttribute('bpic') + "\n";
                        }
                        //console.log(temp2[i].getAttribute('content'));
                        //console.log(temp2[i].children[0].getAttribute('bpic'));

                    }
                    textGroup.push("内容:\n" + temp3.trim() + " ");

                    //console.log(parent.parentNode.parentNode.parentNode.querySelectorAll(".imgtopic_gallery")[0].querySelectorAll(".threadlist_pic")[0].getAttribute('bpic'));
                    //       textGroup.push("内容: " + temp.trim() + " ");
                }
                if (setting.author) {
                    textGroup.push((setting.with_at ? '楼主: @' : '楼主: ') + temp4.data.thread.name + ' ');
                }

                if (setting.link) {
                    textGroup.push("链接：https://tieba.baidu.com/p/" + temp.id + " "); //话题贴链接
                }
                if (setting.tiebaming) {
                    textGroup.push("百度贴吧: " + tieba + "吧 ");
                }
                if (setting.createtime) {
                    let temp4 = temp6;
                    if (temp4 != "") {
                        try {
                            //let temp3 = parent.parentNode.querySelectorAll("span.is_show_create_time")[0].innerHTML;
                            temp4 = temp4.split('<div class="i">1楼.')[1].split('<span class="b">')[1].split("</span>")[0]; //.indexOf('您要浏览的贴子不存在') >= 0 || res.indexOf('(共0贴)') >= 0;
                            //console.log(temp3);
                            if (temp4.split("-").length == 2 && temp4.search(/(\d{4})-((0?([1-9]))|(1[1|2]))/) == -1) //只有月，没有年
                            {
                                temp4 = new Date().getFullYear().toString() + "-" + temp4 //2020-2-2
                            } else if (temp4.split(":").length == 2) { //只有时间，没有年月
                                temp4 = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate() + " " + temp4 //2020-02-02 02:00
                            }
                            textGroup.push("发贴时间: " + temp4 + " ");
                        } catch (err) {
                            console.log("发贴时间: " + err);
                            textGroup.push("贴子可能已被删除");
                        }
                    }
                    //console.log(getWaptiebaxinxi(parent.getElementsByClassName('j_th_tit')[0].href.split("/p/")[1]));
                    //let temp5="";
                    /*if (temp4) {
                        temp5=await Promise.resolve(temp4).then(result => {
                            if (result) {
                                 return result;
                            }
                        });
                    }*/
                }
                if (setting.lasthuifutime) {
                    var newDate = new Date();
                    newDate.setTime(temp4.data.thread.last_time * 1000);
                    //console.log(newDate.toLocaleDateString()); // 2014年6月18日
                    //console.log(newDate.toLocaleString()); // 2014年6月18日 上午10:33:24
                    //console.log(newDate.toLocaleTimeString()); // 上午10:33:24
                    //版权声明：本文为CSDN博主「拼搏的小叔」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
                    //原文链接：https://blog.csdn.net/js_admin/java/article/details/76973074
                    textGroup.push("最后回复时间: " + newDate.toLocaleString().replace(/\//g, "-"));
                }
                if (setting.huifushu) {
                    let temp4 = temp6;
                    if (temp4 != "") {
                        if (temp4.match(/<div class="h">.*<\/div>/g) != null) {
                            let temp = parseInt(temp4.match(/<div class="h">.*<\/div>/g).toString().split("第")[1].split("页")[0].split("/")[1]);
                            if (parseInt(temp / 3) == 0) //因为api调用的wap网页只能显示10层楼，这会导致页数*3
                            {
                                temp4 = 1;
                            } else {
                                if (temp % 3 == 0) {
                                    temp4 = temp / 3;
                                } else {
                                    temp4 = parseInt(temp / 3) + 1;
                                }
                            }
                        } else {
                            temp4 = 1;
                        }
                        //(最大30层楼显示)
                        textGroup.push("贴子页数:" + temp4 + " , 回复数: " + temp.reply_num + " ");
                        //console.log(parent.parentNode.parentNode.parentNode.querySelectorAll(".threadlist_rep_num")[0].innerHTML);
                    }
                }
                break;
        }
        console.log(textGroup);
        text = textGroup.join(setting.split);
        //储存合成的文本
        this.setAttribute('data-link-text', text);
    }
    GM_setClipboard(text);
    if (setting.tips) showTips('以下内容已复制到剪贴板：\n' + text);
}

function showTips(text) {
    var text2 = text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    var node = document.createElement('div');
    node.className = 'tieba-link-tips';
    node.innerHTML = text2;
    document.body.appendChild(node);
    let showTipsTimer = setTimeout(function () { //默认显示复制文本显示框一段时间后消失，管消失时间的是在css样式里修改，这里是直接删除标签
        if (node != null) {
            document.body.removeChild(node);
            node = null;
        }
    }, setting.tips_time * 1000);
    node.addEventListener("click", () => { //点击一次复制内容显示框就不消失
        node.setAttribute('style', 'animation-play-state:paused;');
        clearTimeout(showTipsTimer);
        showTipsTimer = null;
    });
    node.addEventListener("dblclick", () => { //双击复制内容显示框会清除掉
        //https://www.w3school.com.cn/cssref/pr_animation-play-state.asp animation-play-state 属性规定动画正在运行还是暂停。
        document.body.removeChild(node); //双击提前关闭复制内容提示窗口
        node = null; //不清楚引擎能不能自动回收不用的东西？
    })
}

function catchLinkTarget(event) {
    if (event.animationName !== 'tiebaLinkTarget') return;
    var target = event.target;
    //console.log("catchLinkTarget:" + target);
    var classList = target.classList;
    var curAnchor = linkAnchor.cloneNode(true);
    curAnchor.addEventListener('click', copyLink);
    if ((classList.contains('threadlist_title') || classList.contains('listTitleCnt')) && target.querySelectorAll(".tieba-link-anchor").length == 0 && target.querySelectorAll(".icon-bazhupublicity")[0] == null && target.querySelectorAll(".icon-bazhurecruit")[0] == null) { //贴吧主题贴列表
        //console.log(target.querySelectorAll(".icon_interview_picture")[0]);
        if (target.querySelectorAll(".icon_interview_picture")[0] != null) {
            var linkAnchor2 = document.createElement('span');
            linkAnchor2.className = 'tieba-link-anchor';
            linkAnchor2.textContent = '[复制链接]';
            linkAnchor2.addEventListener('click', copyLink);
            linkAnchor2.setAttribute('data-anchor-type', '4');
            target.appendChild(linkAnchor2); //添加"复制链接"按钮
        } else {
            curAnchor.setAttribute('data-anchor-type', '0');
            target.appendChild(curAnchor); //添加"复制链接"按钮
        }
        //target.insertBefore(curAnchor, target.getElementsByClassName('j_th_tit')[0]);
    } else if (classList.contains('core_reply_tail') && target.querySelectorAll(".tieba-link-anchor").length == 0) { //core_title
        curAnchor.setAttribute('data-anchor-type', '2'); //楼层
        target.appendChild(curAnchor);
    } else if (classList.contains('lzl_content_reply') && target.querySelectorAll(".tieba-link-anchor").length == 0) { //threadlist_title 楼中楼 && document.querySelectorAll(".lzl_content_reply>a.tieba-link-anchor")[0] == null
        curAnchor.setAttribute('data-anchor-type', '3');
        target.appendChild(curAnchor); //target.getElementsByClassName('j_th_tit')[0] insertBefore('','')
        //console.log(target.querySelectorAll(".tieba-link-anchor"));
    }
    if (classList.contains('pager_theme_4') && target.parentNode.parentNode.parentNode.parentNode.querySelectorAll(".core_title_btns")[0] != null) { // $("ul.core_title_btns>a.tieba-link-anchor")[0] && document.querySelectorAll(".core_title_btns>a.tieba-link-anchor")[0] == null
        if (target.parentNode.parentNode.parentNode.parentNode.querySelectorAll(".core_title_btns")[0].querySelectorAll(".tieba-link-anchor").length == 0) {
            //console.log(target.parentNode.parentNode.parentNode.parentNode);
            curAnchor.setAttribute('data-anchor-type', '1'); //贴子内的标题
            //console.log($("div#j_core_title_wrap")[0].querySelectorAll(".pull-right").length)
            if (target.parentNode.parentNode.parentNode.parentNode.querySelectorAll("div#j_core_title_wrap")[0].querySelectorAll(".pull-right").length == 1) { //动态翻页支持添加按钮
                curAnchor.setAttribute('style', 'width:80px !important;'); //贴子内的标题
            } else {
                curAnchor.setAttribute('style', 'width:80px !important;position: absolute;left: 510px;top: 22px;'); //贴子内的标题,老贴吧用这个
            }
            target.parentNode.parentNode.parentNode.parentNode.querySelectorAll(".core_title_btns")[0].appendChild(curAnchor);
            //console.log(target.querySelectorAll(".tieba-link-anchor"));
        }
    }
    /*if (classList.contains('thread_theme_5') && target.parentNode.querySelectorAll(".core_title_btns")[0].querySelectorAll(".tieba-link-anchor").length == 0) { //首次进入网页加载,不可靠
        curAnchor.setAttribute('data-anchor-type', '1'); //贴子内的标题
        //console.log($("div#j_core_title_wrap")[0].querySelectorAll("span.pull-right").length)
        if (target.parentNode.querySelectorAll("div#j_core_title_wrap")[0].querySelectorAll("span.pull-right").length == 1) { //($("div#j_core_title_wrap")[0].querySelectorAll("span.pull-right").length == 1) { //!= "pull-right"
            curAnchor.setAttribute('style', 'width:80px !important;'); //贴子内的标题
        } else {
            curAnchor.setAttribute('style', 'width:80px !important;position: absolute;left: 510px;top: 22px;'); //贴子内的标题
        }
        target.parentNode.querySelectorAll(".core_title_btns")[0].appendChild(curAnchor);
        //console.log(target.querySelectorAll(".tieba-link-anchor"));
    }*/
}
//https://www.sitepoint.com/css3-animation-javascript-event-handlers/
//https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations/Using_CSS_animations
/*
W3C standard	Firefox     	webkit	                Opera	        IE10
animationstart	animationstart	webkitAnimationStart	oanimationstart	MSAnimationStart
animationiteration	animationiteration	webkitAnimationIteration	oanimationiteration	MSAnimationIteration
animationend	animationend	webkitAnimationEnd	oanimationend	MSAnimationEnd
*/
var pfx = ["webkit", "moz", "MS", "o", ""];

function PrefixedEvent(element, type, callback) {
    for (var p = 0; p < pfx.length; p++) {
        if (!pfx[p]) type = type.toLowerCase();
        //console.log(pfx[p] + type);
        element.addEventListener(pfx[p] + type, callback, false);
    }
}
// 使用 animation 事件，方便处理贴吧 ajax 加载数据
PrefixedEvent(document, "AnimationStart", catchLinkTarget); //开始
//PrefixedEvent(document, "AnimationIteration", catchLinkTarget);
//PrefixedEvent(document, "AnimationEnd", catchLinkTarget);
//document.addEventListener('animationstart', catchLinkTarget, false);
//document.addEventListener('MSAnimationStart', catchLinkTarget, false);
//document.addEventListener('webkitAnimationStart', catchLinkTarget, false);


GM_addStyle(`
@-webkit-keyframes tiebaLinkTarget {}
@-moz-keyframes tiebaLinkTarget {}
@keyframes tiebaLinkTarget {}

@-webkit-keyframes tiebaLinkTips {
from {
opacity: 0;
bottom: -75px;
}
20% {
opacity: 1;
bottom: 10px;
}
80% {
opacity: 1;
bottom: 10px;
}
to {
opacity: 0;
bottom: -75px;
}
}
@-moz-keyframes tiebaLinkTips {
from {
opacity: 0;
bottom: -75px;
}
20% {
opacity: 1;
bottom: 10px;
}
80% {
opacity: 1;
bottom: 10px;
}
to {
opacity: 0;
bottom: -75px;
}
}
@keyframes tiebaLinkTips {
from {
opacity: 0;
bottom: -75px;
}
20% {
opacity: 1;
bottom: 10px;
}
80% {
opacity: 1;
bottom: 10px;
}
to {
opacity: 0;
bottom: -75px;
}
}

.tieba-link-anchor {
display: inline-block;
color: #999 !important;
cursor: pointer;
float: right;
}

.tieba-link-anchor:hover{
color:#f00 !important;
}

.pager_theme_4/*,.thread_theme_5*/{
    animation-duration: 0.001 s;
    animation-name: tiebaLinkTips;
}

.lzl_content_reply,
.core_reply_tail,
/*.core_title_btns,不支持动态加载*/
.pager_theme_4,
/*.thread_theme_5,不支持动态加载*/
.threadlist_title,
.listTitleCnt
{
-webkit-animation: tiebaLinkTarget;
-moz-animation: tiebaLinkTarget;
animation: tiebaLinkTarget;
}

.core_title:hover .core_title_txt {
width: 420px !important;
}

.tieba-link-tips {
background: #ff7f3e;
font-size: 14px;
padding: 10px;
border-radius: 3s;
position: fixed;
right: 10px;
color: #ffffff;
z-index: 99999999;
/*pointer-events: none;这个阻止选择文本和响应注册事件*/
-webkit-animation: tiebaLinkTips ` + setting.tips_time + `s;
-moz-animation: tiebaLinkTips ` + setting.tips_time + `s;
animation: tiebaLinkTips ` + setting.tips_time + `s;
}
`);