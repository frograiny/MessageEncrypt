// Background service worker for extension

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('🔐 Message Encrypt extension installed');
        
        // Open onboarding page
        chrome.tabs.create({
            url: 'src/onboarding.html'
        });
    }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPassphrase') {
        chrome.storage.local.get(['passphrase'], (result) => {
            sendResponse({ passphrase: result.passphrase });
        });
        return true; // Keep channel open for async response
    }
});

// Log extension status
console.log('🔐 Message Encrypt background worker ready');
