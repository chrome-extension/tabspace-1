// This file is executed on each new tab that is opened.

chrome.storage.local.get(null, function (result) {
	console.log(result);
	var ts = result.tabspaces[result.currentTabspace];
	for (var i = 0; i < ts.blocksArray.length; i++) {
		var re = new RegExp(ts.blocksArray[i]);
			
		if (re.test(window.location)) {
			window.location = "http://camlewwri.com/tabspace/block-page.html";
		}
	}
});