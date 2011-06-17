<?
//$docLatestRevision = $_REQUEST['docID'];

try {
	$db = new PDO('sqlite:database1.sqlite');

	$result = $db->query("SELECT * FROM Documents WHERE docID=".$_REQUEST['docID']);

	$docBaseText = "";
	$docPatchText = "";
	$docLatestRevisionText = "";

	foreach($result as $row) {
		//echo $row['docID']."  ".$row['docBase']."  ".$row['docPatch'];
		$docBaseText = $row['docBase'];
		$docPatchText = $row['docPatch'];
		$docLatestRevisionText = $row['docLatestRevision'];
		echo json_encode($row);
	}
	//echo $docLatestRevisionText;
}
catch(PDOException $e) {
	exit($e->getMessage());
}
?>
