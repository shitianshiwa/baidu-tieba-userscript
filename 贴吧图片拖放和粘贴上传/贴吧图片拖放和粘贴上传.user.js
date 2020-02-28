// ==UserScript==
// @name      pasteAndDragImageIntoTiebaEditor(第三方修改)
// @author    527836355
// @id     pasteAndDragImageIntoTiebaEditor
// @namespace   http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul
// @include     http*://tieba.baidu.com/f?*
// @include     http*://tieba.baidu.com/p/*
// @version     3.2(0.0031)
// @description     贴吧图片拖放和粘贴上传
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant GM_addStyle
// @grant GM_log
// @grant        GM_registerMenuCommand
// ==/UserScript==
/*
https://greasyfork.org/en/scripts/633-pasteanddragimageintotiebaeditor
pasteAndDragImageIntoTiebaEditor
贴吧图片拖放和粘贴上传
标题:你们的粘贴传图脚本失效了吗？我的又失效了，数字君那个
楼主:牛牛的约定
链接：http://tieba.baidu.com/p/3259214565
标题:不推荐用UC脚本管理器加载脚本和XUL
楼主:527836355
链接：http://tieba.baidu.com/p/3474414995
Tampermonkey 的 GM_xmlhttpRequest 如何在 onload 回调函数中访问到传入的 url。
https://www.v2ex.com/t/228121
*/

const editorId = 'ueditor_replace'; //发帖框ID
const parentId = 'tb_rich_poster_container'; //父节点监听
var editor = null; //初始化发贴框
var preview = null; //进度预览
sessionStorage.setItem("cishu", 1);
var xianzhi = 10;
/*if (!unsafeWindow.FlashImageLoader) //flash上传还是必须的
{
    var sc = document.createElement('script');
    sc.id = 'flashUpload';
    sc.setAttribute('src', '//static.tieba.baidu.com/tb/static-frs/component/sign_shai/flash_image_loader.js');
    document.body.appendChild(sc);
};*/
if (document.getElementById(editorId)) //检测是否存在这个元素
{
    init();
} else { //不存在则监听节点变动
    var target = document.getElementById(parentId);
    var observer = new MutationObserver(function(mutations) {
        if (document.getElementById(editorId)) {
            observer.disconnect(); //停止监听
            init();
        }
    })
    var config = { attributes: true, childList: true, characterData: true };
    observer.observe(target, config);
}

function init() //初始化，添加事件
{
    editor = document.getElementById(editorId);
    /*editor.addEventListener('paste', function(e) //添加事件处理   粘贴图片可能无效，因为的浏览器为了安全考虑不允许直接访问本地路径
        {
            var data = e.clipboardData.getData('text/unicode');
            //console.log(event.clipboardData.getData('text/unicode'));
            if (!data) {
                event.stopPropagation(); //好吧，如果不是图片，我们也不能随便阻止其他事情吧。
            }
            setTimeout(function() {
                pasteImg()
            }, 200); //给图片解码留出时间
            //
        }, true);*/
    //添加拖入拖出时的效果处理
    document.body.addEventListener('dragenter', function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, false);
    editor.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        editor.style.border = '2px dotted red'
    }, false);
    editor.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        editor.style.border = '1px solid gray';
        dragHandle(e);
    }, false);
    editor.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        editor.style.border = '1px solid gray';
    }, false);
    addProgressBar();
}

function addProgressBar() {
    var container = document.querySelector('.old_style_wrapper');
    var div = document.createElement('div');
    div.id = 'progressBar';
    div.style.cssText = 'position:absolute;right:20px;top:45px;width:auto;height:auto;';
    container.appendChild(div);
    preview = div;
}

function dragHandle(evt) //处理拖放
{
    var files = evt.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
        var file = files[i];
        var type = file.type;
        var name = file.name;
        var size = file.size / 1024 + '';
        size = size.substring(0, 4);
        var reader = new FileReader();
        if (type.match('image')) //测试是否是图片文件
        {
            reader.onload = function(e) {
                var dataURL = e.target.result; //base64编码
                //处理数据
                new uploader(dataURL, false, null).init();
            }
            reader.readAsDataURL(file);
        }
    }
}

