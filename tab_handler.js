//GLOBAL VARIABLES
var tabArray = [];


/*Add on click listener to button*/
var bttn1 = document.getElementById("saveTabspace");
if(bttn1){
bttn1.addEventListener('click', save_tabspace);
}

var checkStorage = document.getElementById("checkStorage");
if (checkStorage){
	checkStorage.addEventListener('click', check_LocalStorage);
}

function Tabspace(name, urls, blacklisted){
	this.name = name
	this.urls = urls;
	this.blacklisted = blacklisted;
}

function loadButtons(){
	
	chrome.storage.sync.get(null, function (Items) {			
			var i = 1;
			for(var obj in Items){								
				var curObj = Items[obj];				
				var newButton = document.createElement('button');

				newButton.id = 'tabspace' + i;
				document.getElementsByTagName('body')[0].appendChild(newButton);
				newButton.innerHTML = "tabspace " + i;			

				newButton.addEventListener('click', load_tabspace);
				i++;
			}			
		});	
}

function load_tabspace(){

	chrome.tabs.query({}, function (tabs) {
	    for (var i = 0; i < tabs.length; i++) {
	        chrome.tabs.remove(tabs[i].id);
	    }
	});	
	
	var currButton = this.id.toString();

	chrome.storage.sync.get(null, function(Items){
		for(var obj in Items){			
			var curObj = Items[obj];			

			if (curObj.name == currButton){
				console.log("name matched: " + curObj.name);
				console.log("this tabspaces urls: ");
				
				for(var url in curObj.urls){
					var curUrl = curObj.urls[url];
					console.log(curUrl);
					chrome.tabs.create({url: curUrl});
				}

			}	
		}
	});	
}

function getCount_Callback(newCount){
	count = newCount;
	console.log("in callback: " + count);

}

//returns the number of current tabspaces
function getCount(callback){
	count = 0;

	chrome.storage.sync.get(null, function(Items){		
		for (var obj in Items){				
			count++;			
		}
		callback(count);						
	});
}

function grabTabs_Callback(openTabs){
	tabArray = openTabs
	console.log("tabarray in callback:");
	console.log(tabArray);

	console.log("tabArray in callback:");
	console.log(tabArray);
	console.log("count in callback:");
	console.log(count);

	var createdTabspace = new Tabspace(name, tabArray, tempblacklist);		
	var newButton = document.createElement('button');
	newButton.id = 'tabspace' + count;
	var keyId = newButton.id.toString();
	createdTabspace.name = keyId;
	var save = {};
	save[keyId] = createdTabspace;
	document.getElementsByTagName('body')[0].appendChild(newButton);
	newButton.innerHTML = "tabspace " + count;


	chrome.storage.sync.set(save, function(){
		//console.log('createdTabspace saved');
	});					
}

function grabTabs(callback){
	var openTabs = [];

	//chrome.tabs.query({lastFocusedWindow:true}, callback);
	chrome.tabs.query({lastFocusedWindow: true}, function(returned_tabs){
		for (var i = 0; i < returned_tabs.length; i++) {
				openTabs.push(returned_tabs[i].url);						
		}	
		callback(openTabs);						
	});
	
}


var tempblacklist = ["twitter.com", "myspace.com"];
loadButtons();

function save_tabspace(){
	var tabs = [];
	var name = "default";	
	getCount(getCount_Callback);
	grabTabs(grabTabs_Callback);
						
}

function check_LocalStorage(){
	chrome.storage.sync.get(null, function (Items) {
		console.log(Items);
	});
}

function testText(string){
	var txtbox = document.getElementById('tbox');
	txtbox.innerHTML = string;	
}