/*------Tabspace class ----------*/
function Tabspace(theName){
    this.name = theName;
    this.linksArray = [];
    this.blocksArray = [];
}

/*-On Click function to append a new Tabspace object to global array and save into chrome.storage 
Invokes displayButtons function afterwards to update button display on home page----------*/
function saveTS(){
    var substring = "https://";
    var name = document.getElementById("textbox-name").value;
    tabspace = new Tabspace(name);
    $("#list-add li").each(function() { 
        var fullSiteName = "";
        var sitename = $(this).text();
        
        if(sitename.includes(substring) !== true){           
            fullSiteName = substring.concat(sitename);            
        }else{
            fullSiteName = sitename;           
        }
        tabspace.linksArray.push(fullSiteName); 
    });
    $("#list-block li").each(function() { tabspace.blocksArray.push($(this).text()) });

    // chrome.storage.local.get(null, function(result){     //result always undefined, not used    
    //     var totalObjects = {};
    //     totalObjects[tabspace.name] = tabspace;
    //     chrome.storage.sync.set(totalObjects);        
    // });

    var totalObjects = {};
    totalObjects[tabspace.name] = tabspace;
    chrome.storage.sync.set(totalObjects);        
    //Append button to DOM
    var html = buildButton(name);
    
    $('#generateTabs').append(html);  
    //Set On Click attribute
    setButtonClick();
}

/*-Start up  function to load tabspaces from chrome.storage 
and display them as Buttons on the home page.
Invokes setButtonClick function afterwards to set On-Click attributes for the generated buttons -*/
function displayButtons(){
    chrome.storage.sync.get(null, function(result){
        $('#generateTabs').empty();

        console.log("in display button:", result);        
        for(objects in result){
            var tabObject = result[objects];
            console.log("tabObject: " , tabObject);
            var name = tabObject.name;
            var html = buildButton(name);
            $('#generateTabs').append(html);   
        }
        
    });
    setTimeout(setButtonClick, 1000);
}

function buildButton(name){
     return '<div class="col-xs-4 individualTS"' + 'title="' + name + '">' + '<input type="image"  id="tab-images" src="1.jpg"/>' + '<p>' + name + '</p>' + '</div>';            
}

/*-Function called after timeout to set On-Click attribute to generated Tabspace buttons.
Possibly do this async/more efficiently? ----------*/
function setButtonClick(){
    $(".individualTS").each(function(){            
        var name = this.title
        this.addEventListener("click", function(){
            displayLinks(name);
        }, false);
    });
}

/*-On-Click function called by tabspace buttons to display tabs saved in the linkArray attribute-*/
function displayLinks(name){      
    var key = name;

    chrome.tabs.query({}, function(tabs){
        var tabs_to_close = [];

        for (var i = 0; i < tabs.length; i++){            
            tabs_to_close.push(tabs[i]);
        }        
        
        chrome.storage.sync.get(null,function(result){
            console.log("result is: ", result);       
            if (result){
                var urls = result[key].linksArray;      
                                      
                for (url in urls){    
                    var tempUrl = urls[url];                  
                    
                    chrome.tabs.create({url : tempUrl});                           
                }
              
                chrome.storage.local.set({currentTabspace : name});
            }
            setTimeout(closeTabs(tabs_to_close), 1000);
        });
        
    });
}

function closeTabs(tabs_to_close){
    
    for(var j = 0; j < tabs_to_close.length; j++){                    
       chrome.tabs.remove(tabs_to_close[j].id);
    }
}

//Function to load edit page
function loadEditPage(){
    chrome.tabs.create({active: true, url: chrome.extension.getURL('editTS.html')});
}

////////////////////// debug tools
var checkStorage = document.getElementById("checkStorage");
if (checkStorage){
    checkStorage.addEventListener('click', check_LocalStorage);
}

function check_LocalStorage(){
    chrome.storage.sync.get(null, function (Items) {
        console.log("sync items: ", Items);              
    });

    chrome.storage.local.get(null, function(objects){
        console.log("local objects:", objects);
    });
}
//////////////////////// create tabspace from current tabs methods

