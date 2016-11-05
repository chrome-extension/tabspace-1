/*------Tabspace class ----------*/
function Tabspace(theName){
    this.name = theName;
    this.linksArray = [];
    this.blocksArray = [];
}

/*-On Click function to save Tabspace object into chrome.storage ----------*/
function saveTS(){
    var name = document.getElementById("textbox-name").value;
    tabspace = new Tabspace(name);
    $("#list-add li").each(function() { tabspace.linksArray.push($(this).text()) });
    $("#list-block li").each(function() { tabspace.blocksArray.push($(this).text()) });
    chrome.storage.local.set({ tabspaces: tabspace});
    displayButtons();
    
}

/*-Start up  function to load tabspaces from chrome.storage 
and display them as Buttons on the home page----------*/
function displayButtons(){

    chrome.storage.local.get(null, function(result){
        for (tabspaces in result) {
            console.log(result.tabspaces);
            var html = '<li>' + '<button class="individualTS">' + result.tabspaces.name + '</button>' + '</li>';
            $('#generateTabs').append(html);
        }
    });
    setTimeout(setButtonClick, 2000);
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

/*-On-Click function called by tabspace buttons to display links saved in the tabspace-*/
function displayLinks(name){      
    var key = name;
    console.log(key);
    chrome.storage.local.get(null,function(result){
        console.log(result.tabspaces.name);
        for(tabspaces in result){
            if(result.tabspaces.name == key){
                var array = result.tabspaces.linksArray;
                for(link in array){
                    var obj = array[link];
                    chrome.tabs.create({active: true, url: obj});
                }
            }
        }
    });
}


window.onload = function(){
    //Display saved tabspaces as buttons and set on click attribute
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
