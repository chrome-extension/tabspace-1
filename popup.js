window.onload = function(){
    
    // ADD TABS
    // Enter key is pressed
    addValue = document.getElementById("textbox-add");
    addValue.addEventListener("keyup", function(event){
        event.preventDefault();
        if (event.keyCode == 13 && addValue.value != "") {
            // Add tab url
            var node = document.createElement("li");
            var textnode = document.createTextNode(addValue.value);
            node.appendChild(textnode);
            document.getElementById("list-add").appendChild(node);
            addValue.value = "";
        }
        else {
            return false;
        }

        // Remove tab url
        var removeTask = document.createElement('input');
        removeTask.setAttribute('type', 'button');
        removeTask.setAttribute("value", "x");
        removeTask.setAttribute("id", "removeButton");
        removeTask.addEventListener('click', function(e) {
            node.parentNode.removeChild(node);
        }, false);
        node.appendChild(removeTask);
    }
    ) 

};
