// Content script for Messenger encryption

console.log('🔐 Message Encrypt extension loaded');

let currentPassphrase = null;

// Load passphrase from storage
chrome.storage.local.get(['passphrase'], (result) => {
    if (result.passphrase) {
        currentPassphrase = result.passphrase;
        console.log('✅ Passphrase loaded');
    }
});

// Listen for passphrase changes
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.passphrase) {
        currentPassphrase = changes.passphrase.newValue;
        console.log('🔄 Passphrase updated');
    }
});

// Observer to detect new messages
const messageObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        // Look for message elements
        const messageElements = document.querySelectorAll('[role="article"], [data-testid*="message"]');
        
        messageElements.forEach((el) => {
            // Check if already processed
            if (el.getAttribute('data-encrypt-processed')) {
                return;
            }

            el.setAttribute('data-encrypt-processed', 'true');
            
            // Find text content in message
            const textElement = el.querySelector('[dir="auto"]') || el;
            const originalText = textElement?.textContent?.trim();

            if (originalText && messageCrypto.isEncrypted(originalText)) {
                // Add hover tooltip for encrypted messages
                addDecryptTooltip(el, originalText);
            }
        });
    });
});

// Start observing
messageObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: false
});

/**
 * Add decryption tooltip to message
 */
function addDecryptTooltip(messageElement, encryptedText) {
    if (!currentPassphrase) {
        return;
    }

    messageElement.style.cursor = 'help';
    
    // Store encrypted text for selection decryption
    messageElement.setAttribute('data-encrypted-text', encryptedText);
    messageElement.setAttribute('data-encrypted', 'true');
    
    messageElement.addEventListener('mouseenter', function(e) {
        try {
            const decrypted = messageCrypto.decrypt(encryptedText, currentPassphrase);
            showTooltip(e, decrypted);
        } catch (error) {
            showTooltip(e, '❌ Không thể giải mã (sai passphrase?)');
        }
    });

    messageElement.addEventListener('mouseleave', function() {
        removeTooltip();
    });
}

/**
 * Show tooltip with decrypted message
 */
function showTooltip(event, message) {
    removeTooltip();

    const tooltip = document.createElement('div');
    tooltip.id = 'msg-encrypt-tooltip';
    tooltip.className = 'msg-encrypt-tooltip';
    tooltip.textContent = message;
    
    document.body.appendChild(tooltip);

    // Position tooltip
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';

    // Adjust if tooltip goes off screen
    if (tooltip.offsetTop < 0) {
        tooltip.style.top = (rect.bottom + 10) + 'px';
    }
}

/**
 * Remove tooltip
 */
