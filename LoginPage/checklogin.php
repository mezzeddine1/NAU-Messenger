<?php

$host="localhost"; //host name
$username=""; //mysql username
$password=""; //mysql password
$db_name="test";
$tbl_name="members";

//connect to server and select database
mysql_connect("$host", "$username", "$password")or die("cannot connect");
mysql_select_db("$db_name")or die("cannot select DB");

//username and password sent from form
$myusername=$_POST['myusername'];
$mypassword=$_POST['mypassword'];

$myusername = stripslashes($myusername);
$mypassword = stripslashes($mypassword);
$myusername = mysql_real_escape_string($myusername);
$mypassword = mysql_real_escape_string($mypassword);
$sql="SELECT * FROM $tbl_name WHERE username='$myusername' and password='$mypassword'";
$result=mysql_query($sql);

//mysql_num_row is counting table row
$count=mysql_num_rows($result);

//if result matched $myusername and $mypassword, table row must be 1 row
if($count==1){

	//register $myusername, $mypassword and redirect to file "login_success.php"

	session_register("myusername");
	session_register("mypassword");
	header("location:login_success.php");
}

else{
	echo "Wrong username or password";
}

?>
