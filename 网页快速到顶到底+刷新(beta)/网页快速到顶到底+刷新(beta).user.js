// ==UserScript==
// @name         网页快速到顶到底+刷新(beta)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  网页快速到顶到底+刷新(大概没什么用吧)
// @author       shitianshiwa
// @include      http*://*
// @grant        none
// @run-at       document-idle
// @downloadURL  https://github.com/shitianshiwa/baidu-tieba-userscript/
// ==/UserScript==

(function()
 {
    'use strict';
    const css1=`
/*按钮样式*/
.miaocssxx
{
position: relative;
width: 60px;
height: 30px;
font-size: 15px;
font-weight:bold;
background: #fff;
color: #89a0c5;
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
width:20px;
height:120px;
position: fixed;
left: 94%;
bottom: 40px;
z-index: 1005;
}
`;
    var s1=new Array("","miaoupdatex","miaotopx","miaobottomx");
    var s2=new Array("隐藏↑ ","刷新  ","到顶↑","到底↓");
    var temp2=new Array();
    try
    {
        const style = document.createElement('style');//创建新样式节点
        style.textContent = css1;//添加样式内容
        document.head.appendChild(style);//给head头添加新样式节点

        var temp1=document.createElement("div");//创建节点<input/>
        temp1.setAttribute('class','miaocsss');
        for(let i=0;i<=3;i++)
        {
            temp2[i]=document.createElement("input");//创建节点<input/>
            temp2[i].setAttribute('type','button');
            temp2[i].setAttribute('id',s1[i]);
            temp2[i].setAttribute('class','miaocssxx');
            temp2[i].setAttribute('value',s2[i]);
            temp1.appendChild(temp2[i]);
        }
        temp2[0].style="color:#f00;"
        temp2[0].addEventListener('click', () => {
            if(temp2[0].value=="隐藏↑ ")
            {
                temp2[0].value="展开↓ ";
                for(let i=1;i<=3;i++)
                {
                    temp2[i].style="display:none;";//修改样式
                }
            }
            else
            {
                temp2[0].value="隐藏↑ ";
                for(let i=1;i<=3;i++)
                {
                    temp2[i].style="display:block;";//修改样式
                }
            }
        })
        temp2[1].addEventListener('click', () => {
            window.location.reload();//刷新网页
        })
        temp2[2].addEventListener('click', () => {
            window.scrollTo(0,0);//到顶
        })
        temp2[3].addEventListener('click', () => {
            window.scrollTo(0,document.body.scrollHeight);//到底
        })
        document.body.appendChild(temp1);
    }
    catch(error)
    {
        alert(error);
    }
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