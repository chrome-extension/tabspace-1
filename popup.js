// Open tabspace
// get reference to element
var openWindowBtn = document.getElementById('openWindow');

openWindowBtn.addEventListener('click', function(event) {
    chrome.windows.create({"url": "http://google.com"});
});

// Close current tabspace and open new tabspace
// get reference to element
//chrome.tabs.query({'active': true}, function(tabs) {
    //chrome.tabs.remove(tabs[0].id);

var switchWindowBtn = document.getElementById('switchWindow');

switchWindowBtn.addEventListener('click', function(event) {
    chrome.windows.getCurrent(function(currentWindow){
        chrome.windows.remove(currentWindow.id);
        chrome.windows.create({"url": "http://google.com"});
    });
});
    
