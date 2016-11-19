// This file is executed on each new tab that is opened.

chrome.storage.local.get(null, function(curTS_Result){

	chrome.storage.sync.get(null, function (result) {
		
		var blocked = false;
		
		var ts = result[curTS_Result.currentTabspace];
		for (var i = 0; i < ts.blocksArray.length; i++) {
			var re = new RegExp(ts.blocksArray[i]);
				
			if (re.test(window.location)) {
				blocked = true;
			}
		}
		
		if (blocked) {
		// Delete all html nodes on the page
			while (document.firstChild) {
				document.removeChild(document.firstChild);
			}	
		// Construct block page
			var htmlNode = document.createElement("html");
			htmlNode.innerHTML = "<body><h1>PAGE BLOCKED</h1></body>"
			document.appendChild(htmlNode);
		}
	});

});

