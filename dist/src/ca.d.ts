import type { AadhaarCSRData, AadhaarCertificateRaw } from "./types";
export declare class CA {
    private publicKeyBytes;
    private privateKeyBytes;
    constructor(privateKeyString: string);
    generateAadhaarCertificate(csrData: AadhaarCSRData, userPublicKeyBytes: Uint8Array): AadhaarCertificateRaw;
    static verifyAadhaarCertificate(certificate: AadhaarCertificateRaw, govPublicKey: string): boolean;
    encodeAadhaarCertificateToPEM(certificate: AadhaarCertificateRaw): string;
    decodeAadhaarCertificateFromPEM(pemString: string): AadhaarCertificateRaw;
}