/*function pasteImg() {
    var imgs = document.querySelectorAll('#ueditor_replace img');
    for (let i = 0; i < imgs.length; i++) {
        if (imgs[i].hasAttribute('uploading') || imgs[i].src.indexOf('data:image') != 0) {
            continue;
        }
        imgs[i].setAttribute('uploading', 'true');
        var src = imgs[i].src;
        var nwidth = imgs[i].width;
        var height = imgs[i].height;
        var width = nwidth > 560 ? 560 : nwidth;
        height = width / nwidth * height;
        imgs[i].src = 'data:image/gif;base64,R0lGODlhEAAQAOUdAOvr69HR0cHBwby8vOzs7PHx8ff397W1tbOzs+Xl5ebm5vDw8PPz88PDw7e3t+3t7dvb2+7u7vX19eTk5OPj4+rq6tbW1unp6bu7u+fn5+jo6N/f3+/v7/7+/ra2ttXV1f39/fz8/Li4uMXFxfb29vLy8vr6+sLCwtPT0/j4+PT09MDAwL+/v7m5ubS0tM7OzsrKytra2tTU1MfHx+Li4tDQ0M/Pz9nZ2b6+vgAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFMAA5ACwAAAAAEAAQAAAGg8CcMAcICAY5QsEwHBYPCMQhl6guGM5GNOqgVhMPbA6y5Xq/kZwkN3Fsu98EJcdYKCo5i7kKwCorVRd4GAg5GVgAfBpxaRtsZwkaiwpfD0NxkYl8QngARF8AdhmeDwl4pngUCQsVHDl2m2iveDkXcZ6YTgS3kAS0RKWxVQ+/TqydrE1BACH5BAkwADkALAAAAAAQABAAAAZ+wJwwJ1kQIgNBgDMcdh6KRILgQSAOn46TIJVSrdZGSMjpeqtgREAoYWi6BFF6xCAJS6ZyYhEIUwxNQgYkFxwBByh2gU0kKRVHi4sgOQuRTRJtJgwSBJElihwMQioqGmw5gEMLKk2AEkSBq4ElQmNNoYG2OVpDuE6Lrzmfp0NBACH5BAUwADkALAAAAAAQABAAAAaFwJwwJ1kQCDlCwTAcMh6KhDQnVSwYTkJ1un1gc5wtdxsh5iqaLbVKyVEWigq4ugZgTyiA9CK/JHIZWCsICCxpVWV/EzkHhAgth1UPQ4OOLXpScmebFA6ELHAZclBycXIULi8VZXCZawplFG05flWlakIVWravCgSaZ1CuksBDFQsAcsfFQQAh+QQJMAA5ACwAAAAAEAAQAAAGQcCccEgsGo/IpHLJzDGaOcKCCUgkAEuFNaFRbq1dJCxX2WKRCFdMmJiiEQjRp1BJwu8y5R3RWNsRBx9+SSsxgzlBACH5BAkwADkALAAAAAAQABAAAAaJwJwwJ1kQCDlCwTAcMh6KhDQnVSwYTkJ1un1gc5wtdxsh5iqaLbVKyTEWigq4ugZglRXpRX5J5DJYAFIAaVVlfhNrURqFVQ9DYhqCgzkzCGdnVQBwGRU0LQiXCRUAORQJCwAcOTChoYplBXIKLq6vUXRCCQ22olUEcroJB66KD8FNCjUrlxWpTUEAIfkEBTAAOQAsAAAAABAAEAAABobAnDAnWRAIOULBMBwyHoqENCdVLBhOQnW6fWBznC13G8nZchXNllql5Bg2xA1cZQOwShwCMdDkLgk5GVgAUgAie3syVDkTbFIaiIkIJ0NiGnp7HiNonRVVAHEuFjlQFVQVAI0JCzYjrKCPZQWnf1unYkMVWrFbBLVoUIaPD8C6CwCnAMhNQQA7';
        new uploader(src, true, imgs[i]).init();
    }
}*/

