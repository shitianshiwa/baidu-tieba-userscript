// ==UserScript==
// @name         网页快速到顶到底+刷新
// @namespace    http://tampermonkey.net/
// @version      测试(beta)0.63
// @description  网页快速到顶到底+刷新(大概没什么用吧)。部分网站存在两个body，会导致出现两条按钮列表的bug，暂没方法解决(例如：广告。。！)
// @author       shitianshiwa
// @include      http*://*
// @grant        GM_registerMenuCommand
// @run-at       document-body
// @downloadURL  https://github.com/shitianshiwa/baidu-tieba-userscript/
// @noframes
// ==/UserScript==
/*
https://www.tampermonkey.net/documentation.php?version=4.10.6112&ext=gcal
1.部分网站存在两个body，会导致出现两条按钮列表的bug，暂没方法解决(例如：广告。。！),用脚本管理器的// @noframes 解决
2.有些网页会报错，暂没方法解决
*/
(function() {
    'use strict';
    var b1 = false,
        b2 = false,
        b3 = 0; //解决按键点击动作与移动按钮动作之间的冲突
    var width = 0 //document.body.offsetLeft;
    var height = 0; //document.body.offsetHeight;
    var width2 = window.innerWidth
    var height2 = window.innerHeight;
    const css1 = `
/*按钮样式*/
.miaocssxx
{
position: relative;
width: 60px;
height: 30px;
font-size: 15px;
font-weight:bold;
background: #fff;
color: #000;
border: 2px solid #e6e6e6;
}
/*鼠标移动到按钮上显示的样式*/
.miaocssxx:hover
{
background: #fff;
color: #3e89fa;
border: 2px solid #3e89fa;
}
/*固定到网页右边*/
.miaocsss
{
/*margin-left: 50%;*/
width:60px;
height:120px;
position: fixed;
left:0px;
z-index: 1005;
}
`;

    function windowResizeEvent(callback) { //https://www.runoob.com/jsref/event-onresize.html onresize 事件
        window.onresize = function() {
            var target = this;
            if (target.resizeFlag) {
                clearTimeout(target.resizeFlag);
            }

            target.resizeFlag = setTimeout(function() {
                callback();
                target.resizeFlag = null;
            }, 100);
        }
    }
    var s1 = new Array("", "miaoupdatex", "miaotopx", "miaobottomx");
    var s2 = new Array("隐藏↑  ", "刷新  ", "到顶↑", "到底↓");
    var temp2 = new Array();
    try {
        var mouseX = sessionStorage.getItem("miaox") || null;
        var mouseY = sessionStorage.getItem("miaoy") || null;
        const style = document.createElement('style'); //创建新样式节点
        style.textContent = css1; //添加样式内容
        var temp0 = document.head;
        if (temp0 != null) {
            temp0.appendChild(style); //给head头添加新样式节点
        }
        //------------------------------------------------------
        var temp1 = document.createElement("div"); //创建节点<input/>
        temp1.setAttribute('class', 'miaocsss');
        if (mouseX != null && mouseY != null) {
            temp1.style.left = mouseX + "px"; //设置left数值
            temp1.style.top = mouseY + "px"; //设置top数值
        } else {
            temp1.style.left = window.innerWidth * 0.940 + "px";
            temp1.style.bottom = "30px";
        }
        width = temp1.style.left;
        height = temp1.style.top;
        for (let i = 0; i <= 3; i++) {
            temp2[i] = document.createElement("input"); //创建节点<input/>
            temp2[i].setAttribute('type', 'button');
            temp2[i].setAttribute('id', s1[i]);
            temp2[i].setAttribute('class', 'miaocssxx');
            temp2[i].setAttribute('value', s2[i]);
            temp1.appendChild(temp2[i]);
        }
        //-----------------------
        temp2[0].style = "color:#f00;" //展开折叠按钮文字改为红色#ff0000,red,green,blue
        temp2[0].addEventListener('click', () => {
                if (temp2[0].value == "隐藏↑  ") //1
                {
                    b1 = true;
                    temp2[0].value = "展开↓ ";
                    temp2[0].value = "展开↓" + (b3 + 1);
                    for (let i = 1; i <= 3; i++) {
                        temp2[i].style = "display:none;"; //修改样式
                    }
                } else {
                    b1 = false;
                    if (b3 == 2) //3
                    {
                        b3 = 0;
                        temp2[0].value = "隐藏↑  ";
                        for (let i = 1; i <= 3; i++) {
                            temp2[i].style = "display:block;"; //修改样式
                        }
                    } else //2
                    {
                        b3++;
                        if (b3 == 2) {
                            b2 = false;
                        }
                        temp2[0].value = "展开↓" + (b3 + 1);
                    }
                }
                temp2[0].addEventListener('mousedown', () => {
                    if (b1 == true) //1
                    {
                        b2 = true; //2
                    }
                });
                document.body.addEventListener('mousedown', (event) => {
                    if (b2 == true) //2
                    {
                        temp1.style.left = event.x - 30 + "px"; //设置left数值
                        temp1.style.top = event.y - 15 + "px"; //设置top数值
                        sessionStorage.setItem("miaox", event.x - 30);
                        sessionStorage.setItem("miaoy", event.y - 15);
                        width = temp1.style.left;
                        height = temp1.style.top;
                    }
                })
            })
            //-----------------------
        temp2[1].addEventListener('click', () => {
            window.location.reload(); //刷新网页
        })
        temp2[2].addEventListener('click', () => {
            window.scrollTo(0, 0); //到顶
        })
        temp2[3].addEventListener('click', () => {
                window.scrollTo(0, document.body.scrollHeight); //到底 document.documentElement.scrollTop获取滚动条高度
            })
            //console.log("start")
            //document.body可以同时代表多个内嵌网页标签
        document.body.appendChild(temp1);
    } catch (error) {
        //alert(error);
    }
    windowResizeEvent(() => {
        //console.log("233");

        if (width2 == window.innerWidth && height2 == window.innerHeight) {
            let temp = document.getElementsByClassName("miaocsss")
                //console.log(temp[0].style.left+(width-document.body.offsetLeft));
                //console.log(temp[0].style.top+(height-document.body.offsetHeight));
            temp[0].style.left = width + "px"; //设置left数值
            temp[0].style.top = height + "px"; //设置top数值
        } else {
            //还不支持自适应缩放网页
            //let temp = document.getElementsByClassName("miaocsss")
            //temp[0].style.left = width-(width2-window.innerWidth) + "px"; //设置left数值
            //temp[0].style.top = height-(height2-window.innerHeight) + "px";//设置top数值
        }
    });

    function reset() {
        try {
            sessionStorage.removeItem("miaox");
            sessionStorage.removeItem("miaoy");
            let temp = document.getElementsByClassName("miaocsss") //新增点击“重置按钮位置"按钮不刷新网页即可归位
                //console.log(temp)
            temp[0].style.left = window.innerWidth * 0.940 + "px";
            temp[0].style.bottom = "30px";
            temp[0].style.top = "unset";
            alert("已恢复默认位置！");
        } catch (error) {
            alert(error);
        }
    }
    GM_registerMenuCommand("恢复默认位置", reset);
})();
/*
        $("body").append('<div class="miaocsss"></div>');
        $("div.miaocsss").append('<input type="button" id="miaoupdatex" class="miaocssxx" value="刷新  "/><br/><input type="button" id="miaotopx" class="miaocssxx" value="到顶↑"/><br/><input type="button"  id="miaobottomx" class="miaocssxx" value="到底↓"/>');
        ($("#miaoupdatex").click(
            function()
            {
                window.location.reload();//刷新网页
            });
        $("#miaotopx").click(
            function()
            {
                window.scrollTo(0,0);//到顶
            });
        $("#miaobottomx").click(
            function()
            {
                window.scrollTo(0,document.body.scrollHeight);//到底
            });
*/