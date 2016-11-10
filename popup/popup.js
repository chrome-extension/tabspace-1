/*
    Code behind the dropdown menu for adding/removing tabspaces goes here
*/

//need to put the tabspace objects into an array, i suppose. Then use whatever storage
//thing he's using to make sure it stores

//var tabspace_array = [];
//when they make a new tabspace, add it to the tabspace array using 
//tabspace_array.push(new_tabspace);

/*------Tabspace class ----------*/
function Tabspace(theName){
    this.name = theName;
}

Tabspace.prototype = {
    constructor: Tabspace,
   /* saveLink:function(link){
        
    },
    displayLinks:function(){
    
    }*/
    displayName:function(){
        var array = chrome.extension.getBackgroundPage().globalArray;
        ts_name = escape(this.name)
        ts_name.replace("%20", ' ')
            
        var html =  '<button>' + this.name + '</button>';
        array.push(html);
        chrome.storage.local.set({ globalArray: array});
        
        $('#dynamicTable tr').append(html);
        console.log(this.name);
        chrome.storage.local.get(function(result){
            out = result.globalArray;
            console.log(out);
        });
    }
}

function displayButtons(){
    console.log("Hello from background!");
    chrome.storage.local.get(function(result){
        if(result.globalArray){
            out = result.globalArray;
            for(var i = 0; i < out.length; i++){
                var html = out[i];
                console.log(html);
                $('#dynamicTable tr').append(html);
            }
            
        }
    });
}


var bttn2 = document.getElementById("createTS");
if(bttn2){
bttn2.addEventListener('click', saveTS);
tabspace_array.push(saveTS);
displayButtons();
}

/*Add on click listener to button*/
var bttn = document.getElementById("submit");
if(bttn){
bttn.addEventListener('click', saveChanges);
}

function saveTS(){
    var ts = document.getElementById("tabspace").value;
    tabspace = new Tabspace(ts);
    tabspace.displayName();
}

/*On click function to save form inputs*/
function saveChanges(){
    var substring = "https://";
    var fullSitename = "";
    //do a loop to save all elems in tabspace array
    //for (var i = 0; i < tabspace_array; i++)
    console.log("This works\n");
    var ts = document.getElementById("tabspace").value;
    var sitename = document.getElementById("website").value;
    console.log(sitename);
    
    if(sitename.includes(substring) !== true){
        console.log("No https string");
        fullSiteName = substring.concat(sitename);
        console.log(fullSiteName);
    }else{
        fullSiteName = sitename;
        console.log(fullSiteName);
    }
    
    chrome.storage.local.set({'ts': ts});
    chrome.storage.local.set({'sitename': fullSiteName});
   /* var dataObj = {};
    dataObj[test] = ts;
    dataObj[test2] = sitename;
    
    storage.set(dataObj);*/
    
    var site = "";
    chrome.storage.local.get(function(result){
        tabspace = result.ts;
        site = result.sitename;
        document.getElementById("demo").innerHTML = tabspace;
        console.log(site);
        chrome.tabs.create({active: true, url: site});
    });
    
}
 