function uploader(dataURL, isPaste, oldImage) //第一次尝试模板
{
    let temp = sessionStorage.getItem("cishu");
    if (temp > xianzhi) {
        alert("百度贴吧不支持超过10张图片");
        this.init = () => {};
        return false;
    }
    temp++;
    sessionStorage.setItem("cishu", temp)
    console.log(temp);
    this.dataURL = dataURL;
    this.isPaste = isPaste;
    this.oldImage = oldImage;
    this.progressBar = null;
    this.tbs = null;
    this.blob = null;
    this.init = function() //进条度创建在此
        {
            var now = this;
            var div = document.createElement('DIV'); //父节点
            div.style.cssText = "background:rgba(33,33,33,0.8);width:200px;height;40px;border:1px solid red;border:2px solid gray;border-radius:10px;margin:5px;padding:5px;color:#f00"
            var img = document.createElement('img');
            img.src = this.dataURL;
            img.style.cssText = 'height:auto;width:auto;max-width:200px;max-height:40px;';
            var bar = document.createElement('progress');
            bar.style.cssText = 'width:180px;height:15px;display:position:absolute;';
            div.appendChild(img);
            div.append("点击可取消上传");
            div.appendChild(document.createElement('hr'));
            div.appendChild(bar);
            preview.appendChild(div);
            this.progressBar = bar;
            /*var xhr = new XMLHttpRequest();
                xhr.open('GET', 'http://tieba.baidu.com/dc/common/imgtbs?t=' + new Date().getTime(), false);
                xhr.onload = function ()
                {
                    var res=JSON.parse(xhr.responseText);
                    var tbs = res.data.tbs;
                    now.upload(tbs);
                }
                xhr.send();*/
            var xhr1 = GM_xmlhttpRequest({
                synchronous: false,
                method: 'GET',
                url: 'http://tieba.baidu.com/dc/common/imgtbs?t=' + new Date().getTime(),
                timeout: 10000,
                onload: function(d) //可以正常运行至此
                    {
                        //alert(JSON.parse(d.responseText).data.tbs);
                        let res = JSON.parse(d.responseText);
                        let tbs = res.data.tbs;
                        now.upload(tbs);
                    },
                ontimeout: function() //超时终止
                    {
                        xhr1.abort();
                        unsafeWindow.alert("上传图片失败");
                        unsafeWindow.$(bar.parentNode).slideUp('slow'); //动画效果
                        bar.parentNode.removeChild(bar); //移除预览框
                        return;
                    },
                onerror: function() {
                    unsafeWindow.alert("上传图片出错");
                }
            });
        };
    this.upload = function(tbs) {
        //到这步是正常的
        let bar = this.progressBar;
        var now = this;
        var blob = dataUrlToBlob(this.dataURL);
        var data = new FormData();
        data.append('Filename', '333333.png');
        data.append('tbs', tbs);
        data.append('fid', unsafeWindow.PageData.forum.id);
        data.append('file', blob);
        //上传模块
        //http://upload.tieba.baidu.com/upload/pic?tbs=xxxxxx&fid=xxxxxx
        //http://upload.tieba.baidu.com/upload/pic?is_wm=1
        //GM.xmlHttpRequest-GreaseSpot Wiki
        //https://wiki.greasespot.net/GM.xmlHttpRequest
        var xhr2 = GM_xmlhttpRequest({
            synchronous: false,
            method: 'POST',
            url: 'http://upload.tieba.baidu.com/upload/pic?is_wm=1',
            data: data,
            timeout: 30000, //毫秒 30s
            onprogress: function(e) //处理进度条
                {

                    if (!e.lengthComputable) {
                        now.progressBar.value = 1;
                    } else {
                        now.progressBar.style.display = '';
                        now.progressBar.value = (e.loaded / e.total);
                    }

                },
            onload: function(d) //可以正常运行至此
                {
                    now.onload(d);
                },
            ontimeout: function() //超时终止
                {
                    xhr2.abort();
                    unsafeWindow.alert("上传图片超时");
                    unsafeWindow.$(bar.parentNode).slideUp('slow'); //动画效果
                    bar.parentNode.removeChild(bar); //移除预览框
                    return;
                },
            onerror: function() {
                unsafeWindow.alert("上传图片出错");
                unsafeWindow.$(bar.parentNode).slideUp('slow'); //动画效果
                bar.parentNode.removeChild(bar); //移除预览框
                return;
            }
        });
        this.progressBar.parentNode.addEventListener('click', function(e) {
            xhr2.abort();
            unsafeWindow.$(bar.parentNode).slideUp('slow'); //动画效果
            bar.parentNode.removeChild(bar); //移除预览框
        }, true);
    }
    this.onload = function(res) //下载完毕处理。
        {
            let bar = this.progressBar;
            var mes = null;
            try {
                mes = JSON.parse(res.responseText);
                //console.log(res.responseText);
            } catch (error) {
                unsafeWindow.$(bar.parentNode).slideUp('slow'); //动画效果
                bar.parentNode.removeChild(bar); //移除预览框
                alert("上传失败：" + error);
                return;
            }
            //console.log(JSON.parse(res.responseText));//{err_no: 4301060101, err_msg: "pic too large"}
            //{"err_no":0,"err_msg":"","no":0,"error_code":0,"info":{"cur_time":1386817416,"pic_id":"9732578534","fullpic_width":264,"fullpic_height":149,"pic_type":4,"full_datalen":1953,"full_sign0":93043670,"full_sign1":3974064591,"pic_id_encode":"b2aab951f8198618d026c1f048ed2e738ad4e696","pic_desc":"blob","err_no":0,"pic_water":"http:\/\/imgsrc.baidu.com\/tieba\/pic\/item\/cefc1e178a82b901accced47718da9773912ef65.jpg"}}
            if (mes.err_no == 0) {
                var fullWidth = mes.info.fullpic_width; //真实宽度
                var fullHeight = mes.info.fullpic_height; //真实高度
                var picId = mes.info.pic_id_encode;
                var picType = mes.info.pic_type;
                var picWater = mes.info.pic_water;
                var e = "";
                //var e=mes.pic_water;//getEscapeString(username).replace(/\\/g, '\\\\');
                if (window.location.href.split(":")[0] == "https" || (window.location.href.search("tieba.baidu.com/f") != -1 && window.location.href.search("kw=") != -1)) {
                    e = 'http://tiebapic.baidu.com/forum/pic/item/' + picId + '.jpg'; //图片地址
                } else {
                    e = 'http://imgsrc.baidu.com/forum/pic/item/' + picId + '.jpg'; //图片地址

                }
                var cache = new Image(); //先下载再响应
                cache.setAttribute("pic_type", "0");
                cache.setAttribute("unselectable", "on");
                cache.src = e;
                var old = this.oldImage;
                var nwidth = fullWidth
                var height = fullHeight;
                var width = nwidth > 560 ? 560 : nwidth;
                height = parseInt(width / nwidth * height);
                cache.setAttribute('width', width);
                cache.setAttribute('height', height);
                cache.setAttribute('class', 'BDE_Image');
                if (isPaste) //如果是粘贴的就替换，否则直接插入图片
                {
                    old.parentNode.replaceChild(cache, old);
                } else {
                    editor.appendChild(cache);
                }
                unsafeWindow.$(bar.parentNode).slideUp('slow'); //动画效果
                bar.parentNode.removeChild(bar); //移除预览框
            } else {
                unsafeWindow.$(bar.parentNode).slideUp('slow'); //动画效果
                bar.parentNode.removeChild(bar); //移除预览框
                alert("上传失败：" + mes.err_msg);
            }
        }
}

