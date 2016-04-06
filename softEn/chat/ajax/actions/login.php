<?php

/////////////////////////////////////
// Logs the user into the chatroom //
/////////////////////////////////////

// validation
if (!isset($_POST['username'])) die('0');

$username = $_POST['username'];
$username = str_replace("\t", " ", $username);

// remove inactive users
$sql = "DELETE FROM users WHERE last_activity < datetime('now', 'localtime', '-10 second')";
$result = sqlite_query ($db, $sql);

// remove old bans
$sql = "DELETE FROM bans WHERE time < datetime('now', 'localtime', '-1 hour')";
$result = sqlite_query ($db, $sql);

// check if user is banned
$sql = "SELECT ip FROM bans WHERE ip = '".$_SERVER['REMOTE_ADDR']."'";
$result = sqlite_query ($db, $sql);
$row = sqlite_fetch_object($result);
if ($row) die ('-1'); // banned

// log user in
$sql = "INSERT INTO users (username, last_activity) VALUES ('".sqlite_escape_string($username)."', datetime('now', 'localtime'))";
sqlite_query ($db, $sql);
die('1');