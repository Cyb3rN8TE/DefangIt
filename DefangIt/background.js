// Create a context menu item for defanging
chrome.contextMenus.create({
    id: "defangContextMenuItem",
    title: "Defang Selected Text",
    contexts: ["selection"]
  });
  
  // Create a context menu item for refanging
  chrome.contextMenus.create({
    id: "refangContextMenuItem",
    title: "Refang Selected Text",
    contexts: ["selection"]
  });
  
  // Add event listeners for context menu item clicks
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "defangContextMenuItem") {
      defangSelectedText(tab);
    } else if (info.menuItemId === "refangContextMenuItem") {
      refangSelectedText(tab);
    }
  });
  
  // Function to defang selected text
  function defangSelectedText(tab) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: function () {
        const selectedText = window.getSelection().toString();
  
        if (!selectedText) {
          return;
        }
  
        // Check if there are any periods in the selected text
        if (!selectedText.includes('.')) {
          return;
        }
  
        // Check if there's already [.] in the selected text
        if (selectedText.includes('[.]')) {
          return; // Do nothing if [.] is already present
        }
  
        const defangedText = selectedText.replace(/\./g, '[.]');
  
        // Replace the selected text with the defanged text
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(defangedText));
        }
      }
    });
  }
  
  // Function to refang selected text
  function refangSelectedText(tab) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: function () {
        const selectedText = window.getSelection().toString();
  
        if (!selectedText) {
          return;
        }
  
        // Check if there are any [.] in the selected text
        if (!selectedText.includes('[.]')) {
          return;
        }
  
        const refangedText = selectedText.replace(/\[\.\]/g, '.');
  
        // Replace the selected text with the refanged text
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(refangedText));
        }
      }
    });
  }
  