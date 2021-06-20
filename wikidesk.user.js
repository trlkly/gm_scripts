// ==UserScript==
// @name         Wikimedia Wikis - desktop versions
// @author       BigTSDMB
// @namespace    BigTSDMB
// @version      0.3
// @description  Redirect to the desktop versions of Wikipedia, Wikimedia Commons, and Wiktionary
// @license      MIT      
// @match        *://*.m.wikipedia.org/*
// @match        *://*.m.wikimedia.org/*
// @match        *://*.m.wiktionary.org/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function(){ 'use strict';

if (document.body) document.body.innerHTML = ''; //avoid rendering mobile version
location.replace(document.URL.replace('.m.', '.'));

})();
