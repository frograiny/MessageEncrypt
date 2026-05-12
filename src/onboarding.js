document.addEventListener('DOMContentLoaded', () => {
    const setupBtn = document.getElementById('btn-setup');
    if (setupBtn) {
        setupBtn.addEventListener('click', () => {
            if (chrome.runtime && chrome.runtime.openOptionsPage) {
                chrome.runtime.openOptionsPage();
            } else {
                window.open(chrome.runtime.getURL('src/popup.html'));
            }
        });
    }

    const closeBtn = document.getElementById('btn-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            window.close();
        });
    }
});
