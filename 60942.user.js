// ==UserScript==
// @name        ROT13 in-place converter
// @namespace   trlkly
// @description Converts selection to and from ROT13
// @version     1.0.0
// @include     *
// @grant       GM_registerMenuCommand
// ==/UserScript==

if (typeof GM_registerMenuCommand != 'undefined') {
    GM_registerMenuCommand('ROT13 encode/decode', rotateSelection);
}

document.addEventListener('keydown', function(key){
    if (key.altKey && key.code == 'KeyZ') { rotateSelection(); }
});
//converted from bookmarklet at http://arstechnica.com/civis/viewtopic.php?p=1243961#p1243961
function rotateSelection() {
	function rot13(text) { //replaced rot13 fucntion with my own, faster function
		return text.replace(/[A-Z]/gi, function (char) {
			var rot = (char.toUpperCase() < 'N') ? +13 : -13;
			return String.fromCharCode(char.charCodeAt(0) + rot);
		});
    }

    //added to handle textareas
    function rotateTextArea(txtarea) {
        var sel = {start: txtarea.selectionStart, end: txtarea.selectionEnd}
		var selected = txtarea.value.substring(sel.start, sel.end);
		if (typeof chrome != 'undefined') {
			document.execCommand('insertText', false, rot13(selected));
		} else {
		txtarea.value = txtarea.value.substr(0, sel.start) + rot13(selected) + 
            txtarea.value.substr(sel.end);
		}
        txtarea.selectionStart = sel.start; txtarea.selectionEnd = sel.end;
    }
    var textarea = document.getElementsByTagName('textarea');
    for (var i = 0; i < textarea.length; i++) {
        if (textarea[i].selectionStart != textarea[i].selectionEnd) {
           rotateTextArea(textarea[i]);
        }
    }
    //end addition

    var S = window.getSelection();
    if (S.isCollapsed) return; //added to quit if there's no selection
    function t(N) { return N.nodeType == N.TEXT_NODE; }
    function r(N) {
        if (t(N)) { N.data = rot13(N.data); }
    }
    for (j = 0;j < S.rangeCount; ++j) {
        var g = S.getRangeAt(j), e = g.startContainer, f = g.endContainer,
            E = g.startOffset, F = g.endOffset, m = (e==f);

        //added to better handle triple clicking on paragraphs -- Firefox only
        if(!t(e) && m) {
            var e2 = null, S2 = null;
            for (var x = 0; x < e.childNodes.length + 1; x++) {
                S2 = S.containsNode(e.childNodes[x], false);
                if (S2 && !e2) {
                    e2 = e.childNodes[x];
                } else if (e2 && !S2) {
                    f = e.childNodes[x-1];
                    e = e2;
                    E = 0; F = f.textContent.length;
                    continue;
                }
            }
        }
        //end addition

        if(!m || !t(e)) {
            // rot13 each text node between e and f, not including e and f.
            q = document.createTreeWalker(g.commonAncestorContainer,
                                          NodeFilter.SHOW_ELEMENT |
                                          NodeFilter.SHOW_TEXT, null, false);
            q.currentNode = e;
            for(N = q.nextNode(); N && N != f; N = q.nextNode()) r(N);
        }
        if (t(f)) { f.splitText(F); }
        if (!m) { r(f); }
        if (t(e)) {
            r(k = e.splitText(E));
            if(m) { f = k; }
            e = k;
        }
        if (t(f)) { g.setEnd(f,f.data.length); }
    }
}