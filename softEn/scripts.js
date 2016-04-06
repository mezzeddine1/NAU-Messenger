// bind "open chat" link
window.onload = function()
{
	document.getElementById('open_chat').onclick = function()
	{
		window.open('./chat/', 'Chat', 'width=600,height=400,resizable=yes,scrollbars=yes,toolbar=no,directories=no,status=no,menubar=no');
		return false;
	};
};
