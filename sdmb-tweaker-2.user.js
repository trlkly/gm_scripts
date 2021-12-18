// ==UserScript==
// @name         SDMB Tweaker 2
// @namespace    BigTSDMB
// @version      2.1.2
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

if (optionsList['bolder-titles']) { style +=`
  .topic-list .main-link a.title {
     font-weight: bold;
  }
  .visited .main-link a.title {
     font-weight: normal;
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
if (location.pathname.indexOf('/preferences/') != -1) {
  let createOptionHTML = optionList => {
    let output = '<legend class="control-label">SDMB Tweaker</legend>';
    for (let key in optionList) {
      output += `
        <div class="controls">
          <label class="checkbox-label">
            <input id="${key}" type="checkbox" class="ember-checkbox sdmb-tweaker-setting">
            ${optionList[key]}
          </label>
        </div>
      `;
    };
    return output;
  }
  let addOptions = () => {
    let observer = new MutationObserver( () => {
      let fieldset = document.querySelector('fieldset.other');
      if (fieldset) {
        observer.disconnect();
        let additionalOptions = document.createElement('fieldset');
        additionalOptions.className = 'control-group sdmb-tweaker-preferences';
        fieldset.after(additionalOptions);
        additionalOptions.innerHTML = createOptionHTML({
          'bolder-titles': 'Make unread thread titles more bold',
          'sticky-avatars': 'Enable sticky avatars',
        });
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
  }
  addEventListener('DOMContentLoaded', addOptions);
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
