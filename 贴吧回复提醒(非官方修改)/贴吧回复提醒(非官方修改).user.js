// ==UserScript==
// @name			贴吧回复提醒(非官方修改)
// @description		提供贴吧新消息提醒（系统删贴提醒无效）
// @namespace		52fisher
// @version			2.3
// @include			http://*
// @include			https://*
// @icon			http://tb.himg.baidu.com/sys/portrait/item/d4346e6f65313332ac06
// @grant			52fisher
// @grant			52fisher
// @connect			*
// @connect			tieba.baidu.com
// @updateURL       https://t.52fisher.cn/js/remind.uesr.js
// @downloadURL     https://t.52fisher.cn/js/remind.uesr.js
// @author 投江的鱼
// @contributionURL	i@qnmlgb.trade
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// ==/UserScript==
//系统删贴提醒无效
//GM_addStyle 在tampermonkey4.0以后被弃用，使用@grant          GM_addStyle解决  https://stackoverflow.com/questions/23683439/gm-addstyle-equivalent-in-tampermonkey/33176845#33176845
//来源：https://t.52fisher.cn/tb-remind.html
/*
贴吧消息提醒
本工具提供全局网站的贴吧消息提醒，当你访问其他网站时，如果贴吧有贴子回复、贴子删除、粉丝关注、系统通知，将会在右下角弹出一个简单的会话框提醒。让你不用时刻打开贴吧刷新页面，随时随地的接受贴吧消息，再也不用担心错过回复了。
需要当前浏览器支持Tampermonkey或者GreaseMonkey插件(扩展),FireFox、Chrome、Edge均支持，请在商店里下载安装。安装完成后点击安装本页面的工具，即可开启全站提醒
*/


// @include			http://*
// @include			https://*
// @include			ftp://*
// @include         http*://tieba.baidu.com/*
/*
 * 度娘脚本 处理地址 http://tieba.baidu.com/tb/static-common/component/commonLogic/common/user_message/UserMessage.js?v=18.46
 * 2014/9/10 version get from firebug
 */
// http://tieba.baidu.com/messagepool/get_data?user={uid}		// new API
// http://tieba.baidu.com/messagepool/clear_data?				// new API
// http://message.tieba.baidu.com/i/msg/get_data?user={uid}		// dead

/*
update INFO:
update 2017/10/19 : 重写部分代码
update 2016/10/07 : 添加关闭(x)按钮
update 2016/08/19 : 抓包找到了新的接口~
update 2016/05/31 : Tampermonkey metainfo connect attribute added
update 2016/04/12 : 样式小改
update 2016/03/28 : 用Promise重写callback
*/
var Tiebamessage = function(){
    this.init();
};

Tiebamessage.prototype.time = 30000; // 刷新时间
Tiebamessage.prototype.userinfo = null;	// userinfo
Tiebamessage.prototype.infoArr = null;	// 消息数数组
Tiebamessage.prototype.rem_link = null;
Tiebamessage.prototype.div = null; // 显示div
Tiebamessage.prototype.firstRun = true;
Tiebamessage.prototype.rem_num = [1,4,5,9,10];
Tiebamessage.prototype.rem_text = ["个新粉丝","个新回复","个新精品","个@提到我","个回收站提醒"];


/* ----------------function info-----------------
 * name: init
 * parameters: empty
 * return: void
 * 初始化对象 插入样式
 * ---------------------------------------------- */
