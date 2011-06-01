<html>
<head>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js" type='text/javascript'></script>

<style>
.text {
	width: 5in;
	height: 3in;
}
</style>

<script type='text/javascript'>
function gV(id) {
	return document.getElementById(id).value;
}

function ajax() {
$.ajax({
   type: "POST",
   url: "http://owdocs.com/test/proxy.php",
   data: "text1="+encodeURIComponent(gV('text1'))+"&text2="+encodeURIComponent(gV('text2')),
   success: function(msg){
     $("#output").html(msg);
   }
 });
}
</script>
</head>

<body onload="ajax();">
<textarea id=text1 class=text disabled>// Server has this...
// Hello World program in C

#include<stdio.h>

int main()
{
    printf("Hello World");
    return 0;
}</textarea>

<textarea id=text2 class=text>// You have this...
// Hello World program in C++

#include <iostream>
using namespace std;

int main()
{
  cout << "Hello World";
  return 0;
}</textarea>

<button onclick="ajax();">GO!</button>
<br />
<b>This is the difference...</b>
<br />
<br />
<div id=output style="width: 7in">

</div>
</body>

</html>
