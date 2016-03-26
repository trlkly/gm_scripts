// ==UserScript==
// @name        Hide SDMB Infractions
// @namespace   BigTSDMB.hide-sdmb-infractions
// @include     http://boards.straightdope.com/sdmb/member.php*
// @include		http://boards.straightdope.com/sdmb/usercp.php
// @version     2
// @grant       none
// @run-at      document-start
// @updateURL   https://openuserjs.org/install/BigTSDMB/Hide_SDMB_Infractions.user.js
// @downloadURL https://openuserjs.org/install/BigTSDMB/Hide_SDMB_Infractions.user.js
// @supportURL  https://openuserjs.org/scripts/BigTSDMB/Hide_SDMB_Infractions
// @homepageURL https://openuserjs.org/scripts/BigTSDMB/Hide_SDMB_Infractions
// ==/UserScript==


var style = document.createElement('style');
style.textContent = '#infractions_tab { display: none !important; }';
document.body.appendChild(style);
window.addEventListener('DOMContentLoaded', function () {
    var infractions = document.getElementById("collapseobj_usercp_infraction");
    if (infractions !== null) infractions.parentElement.style.display = 'none';
});
