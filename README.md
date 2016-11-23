# tabspace
PROBLEM: People have lots of unorganized tabs open all the time, even when
they are unrelated to what they are supposed to be doing.

SOLUTION: A browser plugin that supports tabspaces (e.g. social, schoolwork,
etc) that separates concerns, keeps people on task, automatically opens tabs
at class time and can optionally block access to websites, preventing procrastination.

SETUP: To install the extension: 
		1) First go to chrome://extensions in Google Chrome
		2) Either drag and drop tabspace directory into the browser, or click install from local.
		3) Its installed!

## Where to put which code
### manifest.json
Describes the extension to Chrome. Defines required permissions and the actions to take
on browser events such as new tabs. Please ask the other team members before making
changes to this file!

### new_tab.js
The contents of this file are run on each new tab opened by Chrome (as defined in
manifest.json).

### popup
Files in the popup directory define the behavior of the menu displayed when the extension
button is clicked in the top-right of the Chrome window.

### img
Store any image files (.png, .jpg etc) here.

### docs
Contains sprint documentation for the project, including plans and reviews for individual
sprints and releases.