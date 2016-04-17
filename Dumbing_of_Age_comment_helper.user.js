// ==UserScript==
// @name        Dumbing of Age comment helper
// @namespace   trlkly
// @include     http://www.dumbingofage.com/*
// @version     2.3
// @run-at      document-start
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// ==/UserScript==

var ignoreList // = "name|name|name" //if you lack GM_registerMenu
var chromeOverride;

//console.log ('script fired')

if (typeof GM_registerMenuCommand != 'undefined') {
	var getIgnoreList = function() {
		var input = window.prompt('Enter ignore list, e.g. name|name|name\n' +
								  '(Refresh page to activate)',
								  (chromeOverride ? '$override||' : '') + ignoreList);
		if (input !== null)  { GM_setValue('ignoreList', input); return input; }
		return ignoreList;
	};
	ignoreList = GM_getValue('ignoreList', '');
	GM_registerMenuCommand('Edit Ignore List (DofA helper)', function (){
		ignoreList = getIgnoreList();
	});
	//console.log ('script fired')
}
//innerText polyfill
if ( (!('innerText' in document.createElement('a'))) && ('getSelection' in window) ) {
    HTMLElement.prototype.__defineGetter__("innerText", function() {
        var selection = window.getSelection(),
            ranges    = [],
            str;

        // Save existing selections.
        for (var i = 0; i < selection.rangeCount; i++) {
            ranges[i] = selection.getRangeAt(i);
        }

        // Deselect everything.
        selection.removeAllRanges();

        // Select `el` and all child nodes.
        // 'this' is the element .innerText got called on
        selection.selectAllChildren(this);

        // Get the string representation of the selected nodes.
        str = selection.toString();

        // Deselect everything. Again.
        selection.removeAllRanges();

        // Restore all formerly existing selections.
        for (var i = 0; i < ranges.length; i++) {
            selection.addRange(ranges[i]);
        }

        // Oh look, this is what we wanted.
        // String representation of the element, close to as rendered.
        return str;
    });

	HTMLElement.prototype.__defineSetter__("innerText", function(str) {
        this.innerHTML = str.replace(/\n/g, "<br />");
    });
}

//Style changes
                                             /*jshint esnext:true*/
var style = document.createElement('style'); style.textContent = `
	.comment-permalink { display: initial !important; }
	textarea#comment { width: 98.5%; }
	#sidebar-left {	padding-right: 0px; }
	.narrowcolumn { padding: 0; width: 510px; }
	textarea { resize: vertical !important; }
`; document.head.appendChild(style);

window.addEventListener('DOMContentLoaded', function() {
	//parse "override" option
	if (ignoreList && ignoreList.split('||')[0] == "$override") {
		chromeOverride = true;
		ignoreList = ignoreList.split('||')[1];
	}

	//autoexpanding text box
	var te = document.getElementById('comment');
	if (!window.chrome || chromeOverride) {
		te.style.display = 'none';
		te.id = 'textcomment';
		var ce = document.createElement('div');
		ce.contentEditable = true;
		ce.id = 'comment';
		ce.innerText = te.value;
		te.parentElement.insertBefore(ce, te);
		ce.style.cssText = 'min-height: 5em; resize: vertical; overflow: auto; ';
		ce.style.cssText += 'white-space: pre-wrap; word-wrap: break-word;';
		var cf = document.getElementById('commentform');
		cf.addEventListener('submit', function() {
			document.getElementById('textcomment').value =
			document.getElementById('comment').innerText;
			return true;
		});
		//converting back to resizable if you manually resize it back
		/*ce.addEventListener('click', function(){
			console.log ('click event fired')
			if (!ce.childNodes[0] || !ce.childNodes[0].innerText) {
				var ceInnerText = ce.innerText; 
				ce.innerHTML = '<div> </div>'; 
				ce.childNodes[0].innerText = ceInnerText;
			}
			var ceHeight = ce.style.height.split('px')[0] * 1 || 100000;
			var ceMinHeight = getComputedStyle(ce).minHeight.split('px')[0] * 1;
			var ceScrollHeight = ce.childNodes[0].scrollHeight;
			if (Math.abs(ceHeight - ceScrollHeight) < 6 ||
					(ceScrollHeight <= ceHeight && ceHeight <= ceMinHeight + 6)) {
				ce.style.height = null;
				console.log('ceHeight=' + ceHeight + ' ceMinHeight=' + ceMinHeight +
							' ceScrollHeight=' + ceScrollHeight);
			}
		});/**/
		//cf.action = 'http://www.htmlcodetutorial.com/cgi-bin/mycgi.pl';
	} else { //fallback to large textbox for chrome while the expander is slow
		te.style.height = document.documentElement.clientHeight - 32 + 'px';
	}

	//remove posts (and threads) from people on your ignore list
	if (ignoreList) {
		var cites = document.getElementsByTagName('cite');
		for (var x = 0; x < cites.length; x++) {
			if (cites[x].innerText.search(new RegExp('^' + ignoreList + '$', 'gi')) != -1) {
				cites[x].parentNode.parentNode.parentNode.style.display = 'none';
			}
		}
	}
});


/*IDEAS

//for Chrome workarounds (which I may never try)

For Chrome, use an iframe, and set iframe.contentWindow.document.body.innerHTML=cf.innerHTML
and bring over the CSS to style it. Have it take up the minimal amount of space at the start,
but, if someone clicks inside of it, then it resizes itself to take up one entire screen.

Or, a lesser solution, when you click inside the comment box, just resize it to be the screen
height, minus the space needed for the post button. Make the post button a fixed div that stays
at the bottom of the page as long as any element in the form is active.

//other
maybe add autosize button that will remove the user-defined size (and shrink or
grow the textarea on Chrome).

add another post button in chrome--one on top the textbox

see if there's a way to detect when the comment box is active, and hide the rightmost
column, allowing for a larger comment box.

Add a mazimize comments button, both at the top and above the comment box. It would
hide the other two columns and set the width of the middle column to auto.
'*/