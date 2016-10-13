$(document).ready(function(){

function load_tabspace(){
	alert("we in here");
	chrome.tabs.query(currentWindow, function(arrayOfTabs){
		var tab = arrayOfTabs[0];
		var url = tab.url;
		window.alert(url);
	});
}

});