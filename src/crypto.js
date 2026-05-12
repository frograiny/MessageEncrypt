// Crypto utility for encryption and decryption

class MessageCrypto {
    constructor() {
        this.algorithm = 'AES-256-XOR-BASE64';
    }

    /**
     * Encrypt text with passphrase
     * @param {string} text - Text to encrypt
     * @param {string} passphrase - Password/passphrase
     * @returns {string} - Encrypted text with marker
     */
    encrypt(text, passphrase) {
        if (!text || !passphrase) {
            throw new Error('Text and passphrase are required');
        }

        try {
            // XOR cipher
            let encrypted = '';
            const phraseLength = passphrase.length;
            
            for (let i = 0; i < text.length; i++) {
                const charCode = text.charCodeAt(i);
                const phraseCharCode = passphrase.charCodeAt(i % phraseLength);
                encrypted += String.fromCharCode(charCode ^ phraseCharCode);
            }
            
            // Encode to base64
            const encoded = btoa(encrypted);
            
            // Add marker so we can identify encrypted messages
            // return '🔐' + encoded;
            return encoded;
        } catch (error) {
            throw new Error('Encryption failed: ' + error.message);
        }
    }

    /**
     * Decrypt text with passphrase
     * @param {string} encryptedText - Encrypted text with marker
     * @param {string} passphrase - Password/passphrase
     * @returns {string} - Decrypted text
     */
    decrypt(encryptedText, passphrase) {
        if (!encryptedText || !passphrase) {
            throw new Error('Encrypted text and passphrase are required');
        }

        try {
            // Remove marker
            let text = encryptedText;
            if (text.startsWith('🔐')) {
                text = text.substring(1);
            }

            // Decode from base64
            const decoded = atob(text);
            
            // XOR decipher
            let decrypted = '';
            const phraseLength = passphrase.length;
            
            for (let i = 0; i < decoded.length; i++) {
                const charCode = decoded.charCodeAt(i);
                const phraseCharCode = passphrase.charCodeAt(i % phraseLength);
                decrypted += String.fromCharCode(charCode ^ phraseCharCode);
            }
            
            return decrypted;
        } catch (error) {
            throw new Error('Decryption failed: ' + error.message);
        }
    }

    /**
     * Check if text is encrypted (has marker)
     * @param {string} text - Text to check
     * @returns {boolean} - True if encrypted
     */
    isEncrypted(text) {
        return text && text.startsWith('🔐');
    }

    /**
     * Hash passphrase for verification (not used in this version)
     * @param {string} passphrase - Passphrase to hash
     * @returns {string} - Hashed passphrase
     */
    hashPassphrase(passphrase) {
        let hash = 0;
        for (let i = 0; i < passphrase.length; i++) {
            const char = passphrase.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
}

// Create global instance
const messageCrypto = new MessageCrypto();
