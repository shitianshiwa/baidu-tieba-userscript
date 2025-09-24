// ==UserScript==
// @name         MD5 Hash
// @version      1.0
// @description  MD5 hashing framework
// @author       A Meaty Alt
// @match        /fairview\.deadfrontier\.com/
// @grant        none
// @homepage    https://update.greasyfork.org/scripts/32927/225078/MD5%20Hash.js
// ==/UserScript==

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
    for(var i=0;i<b.length;i++)c+=b[i][1];
    return MD5(c);
}
//MAGIC HASH END