function removeTooltip() {
    const tooltip = document.getElementById('msg-encrypt-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

/**
 * Handle text selection to decrypt selected encrypted message
 * We store the selection text on selectionchange because Messenger
 * often clears window.getSelection() before mouseup handlers run.
 */
let lastSelectedText = '';

document.addEventListener('selectionchange', function() {
    const sel = window.getSelection();
    if (sel && sel.toString().trim()) {
        lastSelectedText = sel.toString().trim();
    }
});

document.addEventListener('mouseup', function() {
    // Small delay to let selectionchange fire first
    setTimeout(handleSelection, 150);
}, true);

document.addEventListener('touchend', function() {
    setTimeout(handleSelection, 200);
}, true);

function handleSelection() {
    if (!currentPassphrase) {
        return;
    }

    // Try live selection first, fall back to stored value
    const liveText = window.getSelection()?.toString().trim();
    const selectedText = (liveText && liveText.length > 0) ? liveText : lastSelectedText;

    if (!selectedText) {
        return;
    }

    // Reset stored text after use so it doesn't re-trigger
    lastSelectedText = '';

    try {
        const decrypted = messageCrypto.decrypt(selectedText, currentPassphrase);
        
        // Copy to clipboard
        navigator.clipboard.writeText(decrypted).catch(() => {});
        
        // Show notification with decrypted text
        showDecryptNotification(decrypted);
        
    } catch (error) {
        // Nếu không giải mã được thì hiện nguyên gốc
        showDecryptNotification(selectedText);
    }
}

/**
 * Replace message with decrypted text or toggle back
 */
function replaceMessageWithDecrypted(messageElement, decryptedText, encryptedText) {
    const textContainer = messageElement.querySelector('[dir="auto"]') || messageElement;
    const isCurrentlyDecrypted = textContainer.getAttribute('data-is-decrypted') === 'true';
    
    if (isCurrentlyDecrypted) {
        // Toggle back to encrypted
        textContainer.textContent = encryptedText;
        textContainer.setAttribute('data-is-decrypted', 'false');
        console.log('🔐 Toggled back to encrypted');
    } else {
        // Show decrypted
        textContainer.textContent = decryptedText;
        textContainer.setAttribute('data-is-decrypted', 'true');
        
        // Add visual indicator
        messageElement.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
        
        // Auto toggle back after 5 seconds
        setTimeout(() => {
            textContainer.textContent = encryptedText;
            textContainer.setAttribute('data-is-decrypted', 'false');
            messageElement.style.backgroundColor = '';
            console.log('⏱️ Auto toggled back to encrypted');
        }, 5000);
        
        console.log('✅ Decrypted: ' + decryptedText.substring(0, 50) + '...');
    }
}

/**
 * Show notification when text is decrypted and copied
 */
function showDecryptNotification(message) {
    removeNotification();
    
    const notification = document.createElement('div');
    notification.id = 'msg-encrypt-notification';
    notification.className = 'msg-encrypt-notification';
    
    const truncated = message.length > 80 ? message.substring(0, 80) + '...' : message;
    notification.innerHTML = `
        <strong>✅ Đã giải mã & copy:</strong><br>
        <span>"${truncated}"</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification();
    }, 5000);
}

/**
 * Remove notification
 */
function removeNotification() {
    const notification = document.getElementById('msg-encrypt-notification');
    if (notification) {
        notification.remove();
    }
}

// Intercept message sending for Facebook Messenger
setupMessageEncryption();

function setupMessageEncryption() {
    // Wait for Messenger to load
    const checkInterval = setInterval(() => {
        const messageInput = document.querySelector('[contenteditable="true"]');
        
        if (messageInput) {
            clearInterval(checkInterval);
            
            // Create encrypt button
            const encryptBtn = document.createElement('button');
            encryptBtn.id = 'msg-encrypt-btn';
            encryptBtn.className = 'msg-encrypt-btn';
            encryptBtn.title = 'Mã hóa tin nhắn trước khi gửi (Ctrl+Shift+E)';
            encryptBtn.innerHTML = '🔐';
            
            // Find where to insert button (near send button)
            const sendButton = document.querySelector('[aria-label*="Send"], button[aria-label*="Gửi"]');
            if (sendButton && sendButton.parentElement) {
                sendButton.parentElement.insertBefore(encryptBtn, sendButton);
            }

            // Encrypt button click handler
            encryptBtn.addEventListener('click', () => {
                encryptMessage(messageInput);
            });

            // Keyboard shortcut
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyE') {
                    e.preventDefault();
                    encryptMessage(messageInput);
                }
            });
        }
    }, 500);
}

/**
 * Encrypt message in input field
 */
function encryptMessage(inputElement) {
    if (!currentPassphrase) {
        alert('❌ Vui lòng lưu mật khẩu trước (click biểu tượng extension)');
        return;
    }

    try {
        const text = inputElement.textContent.trim();
        
        if (!text) {
            alert('⚠️ Vui lòng nhập tin nhắn');
            return;
        }

        const encrypted = messageCrypto.encrypt(text, currentPassphrase);
        
        // Clear and set encrypted text
        inputElement.textContent = encrypted;
        
        // Trigger input event to update send button
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Show confirmation
        console.log('✅ Tin nhắn đã được mã hóa - Nhấn gửi để tiếp tục');
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
}

// Also intercept native send (for automatic encryption if needed in future)
interceptMessageSend();

function interceptMessageSend() {
    // This is optional - for now we use manual encryption
    // Can be extended to auto-encrypt
}
