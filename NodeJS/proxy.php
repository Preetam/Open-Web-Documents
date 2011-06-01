<?php
//extract data from the post
extract($_POST);

//set POST variables
$url = 'http://localhost:9001';
$fields = array(
			'text1'=>urlencode($text1),
			'text2'=>urlencode($text2)
		//	'title'=>urlencode($title),
		//	'company'=>urlencode($institution),
		//	'age'=>urlencode($age),
		//	'email'=>urlencode($email),
		//	'phone'=>urlencode($phone)
		);

//url-ify the data for the POST
foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
rtrim($fields_string,'&');

//open connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL,$url);
curl_setopt($ch,CURLOPT_POST,count($fields));
curl_setopt($ch,CURLOPT_POSTFIELDS,$fields_string);

//execute post
$result = curl_exec($ch);

echo $result;

//close connection
curl_close($ch);
?>
