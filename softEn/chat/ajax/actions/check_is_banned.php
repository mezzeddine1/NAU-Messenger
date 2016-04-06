<?php

////////////////////////////////////////
// Checks if the user has been banned //
////////////////////////////////////////

if (!isset ($_POST['username'])) die('1');
$username = $_POST['username'];

// remove old bans
$sql = "DELETE FROM bans WHERE time < datetime('now', 'localtime', '-1 hour')";
$result = sqlite_query ($db, $sql);

// check if user is banned
$sql = "SELECT ip FROM bans WHERE ip = '".$_SERVER['REMOTE_ADDR']."'";
$result = sqlite_query ($db, $sql);
$row = sqlite_fetch_object($result);
if ($row) die ('1'); // banned

die('0');