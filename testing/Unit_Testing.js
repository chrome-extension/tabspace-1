/*
   Unit Testing file for testing all of the methods in popup.js
*/

//sanitize
function test_sanitize(){
   console.assert(sanitize("<>& " == "&lt;&gt;&amp; ", "sanitize test failed!");
}

//saveTS
function test_saveTS(){
   var ts = new Tabspace("testTS");
   ts.linksArray.push("https://www.google.com");
   ts.linksArray.push("https://www.yahoo.com");
   ts.blocksArray.push("https://www.youtube.com");
   ts.blocksArray.push("https://www.facebook.com");
   $("#list-add li").append('<li>www.google.com</li>');
   $("#list-add li").append('<li>https://www.yahoo.com</li>');
   $("#list-block li").append('<li>www.youtube.com<li>');
   $("#list-block li").append('<li>https://www.facebook.com<li>');
   saveTS();
   var flag = false;
   chrome.storage.sync.get(null, function(result){
            for (tsObj in result){
               if (tsObj == ts) flag = true;
            }
   });
   console.assert(flag, "saveTS test failed!");
}

//displayButtons
function test_displayButtons(){
   var name = "testTS";
   var tsObj = new Tabspace(name);
   tsObj.linksArray.push("https://www.google.com");
   chrome.storage.local.set({currentTabspace : name});
   var totalObjects = {};
   totalObjects[name] = tsObj;
   chrome.storage.sync.set(totalObjects);
   displayButtons();
   console.assert($('#generateTabs').text().includes(
      '<div class="col-xs-4 individualTS"' + 'title="' + name + '">' + '<input type="image"  class="curTS" id="tab-images" src="images/'
      ), "displayButtons test failed!");
}

//randomSrc
function test_randomSrc(){
   var result = randomSrc();
   var imageUrls = ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg",
                     "7.jpg","8.jpg","9.jpg","10.jpg","11.jpg","12.jpg","13.jpg","14.jpg","15.jpg"];
   console.assert($.inArray(result, imageUrls) > -1, "randomSrc test failed!");
}

//buildButton
function test_buildButton(){
   var name = "testTS";
   var curTS = "curTS";
   var same = buildButton(name, name);
   var diff = buildButton(name, curTS);
   console.assert(
      same.includes(
          '<div class="col-xs-4 individualTS"' + 'title="' + name + '">' + '<input type="image"  class="curTS" id="tab-images" src="images/'
      ) && diff.includes(
          '<div class="col-xs-4 individualTS"' + 'title="' + name + '">' + '<input type="image"  id="tab-images" src="images/'
      ), "buildButton test failed!");
}

//setButtonClick
function test_setButtonClick(){
   setButtonClick();
   //not sure if this is right
   console.assert($(".individualTS").attr("onClick") != undefined, "setButtonClick test failed!");
}

//displayLinks
function test_displayLinks(){
   var tsObj = new Tabspace("testTS");
   tsObj.linksArray.push("https://www.google.com");
   tsObj.linksArray.push("https://www.yahoo.com");
   displayLinks("testTS");
   chrome.tabs.query({}, function(tabs){
      console.assert(tabs.length == 2, "displayLinks test failed!");
   });
}

//closeTabs
function test_closeTabs(){
   var tabs_to_close = [];
   var num_tabs_before = 0;
   var num_tabs_after = 0;
   chrome.tabs.create({url : "http://www/google.com"});
   chrome.tabs.query({}, function(tabs){
      num_tabs_before = tabs.length;
      for (tab in tabs){
         chrome.tabs.getSelected(null,function(tab) {
             if (tab.url == "http://www/google.com") tabs_to_close.push(tab);
         });
      }
   });
   closeTabs(tabs_to_close);
   chrome.tabs.query({}, function(tabs){
      num_tabs_after = tabs.length;
   });
   console.assert(num_tabs_after == num_tabs_before - 1, "closeTabs test failed!");
}

//loadEditPage
function test_loadEditPage(){
   var num_tabs_before = 0;
   var num_tabs_after = 0;
   chrome.tabs.query({}, function(tabs){
      num_tabs_before = tabs.length;
   });
   loadEditPage();
   chrome.tabs.query({}, function(tabs){
      num_tabs_after = tabs.length;
   });
   console.assert(num_tabs_after == num_tabs_before, "loadEditPage test failed!");
}

//check_LocalStorage - this function is a test method itself, we dont need a test method for test methods i think
/*function test_check_LocalStorage(){
   
}*/

//getCount_Callback
function test_getCount_Callback(){
   var testingNumber = 3;
   getCount_Callback(testingNumber);
   console.assert(count == testingNumber, "getCount_Callback test failed!");
}

//getCount
function test_getCount(){
   $("#list-add li").append('<li>www.google.com</li>');
   saveTS();
   $("#list-add li").append('<li>https://www.yahoo.com</li>');
   saveTS();
   getCount(getCount_Callback);
   console.assert(count == 2, "getCount test failed!");
}

//grabTabs_Callback
function test_grabTabs_Callback(){
   var testTabs = ["https://www.google.com", "https://www.yahoo.com"];
   grabTabs_Callback(testTabs);
   chrome.storage.sync.get(null, function(result){
      //assuming we're calling this on a clean slate, this is the first tabspace
      for (tabspace in result){
         console.assert(
            tabspace.name == "tabspace1" &&
            tabspace.linksArray == testTabs,
            "grabTabs_Callback test failed!");
      }
}

//grabTabs
function test_grabTabs(){
   chrome.tabs.create({url : "https://www.google.com"});
   grabTabs(grabTabs_Callback);
   chrome.storage.sync.get(null, function(result){
   for (tabspace in result){
       console.assert(
          tabspace.name == "tabspace1" &&
          $.inArray("https://www.google.com", tabspace.linksArray) > -1,
          "grabTabs test failed!");
   }
}

//save_tabspace
function test_save_tabspace(){
   test_grabTabs();
   chrome.tabs.create({url : "https://www.google.com"});
   save_tabspace();
   chrome.storage.sync.get(null, function(result){
   for (tabspace in result){
       console.assert(
   //since we just made a tabspace in test_grabTabs, we should make sure this is saved as tabspace2
          tabspace.name == "tabspace2" &&
          $.inArray("https://www.google.com", tabspace.linksArray) > -1,
          "grabTabs test failed!");
   }
}
