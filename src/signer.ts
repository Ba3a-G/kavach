export class Signer {
    private crypto: any;
    private privateKey: any;

    constructor(privateKeyString: string) {
        this.crypto = this.loadCrypto();
        if (!this.crypto) {
            throw new Error('No crypto implementation available');
        }
        this.privateKey = this.crypto.createPrivateKey({
            key: privateKeyString,
            format: 'pem',
            type: 'pkcs8',
        });
    }

    protected loadCrypto() {
        if (typeof window !== 'undefined' && window.crypto) {
            return window.crypto;
        }

        if (typeof global !== 'undefined' && typeof require !== 'undefined') {
            try {
                const crypto = require('crypto');
                console.log('Using Node.js crypto implementation');
                return crypto;
            } catch (error) {
                return null;
            }
        }
        console.warn('No crypto implementation available');
        return null;
    }

    public sign(data: string): ArrayBuffer {
        return this.crypto.sign(null, Buffer.from(data), this.privateKey);
    }

    public static verify(data: string, signature: ArrayBuffer, publicKeyString: string): boolean {
        const crypto = (typeof window !== 'undefined' && window.crypto) ? window.crypto : require('crypto');
        const publicKey = crypto.createPublicKey({
            key: publicKeyString,
            format: 'pem',
            type: 'spki',
        });
        return crypto.verify(null, Buffer.from(data), publicKey, Buffer.from(signature));
    }
}