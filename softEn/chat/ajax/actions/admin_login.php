<?php

/////////////////
// Admin login //
/////////////////

// Check if admin password is correct
if (ADMIN_PASSWORD == '') die('0');
if (isset($_POST['password']) && $_POST['password'] == ADMIN_PASSWORD) die('1');


die('0');
