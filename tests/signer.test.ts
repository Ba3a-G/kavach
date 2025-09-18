import { expect, it, describe, beforeAll } from "bun:test";

import { Signer } from '../src/signer';
import * as fs from 'fs';
import * as path from 'path';

describe('Signer', () => {
    let privateKeyString: string;
    let publicKeyString: string;
    const testData = 'Lmao';

    beforeAll(() => {
        // Load test keys (Ed25519, PKCS#8 for private, SPKI for public)
        privateKeyString = fs.readFileSync(path.join(__dirname, '../.keys/gov.pem'), 'utf-8');
        publicKeyString = fs.readFileSync(path.join(__dirname, '../.keys/gov_pub.pem'), 'utf-8');
    });

    it('should sign and verify data correctly', () => {
        const signer = new Signer(privateKeyString);
        const signature = signer.sign(testData);
        console.log('Signature (base64):', signature);
        expect(signature).toBeInstanceOf(Buffer);
        const isValid = Signer.verify(testData, signature, publicKeyString);
        expect(isValid).toBe(true);
    });

    it('should fail verification with wrong data', () => {
        const signer = new Signer(privateKeyString);
        const signature = signer.sign(testData);
        const isValid = Signer.verify('Wrong data', signature, publicKeyString);
        expect(isValid).toBe(false);
    });

    it('should fail verification with wrong public key', () => {
        const signer = new Signer(privateKeyString);
        const signature = signer.sign(testData);
        // Generate a new key pair for negative test
        const { generateKeyPairSync } = require('crypto');
        const { publicKey } = generateKeyPairSync('ed25519');
        const wrongPublicKeyString = publicKey.export({ format: 'pem', type: 'spki' });
        const isValid = Signer.verify(testData, signature, wrongPublicKeyString);
        expect(isValid).toBe(false);
    });

    it('should throw if no crypto implementation is available', () => {
        // Simulate missing crypto by monkey-patching loadCrypto
        class BadSigner extends Signer {
            protected loadCrypto() { return null; }
        }
        expect(() => new BadSigner(privateKeyString)).toThrow('No crypto implementation available');
    });

    it('should throw with invalid private key', () => {
        expect(() => new Signer('not a key')).toThrow();
    });

    it('should throw with invalid public key in verify', () => {
        const signer = new Signer(privateKeyString);
        const signature = signer.sign(testData);
        expect(() => Signer.verify(testData, signature, 'not a key')).toThrow();
    });
});
