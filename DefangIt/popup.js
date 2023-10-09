// Function to update the selected text in the popup textbox
function updateSelectedText(selectedText) {
  document.getElementById('selectedText').value = selectedText;
}

// Get the currently active tab and the selected text
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    function: getSelectedText
  });
});

// Handle the response from the content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.selectedText) {
    updateSelectedText(request.selectedText);
  }
});

// Function to get the selected text in the active tab
function getSelectedText() {
  const selectedText = window.getSelection().toString();
  chrome.runtime.sendMessage({ selectedText });
}

// Function to display messages
function showMessage(message, color) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = message;
  messageDiv.style.color = color;

  setTimeout(() => {
    messageDiv.textContent = '';
  }, 7000);
}

// Handle the "Defang" button click
document.getElementById('defangButton').addEventListener('click', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const selectedText = document.getElementById('selectedText').value;

    if (selectedText.trim() === "") {
      showMessage('Error: No text is selected', 'red');
      return;
    }

    if (!selectedText.includes('.')) {
      showMessage('Error: Nothing to defang', 'red');
      return;
    }

    if (selectedText.includes('[.]')) {
      return;
    }

    const defangedText = selectedText.replace(/\./g, '[.]');
    updateSelectedText(defangedText);

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: updateSelectionOnPage,
      args: [defangedText]
    });

    showMessage('Success: Text defanged and updated on the page.', 'green');
  });
});

// Handle the "Refang" button click
document.getElementById('refangButton').addEventListener('click', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const selectedText = document.getElementById('selectedText').value;

    if (selectedText.trim() === "") {
      showMessage('Error: No text is selected', 'red');
      return;
    }

    if (!selectedText.includes('[.]')) {
      showMessage('Error: Nothing to refang', 'red');
      return;
    }

    const refangedText = selectedText.replace(/\[\.\]/g, '.');
    updateSelectedText(refangedText);

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: updateSelectionOnPage,
      args: [refangedText]
    });

    showMessage('Success: Text refanged and updated on the page.', 'green');
  });
});

// Function to update the selection on the page
function updateSelectionOnPage(newText) {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(newText));
  }
}

// Function to replace periods with [.] in text on the page
function replacePeriodsWithBrackets(tab, successMessage) {
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
        node.textContent = node.textContent.replace(regex, replacePeriods);
      }
    }
  }, function() {
    showMessage(successMessage, 'green');
  });
}

// Function to replace [.] with periods in text on the page
function replaceBracketsWithPeriods(tab, successMessage) {
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
        node.textContent = node.textContent.replace(regex, replaceBrackets);
      }
    }
  }, function() {
    showMessage(successMessage, 'green');
  });
}

// Handle the "Defang Page" button click
document.getElementById('defangepageButton').addEventListener('click', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    replacePeriodsWithBrackets(tabs[0], 'Success: Text defanged and updated on the page.');
  });
});

// Handle the "Refang Page" button click
document.getElementById('refangpageButton').addEventListener('click', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    replaceBracketsWithPeriods(tabs[0], 'Success: Text refanged and updated on the page.');
  });
});
