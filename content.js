

function blockPages(){
	var blist;
	
	chrome.storage.sync.get(null, function (Items) {
		console.log(Items);		
		blist = Items[0].blacklisted;
		alert(blist);
		
		for (var i = 0; i < Items[0].blacklisted.length; i++) {
			var re = new RegExp(Items[0].blacklisted[i]);
			
			if (re.test(window.location)) {
				window.location = "http://camlewwri.com/tabspace/block-page.html";
			}
		}
	});
}

blockPages();
