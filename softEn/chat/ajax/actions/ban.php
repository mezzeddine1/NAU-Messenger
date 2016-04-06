<?php

///////////////////
// Bans the user //
///////////////////

// Check if admin password is correct
if (ADMIN_PASSWORD == '') die('0');
if (!isset($_POST['password']) || $_POST['password'] !== ADMIN_PASSWORD) die('0');

// validation
if (!isset($_POST['username'])) die('0');
if (!isset($_POST['message'])) die('0');

$username = $_POST['username'];
$username = str_replace("\t", " ", $username);
$message  = $_POST['message'];

// kick the user
$sql = "UPDATE users SET is_banned=1, kick_ban_message='".sqlite_escape_string($message)."' WHERE username = '".sqlite_escape_string($username)."'";
sqlite_query ($db, $sql);

// ban the user
$sql = "INSERT INTO bans (ip, time) VALUES ('".$_SERVER['REMOTE_ADDR']."', datetime('now', 'localtime'))";
sqlite_query ($db, $sql);

die('1');