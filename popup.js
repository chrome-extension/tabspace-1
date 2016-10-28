
/*------Tabspace class ----------*/
function Tabspace(theName){
    this.name = theName;
    this.linksArray = [];
    this.add = function(newObject){
        this.linksArray.push(newObject);
    };
    
}

Tabspace.prototype = {
    constructor: Tabspace,
    
    displayName:function(){
        var that = this;
        var array = chrome.extension.getBackgroundPage().globalArray;
        var html =  '<button class="individualTS">' + this.name + '</button>';
      
        var dynamicHTML = 'Input websites:<br> \
        <input type="text" id="website"> \
        <br><br> \
        <button type="button" class="dynamic" id="submit">Submited</button>';
        
        array.push(html);
        chrome.storage.local.set({ globalArray: array});
        $('#dynamicInput').append(dynamicHTML);
        $('#dynamicTable tr').append(html);
        $(".dynamic").on("click", {arg1: this.name, arg2: this.linksArray}, saveLink);
       // $(".individualTS").on("click", {arg1: this.name}, displayLinks);
       setButtonClick();
        console.log(this.key);
        console.log(this.name);
        chrome.storage.local.get(function(result){
            out = result.globalArray;
            console.log(out);
        });
    }
}

function saveLink(foo){
        var substring = "https://";
        var fullSitename = "";
        var obj= {};
        var key = foo.data.arg1;
        var array = foo.data.arg2;
        
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
        
        console.log(key);
        array.push(fullSiteName);
        obj[key] = array;
       
        chrome.storage.local.set(obj);
        
}

/*
function displayLinks(){
    var key = this.text();
    console.log(key)
    chrome.storage.local.get(key,function(result){
            console.log(key,result);
            var array = result[key];
            for(var link in array){
                var obj = array[link];
                chrome.tabs.create({active: true, url: obj});
            }
        });
}*/


function displayLinks(foo){
        //var key = foo.data.arg1;
        var key = foo;
        console.log(key);
        chrome.storage.local.get(key,function(result){
            console.log(key,result);
            var array = result[key];
            for(var link in array){
                var obj = array[link];
                chrome.tabs.create({active: true, url: obj});
            }
        });
}

function displayButtons(){
    console.log("Hello from background!");
    chrome.storage.local.get(function(result){
        if(result.globalArray){
            out = result.globalArray;
            for(var i = 0; i < out.length; i++){
                var html = out[i];
                console.log(html);
                console.log(i);
                $('#dynamicTable tr').append(html);
              
            }
            
        }
    });
    setTimeout(setButtonClick, 2000);
    
}

function setButtonClick(){
    console.log("Reach here?");
        $(".individualTS").each(function(){
            var faz = this;
            console.log(faz);
            var fag = this.innerText;
            console.log(fag);       
            faz.addEventListener("click", function(){
                displayLinks(fag);
            }, false);
        });
}

var bttn2 = document.getElementById("createTS");
if(bttn2){
bttn2.addEventListener('click', saveTS);
displayButtons();

}

/*Add on click listener to button
var bttn = document.getElementById("submit");
if(bttn){
bttn.addEventListener('click', saveChanges);
}*/

function saveTS(){
    var ts = document.getElementById("tabspace").value;
    tabspace = new Tabspace(ts);
    tabspace.displayName();
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
 