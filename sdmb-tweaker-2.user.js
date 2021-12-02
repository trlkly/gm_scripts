// ==UserScript==
// @name         SDMB Tweaker 2
// @namespace    BigTSDMB
// @version      2.0
// @description  New tweaks for the new(er) Discourse SDMB
// @author       BigTSDMB
// @updateURL    https://openuserjs.org/meta/BigTSDMB/SDMB_Tweaker_2.meta.js
// @downloadURL  https://openuserjs.org/install/BigTSDMB/SDMB_Tweaker_2.user.js
// @license      MIT
// @match        https://boards.straightdope.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==
/* jshint esversion: 6 */

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
     text-decoration-skip: trailing-spaces; /* currently doesn't work. used gradient workaround */
  }
  .cooked :not(.source) > a:not(.mention):visited, aside.onebox .onebox-body a[href]:visited {
     color: var(--success-hover);
  }
  a:hover {
     text-decoration: underline !important;
  }
  .title a, .menu-panel a:hover {
     text-decoration: none !important;
  }
  .badge-notification.clicks {
     left: -0.7ch;
     margin-right: -0.7ch;
     border-radius: 10px 10px 10px 0px;
     background: radial-gradient(67% 79%, var(--primary-low) 68%, transparent 73%),
                 linear-gradient(to left, var(--primary-low) 60%, var(--secondary) 60%);
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
      a, .cooked :not(.source) > a:active:not(.mention), /*aside.onebox .onebox-body a[href],*/
      .cooked :not(.source) > a:hover:not(.mention) {
         color: var(--tertiary-high);
      }
      .cooked :not(.source) > a:not(.mention):visited, aside.onebox .onebox-body a[href]:visited {
         color: #551a8b; /* default visited color in most browsers */
      }
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
  document.querySelectorAll('.badge-notification.clicks').forEach( badge => {
    let spacer = badge.previousSibling;
    if(spacer.textContent == ' ') { spacer.textContent = ''; }
  });
}
*/
