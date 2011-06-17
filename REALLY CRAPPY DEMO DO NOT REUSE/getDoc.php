<?
try {
	$db = new PDO('sqlite:database1.sqlite');

	$result = $db->query("SELECT * FROM Documents WHERE docID=".$_GET['docID']);
	$docRow;

	foreach($result as $row) {
		$docRow = $row;
	}

	//print_r($docRow);
	echo json_encode($docRow);
	
}
catch(PDOException $e) {
	exit($e->getMessage());
}
?>
