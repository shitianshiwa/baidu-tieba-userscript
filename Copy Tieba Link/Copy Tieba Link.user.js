// ==UserScript==
// @name         Copy Tieba Link
// @version      1.1(0.01343)
// @description  复制贴吧的贴子标题与链接
// @include      http*://tieba.baidu.com/f?kw=*
// @include      http*://tieba.baidu.com/f/good?kw=*
// @include      http*://tieba.baidu.com/p/*
// @include      http*://tieba.baidu.com/f?kz=*
// @include      http*://tieba.baidu.com/f?ie=utf-8&kw=*
// @exclude      http*://tieba.baidu.com/f?kw=*&ie=utf-8&tab=album
// @exclude      http*://tieba.baidu.com/f?kw=*&ie=utf-8&tab=video
/// @exclude     http*://tieba.baidu.com/f?kw=*&ie=utf-8&tab=group 贴吧已去掉群组功能 标题: 【公告】贴吧群组功能下线通知 链接：https://tieba.baidu.com/p/6698238206 百度贴吧: 贴吧意见反馈吧 发贴时间: 2020-5-22 19:24 
// @exclude      http*://tieba.baidu.com/f?kw=*&ie=utf-8&tab=tuan
// @author       864907600cc,shitianshiwa
// @icon         https://secure.gravatar.com/avatar/147834caf9ccb0a66b2505c753747867
// @run-at       document-idle
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @namespace    http://ext.ccloli.com
// @downloadURL  https://github.com/shitianshiwa/baidu-tieba-userscript/
///原脚本地址：https://greasyfork.org/zh-CN/scripts/17375-copy-tieba-link
///【噗通一声跪下】求大神发布一个PC端一键复制帖子标题和链接脚本
///@狐狸已经乱了
///http://tieba.baidu.com/p/4371750793
// ==/UserScript==
//语音和表情内容不好处理
//未来计划增加一个UI界面
//目前本脚本不适合复制贴吧里面的代码，容易少复制内容！
//document-start
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
    split: "\n",
    tips: true,
    tips_time: 5
};
// 是否复制标题，默认为 true
// 是否复制作者（复制楼中楼时则为楼中楼作者），默认为 false
// 若复制AT作者，则是否需要添加 @，默认为 true
// 是否复制贴吧名，默认为 true
// 是否复制链接，默认为 true
// 是否复制楼层的内容，默认为true
// 是否复制楼中楼的内容，默认为true
// 是否复制发贴时间，默认为true
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
//https://github.com/FirefoxBar/userscript/raw/master/Tieba_Blocked_Detect/Tieba_Blocked_Detect.user.js
//参考贴吧屏蔽检测脚本的代码 https://greasyfork.org/zh-CN/scripts/383981-%E8%B4%B4%E5%90%A7%E8%B4%B4%E5%AD%90%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B
/**
 * 获取主题贴的移动端地址
 *
 * @param {number} tid - 贴子 id
 * @returns {string} URL
 */
const getThreadMoUrl = tid => `//tieba.baidu.com/mo/q-----1-1-0----/m?kz=${tid}`;
/**
 * 返回wap贴吧贴子1楼的时间
 *
 * @param {string} res - 页面内容
 * @returns {boolean} 是否被屏蔽
 */
const threadIsNotExist = res => res.split('<div class="i">1楼.')[1].split('<span class="b">')[1].split("</span>")[0].split(" ")[1]; //.indexOf('您要浏览的贴子不存在') >= 0 || res.indexOf('(共0贴)') >= 0;
const threadIsNotExist2 = res => res.split('<div class="i">1楼.')[1].split('<span class="b">')[1].split("</span>")[0];
/**
 * 获取主题贴是否被屏蔽
 *
 * @param {number} tid - 贴子 id
 * @returns {Promise<boolean>} 是否被屏蔽
 */
const getThreadBlocked = tid => request(getThreadMoUrl(tid))
    .then(threadIsNotExist);
const getThreadBlocked2 = tid => request(getThreadMoUrl(tid))
    .then(threadIsNotExist2);

var linkAnchor = document.createElement('a');
linkAnchor.className = 'tieba-link-anchor';
linkAnchor.textContent = '[复制链接]';

