<?php

//////////////////////////
// Returns current date //
//////////////////////////

$sql = "SELECT datetime('now', 'localtime') as date";
$result = sqlite_query ($db, $sql);
$row = sqlite_fetch_object($result);

die($row->date);