// ==UserScript==
// @name         网页快速到顶到底+刷新
// @namespace    http://tampermonkey.net/
// @version      测试(beta)0.61
// @description  网页快速到顶到底+刷新(大概没什么用吧)。部分网站存在两个body，会导致出现两条按钮列表的bug，暂没方法解决(例如：广告。。！)
// @author       shitianshiwa
// @include      http*://*
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL  https://github.com/shitianshiwa/baidu-tieba-userscript/
// ==/UserScript==
/*
1.部分网站存在两个body，会导致出现两条按钮列表的bug，暂没方法解决(例如：广告。。！)
2.有些网页会报错，暂没方法解决
*/
(function() {
    'use strict';
    var b1 = false,
        b2 = false,
        b3 = 0; //解决按键点击动作与移动按钮动作之间的冲突
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
width:60px;
height:120px;
position: fixed;
left:0px;
z-index: 1005;
}
`;
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
            temp1.style.left = window.innerWidth * 0.945 + "px";
            temp1.style.bottom = "30px";
        }
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
        var temp3 = document.body;
        if (temp3 != null) {
            temp3.appendChild(temp1);
        }
    } catch (error) {
        //alert(error);
    }

    function reset() {
        try {
            sessionStorage.removeItem("miaox");
            sessionStorage.removeItem("miaoy");
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