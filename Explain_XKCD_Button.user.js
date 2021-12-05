// ==UserScript==
// @id             Explain XKCD Button
// @name           Explain XKCD Button
// @license        MIT
// @icon           data:image/gif;base64,R0lGODlhIAAgAOMPAAACAB4fHSkrKT0/PEpMSVxeXG1vbH6AfZOVkqmrqLe5tszOy9/h3u7x7f3//P///yH5BAEKAA8ALAAAAAAgACAAAAT08EnnELj4Jsq7lxNFZEaQFV7ahcM1KJ0iXLCaPlRxEbYZ2DbGDpi4LICpw6WBvByQHp0B6oR2Ws8mIGt1GLZUcNehFCAbmnHFSFyq0YABUBdgqr9xFZyrbgF4URcMDgtYY35bCg0JIwAoChh8YRkYAgwLGAZ2XZSZDQwmADVjkJRZCzNiao0ZAwylAFNqDkKRiJGzORkNDTq4uZgZCBStBweKvMkLxsYdrFWwndIYm9RYwVsGBbfTAJuhDEqUY+Kb0Z3kF4HT6QAe2C7lXfLOGHIOgvNuOBR4AnZsrBTxFgLWMGIAjlip1QDEgwyDECqEggZEBAA7
// @version        1.4.0
// @namespace      http://obskyr.io/
// @homepageURL    https://openuserjs.org/scripts/BigTSDMB/Explain_XKCD_Button
// @updateURL      https://openuserjs.org/meta/BigTSDMB/Explain_XKCD_Button.meta.js
// @author         BigT
// @description    Add a link to explainxkcd to every XKCD comic page.
// @match          *://*.xkcd.com/*
// @run-at         document-start
// @grant          none
// ==/UserScript==

//var timer = new Date(); //for testing only

function addStyle(css) {
  let style = document.createElement('style');
  style.innerText = css;
  if (document.documentElement) {
    document.documentElement.appendChild(style);
  }
  else {
    let observer = new MutationObserver( () => {
      if (document.documentElement) {
        observer.diconnect();
        document.documentElement.appendChild(style);
      }
    }); observer.observe(document, { childList: true });
  }
}

addStyle('.comicNav { visibility: hidden; }');

let watcher = new MutationObserver( () => {
  if (document.getElementsByClassName('comicNav').length == 2) {
    watcher.disconnect();
    createButton(); //waits for comicNav to load, since the script now starts before it renders.
    fixAccess();
  }
}); watcher.observe(document, { childList: true, subtree: true });

function createButton() {
  let middleContainer = document.getElementById('middleContainer');
  if (!middleContainer) return;
  let comicNumber = (document.URL + '/').split('/')[3]; //gets comic number from URL
  if (!comicNumber) { //if fails, try another way to get the current comic number
    comicNumber = document.querySelector('a[rel="prev"]').href.split('/')[3];
    comicNumber++;
  }
  let explainUrl = 'http://www.explainxkcd.com/wiki/index.php/' + comicNumber;
  let comicNav = document.getElementsByClassName('comicNav');

  for (let i = 0; i < comicNav.length; i++) {
    let nav = comicNav[i];
    if (nav.getElementsByClassName('explainxkcd')[0]) { continue; } //skip if button is already there
    let li = document.createElement('li');
    li.innerHTML = '<a href="' + explainUrl + '" class="explainxkcd" accesskey="e">Explain</a>';
    nav.insertBefore(li, comicNav[i].children[3]);
    nav.insertBefore(document.createTextNode('\n'), li.nextSibling); //makes spacing the same as other buttons
  }
  addStyle('.comicNav { visibility: visible; }'); //unhides buttons now that Explain button is present
  //console.log(new Date() - timer); //for speed testing only
}

function fixAccess() { //remove extra access keys so they work instantly without pressing Enter
  let comicNav = document.getElementsByClassName('comicNav');
  if (comicNav.length < 2) { return; } //quick and graceful exit if there are no buttons
  let navButtons = comicNav[1].getElementsByTagName('a');
  for (let i = 1; i < navButtons.length; i++) { navButtons[i].removeAttribute('accesskey'); }/**/
}