Tiebamessage.prototype.init = function(){
    GM_addStyle('#rem_main_div{transition:0.25s ease box-shadow,0.3s ease right 0.3s,0.3s ease opacity 0.3s!important;background:rgba(235,235,235,0.8)!important;border:1px solid gray!important;bottom:40px!important;box-shadow:0 0 3px #999!important;font-size:0!important;min-width:160px!important;opacity:0.5!important;overflow:visible!important;padding:0!important;position:fixed!important;right:-120px!important;width:auto!important;z-index:10000!important;box-sizing:border-box!important}#rem_main_div:hover{transition:0.25s ease box-shadow,ease right 0.3s,0.3s ease opacity 0.1s!important;background:rgba(235,235,235,0.8)!important;border:1px solid gray!important;bottom:40px!important;box-shadow:0 0 4px 0px #444!important;font-size:0!important;min-width:160px!important;opacity:1!important;padding:0!important;position:fixed!important;right:0!important;width:auto!important;z-index:10000!important;box-sizing:border-box!important}#rem_main_div > .closebtn{transition:0.15s;display:block!important;background-color:rgba(235,235,235,0.8)!important;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADtElEQVR4nO3cX4tVVQCG8WczONRITRRDFPYtJDCKCKKI6CIxpAsLrbAwxMGKCqFAsH/mWKbSRRFeiCh1EaHYTVEUFEWRRFTQZ5giEcOOXpw5NNXMca+1115rb31+cC5nn3ft92VmzjDngCRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJjcwCe0qHqKEC5oCHSge5lMwC5xceXR/BHoY5zwGbCme5JCwuv+sjeIV/5xwAm4sm6rmlyu/qCHaydM4BsKVgrt4aV37XRvAC43MOgG3F0vVQnfJHj9cLZRx5nvpZny6UsVdCyi89gqcCMo4ezxVJ2iNzhN/UEiPYFpnztcw5e2f0OrrLI9jC8Od6aL65TPl6r8sjeJS48vctnEs1dXEEG4kr/20sP0oF7CVuBLsTZ9nA8K97oTnewfIb6cII1hNX/iFgIlGGy1rJEawjrvwjWH5SJUZwP3A24vmOYfmtyDmCe4kr/wNgMvJ8qiHHCO4mrvyPsPws2hzBncDpiOuewPKzajKC5f4ceztx5X8MXJn4fKqhAt4gzQhuBf6MuM6nwFQ7x1MdKUawBvg94us/B1a2fD7V0GQEh4D5iK/7Erg6x+FUT5MRhD6+BqbzHEshcozgW+CaXAdSuDZH8D1wXb6jKFYFvEna8k8BMzkPoWZSjuAn4Pq88ZVCihH8AtyYO7jSqYB3iSt/HliVP7JSugn4jfjvAK/mj6xUVgG/0vx3AEfQQzcAP5PuVYAj6JEZ4EfSvgw8z/Ddv+q4GeAH0pfvCHrgWuA72ivfEXTYNPAN4WXG/OuXI+iYaeArwkucB1YzfNuWI+ipq4AviCv/5oVrVDiCXpoCPiO8tD+AW/5zrSYjeLml82mMKeATwss6Ddy2zDUr4K2IazqCzK4AThJX/h0XubYj6LhJ4Djh5ZwB7qr5HI6goyaBDwkv5SxwT+BzOYKOWQG8T1z590U+pyPoiAngKOEl/AWsbfjcjqCwCeAw4Tf/HPBAogxNRvBSogyXpQngPeLKfzBxlgrYH5HFEUSqGH6+TujN/ht4uMVMjiCDCjhI+E0eAI9kyOYIWhT7xo4B8HjGjLEj2JUpY68t99Hr48rfmjljzAj86PgAO6h/Y2cLZQwZgeVHeJaL39hniqUbqoADWH5rtrP8jd1RMNdi40Zg+Qls5f+f0ftiyUBLWGoElp/QE/wzgq6+nFo8AstvwWOk/xDo1Ea/GD5ZOogkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSeq3Cz3CEr5+Gg7iAAAAAElFTkSuQmCC")!important;background-size:26px 26px!important;background-position:0 0!important;border:1px solid gray!important;width:28px!important;height:28px!important;box-sizing:border-box!important;margin:0!important;padding:0!important;position:absolute!important;top:-28px!important;right:-1px!important;text-align:center!important;cursor:pointer!important;-moz-user-select:none!important;opacity:0.15!important}#rem_main_div > .closebtn:hover{opacity:1!important}.rem_item{font-size:16px!important;height:32px!important;line-height:32px!important;text-align:left!important}#rem_main_div > .rem_item > a{background:none!important;color:#111!important;display:block!important;font-family:"Microsoft Yahei"!important;font-weight:normal!important;height:32px!important;line-height:32px!important;padding:0 6px!important;margin:0!important}.rem_item:not(:last-child){border-bottom:1px solid #666!important}');
}

/* ----------------function info-----------------
 * name: createDiv
 * parameters: empty
 * return: void
 * 创建消息div
 * ---------------------------------------------- */
Tiebamessage.prototype.createDiv = function(){
    var _this = this;
    if(_this.isExistDiv){
        _this.removeDiv();
    }
    _this.div = document.createElement("div");
    _this.div.id = "rem_main_div";
    _this.div.p = _this;
    var x = document.createElement("div");

    x.className = "closebtn";
    _this.div.appendChild(x);

    x.addEventListener("mouseup",function(e){
        _this.clearAll(e,_this);
    },false);


    document.body.appendChild(_this.div);
}

