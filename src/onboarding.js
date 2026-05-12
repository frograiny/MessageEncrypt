document.addEventListener('DOMContentLoaded', () => {
    const setupBtn = document.getElementById('btn-setup');
    if (setupBtn) {
        setupBtn.addEventListener('click', () => {
            window.open(chrome.runtime.getURL('src/popup.html'), '_blank');
        });
    }

    const closeBtn = document.getElementById('btn-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            window.close();
        });
    }
});
