/*------Tabspace class ----------*/
function Tabspace(theName){
    this.name = theName;
    this.linksArray = [];
    this.blocksArray = [];
}

/*-On Click function to append a new Tabspace object to global array and save into chrome.storage 
Invokes displayButtons function afterwards to update button display on home page----------*/
function saveTS(){
    var name = document.getElementById("textbox-name").value;
    tabspace = new Tabspace(name);
    $("#list-add li").each(function() { tabspace.linksArray.push($(this).text()) });
    $("#list-block li").each(function() { tabspace.blocksArray.push($(this).text()) });
    chrome.storage.local.get(null, function(result){
        var totalObjects = result.tabspaces;
        totalObjects.push(tabspace);
        //console.log(totalObjects);
        chrome.storage.local.set({ tabspaces: totalObjects});
        
    });
    displayButtons();
    
}

/*-Start up  function to load tabspaces from chrome.storage 
and display them as Buttons on the home page.
Invokes setButtonClick function afterwards to set On-Click attributes for the generated buttons -*/
function displayButtons(){
    chrome.storage.local.get(null, function(result){
        console.log(result.tabspaces);
        for(objects in result.tabspaces){
            var tabObject = result.tabspaces[objects];
            //console.log(tabObject);
            var name = tabObject.name;
            var html = '<li>' + '<button class="individualTS">' + name + '</button>' + '</li>';
            $('#generateTabs').append(html);   
        }
        
    });
    setTimeout(setButtonClick, 1000);
}

/*-Function called after timeout to set On-Click attribute to generated Tabspace buttons.
Possibly do this async/more efficiently? ----------*/
function setButtonClick(){
    $(".individualTS").each(function(){
        var name = this.innerText;
        console.log("Name of tabspace: " + name);       
        this.addEventListener("click", function(){
            displayLinks(name);
        }, false);
    });
}

/*-On-Click function called by tabspace buttons to display links saved in the linkArray attribute-*/
function displayLinks(name){      
    var key = name;
    console.log(key);
    chrome.storage.local.get(null,function(result){
        console.log(result.tabspaces.name);
        for(objects in result.tabspaces){
            var tabObject = result.tabspaces[objects];
            if(tabObject.name == key){
                var array = tabObject.linksArray;
                for(link in array){
                    var obj = array[link];
                    chrome.tabs.create({active: true, url: obj});
                }
            }
        }
            
        
    });
}


window.onload = function(){
    //Get global array variable and make initial query to see if storage object is empty. If empty, initialize object
    var totalObjects = chrome.extension.getBackgroundPage().totalObjects;
    chrome.storage.local.get(null, function(result){
        if(result.tabspaces == null){
            chrome.storage.local.set({ tabspaces: totalObjects});
        }else{
        console.log(result.tabspaces);
        }
    });
    
   
    //Display saved tabspaces as buttons and set on click attribute
    //setTimeout(displayButtons, 2000);
    displayButtons();
   
    //Set on click attribute for submit button
    var submitButton = document.getElementById("submitButton").addEventListener('click', saveTS);;
    
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
};