var newTSbttn = document.getElementById("newTabspaceFromTabs");
if(newTSbttn){
newTSbttn.addEventListener('click', save_tabspace);
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
    var tempblacklist = ["myspace.com"];

    //var name = prompt("Enter a Name for the Tabspace:", "my tabspace");
    var name = document.getElementById("textbox-name").value;        
    if (name == ""){
        name = "tabspace" + count;
    }

    var createdTabspace = new Tabspace(name);
    createdTabspace.linksArray = openTabs;
    createdTabspace.blocksArray = tempblacklist;


    var html = buildButton(name);
    $('#generateTabs').append(html); 
    var save = {};
    save[name] = createdTabspace;

    chrome.storage.sync.set(save);     
    setButtonClick();            
}

//grab the current open tabs from the focused window.
function grabTabs(callback){
    // var openTabs = [];
    
    chrome.tabs.query({lastFocusedWindow: true}, function(returned_tabs){
        var openTabs = [];
        console.log("returned_tabs:", returned_tabs);
        for (var i = 0; i < returned_tabs.length; i++) {
                openTabs.push(returned_tabs[i].url);                        
        }   
        console.log("openTabs in grabTabs:", openTabs);
        callback(openTabs);                     
    });
    
}

function save_tabspace(){    

    getCount(getCount_Callback);
    grabTabs(grabTabs_Callback);
                        
}

window.onload = function(){

    displayButtons();
   
    //Set on click attribute for submit,edit buttons
    var submitButton = document.getElementById("changetabbutton").addEventListener('click', saveTS);;

    // ADD TABS
    // Enter key is pressed
    addValue = document.getElementById("textbox-add");
    addValue.addEventListener("keyup", function(event){
        event.preventDefault();
        if (event.keyCode == 13 && addValue.value != "") {
            // Add tab url
            var nodeAdd = document.createElement("li");
            var textnodeAdd = document.createTextNode(addValue.value);
            nodeAdd.appendChild(textnodeAdd);
            document.getElementById("list-add").appendChild(nodeAdd);
            addValue.value = "";
        }
        else {
            return false;
        }


        // Remove tab url
        var removeAddTab = document.createElement('input');
        removeAddTab.setAttribute('type', 'button');
        removeAddTab.setAttribute("value", "x");
        removeAddTab.setAttribute("id", "removeButton");
        removeAddTab.addEventListener('click', function(e) {
            nodeAdd.parentNode.removeChild(nodeAdd);
        }, false);
        nodeAdd.appendChild(removeAddTab);
    }
    ) 

    // BLOCK TABS
    // Enter key is pressed
    blockValue = document.getElementById("textbox-block");
    blockValue.addEventListener("keyup", function(event){
        event.preventDefault();
        if (event.keyCode == 13 && blockValue.value != "") {
            // Add tab url
            var nodeBlock = document.createElement("li");
            var textnodeBlock = document.createTextNode(blockValue.value);
            nodeBlock.appendChild(textnodeBlock);
            document.getElementById("list-block").appendChild(nodeBlock);
            blockValue.value = "";
        }
        else {
            return false;
        }


        // Remove tab url
        var removeBlockTab = document.createElement('input');
        removeBlockTab.setAttribute('type', 'button');
        removeBlockTab.setAttribute("value", "x");
        removeBlockTab.setAttribute("id", "removeButton");
        removeBlockTab.addEventListener('click', function(e) {
            nodeBlock.parentNode.removeChild(nodeBlock);
        }, false);
        nodeBlock.appendChild(removeBlockTab);
    }
    ) 

          // Allow "Submit" button to return to home
    $('#changetabbutton').click(function(event){
        event.preventDefault();
        $('#mytabs a[href="#home"]').tab('show');
    })

    $(document).ready(function(){
        $('[data-toggle="popover"]').popover();   
    });

    $('a[href="#home"]').on('shown.bs.tab', function (e) {
        console.log("Show tab event fired.");
        document.getElementById("generateTabs").id = "temp";
        document.getElementById("generateTabs_inactive").id = "generateTabs";
        document.getElementById("temp").id = "generateTabs_inactive";
        displayButtons();
    });

    $('a[href="#edit"]').on('shown.bs.tab', function (e) {
        console.log("Show tab event fired.");
        document.getElementById("generateTabs").id = "temp";
        document.getElementById("generateTabs_inactive").id = "generateTabs";
        document.getElementById("temp").id = "generateTabs_inactive";
        displayButtons();
    });
};

