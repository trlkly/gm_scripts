// ==UserScript==
// @name        ScrollRight
// @namespace   trlkly
// @description Scrolls the page all the way to the right. Good for when you zoom in.
// @exclude     *
// @version     1
// @grant       none
// @run-at      document-start
// ==/UserScript==

var maxTime = 5000; //milliseconds

//console.log ("script fired");
var timeout = new Date();
(function scrollRight() {
  if (new Date() - timeout < maxTime) {
//    console.log ("function fired");
    window.scroll (scrollMaxX, scrollY);
    if (scrollX == 0) { setTimeout (scrollRight, 5);}
  }
})();
