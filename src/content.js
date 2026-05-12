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

// ─── Shadow DOM Host ──────────────────────────────────────────────────────────
// We mount our entire UI inside a Shadow Root so Messenger's CSS cannot touch it
const shadowHost = document.createElement('div');
shadowHost.id = 'msg-encrypt-host';
Object.assign(shadowHost.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '0',
    height: '0',
    zIndex: '2147483647',
    pointerEvents: 'none',
    overflow: 'visible'
});
document.documentElement.appendChild(shadowHost);
const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

// Inject styles into shadow root
const shadowStyle = document.createElement('style');
shadowStyle.textContent = `
    #msg-encrypt-popup {
        position: fixed;
        background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
        color: #fff;
        padding: 12px 18px;
        border-radius: 10px;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 500;
        max-width: 360px;
        word-break: break-word;
        z-index: 2147483647;
        box-shadow: 0 8px 32px rgba(0,0,0,0.45);
        border: 1px solid rgba(255,255,255,0.15);
        pointer-events: none;
        line-height: 1.5;
        animation: popIn 0.18s ease-out;
    }
    #msg-encrypt-popup .label {
        font-size: 11px;
        opacity: 0.7;
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    #msg-encrypt-popup .content {
        font-size: 15px;
        font-weight: 600;
    }
    @keyframes popIn {
        from { opacity: 0; transform: translateY(6px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
    }
`;
shadowRoot.appendChild(shadowStyle);
// ─────────────────────────────────────────────────────────────────────────────

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
let lastRawSelectedText = '';
let lastSelectionRect = null;

document.addEventListener('selectionchange', function() {
    const sel = window.getSelection();
    if (sel && sel.toString().trim()) {
        lastSelectedText = sel.toString().trim();
        lastRawSelectedText = lastSelectedText;
        // Grab bounding rect of selection
        if (sel.rangeCount > 0) {
            lastSelectionRect = sel.getRangeAt(0).getBoundingClientRect();
        }
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
    const anchorRect = lastSelectionRect;
    lastSelectionRect = null;

    try {
        const decrypted = messageCrypto.decrypt(selectedText, currentPassphrase);
        
        // Copy to clipboard
        navigator.clipboard.writeText(decrypted).catch(() => {});
        
        // Show popup near selection
        showDecryptNotification(decrypted, anchorRect);
        
    } catch (error) {
        // Nếu không giải mã được thì hiện nguyên gốc
        lastRawSelectedText = selectedText; // mark as raw
        showDecryptNotification(selectedText, anchorRect);
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

let _popupTimeout = null;

/**
 * Show decryption result popup near the selected text
 */
function showDecryptNotification(message, anchorRect) {
    // Remove any existing popup from shadow root
    const existing = shadowRoot.getElementById('msg-encrypt-popup');
    if (existing) existing.remove();
    if (_popupTimeout) clearTimeout(_popupTimeout);

    const popup = document.createElement('div');
    popup.id = 'msg-encrypt-popup';

    const isDecrypted = message !== lastRawSelectedText;
    const label = isDecrypted ? '🔓 Đã giải mã' : '📋 Đoạn text';
    const truncated = message.length > 120 ? message.substring(0, 120) + '…' : message;

    popup.innerHTML = `<div class="label">${label}</div><div class="content">${truncated}</div>`;
    shadowRoot.appendChild(popup);

    // Position: above the selection, or fall back to bottom-right
    if (anchorRect) {
        let top = anchorRect.top - popup.offsetHeight - 12;
        let left = anchorRect.left;
        if (top < 8) top = anchorRect.bottom + 10;
        if (left + 360 > window.innerWidth) left = window.innerWidth - 368;
        popup.style.top = top + 'px';
        popup.style.left = left + 'px';
    } else {
        popup.style.bottom = '24px';
        popup.style.right  = '24px';
    }

    _popupTimeout = setTimeout(() => {
        const p = shadowRoot.getElementById('msg-encrypt-popup');
        if (p) p.remove();
    }, 5000);
}

function removeNotification() {
    const p = shadowRoot.getElementById('msg-encrypt-popup');
    if (p) p.remove();
    if (_popupTimeout) clearTimeout(_popupTimeout);
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
