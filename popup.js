
var but = document.getElementById("button");
if(but){
but.addEventListener('click', saveChanges);
}

function saveChanges(){
    console.log("This works\n");
    var ts = document.getElementById("tabspace").value;
    var sitename = document.getElementById("website").value;
    console.log(ts);
    
    chrome.storage.local.set({'ts': ts});
    chrome.storage.local.set({'sitename': sitename});
   /* var dataObj = {};
    dataObj[test] = ts;
    dataObj[test2] = sitename;
    
    storage.set(dataObj);*/
    var string = "";
    chrome.storage.local.get('ts', function(result){
        string = result.ts;
        document.getElementById("demo").innerHTML = string;
        chrome.tabs.create({active: true, url: string});
    });
    
}