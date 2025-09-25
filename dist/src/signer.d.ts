export declare class Signer {
    private privateKeyBytes;
    private publicKeyBytes;
    constructor(privateKeyString: string);
    static parsePrivateKeyPEM(pemString: string): Uint8Array;
    static base64ToUint8Array(base64: string): Uint8Array;
    static extractEd25519PrivateKey(derBytes: Uint8Array): Uint8Array;
    getPublicKey(): Uint8Array;
    getPublicKeyPEM(): string;
    private createPublicKeyDER;
    private uint8ArrayToBase64;
    static splitIntoLines(str: string, lineLength: number): string[];
    static parsePublicKeyPEM(pemString: string): Uint8Array;
    private static base64ToUint8ArrayStatic;
    static verify(data: string | Uint8Array, signature: Uint8Array, publicKeyString: string): boolean;
    sign(data: string | Uint8Array): Uint8Array;
}
