var tmp = require('node-require.js-diff_match_patch');
var express = require('express');

var dmp = new tmp.diff_match_patch();

var app = express.createServer();
app.use(express.bodyParser());
app.post('/', function(req, res){
	res.header('Access-Control-Allow-Origin', '*');
  var text1 = req.param('text1', null);  // second parameter is default
  var text2 = req.param('text2', null);  // second parameter is default

  var d = dmp.diff_main(text1, text2);
  
  //res.write(dmp.diff_prettyHtml(d));
  //res.write('<br /><br />');
  var patches = dmp.patch_make(text1, text2);
  res.write(dmp.patch_toText(patches));
  
  res.end();
});

app.listen(9001);
