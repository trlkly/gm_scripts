// ==UserScript==
// @id             Explain XKCD Button
// @name           Explain XKCD Button
// @icon           http://i.imgur.com/bktNyTc.png
// @version        1.1.3
// @namespace      http://obskyr.io/
// @homepageURL    http://obskyr.io/
// @author         Samuel (@obskyr)
// @description    Add a link to explainxkcd to each and every XKCD page.
// @include        /^https?://(www.)?xkcd.com/([0-9]+/)?#?$/
// @exclude        /^https?://(www.)?xkcd.com/404/?$/
// @run-at         document-start
// @grant          GM_addStyle
// @require        https://raw.githubusercontent.com/uzairfarooq/arrive/master/src/arrive.js
// ==/UserScript==
    var timer // = new Date()
//trlkly: added #? to @include URL to also cover http://xkcd.com/[number/]#, which occurs if you click Next on the most recent comic.

GM_addStyle (".comicNav { opacity: 0; /*transition: opacity 0.05s ease-out*/ }"); //trlkly: with @run-at document start, this hides buttons until script takes effect

//window.addEventListener("DOMContentLoaded", function (){ setTimeout (function() {alert(new Date - timer)}, 0); })

document.arrive(".comicNav", {onceOnly: true, existing: true }, function (){ //from @require
    //trlkly: waits for comicNav to load, since the script now starts before it renders.
    var comicNumberRe = new RegExp("Permanent link to this comic: http://xkcd.com/([0-9]+)", "g");
    var middleContainer = document.getElementById("middleContainer");
    var pageText = middleContainer.textContent || middleContainer.innerText;
    var comicNumber = comicNumberRe.exec(pageText)[1];
    
   
    //trlkly: getting the title of the comic can break and is unncessary, due to redirects on the wiki. Also .toString is rather slow
    //var titleDiv = document.getElementById("ctitle");  
    //var comicTitle = titleDiv.textContent || middleContainer.innerText;
    var comicNavs = document.getElementsByClassName("comicNav");
    var explainUrl = "http://www.explainxkcd.com/wiki/index.php/" + comicNumber//.toString() + ":_" + encodeURIComponent(comicTitle.split(" ").join("_"));

    for (var i = 0; i < comicNavs.length; i++) {
        var nav = comicNavs[i];
        var li = document.createElement("li");
        var button = document.createElement("a");
        var buttonText = document.createTextNode("Explain");
        button.appendChild(buttonText);
        button.setAttribute("href", explainUrl);
        button.setAttribute("accesskey", "e"); //trlkly: adds a keyboard shortcut like the other buttons
        li.appendChild(button);
        nav.insertBefore(li, nav.children[3]);
        nav.insertBefore(document.createTextNode("\n"), nav.children[4])
        nav.style.opacity = "100"; //trlkly: unhides buttons now that script is finished
    }
//    timer = new Date();
    var navButtons = comicNavs[1].getElementsByTagName("a");
    for (var i = 1; i < navButtons.length; i++) { navButtons[i].setAttribute("accesskey", "") }/**/
})