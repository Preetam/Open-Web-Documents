<?
if(!isset($_GET['docID']))
	exit("docID not specified!");

try {
	$db = new PDO('sqlite:database1.sqlite');

	$result = $db->query("SELECT * FROM Documents WHERE docID=".$_GET['docID']);

	$docBaseText = "";
	$docPatchText = "";
	$docLatestRevisionText = "";

	foreach($result as $row) {
		//echo $row['docID']."  ".$row['docBase']."  ".$row['docPatch'];
		$docBaseText = $row['docBase'];
		$docPatchText = $row['docPatch'];
		$docLatestRevisionText = $row['docLatestRevision'];
	}
}
catch(PDOException $e) {
	exit($e->getMessage());
}
?>

<html>
<head>
<script src="js/diff_match_patch.js" type="text/javascript"></script>
<script src="js/client.js" type="text/javascript"></script>
<script src="http://code.jquery.com/jquery-1.6.1.min.js" type="text/javascript"></script>
<script src="http://owdocs.com/beta/rangy/rangy-core.js" type="text/javascript"></script>
<script src="http://owdocs.com/beta/rangy/rangy-selectionsaverestore.js" type="text/javascript"></script>
<style>
#mainEditableDiv {
	width: 8.5in;
	height: 11in;
}
</style>
</head>

<body onload="owdInit()">
<div id=mainEditableDiv contenteditable=true>
<? echo $docBaseText; ?>
</div>
<div id=docRev style="display:none"><? echo $docLatestRevisionText ?></div>
<div id=docPatch style="display:none"><? echo $docPatchText ?></div>
<div id=docID style="display:none"><? echo $_GET['docID'] ?></div>
<button style="position: absolute; right: 0; top:0" onclick="openHTMLEditor()">Edit HTML</button>
<textarea id=rawHTML style="display:none; height: 500px; width: 800px"></textarea>
<button onclick="updateText()">Update HTML</button>
</body>
</html>

<?
$db = NULL;
?>
