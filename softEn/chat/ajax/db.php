<?php

//////////////////////////////////
// Connect to database (SQLite) //
//////////////////////////////////

if (!$db = sqlite_open ('chatdb'))
{
	die('Database problem. Please try again later.');
}

function sqlite_table_exists ($db, $mytable)
{
	$result = sqlite_query($db, "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='$mytable'");
	$count = intval(sqlite_fetch_single($result));
	return $count > 0;
}

if (sqlite_table_exists($db, 'messages') == false)
{
	$sql = 'CREATE TABLE messages (username VARCHAR(50), message TEXT, date DATE)';
	sqlite_query ($db, $sql);
}

if (sqlite_table_exists($db, 'users') == false)
{
	$sql = 'CREATE TABLE users (username VARCHAR(50) UNIQUE, last_activity DATE, is_kicked INTEGER DEFAULT 0, is_banned INTEGER DEFAULT 0, kick_ban_message VARCHAR(100))';
	sqlite_query ($db, $sql);
}

if (sqlite_table_exists($db, 'bans') == false)
{
	$sql = 'CREATE TABLE bans (ip VARCHAR(15), time DATE)';
	sqlite_query ($db, $sql);
}