var linkPath = 'https://tieba.baidu.com/p/'; //贴吧的贴子已全面支持https
var tieba = PageData.forum.name || PageData.forum.forum_name; //获取贴吧名
var louzhu1 = $("div.l_post").children("div.d_author").children("div.louzhubiaoshi_wrap")[0]; //获取楼主的portrait，这个在我的贴吧链接可直接找到(id=xxxxxxxx)
var louzhu2;
if (louzhu1 != undefined) {
    try {
        louzhu2 = JSON.parse(louzhu1.parentNode.parentNode.getAttribute("data-field") /*.replace(/'/g, '"')*/ ).author.portrait.split("?")[0]; //把这里的'换成"会导致json转换失败 onclick=\"Stats.sendRequest('fr=tb0_forum&st_mod=pb&st_value=atlink');\"
    } catch (err) {
        console.log("变量louzhu2位置报错:" + err);
        louzhu2 = "";
    }
} else {
    louzhu2 = "";
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
    if (this.dataset.linkText) text = this.dataset.linkText;
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
                    let temp3 = parent.parentNode.querySelectorAll("span.is_show_create_time")[0].innerHTML;
                    if (temp3.split("-").length == 2 && temp3.search(/(\d{4})-((0?([1-9]))|(1[1|2]))/) == -1) //判断日期
                    {
                        temp3 = new Date().getFullYear().toString() + "-" + temp3 //2020-2-2
                    }
                    if (temp3.split(":").length == 2) {
                        temp3 = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDay() + " " + temp3 //2020-02-02 02:00
                    }
                    if (setting.title) textGroup.push("标题: " + parent.getElementsByClassName('j_th_tit')[0].getAttribute('title') + " ");
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
                            textGroup.push("内容: " + temp.trim() + " ");
                        }
                    }
                    if (setting.link) textGroup.push("链接：" + parent.getElementsByClassName('j_th_tit')[0].href + " ");
                    if (setting.tiebaming) textGroup.push("百度贴吧: " + tieba + "吧 ");
                    if (setting.createtime) {
                        let temp4 = await getThreadBlocked(parent.getElementsByClassName('j_th_tit')[0].href.split("/p/")[1]).then(result => {
                            if (result) {
                                return result;
                            } else {
                                return "";
                            }
                        });
                        textGroup.push("发贴时间: " + temp3 + " " + temp4 + " ");
                        //console.log(getThreadBlocked(parent.getElementsByClassName('j_th_tit')[0].href.split("/p/")[1]));
                        //let temp5="";
                        /*if (temp4) {
                            temp5=await Promise.resolve(temp4).then(result => {
                                if (result) {
                                     return result;
                                }
                            });
                        }*/
                    }
                } else {
                    //console.log("https:"+parent.children[1].children[1].getAttribute('href'));//话题贴链接
                    //console.log(parent.children[1].children[1].getAttribute('title'));//话题贴标题
                    //console.log(parent.children[2].children[0].getAttribute('href').split("un=")[1].split("&")[0]);//话题贴作者
                    if (setting.title) textGroup.push("今日话题: " + parent.children[1].children[1].getAttribute('title') + " "); //话题贴标题
                    if (setting.author) textGroup.push((setting.with_at ? '楼主: @' : '楼主: ') + parent.children[2].children[0].getAttribute('href').split("un=")[1].split("&")[0] + ' '); //话题贴作者
                    //parent.nextElementSibling.getElementsByClassName('j_user_card')[0].textContent//旧的复制用户名，会复制昵称
                    if (setting.link) textGroup.push("链接：" + "https:" + parent.children[1].children[1].getAttribute('href') + " "); //话题贴链接
                    if (setting.tiebaming) textGroup.push("百度贴吧: " + tieba + "吧 ");
                }
                break;
            case '1': // 贴子内页获取贴子链接
                //console.log($("div.l_post").children("div.d_author").children("div.louzhubiaoshi_wrap")[0]);
                //console.log(JSON.parse($("div.l_post").children("div.d_author").children("div.louzhubiaoshi_wrap")[0].parentNode.parentNode.getAttribute("data-field").replace(/'/g, '"')).author.portrait.split("?")[0]);
                if (setting.title) textGroup.push("标题: " + unsafeWindow.PageData.thread.title + " ");
                if (setting.author) textGroup.push((setting.with_at ? '楼主: @' : '楼主: ') + (unsafeWindow.PageData.thread.author != "" ? unsafeWindow.PageData.thread.author : louzhu2) + ' '); //portrait
                if (setting.link) textGroup.push("链接：" + linkPath + unsafeWindow.PageData.thread.thread_id + " ");
                if (setting.tiebaming) textGroup.push("百度贴吧: " + tieba + "吧 ");
                if (setting.createtime) {
                    let temp4 = await getThreadBlocked2(unsafeWindow.PageData.thread.thread_id).then(result => {
                        return result;
                    });
                    if (temp4.split("-").length == 2 && temp4.search(/(\d{4})-((0?([1-9]))|(1[1|2]))/) == -1) { //补上年份 2020-2-2
                        temp4 = new Date().getFullYear().toString() + "-" + temp4;
                    } else if (temp4.split("-").length == 2 && temp4.search(":") != -1) ////补上年份  2-2 02:02
                    {
                        temp4 = new Date().getFullYear().toString() + "-" + temp4;

                    } else if (temp4.split(":").length == 2 && temp4.search("-") == -1) { //补上年月日  02:02
                        temp4 = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDay() + " " + temp4 //2020-02-02 02:00
                    }
                    textGroup.push("发贴时间: " + temp4 + " ");
                }
                break;
            case '2': // 贴子内页获取楼层链接
                //获取楼层的内容
                var floorData00 = parent.parentNode.parentNode.children[0].children[1].children[1] || parent.parentNode.parentNode.children[0].children[3].children[1] || parent.parentNode.parentNode.parentNode.children[1].children[0].children[3].children[1];
                var floorData = JSON.parse(parent.parentElement.parentElement.parentElement.dataset.field);
                //console.log(parent.parentNode.parentNode.parentNode.children[1])
                var floorData02 = (parent.parentNode.parentNode.parentNode.children[0].children[0] || parent.parentNode.parentNode.parentNode.children[1].children[0]).getAttribute("class");
                //console.log(parent.parentNode.parentNode.parentNode.children[0].children[0].getAttribute("class"))判断是不是楼主
                /*if (floorData.content.post_no == 1) {
                    //console.log("1楼")
                    //console.log(parent)
                }*/
                //console.log(floorData00.innerHTML.replace(/<a.*?">/g,"").replace(/<img.*?src=/g,"").replace(/<br>/g,"\n").replace(/" size.*?">/g,"").replace(/">/g," ").replace(/<\/a>/g,"").replace(/</g,"").replace(/"/g," "))
                if (setting.title) textGroup.push("标题: " + unsafeWindow.PageData.thread.title + ' #' + floorData.content.post_no + " ");
                if (setting.author) textGroup.push((floorData.content.post_no == 1 || floorData02 == "louzhubiaoshi_wrap" ? (setting.with_at ? '楼主: @' : '楼主: ') : (setting.with_at ? '层主: @' : '层主: ')) + (floorData.author.user_name != "" && floorData.author.user_name != "null" ? floorData.author.user_name : floorData.author.portrait) + ' ');
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
                    temp = temp.trim();
                    textGroup.push("内容: " + temp + " ");
                }
                if (setting.link) textGroup.push("链接：" + linkPath + unsafeWindow.PageData.thread.thread_id + '?pid=' + floorData.content.post_id + '#' + floorData.content.post_id + " ");
                if (setting.qianmingdang) {
                    //console.log(parent.parentNode.parentNode.querySelectorAll(".j_user_sign")[0].getAttribute("src"));
                    let temp = parent.parentNode.parentNode.querySelectorAll(".j_user_sign")[0];
                    if (temp != null) {
                        textGroup.push("签名档: " + temp.getAttribute("src"));
                    }
                }
                if (setting.tiebaming) textGroup.push("百度贴吧: " + tieba + "吧 ");
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
                if (setting.title) textGroup.push("标题: " + unsafeWindow.PageData.thread.title + ' #' + floorData1.floor_num + ' 楼中楼 ');
                if (setting.author) textGroup.push(((floorData2.user_name == unsafeWindow.PageData.thread.author && floorData2.user_name != "" && floorData2.user_name != "null") || floorData2.portrait == louzhu2 ? (setting.with_at ? '楼主: @' : '楼主: ') : (setting.with_at ? '回复人: @' : '回复人: ')) + (floorData2.user_name != "" && floorData2.user_name != "null" ? floorData2.user_name : floorData2.portrait) + ' ');
                //应该不会有用户名是null的吧？
                if (setting.neirong_lzl) {
                    let temp = (parent.parentNode.children[2].getAttribute("class") == "lzl_content_main" ? parent.parentNode.children[2].innerHTML /*贴吧超级会员的楼中楼*/ : parent.parentNode.children[1].innerHTML /*普通用户*/ );
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
                if (setting.link) textGroup.push("链接：" + linkPath + unsafeWindow.PageData.thread.thread_id + '?pid=' + floorData3.pid + "&cid=" + floorData2.spid + '#' + floorData2.spid + " ");
                if (setting.tiebaming) textGroup.push("百度贴吧: " + tieba + "吧 ");
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
        }
        console.log(textGroup);
        text = textGroup.join(setting.split);
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

    setTimeout(function() {
        document.body.removeChild(node);
    }, setting.tips_time * 1000);
}

