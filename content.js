// var tabspaces = [];
// var blist;
// chrome.storage.sync.get('tabspace', function (Items) {
// 	console.log(Items);
// 	tabspaces.push(Items);

// 	console.log(tabspaces[0].tabspace[0].blacklisted);
// 	blist = tabspaces[0].tabspace[0].blacklisted;

// 	console.log(blist);

// for (var i = 0; i < tabspaces[0].tabspace[0].blacklisted.length; i++) {
// 	var re = new RegExp(tabspaces[0].tabspace[0].blacklisted[i]);
	
// 	if (re.test(window.location)) {
// 		window.location = "http://camlewwri.com/tabspace/block-page.html";
// 	}
// }
// });
console.log("HIHIHIHIH");

var count = 0;

function getCount_Callback(){
	count++;
	
}

function getCount(callback){
	//getCount_Callback();
	callback();
}

getCount(getCount_Callback);
//alert(count);


