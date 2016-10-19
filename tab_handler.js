
var spaces = [];

chrome.storage.sync.get('tabspace', function (Items) {
		console.log(Items);
		spaces.push(Items.tabspace);
		for (var i = 0; i < Items.tabspace.length; i++) {
			var newButton = document.createElement('button');
			newButton.id = 'tabspace' + i;
			document.getElementsByTagName('body')[0].appendChild(newButton);
			newButton.innerHTML = "tabspace " + i;

			newButton.addEventListener('click', load_tabspace);
		};
	});

var txtbox = document.getElementById('tbox');
txtbox.innerHTML = "IN THE TEXT";
function load_tabspace(){
	//var newWindow = window.open();	
	console.log(spaces);
	txtbox.innerHTML = "IN THE TEXT TOO";
	// chrome.tabs.query({}, function (tabs) {
	//     for (var i = 0; i < tabs.length; i++) {
	//         chrome.tabs.remove(tabs[i].id);
	//     }
	// });
	for (var i = 0; i < spaces[0][0].urls.length; i++) {
		console.log("spaces" + i);
		console.log(spaces[0][0].urls[i]);
		tempUrl = spaces[0][0].urls[i];
		txtbox.innerHTML += tempUrl + "\n";
		//chrome.tabs.create({url: tempUrl});
	}

	
}


/*Add on click listener to button*/
var bttn1 = document.getElementById("saveTabspace");
if(bttn1){
bttn1.addEventListener('click', save_tabspace);
}

var checkStorage = document.getElementById("checkStorage");
if (checkStorage){
	checkStorage.addEventListener('click', check_LocalStorage);
}

function Tabspace(urls, blacklisted){
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

var tempblacklist = ["twitter.com", "myspace.com"];

function save_tabspace(){
	var tabs = [];

	for (var i = 0; i < returned_tabs.length; i++) {
				tabs.push(returned_tabs[i].url);						
	}		
			
	console.log("# of tabs: " + tabs.length);
	var createdTabspace = new Tabspace(tabs, tempblacklist);
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


