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

function randomSrc(){
    var imageUrls = ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg",
                     "7.jpg","8.jpg","9.jpg","10.jpg","11.jpg","12.jpg","13.jpg","14.jpg","15.jpg"];
    var randomIndex = Math.floor(Math.random() * imageUrls.length);    
    return imageUrls[randomIndex];
}

function buildButton(name, curTS){    
    console.log(curTS);
    if (curTS == name){
        console.log("curTS == name");
        return '<div class="col-xs-4 individualTS"' + 'title="' + name + '">' + '<input type="image" id="tab-images" src="images/' + randomSrc() + '"/>' + '<p class="curTS">' + name + '</p>' + '</div>';            
    } else {
        return '<div class="col-xs-4 individualTS"' + 'title="' + name + '">' + '<input type="image"  id="tab-images" src="images/' + randomSrc() + '"/>' + '<p>' + name + '</p>' + '</div>';            
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
                                      
                for (url in urls){    
                    var tempUrl = urls[url];                  
                    
                    chrome.tabs.create({url : tempUrl});                           
                }
              
                chrome.storage.local.set({currentTabspace : name});                
            }
            //setTimeout(closeTabs(tabs_to_close), 1000);
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

function init_testing(){
    // test_sanitize();
    // test_save_tabspace();
    // test_grabTabs();
    // test_grabTabs_Callback();
    // test_saveTS();
    test_displayButtons();
    test_randomSrc();
    test_buildButton();
    // test_closeTabs();
    // test_getCount();
    // test_getCount_Callback();
    
    test_loadEditPage();
}

//Function to load edit page
function loadEditPage(){
    chrome.tabs.create({active: true, url: chrome.extension.getURL('editTS.html')});
}

window.onload = function(){

    init_testing();
    //displayButtons();
   
    //Set on click attribute for submit,edit buttons
    var submitButton = document.getElementById("changetabbutton").addEventListener('click', saveTS);
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
};

function init_testing(){
    // test_sanitize();
    // test_save_tabspace();
    // test_grabTabs();
    // test_grabTabs_Callback();
    // test_saveTS();
    test_displayButtons();
    test_randomSrc();
    test_buildButton();
    // test_closeTabs();
    // test_getCount();
    // test_getCount_Callback();
    
    test_loadEditPage();
}

//sanitize
function test_sanitize(){
   console.assert(sanitize("<>& " == "&lt;&gt;&amp; ", "sanitize test failed!"));
}

//saveTS
function test_saveTS(){
   var ts = new Tabspace("testTS");
   ts.linksArray.push("https://www.google.com");
   ts.linksArray.push("https://www.yahoo.com");
   ts.blocksArray.push("https://www.youtube.com");
   ts.blocksArray.push("https://www.facebook.com");
   $("#list-add li").append('<li>www.google.com</li>');
   $("#list-add li").append('<li>https://www.yahoo.com</li>');
   $("#list-block li").append('<li>www.youtube.com<li>');
   $("#list-block li").append('<li>https://www.facebook.com<li>');
   saveTS();
   var flag = false;
   chrome.storage.sync.get(null, function(result){
            for (tsObj in result){
               if (tsObj == ts) flag = true;
            }
   });
   console.assert(flag, "saveTS test failed!");
}

//displayButtons
function test_displayButtons(){
   var name = "testTS";
   var tsObj = new Tabspace(name);
   tsObj.linksArray.push("https://www.google.com");
   chrome.storage.local.set({currentTabspace : name});
   var totalObjects = {};
   totalObjects[name] = tsObj;
   chrome.storage.sync.set(totalObjects);
   displayButtons();
   console.assert($('#generateTabs').text().includes(
      '<div class="col-xs-4 individualTS"' + 'title="' + name + '">' + '<input type="image"  class="curTS" id="tab-images" src="images/'
      ), "displayButtons test failed!");
}

//randomSrc
function test_randomSrc(){
   var result = randomSrc();
   var imageUrls = ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg",
                     "7.jpg","8.jpg","9.jpg","10.jpg","11.jpg","12.jpg","13.jpg","14.jpg","15.jpg"];
   console.assert($.inArray(result, imageUrls) > -1, "randomSrc test failed!");
}

