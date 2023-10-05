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
    // Display the selected text in the textbox
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

  // Clear the message after 7 seconds (7000 milliseconds)
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

    // Check if there are any periods in the selected text
    if (!selectedText.includes('.')) {
      showMessage('Error: Nothing to defang', 'red');
      return;
    }

    // Check if there's already [.] in the selected text
    if (selectedText.includes('[.]')) {
      return; // Do nothing if [.] is already present
    }

    const defangedText = selectedText.replace(/\./g, '[.]');
    updateSelectedText(defangedText);
    // Send the defanged text to the content script to update the selection on the page
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

    // Check if there are any [.] in the selected text
    if (!selectedText.includes('[.]')) {
      showMessage('Error: Nothing to refang', 'red');
      return;
    }

    const refangedText = selectedText.replace(/\[\.\]/g, '.');
    updateSelectedText(refangedText);
    // Send the refanged text to the content script to update the selection on the page
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
