function removeDefaultText(textbox, defaultText) {
	if (textbox.value == defaultText) {
		textbox.value = "";
	}
}

function setToDefaultText(textbox, defaultText) {
	if (textbox.value == "") {
		textbox.value = defaultText;
	}
}