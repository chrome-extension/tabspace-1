
//Add on click listener to 'create new tabspace' button
//This button will grab current open tabs and save them as tabspaceX
//where X is 1,2,3,4....etc
var newTSbttn = document.getElementById("saveTabspace");
if(newTSbttn){
newTSbttn.addEventListener('click', save_tabspace);
}

//used for debugging, this button prints out the values in storage to the console
var checkStorage = document.getElementById("checkStorage");
if (checkStorage){
	checkStorage.addEventListener('click', check_LocalStorage);
}

//simple tabspace class
function Tabspace(name, urls, blacklisted){
	this.name = name
	this.urls = urls;
	this.blacklisted = blacklisted;
}

//reads all values from storage and loads them into their associated button 
//in the popup menu
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

//simple function that deletes open tabs and loads tabspace of the button clicked
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
				chrome.windows.create({url : curObj.urls});				
			}	
		}
	});	
}

//check how many tabspaces have been saved and set that number to count
function getCount_Callback(newCount){
	count = newCount;
	console.log("in getCount_callback: " + count);
}

//returns the number of current tabspaces
function getCount(callback){
	count = 1;

	chrome.storage.sync.get(null, function(Items){		
		for (var obj in Items){				
			count++;			
		}
		callback(count);						
	});
}

//create a new tabspace with the urls of our open tabs
//save these tabs to storage in tabspaceX format
function grabTabs_Callback(openTabs){	
	var tempblacklist = ["twitter.com", "myspace.com"];

	var createdTabspace = new Tabspace(name, openTabs, tempblacklist);		
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

//grab the current open tabs from the focused window.
function grabTabs(callback){
	var openTabs = [];
	
	chrome.tabs.query({lastFocusedWindow: true}, function(returned_tabs){
		for (var i = 0; i < returned_tabs.length; i++) {
				openTabs.push(returned_tabs[i].url);						
		}	
		callback(openTabs);						
	});
	
}


loadButtons();

//main function that is called when 'save tabspace' button is clicked
function save_tabspace(){
	//var tabs = [];
	var name = "default";	
	getCount(getCount_Callback);
	grabTabs(grabTabs_Callback);
						
}

//used for debug
function check_LocalStorage(){
	chrome.storage.sync.get(null, function (Items) {
		console.log(Items);
		for(var url in Items.tabspace1.urls){
			testText(Items.tabspace1.urls[url]);
		}		
	});
}

//used for debug
function testText(string){
	var txtbox = document.getElementById('tbox');
	txtbox.innerHTML += string + "\n\n\n";	
}