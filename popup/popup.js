var  open_in_curr_window = localStorage.open_in_curr_window || "yes";

//Bind event handler to checkbox toggle
$(function(){
    if(open_in_curr_window === "no"){
        $('#toggle-event').bootstrapToggle('off');
    }

    $('#toggle-event').change(function() {
       if(open_in_curr_window === "yes"){     
            
            localStorage.open_in_curr_window = "no";
        }
        if(open_in_curr_window === "no"){   
            
            localStorage.open_in_curr_window = "yes";
        }
    })
});

/*------Tabspace class ----------*/
function Tabspace(theName){
    this.name = theName;
    this.linksArray = [];
    this.blocksArray = [];
}



//sanitize function used for testing
function sanitize(str) {
    //regex to find & < > characters and replace them with html values
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}


/*-On Click function to append a new Tabspace object to global array and save into chrome.storage 
Invokes displayButtons function afterwards to update button display on home page----------*/
function saveTS(){
    var substring = "http://";    
    var name = sanitize(document.getElementById("textbox-name").value);
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

    var totalObjects = {};
    totalObjects[tabspace.name] = tabspace;
    chrome.storage.sync.set(totalObjects); 

    var html = buildButton(name); //Append button to DOM
    $('#generateTabs').append(html);  
    
    setButtonClick(); //Set On Click attribute
}

/*-Start up  function to load tabspaces from chrome.storage 
and display them as Buttons on the home page.
Invokes setButtonClick function afterwards to set On-Click attributes for the generated buttons -*/
function displayButtons(){
    chrome.storage.local.get(null, function(curTS_Result){
        chrome.storage.sync.get(null, function(result){

            console.log("in display button:", curTS_Result.currentTabspace); 

            for(objects in result){
                var tabObject = result[objects];                
                var name = tabObject.name;
                var html = buildButton(name, curTS_Result.currentTabspace);
                $('#generateTabs').append(html);   
            }        
        });
    });
    setTimeout(setButtonClick, 1000);
}

//randomSrc function used to load a random image in the imageUrls video
function randomSrc(){
    var imageUrls = ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg",
                     "7.jpg","8.jpg","9.jpg","10.jpg","11.jpg","12.jpg","13.jpg","14.jpg","15.jpg"];
    var randomIndex = Math.floor(Math.random() * imageUrls.length);    
    return imageUrls[randomIndex];
}

//creates the html element with needed values
function buildButton(name, curTS){    
    console.log(curTS);
    if (curTS == name){
        console.log("curTS == name");
        return '<div class="col-xs-4 individualTS"' + 'title="' + name + '">' + '<input type="image" id="tab-images" src="images/' + randomSrc() + '"/>' + '<p class="curTS" id="title">' + name + '</p>' + '</div>';            
    } else {
        return '<div class="col-xs-4 individualTS"' + 'title="' + name + '">' + '<input type="image"  id="tab-images" src="images/' + randomSrc() + '"/>' + '<p id="title">' + name + '</p>' + '</div>';            
    }
    
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

                if(localStorage.open_in_curr_window === "yes"){
                    chrome.windows.create({url: urls}, function(window) {
                    });        
                }else {
                    for (url in urls){    
                        var tempUrl = urls[url];                  
                        chrome.tabs.create({url : tempUrl});    
                    }
                }
                chrome.storage.local.set({currentTabspace : name});                
            }
            //setTimeout(closeTabs(tabs_to_close), 1000);
        });
        
    });
}

//closes each url in the array tabs_to_close
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

//add on click event listener to the new button
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

    var tempblacklist = [];

    // var tempblacklist = ["myspace.com"];


    //var name = prompt("Enter a Name for the Tabspace:", "my tabspace");
    var name = document.getElementById("textbox-name").value;        
    if (name == ""){
        name = "tabspace" + count;
    }

    var createdTabspace = new Tabspace(name);
    createdTabspace.linksArray = openTabs;
    // createdTabspace.blocksArray = tempblacklist;


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

//save open tabs into storage as tabspaceX
function save_tabspace(){    

    getCount(getCount_Callback);
    grabTabs(grabTabs_Callback);
                        
}

//Function to load edit page
function loadEditPage(){
    chrome.tabs.create({active: true, url: chrome.extension.getURL('popup/editTS.html')});
}

window.onload = function(){

    displayButtons();
   
    //Set on click attribute for submit,edit buttons
    var submitButton = document.getElementById("changetabbutton").addEventListener('click', saveTS);;
    var editBttn = document.getElementById("loadEdit").addEventListener('click', loadEditPage);
    
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
        removeAddTab.setAttribute("class", "btn btn-default btn-xs btn-circle");
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
        removeBlockTab.setAttribute("class", "btn btn-default btn-xs btn-circle");
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
};