/* ----------------function info-----------------
 * name: isExistDiv
 * parameters: empty
 * return: Boolean
 * 消息div是否存在
 * ---------------------------------------------- */
Tiebamessage.prototype.isExistDiv = function(){
    var r = Boolean(document.getElementById("rem_main_div"));
    return r;
}

/* ----------------function info-----------------
 * name: isEmpty
 * parameters: empty
 * return: Boolean
 * 消息div是否存在项目
 * ---------------------------------------------- */
Tiebamessage.prototype.isEmpty = function(){
    return document.querySelectorAll("#rem_main_div > .rem_item").length === 0;
}

/* ----------------function info-----------------
 * name: removeDiv
 * parameters: empty
 * return: void
 * 删除消息div
 * ---------------------------------------------- */
Tiebamessage.prototype.removeDiv = function(){
    var _this = this;
    var div = document.getElementById("rem_main_div");
    if(Boolean(div)){
        div.parentNode.removeChild(div);
    };
    _this.div = null;
}

/* ----------------function info-----------------
 * name: addNode
 * parameters: Array
 * return: (0|成功) (其他值|错误信息)
 * 用参数传进的数组往div内添加子节点
 * ----------------------------------------------
 */
Tiebamessage.prototype.addNode = function(){
    var _this = this;
    var item_div,item_link;
    if(!_this.div){
        return 'div不存在！';
    }

    for(var i = 0;i < _this.infoArr.length;i++){
        if(_this.infoArr[i] == 0){
            continue;
        }
        item_div = document.createElement("div");
        item_link = document.createElement("a");

        item_div.className = "rem_item";
        item_link.textContent = _this.infoArr[i] + _this.rem_text[i];
        item_link.setAttribute("type",i);
        item_link.target = "_blank";
        item_link.href = _this.rem_link[i];

        item_link.addEventListener("mouseup",function(e){
            _this.openLink(e,_this);
        },false);
        item_div.appendChild(item_link);
        _this.div.appendChild(item_div);
    }
    return 0;
}

/* ----------------function info-----------------
 * name: getUserinfo
 * parameters: rs,rj
 * return: void
 * 获取用户信息保存到this.userinfo
 * ---------------------------------------------- */
Tiebamessage.prototype.getUserinfo = function(rs,rj){
    var _this = this;
    var xhr =GM_xmlhttpRequest({//GM_xmlhttpRequest Greasemonkey
        method: "GET",
        url: "http://tieba.baidu.com/f/user/json_userinfo",
        synchronous:false,
        headers: {
            "User-Agent": "Mozilla/5.0",	// If not specified, navigator.userAgent will be used.
            "Accept": "text/xml"			// If not specified, browser defaults will be used.
        },
        timeout:30000,
        onerror:function(r){
            rj(r.statusText);
        },
        onload:function(r){
            if(r.status !== 200){
                rj(r.status);
            }
            try{
                _this.userinfo = JSON.parse(r.responseText);
                _this.rem_link = [
                    "http://tieba.baidu.com/i/sys/jump?u=" + _this.userinfo.data.user_portrait + "&type=fans",
                    "http://tieba.baidu.com/i/sys/jump?u=" + _this.userinfo.data.user_portrait + "&type=replyme",
                    "http://tieba.baidu.com/i/sys/jump?u=" + _this.userinfo.data.user_portrait + "&type=feature",
                    "http://tieba.baidu.com/i/sys/jump?u=" + _this.userinfo.data.user_portrait + "&type=atme",
                    "http://tieba.baidu.com/pmc/recycle"
                ];
                rs('success');
            }catch(e){
                rj(e);
            }
        }
    });
}

/* ----------------function info-----------------
 * name: getMessageData
 * parameters: rs,rj
 * return: void
 * 获取贴吧未读消息数目数据保存到this.infoArr
 * ---------------------------------------------- */