//buildButton
function test_buildButton(){
   var name = "testTS";
   var curTS = "curTS";
   var same = buildButton(name, name);
   var diff = buildButton(name, curTS);
   console.assert(
      same.includes(
          '<div class="col-xs-4 individualTS"' + 'title="' + name + '">' + '<input type="image"  class="curTS" id="tab-images" src="images/'
      ) && diff.includes(
          '<div class="col-xs-4 individualTS"' + 'title="' + name + '">' + '<input type="image"  id="tab-images" src="images/'
      ), "buildButton test failed!");
}

//setButtonClick
function test_setButtonClick(){
   setButtonClick();
   //not sure if this is right
   console.assert($(".individualTS").attr("onClick") != undefined, "setButtonClick test failed!");
}

//displayLinks
function test_displayLinks(){
   var tsObj = new Tabspace("testTS");
   tsObj.linksArray.push("https://www.google.com");
   tsObj.linksArray.push("https://www.yahoo.com");
   displayLinks("testTS");
   chrome.tabs.query({}, function(tabs){
      console.assert(tabs.length == 2, "displayLinks test failed!");
   });
}

//closeTabs
function test_closeTabs(){
   var tabs_to_close = [];
   var num_tabs_before = 0;
   var num_tabs_after = 0;
   chrome.tabs.create({url : "http://www.google.com"});
   chrome.tabs.query({}, function(tabs){
      num_tabs_before = tabs.length;
      for (tab in tabs){
         chrome.tabs.getSelected(null,function(tab) {
             if (tab.url == "http://www.google.com") tabs_to_close.push(tab);
         });
      }
   });
   closeTabs(tabs_to_close);
   chrome.tabs.query({}, function(tabs){
      num_tabs_after = tabs.length;
   });
   console.assert(num_tabs_after == num_tabs_before - 1, "closeTabs test failed!");
}

//loadEditPage
function test_loadEditPage(){
   var num_tabs_before = 0;
   var num_tabs_after = 0;
   chrome.tabs.query({}, function(tabs){
      num_tabs_before = tabs.length;
   });
   loadEditPage();
   chrome.tabs.query({}, function(tabs){
      num_tabs_after = tabs.length;
   });
   console.assert(num_tabs_after == num_tabs_before, "loadEditPage test failed!");
}

//check_LocalStorage - this function is a test method itself, we dont need a test method for test methods i think
/*function test_check_LocalStorage(){
   
}*/

//getCount_Callback
function test_getCount_Callback(){
   var testingNumber = 3;
   getCount_Callback(testingNumber);
   console.assert(count == testingNumber, "getCount_Callback test failed!");
}

//getCount
function test_getCount(){
   $("#list-add li").append('<li>www.google.com</li>');
   saveTS();
   $("#list-add li").append('<li>https://www.yahoo.com</li>');
   saveTS();
   getCount(getCount_Callback);
   console.assert(count == 2, "getCount test failed!");
}

//grabTabs_Callback
function test_grabTabs_Callback(){
   var testTabs = ["https://www.google.com", "https://www.yahoo.com"];
   grabTabs_Callback(testTabs);
   chrome.storage.sync.get(null, function(result){
      //assuming we're calling this on a clean slate, this is the first tabspace
      for (tabspace in result){
         console.assert(
            tabspace.name == "tabspace1" &&
            tabspace.linksArray == testTabs,
            "grabTabs_Callback test failed!");
      }
    });
}

//grabTabs
function test_grabTabs(){
   chrome.tabs.create({url : "https://www.google.com"});
   grabTabs(grabTabs_Callback);
   chrome.storage.sync.get(null, function(result){
   for (tabspace in result){
       console.assert(
          tabspace.name == "tabspace1" &&
          $.inArray("https://www.google.com", tabspace.linksArray) > -1,
          "grabTabs test failed!");
   }
    });
}

//save_tabspace
function test_save_tabspace(){
   test_grabTabs();
   chrome.tabs.create({url : "https://www.google.com"});
   save_tabspace();
   chrome.storage.sync.get(null, function(result){
    alert("failure");
   for (tabspace in result){
       console.assert(
   //since we just made a tabspace in test_grabTabs, we should make sure this is saved as tabspace2
          tabspace.name == "tabspace2" &&
          $.inArray("https://www.google.com", tabspace.linksArray) > -1,
          "grabTabs test failed!");
       alert("failed");
   }
    });
}

