
/*Add on click listener to button*/
var bttn1 = document.getElementById("saveTabspace");
if(bttn1){
bttn1.addEventListener('click', save_tabspace);
}

var checkStorage = document.getElementById("checkStorage");
if (checkStorage){
	checkStorage.addEventListener('click', check_LocalStorage);
}

function Tabspace(urls){
	this.urls = urls;
	this.blacklisted = blacklisted;
}

var tabspaces = []
var returned_tabs = [];

chrome.tabs.query({
		lastFocusedWindow: true
	},  function(arrayOfTabs){
			returned_tabs = arrayOfTabs;			
});


function save_tabspace(){
	var tabs = [];

	for (var i = 0; i < returned_tabs.length; i++) {
				tabs.push(returned_tabs[i].url);						
	}		
			
	console.log("# of tabs: " + tabs.length);
	var createdTabspace = new Tabspace(tabs);
	tabspaces.push(createdTabspace);
	console.log("createdTabspace: " + createdTabspace.urls);
	console.log("tabspaces: " + tabspaces);
	
	var newButton = document.createElement('button');
	newButton.id = 'tabspace' + tabspaces.length;
	console.log("newbutton id: " + newButton.id);
	document.getElementsByTagName('body')[0].appendChild(newButton);
	newButton.innerHTML = "tabspace " + tabspaces.length;



	chrome.storage.sync.set({'tabspace': tabspaces}, function(){
		console.log('tabspace saved');
	});

}

//var dynamic_Button = document.getElementById('')


function check_LocalStorage(){
	chrome.storage.sync.get('tabspace', function (Items) {
		console.log(Items);
	});
}


