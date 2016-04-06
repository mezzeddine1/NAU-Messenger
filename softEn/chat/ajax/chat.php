<?php

// action tells us what we need to do
if (!isset($_REQUEST['action'])) die('0');
$action = $_REQUEST['action'];

define ('ADMIN_PASSWORD', 'admin123');
define ('AJAX_PATH', './');
define ('ACTIONS_PATH', './actions/');


// strip slashes for incoming variables if needed

if (get_magic_quotes_gpc())
{
    function stripslashes_gpc(&$value)
    {
        $value = stripslashes($value);
    }

    array_walk_recursive($_GET, 'stripslashes_gpc');
    array_walk_recursive($_POST, 'stripslashes_gpc');
    array_walk_recursive($_COOKIE, 'stripslashes_gpc');
    array_walk_recursive($_REQUEST, 'stripslashes_gpc');
}

////////////////////////////////////////////
// Maximum user's inactivity (in seconds) //
////////////////////////////////////////////

// `inactivity` does NOT mean "not typing for X seconds"
// but is the amount of time that user's browser does not 
// send PING message
//
// normally it pings every 2 seconds, so every reasonable
// time period above these 2 seconds (e.g. 5 or 10 seconds)
// should be enough to mark the user as inactive

define ('CHAT_INACTIVITY', 5);


/////////////////////////
// Connect to database //
/////////////////////////

require_once (AJAX_PATH . 'db.php');

//////////////////////////////
// Choose action to perform //
//////////////////////////////

switch ($action)
{
	case 'ping':
		require_once(ACTIONS_PATH.'ping.php');
		break;

	case 'admin_login':
		require_once(ACTIONS_PATH.'admin_login.php');
		break;

	case 'check_username':
		require_once(ACTIONS_PATH.'check_username.php');
		break;

	case 'check_is_banned':
		require_once(ACTIONS_PATH.'check_is_banned.php');
		break;

	case 'get_date':
		require_once(ACTIONS_PATH.'get_date.php');
		break;

	case 'get_users':
		require_once(ACTIONS_PATH.'get_users.php');
		break;

	case 'send_message':
		require_once(ACTIONS_PATH.'send_message.php');
		break;

	case 'login':
		require_once(ACTIONS_PATH.'login.php');
		break;

	case 'kick':
		require_once(ACTIONS_PATH.'kick.php');
		break;

	case 'ban':
		require_once(ACTIONS_PATH.'ban.php');
		break;
}

die('0');
