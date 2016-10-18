var tabspace;
chrome.storage.sync.get('tabspace', function (tabspace) {
	console.log(tabspace);
});

for (var i = 0; i < tabspace.blacklisted.length(); i++) {
	var re = new RegExp(tabspace.blacklisted[i]);
	
	if (re.test(window.location)) {
		window.location = "http://camlewwri.com/tabspace/block-page.html";
	}
}



