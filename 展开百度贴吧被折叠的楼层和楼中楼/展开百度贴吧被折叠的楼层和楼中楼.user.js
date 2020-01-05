// ==UserScript==
// @name         展开百度贴吧被折叠的楼层和楼中楼
// @namespace    shitianshiwa
// @version      0.01
// @description  还原被折叠隐藏的楼层、楼中楼，附带自动展开楼中楼的查看更多
// @author       shitianshiwa
// @include      http*://tieba.baidu.com/p/*
// @icon         https://avatars3.githubusercontent.com/u/54750485
// @grant        none
// @run-at       document-idle
// @downloadURL  https://github.com/shitianshiwa/baidu-tieba-userscript/
// ==/UserScript==
/*
参考
https://greasyfork.org/scripts/375218-%E8%B4%B4%E5%90%A7%E5%9B%9E%E5%A4%8D%E4%BF%AE%E6%AD%A3 贴吧回复修正
https://github.com/indefined/UserScripts/tree/master/tiebaPostAdjustment
已知问题继承
展开的被折叠楼层会显示隐藏提示（有意没有去掉它）
展开的被隐藏楼中楼需要点击两次数字才能收起该层楼中楼（暂时无法解决）
可能对某些帖子不管用，如果出现这种情况请反馈准确帖子链接
---
https://github.com/FirefoxBar/userscript/raw/master/Tieba_Blocked_Detect/Tieba_Blocked_Detect.user.js 贴吧贴子屏蔽检测
*/
(function() {
    'use strict';
    const getTriggerStyle = () => {
        return `
/* 使用 animation 监测 DOM 变化 */
@-webkit-keyframes __tieba_zhankai__ {}
@-moz-keyframes __tieba_zhankai__ {}
@keyframes __tieba_zhankai__ {}
/* 楼中楼 */
.lzl_li_pager{//lzl_li_pager j_lzl_l_p lzl_li_pager_s 随便选了一个 在回复层主标签元素那块
-webkit-animation: __tieba_zhankai__;
-moz-animation: __tieba_zhankai__;
animation: __tieba_zhankai__;
}
.__tieba_zhankai2__{
}
`;
    };

    function unfoldPost() { //楼层内容折叠展开
        [].forEach.call(document.querySelectorAll('[style="display:;"]>.p_forbidden_post_content_fold'), node => {
            //console.log(node)
            node.click();
        });
    }

    function unfoldPost2() { //楼中楼内容折叠展开
        //console.log('223');
        [].forEach.call(document.querySelectorAll('div>.j_lzl_container.core_reply_wrapper[style="min-height: 0px; display: none;"]'), node => {
            if (JSON.parse(node.getAttribute("data-field")).total_num > 0) {
                node.style = "min-height: 1px; display:block;" //和原来的样式有所不同，这样就可以人为收起来楼中楼了。。！
                    //node.parentNode.children[0].children[0].children[0].click();
                    //node.classList.add("_yizhankai_");
            }
            //console.log(JSON.parse(node.getAttribute("data-field")).total_num)
            //JSON.parse(json).XXXX
            //https://blog.csdn.net/weixin_39889465/article/details/86220538 js通过'data-xxx'自定义属性获取dom元素
            //https://www.cnblogs.com/landeanfen/p/5159911.html JS组件系列——使用HTML标签的data属性初始化JS组件
            //https://www.w3school.com.cn/tags/att_global_data.asp HTML data-* 属性
        });
    }
    const unfoldPost3 = (event) => { //楼中楼楼层太长折叠展开
            if (event.animationName !== '__tieba_zhankai__') {
                return;
            }
            const { target } = event;
            const { classList } = target;
            let temp = target.children[1].children[1];
            if (temp != undefined) {
                if (temp.classList == "j_lzl_m") {
                    temp.classList.add("__tieba_zhankai2__");
                    temp.click();
                }
            }
            //console.log(target.classList);
            //console.log(temp);
            //console.log("2333");
            //console.log(target.children[1].children[1])
            //document.querySelectorAll(".lzl_li_pager")[0].children[1].children[1].click()
        }
        /**
         * 初始化样式
         */
    const initStyle = () => {
        const style = document.createElement('style');
        style.textContent = getTriggerStyle();
        document.head.appendChild(style);
    };

    /**
     * 初始化事件监听
     *
     */
    const initListener = () => {
        document.addEventListener('webkitAnimationStart', unfoldPost3, false);
        document.addEventListener('MSAnimationStart', unfoldPost3, false);
        document.addEventListener('animationstart', unfoldPost3, false);
    };

    setTimeout(unfoldPost, 1000); //要延迟一会儿，才能保证捕捉到标签
    /*var t=*/
    setInterval(unfoldPost2, 2000); //要定时循环查找才能找全整个贴子的楼中楼。。！
    initListener();
    initStyle();
})();