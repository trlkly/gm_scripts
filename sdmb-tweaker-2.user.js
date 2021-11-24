// ==UserScript==
// @name         SDMB Tweaker 2
// @namespace    BigTSDMB
// @version      2.0
// @description  New tweaks for the new(er) Discourse SDMB
// @author       BigTSDMB
// @license      MIT
// @updateURL    https://openuserjs.org/meta/BigTSDMB/SDMB_Tweaker_2.meta.js
// @downloadURL  https://openuserjs.org/install/BigTSDMB/SDMB_Tweaker_2.user.js
// @match        https://boards.straightdope.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

function changeStyle(css, id = 'sdmb-tweaker') {
  if (!document.documentElement) {
    let observer = new MutationObserver( () => {
      changeStyle(css, id);
      observer.disconnect();
    } );
    observer.observe(document, { childList: true } );
    return;
  }
  let style = document.getElementById(id);
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    let base = document.head || document.documentElement;
    base.appendChild(style);
  }
  style.textContent = css;
}

let style = `
  .cooked a:not(.mention)/*, .d-editor-preview a:not(.mention)*/ {
     text-decoration: underline;
     text-decoration-skip: trailing-spaces;
  }
  .badge-notification.clicks {
     left: -0.6ch;
     margin-right: -0.7ch;
     border-radius: 10px 10px 10px 0px;
     background: radial-gradient(var(--primary-low) 68%, var(--secondary) 73%);
  }
  .MJXc-TeX-sans-R {
     font-family: var(--font-family) !important;
  }
  .topic-post.sticky-avatar .topic-avatar {
     position: unset !important;
  }
`;
changeStyle(style);
addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('[data-theme-name="straight dope light"]')) {
    changeStyle(`
      a, a:active, a:hover { color: var(--tertiary-high); }
      a:visited { color: #551a8b; } /* default visited color in most browsers*/
    `, 'sdmb-tweaker-SDL');
  } else if (document.querySelector('[data-theme-name="minima"]')) {
    changeStyle(`
      .MJXc-TeX-sans-R {
        font-family: sans-serif !important;
      }
    `, 'sdmb-tweaker-Min');
  }
});
/*
addEventListener('DOMContentLoaded', () => {
  var observer = new MutationObserver(main_script);
  observer.observe(document, { childList:true, subtree: true });
});

function main_script(mutation) {
}
*/
