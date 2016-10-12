/*------Tabspace class ----------
function Tabspace(){
    
}

Tabspace.prototype = {
    constructor: Tabspace,
    saveLink:function(link){
        
    },
    displayLinks:function(){
    
    }
}

*/

/*Add on click listener to button*/
var bttn = document.getElementById("button");
if(bttn){
bttn.addEventListener('click', saveChanges);
}

/*On click function to save form inputs*/
function saveChanges(){
    var substring = "https://";
    var fullSitename = "";
    
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