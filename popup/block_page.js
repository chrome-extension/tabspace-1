function loadEditPage(){
    chrome.tabs.create({active: true, url: chrome.extension.getURL('popup/editTS.html')});
}

window.onload = function(){
    var editBttn = document.getElementById("loadEdit").addEventListener('click', loadEditPage);
    
   
};
