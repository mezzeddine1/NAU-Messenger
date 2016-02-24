<?php

//check if session is not registered, redirect to main page
//pull this code in first line of web page

session_start();
if(!session_is_registered(myusername)){
	header("location:main_login.php")
}
?>

<html>
<body>
	Login Successful
</body>
</html>
