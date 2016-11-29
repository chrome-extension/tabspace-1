
chrome.extension.onRequest.addListener(function(message,sender){
  if(message.greeting === "block"){
    chrome.tabs.update(sender.tab.id,{url: chrome.extension.getURL('popup/block_page.html')});
  }
});
