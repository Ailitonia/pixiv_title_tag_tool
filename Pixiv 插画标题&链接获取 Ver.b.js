// ==UserScript==
// @name         Pixiv 插画标题&链接获取 Ver.b
// @namespace    https://ailitonia.com/archives/pixiv-%E6%8F%92%E7%94%BB%E6%A0%87%E9%A2%98%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96/
// @version      1.1_20200223_Ver.b
// @description  Pixiv 插画标题获取 Ver.b
// @author       ailitonia
// @match        https://www.pixiv.net/artworks/*
// @match        http://www.pixiv.net/artworks/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    var illustData;

    var banner = document.createElement("div");
    banner.innerHTML = '<div id="Ailigetpixivtitleandlink"><textarea style="height:100%; width:100%" readonly="">少女祈祷中……</textarea></div>';
    document.body.insertBefore(banner, document.body.firstChild);

function getpid(){
    var aurl = window.location.href;
    var pid = aurl.replace(/^(https\:\/\/www\.pixiv\.net\/artworks\/)/i,"");
    return pid;
};

function getillustData(){
    var aurl = "https://www.pixiv.net/ajax/illust/"+getpid();
    $.ajax({
        type:"get",
        url:aurl,
        async:false,
        dataType:"json",
        success:function (data){
            illustData = data;
        }
    });
};

function gettheillustInfo() {

    getillustData();

    var tag = "";
    var len = illustData.body.tags.tags.length;
    for (var i = 0; i < len; i++)
        {tag = tag + "#" + String(illustData.body.tags.tags[i].tag) + "  ";
    }

    tag = tag.replace(/(\/|\(|\・|\&|\:|\：|\-|\、|\@|\?|\？|\!|\！|\·|\.|\'|\;|\☆|\～|\=|\*|\「|\」|\【|\】)/g,"\_");
    tag = tag.replace(/(\#\_)/g,"\#");
    tag = tag.replace(/(\)|^\_|\_+(?=\s)|\_+$)/g,"");

    var turl = "https://www.pixiv.net/artworks/" + String(illustData.body.illustId);

    var author = String(illustData.body.userName);

    var tutitle = String(illustData.body.illustTitle);

    var ordescription = String(illustData.body.description);
    var tudescription = "";
    if (ordescription != "") {
        ordescription = ordescription.replace(/(\<br\>|\<br \/\>)/g,"\n");
        ordescription = ordescription.replace(/<[^>]+>/g,"");
        tudescription = "\n————————————\n"+ordescription;
    }

    var orcontent = '<textarea id="agpi_illustInfo" style="width:100%" rows="4" onscroll="this.rows++;" readonly="">「'+tutitle+"」/「"+author+"」\n"+tag+"\n"+turl+tudescription+'</textarea>';
    document.getElementById("Ailigetpixivtitleandlink").innerHTML = orcontent

};

    //加载作品信息
    window.setTimeout(gettheillustInfo,500);

    //检测url变化
    //rel:https://stackoverflow.com/a/46428962
    var oldHref = document.location.href;
    window.onload = function() {
        var
            bodyList = document.querySelector("body")
            ,observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (oldHref != document.location.href) {
                        oldHref = document.location.href;
                        /* Changed ! your code here */
                        //刷新作品信息
                        gettheillustInfo();
                    }
                });
            });
        var config = {
            childList: true,
            subtree: true
        };
        observer.observe(bodyList, config);
    };
})();