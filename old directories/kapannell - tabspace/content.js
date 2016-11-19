// This file is executed on each new tab that is opened.

chrome.storage.local.get(null, function(curTS_Result){

	chrome.storage.sync.get(null, function (result) {
		
		var ts = result[curTS_Result.currentTabspace];
		for (var i = 0; i < ts.blocksArray.length; i++) {
			var re = new RegExp(ts.blocksArray[i]);
				
			if (re.test(window.location)) {
				window.location = "http://camlewwri.com/tabspace/block-page.html";
			}
		}
	});

});

