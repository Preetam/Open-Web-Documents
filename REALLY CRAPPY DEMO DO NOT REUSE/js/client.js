var localDocBase = "";
var localDocRev = "";
var localDocPatch = "";
var localDocID = "";

dmp = new diff_match_patch();

//alert(dmp);

/* DOESN'T WORK WITH DIFF-MATCH-PATCH ----------------------------------------------------------------------------
var savedSel = null;
var savedSelActiveElement = null;

        function saveSelection() {
            // Remove markers for previously saved selection
            if (savedSel) {
                rangy.removeMarkers(savedSel);
            }
            savedSel = rangy.saveSelection();
            savedSelActiveElement = document.activeElement;
            //gEBI("restoreButton").disabled = false;
        }

        function restoreSelection() {
            if (savedSel) {
                rangy.restoreSelection(savedSel, true);
                savedSel = null;
              //  gEBI("restoreButton").disabled = true;
                window.setTimeout(function() {
                    if (savedSelActiveElement && typeof savedSelActiveElement.focus != "undefined") {
                        savedSelActiveElement.focus();
                    }
                }, 1);
            }
        }
--------------------------------------------------------------------------------------------------------------*/

function saveSelection(containerEl) {
    var charIndex = 0, start = 0, end = 0, foundStart = false, stop = {};
    var sel = rangy.getSelection(), range;

    function traverseTextNodes(node, range) {
        if (node.nodeType == 3) {
            if (!foundStart && node == range.startContainer) {
                start = charIndex + range.startOffset;
                foundStart = true;
            }
            if (foundStart && node == range.endContainer) {
                end = charIndex + range.endOffset;
                throw stop;
            }
            charIndex += node.length;
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                traverseTextNodes(node.childNodes[i], range);
            }
        }
    }

    if (sel.rangeCount) {
        try {
            traverseTextNodes(containerEl, sel.getRangeAt(0));
        } catch (ex) {
            if (ex != stop) {
                throw ex;
            }
        }
    }

    return {
        start: start,
        end: end
    };
}

function restoreSelection(containerEl, savedSel) {
    var charIndex = 0, range = rangy.createRange(), foundStart = false, stop = {};
    range.collapseToPoint(containerEl, 0);

    function traverseTextNodes(node) {
        if (node.nodeType == 3) {
            var nextCharIndex = charIndex + node.length;
            if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                range.setStart(node, savedSel.start - charIndex);
                foundStart = true;
            }
            if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                range.setEnd(node, savedSel.end - charIndex);
                throw stop;
            }
            charIndex = nextCharIndex;
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                traverseTextNodes(node.childNodes[i]);
            }
        }
    }

    try {
        traverseTextNodes(containerEl);
    } catch (ex) {
        if (ex == stop) {
            rangy.getSelection().setSingleRange(range);
        } else {
            throw ex;
        }
    }
}

function owdInit() {
	rangy.init();

	localDocBase = $("#mainEditableDiv").html();
	localDocRev = parseInt($("#docRev").html());
	localDocPatch = $("#docPatch").html();
	localDocID = $("#docID").html();

	window.setTimeout(updateLocalContent, 100);
//	alert(localDocBase + "\n" + localDocRev);

	window.setInterval(owdSync, 1500);
	document.getElementById('mainEditableDiv').onkeydown = incrementLocalDocRev;

}

function incrementLocalDocRev() {
	localDocRev++;
}

function owdSync() {
	//var serverLatestRevision="0";
	//$.ajaxSetup({async:false});
	$.post("latestRev.php", {docID:localDocID}, function(data) {
	//	serverLatestRevision = data;
		owdSyncPhase2(data);
	});
/*	if(localDocRev < serverLatestRevision) {
		//alert('updating from server');
		$.post("getStuff.php", {docID:localDocID}, function(data) {
			var obj = JSON.parse(data);
			localDocBase = obj['docBase'];
			localDocPatch = obj['docPatch'];
			localDocRev = obj['docLatestRevision'];
			updateLocalContent();
		});
	}
	else if(localDocRev > serverLatestRevision) {
		localDocPatch = dmp.patch_toText(dmp.patch_make(localDocBase, $("#mainEditableDiv").html()));
		//localDocRev++;
		postPatch();
	}
	
	console.log("Local: " + localDocRev + "; Server: " + serverLatestRevision);
*/
}

function owdSyncPhase2(serverLatestRevision) {
//	var serverLatestRevision="0";
//	$.ajaxSetup({async:false});
//	$.post("latestRev.php", {docID:localDocID}, function(data) {
//		serverLatestRevision = data;
//	});
	if(localDocRev < serverLatestRevision) {
		//alert('updating from server');
		$.post("getStuff.php", {docID:localDocID}, function(data) {
			var obj = JSON.parse(data);
			localDocBase = obj['docBase'];
			localDocPatch = obj['docPatch'];
			localDocRev = obj['docLatestRevision'];
			updateLocalContent();
		});
	}
	else if(localDocRev > serverLatestRevision) {
		localDocPatch = dmp.patch_toText(dmp.patch_make(localDocBase, $("#mainEditableDiv").html()));
		//localDocRev++;
		postPatch();
	}
	
	console.log("Local: " + localDocRev + "; Server: " + serverLatestRevision);
}

function postPatch() {
	$.post("submit.php", {docID:localDocID, docLatestRevision:localDocRev, docPatch:localDocPatch});
}

function updateLocalContent() {
//	saveSelection();

	var el=document.getElementById('mainEditableDiv');
	var savedSel = saveSelection(el);

	$("#mainEditableDiv").html(
		(dmp.patch_apply(dmp.patch_fromText(localDocPatch) ,localDocBase))[0]
	);

	restoreSelection(el, savedSel);
//	restoreSelection();
}

function openHTMLEditor() {
	document.getElementById('rawHTML').style.display = 'inline';
	$('#rawHTML').html(
		$('#mainEditableDiv').html().replace('<', "&lt;")
	);
	console.log('asdf');

	document.getElementById('rawHTML').oninput = updateText;
}

function updateText() {
                $('#mainEditableDiv').html(
                        $('#rawHTML').html().replace('&lt;', '<')
                );
}

