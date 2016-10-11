/*------Tabspace class ----------*/
function Tabspace(){
    
}

Tabspace.prototype = {
    constructor: Tabspace,
    saveLink:function(link){
        
    },
    displayLinks:function(){
    
    }
}

/*Add on click listener to button*/
var bttn = document.getElementById("button");
if(bttn){
bttn.addEventListener('click', saveChanges);
}

/*On click function to save form inputs*/
function saveChanges(){
    var substring = "https://"

    console.log("This works\n");
    var ts = document.getElementById("tabspace").value;
    var sitename = document.getElementById("website").value;
    console.log(ts);
    
    if(sitename.indexOf(substring) !== -1){
        /*append substring code TDL*/
    }
    
    chrome.storage.local.set({'ts': ts});
    chrome.storage.local.set({'sitename': sitename});
   /* var dataObj = {};
    dataObj[test] = ts;
    dataObj[test2] = sitename;
    
    storage.set(dataObj);*/
    var string = "";
    chrome.storage.local.get(function(result){
        tabspace = result.ts;
        site = result.sitename;
        document.getElementById("demo").innerHTML = tabspace;
        chrome.tabs.create({active: true, url: site});
    });
    
}