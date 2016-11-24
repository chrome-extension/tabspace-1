$(document).ready(function () {
    displayTabs();
        
});

function displayTabs(){
    var tabId = "#tabs-0"; //Tab id
    var count = 1;
    chrome.storage.sync.get(null, function(result){      
        for(objects in result){
            var tabObject = result[objects]; //The tabspace object
            console.log("tabObject: " , tabObject);
            console.log(objects);
            var name = tabObject.name;       //Name of the tabspace object
            tabId = tabId.slice(0,-1);
            tabId += parseInt(count);        
            var tabDivId = tabId.slice(1);      //Tab id without '#' 
            var html = '<li> <a href = "'+ tabId +'">' + name  + '</a> </li>';   //List element of each tab
            var tabDiv = '<div id="' + tabDivId + '">' + '</div>';   //Div of each individual tab    
            $('#tabs-list').append(html);                            //Append list element to list of tabs
            $(tabDiv).insertAfter('#tabs-list');                     //Append div of each tab after the list of tabs
            listItems(tabObject, tabDivId, name, objects, count);                    //Display rest of DOM elements for each individual tab
            count++;         
            
        }
        $( "#tabs-div" ).tabs();
    });
    
   
}

function listItems(tabObject, tabDivId, name, key, count_id){
   var tabArray = tabObject.linksArray;
   var blockArray = tabObject.blocksArray;
   var hashTabDivId = "#" + tabDivId; 
   
   /*Unique DOM id's*/
   var edit_name = "edit-name";
   var edit_add = "edit-add";
   var edit_block = "edit-block";
   var list_add = "list_add";
   var list_block = "list_block";
   
   edit_name += parseInt(count_id);
   edit_add += parseInt(count_id);
   edit_block += parseInt(count_id);
   list_add += parseInt(count_id);
   list_block += parseInt(count_id);
   
   var ui = '<div id="editUI"> \
              <p id="addLinksTitle"> Links in tabspace: </p>\
              <br> \
              <p id="blockLinksTitle">Blocked links in tabspace: </p> \
              <br> \
              <p>Change name: </p> \
              <input type="text" id="'+ edit_name + '" placeholder="School, Project X"> \
              <br> \
              <p>Add links: </p> \
              <input type="text" id="' + edit_add + '"  class="edit-add" placeholder="Google.com"> \
              <br> \
              <ul id="'+ list_add + '" class="list"></ul> \
              <p>Add blocking links: </p> \
              <input type="text" id="' + edit_block + '" placeholder="Facebook.com"> \
              <br> \
              <ul id="'+ list_block + '" class="list"></ul> \
              <br>\
              <button type="button" id="editSubmit" class="editSubmit" class="btn btn-primary">Submit</button> \
              <br><br> \
              <button type="button" id="delete" class="btn btn-primary">Delete Tabspace</button>\
           </div>';
           
   $(ui).appendTo(hashTabDivId);
    
    
    var addValue = document.getElementById(edit_add);
    addValue.addEventListener("keyup", function(event){
        event.preventDefault();
        if (event.keyCode == 13 && addValue.value != "") {
            // Add tab url
            console.log(addValue.value);
            var nodeAdd = document.createElement("li");
            var textnodeAdd = document.createTextNode(addValue.value);
            nodeAdd.appendChild(textnodeAdd);
            document.getElementById(list_add).appendChild(nodeAdd);
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
         nodeAdd.appendChild(removeAddTab);
        removeAddTab.addEventListener('click', function(e) {
            $(this).parent().remove();
        }, false);
       
    }); 
   
   var blockValue = document.getElementById(edit_block);
    blockValue.addEventListener("keyup", function(event){
        event.preventDefault();
        if (event.keyCode == 13 && blockValue.value != "") {
            // Add tab url
            var nodeBlock = document.createElement("li");
            var textnodeBlock = document.createTextNode(blockValue.value);
            nodeBlock.appendChild(textnodeBlock);
            document.getElementById(list_block).appendChild(nodeBlock);
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
        nodeBlock.appendChild(removeBlockTab);
        removeBlockTab.addEventListener('click', function(e) {
           $(this).parent().remove();
        }, false);
        
    }); 
   
   
   /*Permanently delete Tabspace function*/
   var deleteButton = document.getElementById("delete");
   deleteButton.addEventListener('click',function(e){
      console.log("DELTEDDDD?");
      chrome.storage.sync.remove(key);
   });
   
   var editButton = document.getElementById("editSubmit");
   editButton.addEventListener('click',function(e){
        /*Update name of tabspace if user entered in name form*/
        var list = document.getElementById(edit_name);
        console.log(list);
        if(list.value.length > 0){
            var newName = list.value;
            console.log(newName);
            tabObject.name = newName;
            var totalObjects = {};
            totalObjects[key] = tabObject;
            chrome.storage.sync.set(totalObjects);
            list[i].value = "";
                
        }           
        
         var substring = "http://";
         var hash_list_add = "#" + list_add + " " + "li";
         var hash_list_block = "#" + list_block + " " + "li";
         
        /*Update links of tabspace if user entered in links form*/
        $(hash_list_add).each(function() { 
            var fullSiteName = "";
            var sitename = $(this).text();
            console.log("List text: ", sitename);
            if(sitename.includes(substring) !== true){           
                fullSiteName = substring.concat(sitename);            
            }else{
                fullSiteName = sitename;           
            }
           console.log("Full sitename: ", fullSiteName);
            tabObject.linksArray.push(fullSiteName); 
        });
        $(hash_list_block).each(function() { tabObject.blocksArray.push($(this).text()) });    
        var totalObjects = {};
        totalObjects[key] = tabObject;
        chrome.storage.sync.set(totalObjects); 
          
   });
   
   for(link in tabArray){
      var nodeAdd = document.createElement("li");
      var textnodeAdd = document.createTextNode(tabArray[link]);
      nodeAdd.appendChild(textnodeAdd);
      document.getElementById("addLinksTitle").appendChild(nodeAdd);
      
      var removeAddTab = document.createElement('input');
      removeAddTab.setAttribute('type', 'button');
      removeAddTab.setAttribute("value", "Delete ");
      removeAddTab.setAttribute("id", "removeButton");
      nodeAdd.appendChild(removeAddTab);
      removeAddTab.addEventListener('click', function(e) {
            $(this).parent().remove();                        //Visually remove the DOM element
            var linkRemove = $(this).parent().first().text(); //Get text value of link to be removed from linksArray
            for(var i = 0; i < tabArray.length; i++) {        //Iterate through the object's linksArray until link name is found. 
                console.log(tabArray[i]);                     //Then splice the linksArray to remove the link and then reset object into chrome.storage  
                if(tabArray[i] == linkRemove) {
                    tabArray.splice(i, 1);
                    console.log(tabArray);
                    var totalObjects = {};
                    totalObjects[key] = tabObject;
                    chrome.storage.sync.set(totalObjects); 
                    break;
                }
            }
            console.log(linkRemove);
      }, false);
     
   }
   
   for(link in blockArray){
      var nodeBlock = document.createElement("li");
      var textnodeBlock = document.createTextNode(blockArray[link]);
      nodeBlock.appendChild(textnodeBlock);
      document.getElementById("blockLinksTitle").appendChild(nodeBlock);
      
       
      var removeAddTab = document.createElement('input');
      removeAddTab.setAttribute('type', 'button');
      removeAddTab.setAttribute("value", "Delete ");
      removeAddTab.setAttribute("id", "removeButton");
      nodeBlock.appendChild(removeAddTab);
      removeAddTab.addEventListener('click', function(e) {
            $(this).parent().remove();
            var blockRemove = $(this).parent().first().text(); //Get text value of link to be removed from blockArray
            for(var i = 0; i < blockArray.length; i++) {
                console.log(blockArray[i]);
                if(blockArray[i] == blockRemove) {
                    blockArray.splice(i, 1);
                    console.log(blockArray);
                    var totalObjects = {};
                    totalObjects[name] = tabObject;
                    chrome.storage.sync.set(totalObjects); 
                    break;
                }
            }
            console.log(blockRemove);
      }, false);
   }
   
}
