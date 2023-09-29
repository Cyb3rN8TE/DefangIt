// This function gets information on the IP address.
function ipLookup(input) {
	var ipAddress = input.selectionText.toLowerCase();
  
	// Open a new tab with the IP address lookup website and pass the selected text as a parameter.
	chrome.tabs.create({
	  url: "https://www.ipaddress.com/ip-lookup/" + ipAddress
	});
  }
  
  function defang(input) {
	var url = input.selectionText.toLowerCase();
	url = url.replace(/[.:()]/g, function(match) {
	  if (match === '(') return '[';
	  if (match === ')') return ']';
	  return '[' + match + ']';
	}).replace(/http/g, 'hxxp').replace(/https/g, 'hxxps');
  
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
  
  function refang(input) {
	var text = input.selectionText.toLowerCase();
	text = text.replace(/\[|\]/g, ''); // Remove square brackets
	text = text.replace(/\(|\)/g, ''); // Remove parentheses
	text = text.replace(/hxxp/g, 'http').replace(/hxxps/g, 'https'); // Replace hxxp/hxxps with http/https
	text = text.replace(/\[dot\]/g, '.'); // Replace [dot] with .
	text = text.replace(/\[colon\]/g, ':'); // Replace [colon] with :
	text = text.replace(/\(/g, '[').replace(/\)/g, ']'); // Replace ( with [ and ) with ]
  
	// Create a temporary text element and set its content to the modified text.
	var copyFrom = document.createElement("textarea");
	copyFrom.textContent = text;
  
	// Add the temporary text to the document body.
	document.body.appendChild(copyFrom);
  
	// Select the text inside the temporary textarea.
	copyFrom.select();
  
	// Copy the selected text to the clipboard using document.execCommand('copy').
	document.execCommand('copy');
  
	// Remove the temporary textarea element from the document body.
	document.body.removeChild(copyFrom);
  }
  
  // This code creates a new context menu item titled "Defang Selected Text" that appears when the user right clicks and calls the defang() function when clicked.
  chrome.contextMenus.create({
	title: "Defang Selected Text",
	contexts: ["selection"],
	onclick: defang
  });
  
  // This code creates a new context menu item titled "Refang Selected Text" that appears when the user right clicks and calls the refang() function when clicked.
  chrome.contextMenus.create({
	title: "Refang Selected Text",
	contexts: ["selection"],
	onclick: refang
  });
  
  // This code creates a new context menu item titled "IP/Domain Lookup" that appears when the user right clicks and calls the ipLookup() function when clicked.
  chrome.contextMenus.create({
	title: "IP/Domain Lookup",
	contexts: ["selection"],
	onclick: ipLookup
  });
  