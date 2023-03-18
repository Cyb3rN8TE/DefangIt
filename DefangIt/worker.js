// This function gets information on the IP address.
function ipLookup(input){
	var ipAddress = input.selectionText.toLowerCase();

	// Open a new tab with the IP address lookup website and pass the selected text as a parameter.
	chrome.tabs.create({
		url: "https://www.ipaddress.com/ip-lookup/" + ipAddress
	});
}

// This function takes the selected text and replaces all occurrences of "." and ":" with "[.]" and "[:]" respectively.
function defang(input){
	var url = input.selectionText.toLowerCase();
	url = url.replace(/[.:]/g, function(match) {
		return '[' + match + ']';
	});

	// Create a temporary text element and set its content to the modified URL.
	var copyFrom = document.createElement("textarea");
	copyFrom.textContent = url;

	// Add the temporary text to the document body.
	document.body.appendChild(copyFrom);

	// Select the text inside the temporary textarea.
	copyFrom.select();

	// Copy the selected text to the clipboard using document.execCommand('copy').
	document.execCommand('copy');

	// Remove the temporary textarea element from the document body.
	document.body.removeChild(copyFrom);
}

// This code creates a new context menu item titled "Defang Selected Text" that appears when the user right clicks, and calls the defang() function when clicked.
chrome.contextMenus.create({
	title: "Defang Selected Text",
	contexts:["selection"],
	onclick: defang
});

// This code creates a new context menu item titled "IP Lookup" that appears when the user right clicks, and calls the ipLookup() function when clicked.
chrome.contextMenus.create({
	title: "IP Lookup",
	contexts:["selection"],
	onclick: ipLookup
});
