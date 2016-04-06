<?php

/////////////////////////////////////////
// Returns users available in chatroom //
/////////////////////////////////////////

// remove inactive users
$sql = "DELETE FROM users WHERE last_activity < datetime('now', 'localtime', '-10 second')";
$result = sqlite_query ($db, $sql);

// load users
$sql = "SELECT username
          FROM users
      ORDER BY username ASC";

$result = sqlite_query ($db, $sql);

$s = '';
while ($row = sqlite_fetch_object($result))
{
	$s .= $row->username;
	$s .= "\t\t";
}

$s = preg_replace ("/\t\t$/", '', $s);

die($s);