<?php

/////////////////////////////////////
// Checks if username is available //
/////////////////////////////////////

if (!isset ($_POST['username'])) die('0');
$username = $_POST['username'];

// remove inactive users
$sql = "DELETE FROM users WHERE last_activity < datetime('now', 'localtime', '-10 second')";
$result = sqlite_query ($db, $sql);

// load users
$sql = "SELECT username FROM users WHERE username='".sqlite_escape_string($username)."'";
$result = sqlite_query ($db, $sql);
$row = sqlite_fetch_array($result);
if ($row) die('0');

die('1');