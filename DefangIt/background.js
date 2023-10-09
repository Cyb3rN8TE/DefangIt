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

// Create a sub-menu item "Defang Page"
chrome.contextMenus.create({
  id: "DefangPageContextMenuItem",
  title: "Defang Page",
  parentId: "defangItParent",
  contexts: ["all"]
});

// Create a sub-menu item "Refang Page"
chrome.contextMenus.create({
  id: "RefangePageContextMenuItem",
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
  } else if (info.menuItemId === "DefangPageContextMenuItem") {
    replacePeriodsWithBrackets(tab);
  } else if (info.menuItemId === "RefangePageContextMenuItem") {
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

// Function to replace periods with [.] in text on the page
function replacePeriodsWithBrackets(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: function () {
      // Regular expression to match domains, IP addresses, and URLs
      const regex = /((https?:\/\/|www\.)[^\s]+)|(\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b)|(\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}\b)/g;

      // Function to replace periods with [.] in matched text
      function replacePeriods(match) {
        return match.replace(/\./g, '[.]');
      }

      // Select text nodes in the body element and replace periods with [.] only in their content
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      let node;
      while ((node = walker.nextNode())) {
        // Ignore text nodes inside <img> elements
        if (node.parentNode.tagName !== 'IMG') {
          node.textContent = node.textContent.replace(regex, replacePeriods);
        }
      }
    }
  });
}

// Function to replace [.] with periods in text on the page
function replaceBracketsWithPeriods(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: function () {
      // Regular expression to match domains, IP addresses, and URLs with [.] 
      const regex = /(\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}\b)|(\b\d{1,3}(?:\.\d{1,3}){3}\b)|(\[\.\])/g;

      // Function to replace [.] with periods in matched text
      function replaceBrackets(match) {
        return match.replace(/\[\.\]/g, '.');
      }

      // Select text nodes in the body element and replace [.] with periods only in their content
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      let node;
      while ((node = walker.nextNode())) {
        // Ignore text nodes inside <img> elements
        if (node.parentNode.tagName !== 'IMG') {
          node.textContent = node.textContent.replace(regex, replaceBrackets);
        }
      }
    }
  });
}
