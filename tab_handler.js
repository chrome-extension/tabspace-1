// $(document).ready(function(){

// function load_tabspace(){
// 	alert("we in here");
// 	chrome.tabs.query(currentWindow, function(arrayOfTabs){
// 		var tab = arrayOfTabs[0];
// 		var url = tab.url;
// 		window.alert(url);
// 	});
// }

// });

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("save_tabspace").addEventListener("click", save_tabspace);
});

console.log("a;slkdfj;");

function save_tabspace(){
	
	console.log("we in here");


	chrome.tabs.query(currentWindow, function(arrayOfTabs){
		var tab = arrayOfTabs[0];
		var url = tab.url;
		alert(url);
	});
}