Tiebamessage.prototype.getMessageData = function(rs,rj){
    var _this = this;
    var xhr,response,response_arr,info_arr = [];
    xhr = GM_xmlhttpRequest({
        method: "GET",
        url: "http://tieba.baidu.com/messagepool/get_data?user=" + _this.userinfo.data.user_portrait,
        synchronous:true,
        headers: {
            "User-Agent": "Mozilla/5.0",	// If not specified, navigator.userAgent will be used.
            "Accept": "text/xml"			// If not specified, browser defaults will be used.
        },
        timeout:30000,
        onerror:function(r){
            rj(r.statusText);
        },
        onload:function(r){
            if(r.status !== 200){
                rj(r.status);
            }
            response = r.responseText;

            if(response.indexOf("initItiebaMessage") != 0 || response.length > 150){
                console.log('接收数据格式错误！（贴吧回复提醒脚本）');
                return;
            }

            response_arr = response.replace(/initItiebaMessage\(\[/,"").replace(/\]\);/g,"").split(",");
            info_arr.push(response_arr[0]);
            info_arr.push(response_arr[3]);
            info_arr.push(response_arr[4]);
            info_arr.push(response_arr[8]);
            info_arr.push(response_arr[9]);
            if(!(info_arr[0] || info_arr[1] || info_arr[2] || info_arr[3] || info_arr[4])){
                console.log('无可用数据！');
            }
            _this.infoArr = info_arr;
            // _this.infoArr = [1,2,3,4,5]; // test
            // _this.infoArr = [1,0,0,0,0]; // test
            rs('success');
        }
    });
}

/* ----------------function info-----------------
 * name: getMessageData
 * parameters: empty
 * return: (0|成功) (其他值|错误信息)
 * 获取贴吧未读消息数目数据
 * ---------------------------------------------- */
Tiebamessage.prototype.mainFunction = function(){
    var _this = this;

    if(_this.infoArr.toString() != "0,0,0,0,0"){
        _this.createDiv();
        _this.addNode();
    }else{
        _this.removeDiv();
        return '无消息';
    }
    return 0;
}

/* ----------------function info-----------------
 * name: openLink
 * parameters: empty
 * return: null
 * 连接绑定函数
 * ---------------------------------------------- */
Tiebamessage.prototype.openLink = function(e,_this){
    var num = e.target.getAttribute("type");

    var url = "http://tieba.baidu.com/messagepool/clear_data?type="
    + _this.rem_num[num] + "&user=" + _this.userinfo.data.user_portrait
    + "&stamp=" + (new Date()).getTime();
    console.log(url);
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
    });

    setTimeout(function(){
        var item = e.target.parentNode;
        var main_div = item.parentNode;
        main_div.removeChild(item);
        if(_this.isEmpty()){
            _this.removeDiv();
        }
    },400);
}

/* ----------------function info-----------------
 * name: openLink
 * parameters: empty
 * return: null
 * 连接绑定函数
 * ---------------------------------------------- */
Tiebamessage.prototype.clearAll = function(e,_this)
{
    for(var xx in _this.rem_num){
        var url = "http://tieba.baidu.com/messagepool/clear_data?type="+ _this.rem_num[xx] + "&user=" + _this.userinfo.data.user_portrait+ "&stamp=" + (new Date()).getTime();
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
        });
    }

    _this.removeDiv();
};

/* ----------------function info-----------------
 * name: process
 * parameters: empty
 * return: void
 * 流程处理函数
 * ---------------------------------------------- */
Tiebamessage.prototype.process = function(){
    var _this = this;
    var sequence = Promise.resolve();
    if(_this.firstRun){
        sequence = sequence.then(function(){
            return new Promise(function(rs,rj){
                // getUserinfo
                _this.getUserinfo(rs,rj);
            });
        }).then(function(val){
            _this.firstRun = false;
            return new Promise(function(rs,rj){
                // getMessageData
                _this.getMessageData(rs,rj);
            });
        }).then(function(val){
            // after Userinfo and MessageData loaded
            _this.mainFunction();
        }).catch(function(reason){
            // handle the exceptions
            console.log(reason);
        });
    }else{
        sequence = sequence.then(function(val){
            return new Promise(function(rs,rj){
                // getMessageData
                _this.getMessageData(rs,rj);
            });
        }).then(function(val){
            // after MessageData loaded
            _this.mainFunction();
        }).catch(function(reason){
            // handle the exceptions
            console.log(reason);
        });
    }
};

/* ----------------function info-----------------
 * name: process
 * parameters: empty
 * return: void
 * 运行函数
 * ---------------------------------------------- */
Tiebamessage.prototype.run = function(){
    var _this = this;
    _this.process();
    tieba.interval = setInterval(function(){
        _this.process();
    },_this.time);
};

if(window.top == window.self){
    var tieba,err;
    tieba = new Tiebamessage(); // init the Object
    tieba.run(); // get it started
}