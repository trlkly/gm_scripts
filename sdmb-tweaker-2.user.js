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
// @require      https://openuserjs.org/src/libs/BigTSDMB/setStyle.js
// ==/UserScript==
/* jshint esversion: 6 */
/* globals setStyle */

let optionsList = JSON.parse(localStorage.getItem('sdmb-tweaker-options') || '{}');
let style = `
  .cooked a:not(.mention)/*, .d-editor-preview a:not(.mention)*/ {
     text-decoration: underline;
     text-decoration-skip: trailing-spaces; /* currently doesn't work. used gradient workaround */
  }
  .cooked :not(.source) > a:not(.mention):visited, aside.onebox .onebox-body a[href]:visited {
     color: var(--success-hover);
  }
  a:hover, .title a:hover {
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
`;
if (!optionsList['sticky-avatars']) { style += `
  .topic-post.sticky-avatar .topic-avatar {
     position: unset !important;
  }
`; }
setStyle(style, 'sdmb-tweaker');

addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('[data-theme-name="straight dope light"]')) {
    setStyle(`
      a, .cooked :not(.source) > a:active:not(.mention), /*aside.onebox .onebox-body a[href],*/
      .cooked :not(.source) > a:hover:not(.mention) {
         color: var(--tertiary-high);
      }
      .cooked :not(.source) > a:not(.mention):visited, aside.onebox .onebox-body a[href]:visited {
         color: #551a8b; /* default visited color in most browsers */
      }
    `, 'sdmb-tweaker-SDL');
  } else if (document.querySelector('[data-theme-name="minima"]')) {
    setStyle(`
      .MJXc-TeX-sans-R {
         font-family: sans-serif !important;
      }
    `, 'sdmb-tweaker-Min');
  }
});

//add option(s)
if (location.pathname.endsWith('/preferences/interface') ) {
  addEventListener('DOMContentLoaded', () => {
    let observer = new MutationObserver( () => {
      let fieldset = document.getElementsByTagName('fieldset')[0];
      if (fieldset) {
        observer.disconnect();
        let optionStickyAvatars = document.createElement('div');
        optionStickyAvatars.innerHTML = `
          <label class="checkbox-label">
            <input id="sticky-avatars" type="checkbox"
              class="ember-checkbox ember-view sdmb-tweaker-setting">
            Enable sticky avatars
          </label>
        `;
        optionStickyAvatars.className='controls ember-view';
        fieldset.appendChild(optionStickyAvatars);
        let optionsList = JSON.parse(localStorage.getItem('sdmb-tweaker-options') || '{}');
        let settingsList = document.getElementsByClassName('sdmb-tweaker-setting');
        for (let option of settingsList) {
          if (optionsList[option.id]) { option.checked = true; }
          option.addEventListener('change', () => {
            optionsList[option.id] = option.checked;
            localStorage.setItem('sdmb-tweaker-options', JSON.stringify(optionsList) );
          });
        }
      }
    }); observer.observe(document.body, { childList:true, subtree: true });
  });
}
/* apply to all DOM mutations. Hopefully unneeded:
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
