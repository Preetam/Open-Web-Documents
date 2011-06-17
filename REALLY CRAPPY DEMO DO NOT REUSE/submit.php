<?
try {
	$db = new PDO('sqlite:database1.sqlite');

	$docID = $_REQUEST['docID'];
	$docPatch = $_REQUEST['docPatch'];
	$docLatestRevision = $_REQUEST['docLatestRevision'];

	$result = $db->query("SELECT docLatestRevision FROM Documents WHERE docID = ".$docID);

	foreach($result as $row) {
		if(intval($row['docLatestRevision']) >= intval($docLatestRevision)) {
			header("HTTP/1.1 400 Bad Request");
			die();
		}
	}

	$db->exec("UPDATE Documents SET docPatch='".$docPatch."',docLatestRevision=".$docLatestRevision." WHERE docID=".$docID);
}

catch(PDOException $e) {
	exit($e->getMessage());
}
?>
