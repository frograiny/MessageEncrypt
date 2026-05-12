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
 */
document.addEventListener('mouseup', function() {
    handleSelection();
});

document.addEventListener('touchend', function() {
    setTimeout(handleSelection, 100);
});

function handleSelection() {
    if (!currentPassphrase) {
        return;
    }

    const selectedText = window.getSelection().toString().trim();
    
    if (!selectedText) {
        return;
    }

    // Check if selection contains encrypted marker
    if (messageCrypto.isEncrypted(selectedText)) {
        try {
            const decrypted = messageCrypto.decrypt(selectedText, currentPassphrase);
            
            // Copy decrypted text to clipboard
            navigator.clipboard.writeText(decrypted).then(() => {
                // Show toast notification
                showDecryptNotification(decrypted);
            }).catch(() => {
                // Fallback: show tooltip
                const event = { target: document.elementFromPoint(
                    window.innerWidth / 2, 
                    window.innerHeight / 2
                )};
                showTooltip(event, decrypted);
            });
        } catch (error) {
            console.error('Decrypt error:', error);
        }
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
    
    const truncated = message.length > 100 ? message.substring(0, 100) + '...' : message;
    notification.innerHTML = `
        ✅ Đã copy vào clipboard:<br>
        <span style="font-weight: bold;">"${truncated}"</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        removeNotification();
    }, 3000);
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
