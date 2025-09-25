export declare class Signer {
    private privateKeyBytes;
    private publicKeyBytes;
    constructor(privateKeyString: string);
    private parsePrivateKeyPEM;
    private base64ToUint8Array;
    private extractEd25519PrivateKey;
    getPublicKey(): Uint8Array;
    getPublicKeyPEM(): string;
    private createPublicKeyDER;
    private uint8ArrayToBase64;
    private splitIntoLines;
    private static parsePublicKeyPEM;
    private static base64ToUint8ArrayStatic;
    static verify(data: string | Uint8Array, signature: Uint8Array, publicKeyString: string): boolean;
    sign(data: string | Uint8Array): Uint8Array;
}
