<?php

////////////////////////
// Sends chat message //
////////////////////////

// validation
if (!isset($_POST['username']) || !isset($_POST['message'])) die('0');

// username
$username = mb_substr ($_POST['username'], 0, 20);
$username = str_replace("\t", ' ', $username);

// check if user is kicked
$sql = "SELECT username FROM users WHERE username = '".sqlite_escape_string($username)."'";
$result = sqlite_query ($db, $sql);
$row = sqlite_fetch_object($result);
if (!$row) die (''); // kicked

// chat message
$message = mb_substr ($_POST['message'], 0, 2000);
$message = wordwrap ($message, 90, ' ', true);
$message = str_replace("\t", ' ', $message);

// insert new message
$sql = "INSERT INTO messages (username, message, date) VALUES
        ('".sqlite_escape_string($username)."', '".sqlite_escape_string($message)."', datetime('now', 'localtime'))";
sqlite_query ($db, $sql);

// remove old messages
$sql = "DELETE FROM messages WHERE date < datetime('now','localtime','-1 minute')";
sqlite_query ($db, $sql);

die('1');