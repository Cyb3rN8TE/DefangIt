// Listen for text selection events
document.addEventListener('selectionchange', function() {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      // Send the selected text to the popup
      chrome.runtime.sendMessage({ selectedText });
    }
  });
  