//以下三个函数可把dataURL转换成BLOB对象,研究fawave的收获，哈哈
function binaryToBlob(data) {
    var arr = new Uint8Array(data.length);
    for (var i = 0, l = data.length; i < l; i++) {
        arr[i] = data.charCodeAt(i);
    }
    var buffer = arr;
    return buildBlob([buffer]);
}

function dataUrlToBlob(dataurl) {
    var datas = dataurl.split(',', 2);
    var blob = binaryToBlob(atob(datas[1]));
    blob.fileType = datas[0].split(';')[0].split(':')[1];
    blob.name = 'xxx.png';
    return blob;
};

function buildBlob(parts) {
    return new Blob(parts);
}

function resetx() {
    sessionStorage.setItem("cishu", 1);
    alert("已重置！");
}
GM_registerMenuCommand("重置限制", resetx); // @grant        GM_registerMenuCommand
/*
//static.tieba.baidu.com/tb/static-frs/component/sign_shai/flash_image_loader.js
_.Module.define({path:"frs/component/SignShai/FlashImageLoader",sub:{flashPath:"https://gsp0.baidu.com/5aAHeD3nKhI2p27j8IqW0jdnxx1xbK/tb/static-frs/component/sign_shai/Base64ImageLoader.swf?v=1.0",flashObj:null,isReady:!1,options:null,initial:function(o){try{this.options=$.extend({},o)}catch(e){throw"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message||e.description,path:"frs:component/sign_shai/flash_image_loader.js",method:"",ln:14}),e}},_createFlash:function(){var o=this;if(!this.flashObj){var e=$('<div id="flash_img_loader" style="line-height: 0; font-size: 0px;"></div>');e.appendTo("body"),this.flashObj=new $.swf(this.flashPath,{container:e,width:1,height:1,params:{quality:"high",allowScriptAccess:"always",wMode:"transparent",swLiveConnect:!0,menu:!1},callBacks:{completeHandler:function(e){o._completeHandler(e)},errorHandler:function(e){o._errorHandler(e)},isReady:function(){return o._isReady()},flashReady:function(){o._flashReady()},uploadBase64Complete:function(e){o._uploadBase64Complete(e)},uploadBase64Error:function(){o._uploadBase64Error()}}})}},_completeHandler:function(o){"onComplete"in this.options&&"function"==typeof this.options.onComplete&&this.options.onComplete(o),this.trigger("loadComplete",o)},_errorHandler:function(o){"onError"in this.options&&"function"==typeof this.options.onError&&this.options.onError(o),this.trigger("loadError")},_isReady:function(){return!0},_flashReady:function(){this.isReady=!0,"onFlashReady"in this.options&&"function"==typeof this.options.onFlashReady&&this.options.onFlashReady(),this.trigger("flashReady")},_uploadBase64Complete:function(o){this.trigger("uploadComplete",o)},_uploadBase64Error:function(){this.trigger("uploadError")},_remote:function(){var o=this,e=arguments;this._createFlash(),this.isReady?o.flashObj.remote.apply(o.flashObj,e):this.bind("flashReady",function(){o.flashObj.remote.apply(o.flashObj,e)})},load:function(o){this._remote("loadImage",o)},uploadBase64:function(o,e,t){this._remote("uploadBase64",o,e,t)}}}),_.Module.use("frs/component/SignShai/FlashImageLoader",null,function(o){window.FlashImageLoader=o});
*/