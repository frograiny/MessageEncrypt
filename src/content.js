// Content script for Messenger encryption
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🔐 [MsgEncrypt] Content script loaded on:', window.location.href);

// ─── State ────────────────────────────────────────────────────────────────────
let currentPassphrase = null;
let previousSelection = '';   // tracks last processed selection to avoid duplicates

// ─── Load passphrase from storage ─────────────────────────────────────────────
chrome.storage.local.get(['passphrase'], (result) => {
    if (result.passphrase) {
        currentPassphrase = result.passphrase;
        console.log('🔐 [MsgEncrypt] Passphrase loaded ✅');
    } else {
        console.log('🔐 [MsgEncrypt] No passphrase saved yet');
    }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.passphrase) {
        currentPassphrase = changes.passphrase.newValue;
        console.log('🔐 [MsgEncrypt] Passphrase updated ✅');
    }
});

// ═══════════════════════════════════════════════════════════════════════════════
// POPUP UI - Shadow DOM (completely isolated from Messenger CSS)
// ═══════════════════════════════════════════════════════════════════════════════
let shadowHost, shadowRoot;

function initShadowUI() {
    if (shadowHost) return; // already initialized
    
    shadowHost = document.createElement('msg-encrypt-host');
    shadowHost.setAttribute('style',
        'position:fixed !important;' +
        'top:0 !important;' +
        'left:0 !important;' +
        'width:0 !important;' +
        'height:0 !important;' +
        'z-index:2147483647 !important;' +
        'pointer-events:none !important;' +
        'overflow:visible !important;' +
        'display:block !important;' +
        'opacity:1 !important;' +
        'visibility:visible !important;'
    );
    
    // Use a custom element name to avoid any clash
    document.documentElement.appendChild(shadowHost);
    shadowRoot = shadowHost.attachShadow({ mode: 'closed' });
    
    const style = document.createElement('style');
    style.textContent = `
        :host {
            all: initial !important;
        }
        .popup {
            position: fixed !important;
            background: #1a1a2e !important;
            color: #ffffff !important;
            padding: 14px 18px !important;
            border-radius: 12px !important;
            font-size: 14px !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            font-weight: 500 !important;
            max-width: 400px !important;
            min-width: 120px !important;
            word-break: break-word !important;
            z-index: 2147483647 !important;
            box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1) !important;
            pointer-events: none !important;
            line-height: 1.6 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            animation: slideUp 0.2s ease-out !important;
        }
        .popup .lbl {
            font-size: 10px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.1em !important;
            opacity: 0.6 !important;
            margin-bottom: 6px !important;
            display: block !important;
        }
        .popup .msg {
            font-size: 15px !important;
            font-weight: 600 !important;
            display: block !important;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
        }
    `;
    shadowRoot.appendChild(style);
    console.log('🔐 [MsgEncrypt] Shadow DOM UI initialized ✅');
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHOW / HIDE POPUP
// ═══════════════════════════════════════════════════════════════════════════════
let popupTimer = null;

function hidePopup() {
    if (shadowRoot) {
        const old = shadowRoot.querySelector('.popup');
        if (old) old.remove();
    }
    if (popupTimer) {
        clearTimeout(popupTimer);
        popupTimer = null;
    }
}

function showPopup(text, label, rect) {
    initShadowUI();
    
    // Remove existing
    const old = shadowRoot.querySelector('.popup');
    if (old) old.remove();
    if (popupTimer) clearTimeout(popupTimer);
    
    const el = document.createElement('div');
    el.className = 'popup';
    
    const truncated = text.length > 150 ? text.substring(0, 150) + '…' : text;
    el.innerHTML = `<span class="lbl">${label}</span><span class="msg">${escapeHtml(truncated)}</span>`;
    shadowRoot.appendChild(el);
    
    // Position near the selection
    if (rect && rect.width > 0) {
        let top = rect.top - el.offsetHeight - 10;
        let left = rect.left;
        if (top < 10) top = rect.bottom + 10;
        if (left + 400 > window.innerWidth) left = window.innerWidth - 410;
        if (left < 10) left = 10;
        el.style.top = top + 'px';
        el.style.left = left + 'px';
    } else {
        el.style.bottom = '20px';
        el.style.right = '20px';
    }
    
    console.log('🔐 [MsgEncrypt] Popup shown:', truncated);
    
    // Auto-remove after 6 seconds
    popupTimer = setTimeout(() => {
        const p = shadowRoot.querySelector('.popup');
        if (p) p.remove();
    }, 6000);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SELECTION POLLING — the core mechanism
// This bypasses ALL event interception by Messenger.
// We simply check window.getSelection() every 300ms.
// ═══════════════════════════════════════════════════════════════════════════════

setInterval(() => {
    try {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
            // No active selection → reset tracker so next selection can trigger
            if (previousSelection !== '') {
                previousSelection = '';
                hidePopup(); // Bỏ bôi đen thì tắt popup
            }
            return;
        }
        
        const text = sel.toString().trim();
        
        // Skip empty, skip already processed
        if (!text || text === previousSelection) {
            return;
        }
        
        // Only process text that's at least 3 chars
        if (text.length < 3) {
            return;
        }
        
        // Mark as processed
        previousSelection = text;
        
        // Get bounding rect for positioning
        let rect = null;
        if (sel.rangeCount > 0) {
            rect = sel.getRangeAt(0).getBoundingClientRect();
        }
        
        // Try to decrypt
        if (currentPassphrase) {
            try {
                const decrypted = messageCrypto.decrypt(text, currentPassphrase);
                // Copy to clipboard
                navigator.clipboard.writeText(decrypted).catch(() => {});
                showPopup(decrypted, '🔓 ĐÃ GIẢI MÃ', rect);
            } catch (e) {
                // Can't decrypt — show the raw text
                showPopup(text, '📋 ĐOẠN TEXT ĐÃ CHỌN', rect);
            }
        } else {
            showPopup(text, '⚠️ CHƯA LƯU MẬT KHẨU — vào Extension để lưu', rect);
        }
    } catch (err) {
        console.error('🔐 [MsgEncrypt] Polling error:', err);
    }
}, 300);

console.log('🔐 [MsgEncrypt] Selection polling started (every 300ms) ✅');

// ═══════════════════════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUT — Ctrl+Shift+E to encrypt
// ═══════════════════════════════════════════════════════════════════════════════
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyE') {
        e.preventDefault();
        const input = document.querySelector('[contenteditable="true"]');
        if (input) {
            encryptMessage(input);
        }
    }
}, true);

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
        inputElement.textContent = encrypted;
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('🔐 [MsgEncrypt] Message encrypted ✅');
    } catch (error) {
        alert('❌ Lỗi: ' + error.message);
    }
}