function catchLinkTarget(event) {
    if (event.animationName !== 'tiebaLinkTarget') return;

    var target = event.target;
    //console.log(target);
    var classList = target.classList;
    var curAnchor = linkAnchor.cloneNode(true);
    curAnchor.addEventListener('click', copyLink);
    if ((classList.contains('threadlist_title') || classList.contains('listTitleCnt')) && target.querySelectorAll(".tieba-link-anchor").length == 0 && target.querySelectorAll(".icon-bazhupublicity")[0] == null) { //贴吧主题贴列表
        curAnchor.setAttribute('data-anchor-type', '0');
        target.appendChild(curAnchor); //添加"复制链接"按钮
        //target.insertBefore(curAnchor, target.getElementsByClassName('j_th_tit')[0]);
    } else if (classList.contains('pager_theme_4') && target.parentNode.parentNode.parentNode.parentNode.querySelectorAll("span.core_title_btns")[0].querySelectorAll(".tieba-link-anchor").length == 0) { // $("ul.core_title_btns>a.tieba-link-anchor")[0] && document.querySelectorAll(".core_title_btns>a.tieba-link-anchor")[0] == null
        //console.log(target.parentNode.parentNode.parentNode.parentNode);
        curAnchor.setAttribute('data-anchor-type', '1'); //贴子内的标题
        //console.log($("div#j_core_title_wrap")[0].querySelectorAll("span.pull-right").length)
        if (target.parentNode.parentNode.parentNode.parentNode.querySelectorAll("div#j_core_title_wrap")[0].querySelectorAll("span.pull-right").length == 1) { //动态翻页支持添加按钮
            curAnchor.setAttribute('style', 'width:80px !important;'); //贴子内的标题
        } else {
            curAnchor.setAttribute('style', 'width:80px !important;position: absolute;left: 510px;top: 22px;'); //贴子内的标题
        }
        target.parentNode.parentNode.parentNode.parentNode.querySelectorAll(".core_title_btns")[0].appendChild(curAnchor);
        //console.log(target.querySelectorAll(".tieba-link-anchor"));
    } else if (classList.contains('thread_theme_5') && target.parentNode.querySelectorAll(".tieba-link-anchor").length == 0) { //首次进入网页加载
        curAnchor.setAttribute('data-anchor-type', '1'); //贴子内的标题
        //console.log($("div#j_core_title_wrap")[0].querySelectorAll("span.pull-right").length)
        if (target.parentNode.querySelectorAll("div#j_core_title_wrap")[0].querySelectorAll("span.pull-right").length == 1) { //($("div#j_core_title_wrap")[0].querySelectorAll("span.pull-right").length == 1) { //!= "pull-right"
            curAnchor.setAttribute('style', 'width:80px !important;'); //贴子内的标题
        } else {
            curAnchor.setAttribute('style', 'width:80px !important;position: absolute;left: 510px;top: 22px;'); //贴子内的标题
        }
        target.parentNode.querySelectorAll(".core_title_btns")[0].appendChild(curAnchor);
        //console.log(target.querySelectorAll(".tieba-link-anchor"));
    } else if (classList.contains('core_reply_tail') && target.querySelectorAll(".tieba-link-anchor").length == 0) { //core_title
        curAnchor.setAttribute('data-anchor-type', '2'); //楼层
        target.appendChild(curAnchor);
    } else if (classList.contains('lzl_content_reply') && target.querySelectorAll(".tieba-link-anchor").length == 0) { //threadlist_title 楼中楼 && document.querySelectorAll(".lzl_content_reply>a.tieba-link-anchor")[0] == null
        curAnchor.setAttribute('data-anchor-type', '3');
        target.appendChild(curAnchor); //target.getElementsByClassName('j_th_tit')[0] insertBefore('','')
        //console.log(target.querySelectorAll(".tieba-link-anchor"));
    }

}

// 使用 animation 事件，方便处理贴吧 ajax 加载数据
document.addEventListener('animationstart', catchLinkTarget, false);
document.addEventListener('MSAnimationStart', catchLinkTarget, false);
document.addEventListener('webkitAnimationStart', catchLinkTarget, false);

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

.pager_theme_4,.thread_theme_5{
    animation-duration: 0.001 s;
    animation-name: tiebaLinkTips;
}

.lzl_content_reply,
.core_reply_tail,
/*.core_title_btns,不支持动态加载*/
.pager_theme_4,
.thread_theme_5,/*不支持动态加载*/
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
pointer-events: none;
-webkit-animation: tiebaLinkTips ` + setting.tips_time + `s;
-moz-animation: tiebaLinkTips ` + setting.tips_time + `s;
animation: tiebaLinkTips ` + setting.tips_time + `s;
}
`);