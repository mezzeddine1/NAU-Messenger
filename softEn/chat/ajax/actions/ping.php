<?php

//////////
// PING //
//////////

// Ping is sent by every user very often
// which tells the server they haven't
// closed chat window yet.

// validation
if (!isset ($_GET['username'])) die('0');
if (!isset ($_GET['last_message_date'])) die('0');

$username = $_GET['username'];
$username = str_replace("\t", ' ', $username);

$last_message_date = $_GET['last_message_date'];


// check if user is kicked
$sql = "SELECT username, is_kicked, is_banned, kick_ban_message FROM users WHERE username = '".sqlite_escape_string($username)."'";
$result = sqlite_query ($db, $sql);
$row = sqlite_fetch_object($result);
if (!$row) die ('-1');
if ($row->is_kicked == '1') die ("kicked"."\t".$row->kick_ban_message);
if ($row->is_banned == '1') die ("banned"."\t".$row->kick_ban_message);


// update user's last_activity
$sql = "UPDATE users SET last_activity = datetime('now', 'localtime') WHERE username = '".sqlite_escape_string($username)."'";
$result = sqlite_query ($db, $sql);


// get new messages
$sql = "SELECT date, username, message
          FROM messages
         WHERE strftime('%s', date, 'utc') > ".strtotime($last_message_date)."
      ORDER BY date ASC";

$result = sqlite_query ($db, $sql);

$s = '';
while ($row = sqlite_fetch_object($result))
{
	$s .= $row->date;
	$s .= "\t";
	$s .= $row->username;
	$s .= "\t";
	$s .= $row->message;
	$s .= "\t\t";
}

$s = preg_replace ("/\t\t$/", '', $s);

die($s);