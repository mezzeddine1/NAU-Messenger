// Prevents from HTML injection.
function escape_html (str)
{
	if (!str) return '';

	return $('<span/>').text(str).html();
}

/////////////////////
// Main Chat class //
/////////////////////

var Chat =
{
	_already_inited: false,
	_username: null,
	_is_admin: false,
	_admin_password: '',
	_prelogin: [],
	_last_message_date: 0,
	_last_sent_message_date: 0,

	// Returns current SQLite date
	get_date: function()
	{
		var timestamp = new Date().getTime();
		$.get('ajax/chat.php', {'action': 'get_date', time: timestamp}, function(date)
		{
			Chat._last_message_date = date;
			Chat.prelogin('get_date');
		});
	},

	// Loads users list
	load_users: function()
	{
		var timestamp = new Date().getTime();
		$.get('ajax/chat.php', {'action': 'get_users', time: timestamp}, function(users)
		{
			if (users == '' || users == '0')
			{
				// No users yet.
				Chat.prelogin('load_users');
				return;
			}

			users = users.split("\t\t").sort();
			var user;
			for (var i in users)
			{
				user = users[i].split("\t");
				Chat._show_new_user(user[0]);
			}
			Chat.prelogin('load_users');
		});
	},

	// Updated users list
	update_users_list: function()
	{
		var timestamp = new Date().getTime();
		$.get('ajax/chat.php', {'action': 'get_users', time: timestamp}, function(users)
		{
			users = users.split("\t\t").sort();
			var user;
			$('#users-list ul').html('');
			for (var i in users)
			{
				user = users[i].split("\t");
				Chat._show_new_user(user[0]);
			}
		});
	},

	// Pings server (used very often)
	ping: function()
	{
		var timestamp = new Date().getTime();
		$.get('ajax/chat.php', {'action': 'ping', 'last_message_date': Chat._last_message_date, 'username': Chat._username, time: timestamp}, function(messages)
		{
			if (messages == '' || messages == '0')
			{
				// No new messages.
				return;
			}

			if (messages == '-1')
			{
				// User has been kicked.
				window.location.reload();
				return;
			}

			if (/^kicked/.test(messages))
			{
				messages = messages.replace(/^kicked/, '');
				alert('You have been kicked! Reason:' + "\n" + messages);
				window.location.reload();
				return;
			}

			if (/^banned/.test(messages))
			{
				messages = messages.replace(/^banned/, '');
				alert('You have been banned! Reason:' + "\n" + messages);
				window.location.reload();
				return;
			}

			messages = messages.split("\t\t");
			var message;
			for (var i in messages)
			{
				if (!messages[i]) break;
				message = messages[i].split("\t");
				Chat._show_new_message(message[0], escape_html(message[1]), escape_html(message[2]));
			}
			Chat._last_message_date = message[0];
		});
	},

	// Decides if current user should be logged in
	prelogin: function(event)
	{
		this._prelogin.push(event);
		if (this._prelogin.length == 2)
		{
			this.login();
		}
	},

	// Logs current user in
	login: function ()
	{
		var timestamp = new Date().getTime();
		$.post('ajax/chat.php', {'action': 'login', 'username': Chat._username, time: timestamp}, function(response)
		{
			if (response === '-1')
			{
				// User is banned.
				return false;
			}

			if (response === '1')
			{
				Chat._show_new_user (Chat._username);
				Chat._show_new_message (false, '', 'Welcome, <strong>'+Chat._username+'</strong>!', 'system');
			}
		});
	},

	// Sends chat message to everyone
	send_message: function()
	{
		var timestamp = new Date().getTime();

		// flood control
		if (timestamp < (this._last_sent_message_date + 1200))
		{
			return;
		}

		this._last_sent_message_date = timestamp;

		var username = this._username;
		var message = $('#message').val();
		if (parseInt(message.length) > 2000)
		{
			alert('Your message is too long.');
			return;
		}

		if (/^\s*$/.test(message))
		{
			return;
		}

		$('#message').val('').focus();

		$.post('ajax/chat.php', {'action': 'send_message', 'message': message, 'username': username, time: timestamp}, function() {});
	},

	// Shows new user on the list
	_show_new_user: function(username)
	{
		$('#users-list li.empty').remove();
		$('#users-list ul').append('<li></li>');
		$('#users-list li:last-child')
			.html('<span>' +
			      escape_html(username) +
			      '</span>' +
				  (this._is_admin ?
					  ' <a class="admin kick" href="#" title="Kick"></a> ' +
					  ' <a class="admin ban" href="#" title="Ban for one hour"></a>'
		           : '')
			);

		if (this._is_admin && username != this._username)
		{
			$('#users-list li:last-child')
				.hover(
					function() { $(this).find('a.admin').css('display', 'inline-block'); },
					function() { $(this).find('a.admin').css('display', 'none'); }
				);

			// bind "kick" and "ban" buttons
			$('#users-list li:last-child a.admin.kick').click(function() { Chat.kick($(this).parent().find('span').text()); });
			$('#users-list li:last-child a.admin.ban').click(function() { Chat.ban($(this).parent().find('span').text()); });
		}

		$('#users-list li:even').attr('class', 'odd');
		$('#users-list li:odd').removeAttr('class');
	},

	// Shows new message in chat window
	_show_new_message: function(date, username, message, system)
	{
		var h,m;
		date = new String(date);
		h  = date.substring(11,13);
		m = date.substring(14,16);
		date = h+':'+m;

		/* message body replacements */
		// clickable urls
		message = message.replace(
			/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/,
			"<a href=\"$1\">$1</a>"
		);

		// clickable emails
		message = message.replace(
			/(([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?))/i,
			"<a href=\"mailto:$1\">$1</a>"
		);


		var content = '';

		if (!system)
		{
			content += '<span class="time">&lt;'+date+'&gt;</span> ';
			content += '<span class="author">'+username+':</span> ';
		}
		content += '<span class="message">'+message+'</span>';
		$('#chat-window li.empty').remove();
		$('#chat-window ul').append( (username == this._username) ? '<li class="own"></li>' : '<li></li>');
		$('#chat-window li:last-child').html(content);

		if (system)
		{
			$('#chat-window li:last-child').attr('class', 'system');
		}

		$('#chat-window ul').scrollTop($('#chat-window ul')[0].scrollHeight);
	},

	// function scales #messages-list and #users-list
	// to fit the window height perfectly
	scale_window: function()
	{
		var window_h = $(window).height();
		var new_h = window_h - $('#header').height() - $('#send-message').height() - 1;

		$('#chat-window ul, #users-list ul').css('height', new_h + 'px');
		$('#chat-window ul').scrollTop($('#chat-window ul')[0].scrollHeight);
	},

	// Kicks the user
	kick: function(username)
	{
		if (this._is_admin == false) return false;
		if (username == this._username) return false;
		if (!confirm('Do you really want to kick: '+username+'?')) return false;

		var message = prompt('Kick reason (visible to the kicked user):');
		if (!message) return false;

		$('#users-list li span:contains("'+username+'")').each(function()
		{
			if ($(this).text() === username)
			{
				// kick the user.
				var el = $(this);
				var timestamp = new Date().getTime();
				$.post('ajax/chat.php', {'action': 'kick', 'message': message, 'username': username, 'password': Chat._admin_password, time: timestamp}, function(response)
				{
					if (response == '1')
					{
						el.parent().fadeOut();
						Chat._show_new_message (false, '', '<strong>'+username+'</strong> has been kicked.', 'system');
					}
				});
			}
		});
	},

	// Bans the user
	ban: function(username)
	{
		if (this._is_admin == false) return false;
		if (username == this._username) return false;
		if (!confirm('Do you really want to ban: '+username+'?')) return false;

		var message = prompt('Ban reason (visible to the banned user):');
		if (!message) return false;

		$('#users-list li span:contains("'+username+'")').each(function()
		{
			if ($(this).text() === username)
			{
				// ban the user.
				var el = $(this);
				var timestamp = new Date().getTime();
				$.post('ajax/chat.php', {'action': 'ban', 'message': message, 'username': username, 'password': Chat._admin_password, time: timestamp}, function(response)
				{
					if (response == '1')
					{
						el.parent().fadeOut();
						Chat._show_new_message (false, '', '<strong>'+username+'</strong> has been banned for one hour.', 'system');
					}
				});
			}
		});
	},

	// Starts the chat
	init: function(username)
	{
		if (this._already_inited) return false;
		if (/^\s*$/.test(username)) return false;

		var timestamp = new Date().getTime();
		$.post('ajax/chat.php', {'action': 'check_username', 'username': username, time: timestamp}, function(username_available)
		{
			if (username_available == '0')
			{
				$('#error').text('Username already exists. Please choose another username.').hide().fadeIn();
				return;
			}


			var timestamp = new Date().getTime();
			$.post('ajax/chat.php', {'action': 'check_is_banned', 'username': username, time: timestamp}, function(is_banned)
			{
				if (is_banned == '1')
				{
					$('#error').text('Your IP has been banned for one hour.').hide().fadeIn();
					return;
				}


				var timestamp = new Date().getTime();
				$('body').load('chat_window.html?time='+timestamp, function()
				{
					this._already_inited = true;
					Chat._username = username;

					$(window).bind('resize', function()
					{
						Chat.scale_window();
					});
					setTimeout(function(){Chat.scale_window();}, 200);

					// scale window few times due to IE bug
					if ($.browser.msie && parseInt($.browser.version) <= 7)
					{
						var scale_counter = 8;
						while (--scale_counter) Chat.scale_window();
					}

					// bind "Change skin" buttons
					$('#skins a').click(function()
					{
						var skin = $(this).attr('class');
						$('link[rel=stylesheet][href^="css/skins"]').attr('href', 'css/skins/'+skin+'.css');
						return false;
					});


					// bind "Admin" button
					$('#admin a').click(function()
					{
						if (Chat._is_admin)
						{
							alert('You are already logged in.'+"\n"+'To logout, refresh your browser window.');
							return false;
						}

						var password = prompt('Enter password:');
						if (!password)  return false;
						$.post('ajax/chat.php', {'action': 'admin_login', 'password': password, time: timestamp}, function(response)
						{
							if (response == '1')
							{
								alert('Logged successfully.');
								Chat._is_admin = true;
								Chat._admin_password = password;
								Chat.update_users_list();
							}
							else if (response == '0')
							{
								alert('Wrong password.');
							}
						});

						return false;
					});


					// focus message input
					// setTimeout used because of IE7 bug
					setTimeout(function(){$('#message').focus();}, 500);

					$('#send-message button').click(function()
					{
						Chat.send_message();
					});
					$('#message').keydown(function(e)
					{
						var key = e.charCode || e.keyCode || 0;

						if (key === 13)
						{
							Chat.send_message();
						}
					});

					Chat.get_date();
					Chat.load_users();

					setInterval(function() { Chat.ping(); }, 2000);
					setInterval(function() { Chat.update_users_list(); }, 5000);
				});
			});
		});
	}
};

// Binds login window elements
$(document).ready(function()
{
	// focus username input
	// setTimeout used because of IE7 bug
	setTimeout(function() {$('#username').focus();}, 200);

	$('input[type=submit]').click(function()
	{
		Chat.init($('input#username').val());
	});
	$('input#username').keydown(function(e)
	{
		if (e.keyCode === 13)
		{
			Chat.init($('input#username').val());
		}
	});
});
