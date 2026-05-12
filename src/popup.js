document.addEventListener('DOMContentLoaded', async () => {
    const passphraseInput = document.getElementById('passphrase');
    const saveBtn = document.getElementById('saveBtn');
    const clearBtn = document.getElementById('clearBtn');
    const encryptBtn = document.getElementById('encryptBtn');
    const copyBtn = document.getElementById('copyBtn');
    const textToEncrypt = document.getElementById('textToEncrypt');
    const encryptedText = document.getElementById('encryptedText');
    const statusDiv = document.getElementById('status');

    // Load saved passphrase
    chrome.storage.local.get(['passphrase'], (result) => {
        if (result.passphrase) {
            passphraseInput.value = '••••••••';
            passphraseInput.placeholder = 'Mật khẩu đã được lưu';
            showStatus('✅ Mật khẩu đã được lưu', 'success');
        }
    });

    // Save passphrase
    saveBtn.addEventListener('click', () => {
        const passphrase = passphraseInput.value.trim();
        
        if (!passphrase || passphrase === '••••••••') {
            showStatus('⚠️ Vui lòng nhập mật khẩu', 'warning');
            return;
        }

        chrome.storage.local.set({ passphrase }, () => {
            showStatus('✅ Lưu mật khẩu thành công!', 'success');
            passphraseInput.value = '••••••••';
        });
    });

    // Clear passphrase
    clearBtn.addEventListener('click', () => {
        if (confirm('Xoá mật khẩu? Bạn sẽ phải nhập lại.')) {
            chrome.storage.local.remove(['passphrase'], () => {
                passphraseInput.value = '';
                passphraseInput.placeholder = 'Nhập mật khẩu chung của nhóm...';
                showStatus('🗑️ Đã xoá mật khẩu', 'error');
            });
        }
    });

    // Encrypt text
    encryptBtn.addEventListener('click', () => {
        const text = textToEncrypt.value.trim();
        
        if (!text) {
            showStatus('⚠️ Vui lòng nhập text cần mã hóa', 'warning');
            return;
        }

        chrome.storage.local.get(['passphrase'], (result) => {
            if (!result.passphrase) {
                showStatus('⚠️ Vui lòng lưu mật khẩu trước', 'warning');
                return;
            }

            try {
                // Use shared crypto module
                const encrypted = messageCrypto.encrypt(text, result.passphrase);
                encryptedText.value = encrypted;
                showStatus('✅ Mã hóa thành công!', 'success');
            } catch (error) {
                showStatus('❌ Lỗi: ' + error.message, 'error');
            }
        });
    });

    // Copy encrypted text
    copyBtn.addEventListener('click', () => {
        if (!encryptedText.value) {
            showStatus('⚠️ Chưa có text để copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(encryptedText.value).then(() => {
            showStatus('✅ Đã copy vào clipboard!', 'success');
            setTimeout(() => statusDiv.innerHTML = '', 2000);
        });
    });

    function showStatus(message, type) {
        statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
    }
});
