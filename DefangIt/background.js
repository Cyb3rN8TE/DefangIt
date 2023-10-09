// Create a context menu item for defanging selected text
chrome.contextMenus.create({
  id: "defangContextMenuItem",
  title: "Defang Selected Text",
  contexts: ["selection"]
});

// Create a context menu item for refanging selected text
chrome.contextMenus.create({
  id: "refangContextMenuItem",
  title: "Refang Selected Text",
  contexts: ["selection"]
});

// Create a parent context menu item "DefangIt"
chrome.contextMenus.create({
  id: "defangItParent",
  title: "DefangIt",
  contexts: ["page"]
});

// Create a sub-menu item "Replace periods with [.]"
chrome.contextMenus.create({
  id: "replacePeriodsContextMenuItem",
  title: "Defang Page",
  parentId: "defangItParent",
  contexts: ["all"]
});

// Create a sub-menu item "Replace [.] with periods"
chrome.contextMenus.create({
  id: "replaceBracketsWithPeriodsContextMenuItem",
  title: "Refang Page",
  parentId: "defangItParent",
  contexts: ["all"]
});

// Add event listeners for context menu item clicks
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "defangContextMenuItem") {
    defangSelectedText(tab);
  } else if (info.menuItemId === "refangContextMenuItem") {
    refangSelectedText(tab);
  } else if (info.menuItemId === "replacePeriodsContextMenuItem") {
    replacePeriodsWithBrackets(tab);
  } else if (info.menuItemId === "replaceBracketsWithPeriodsContextMenuItem") {
    replaceBracketsWithPeriods(tab);
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

      if (!selectedText.includes('.')) {
        return;
      }

      if (selectedText.includes('[.]')) {
        return;
      }

      const defangedText = selectedText.replace(/\./g, '[.]');

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

      if (!selectedText.includes('[.]')) {
        return;
      }

      const refangedText = selectedText.replace(/\[\.\]/g, '.');

      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(refangedText));
      }
    }
  });
}

// Function to replace periods with [.] in URLs, Domains, and IP addresses
function replacePeriodsWithBrackets(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: function () {
      const regex = /((https?:\/\/|www\.)[^\s]+)|(\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b)|(\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}\b)/g;
      
      function replacePeriods(match) {
        return match.replace(/\./g, '[.]');
      }

      document.body.innerHTML = document.body.innerHTML.replace(regex, replacePeriods);
    }
  });
}

// Function to replace [.] with periods in URLs, Domains, and IP addresses
function replaceBracketsWithPeriods(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: function () {
      const regex = /\[\.\]/g;

      function replaceBrackets(match) {
        return match.replace(/\[\.\]/g, '.');
      }

      document.body.innerHTML = document.body.innerHTML.replace(regex, replaceBrackets);
    }
  });
}
