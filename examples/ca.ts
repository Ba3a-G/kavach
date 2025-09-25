import { ed25519 } from "@noble/curves/ed25519.js";
import { CA } from "../src/ca";
import type { AadhaarCSRData, AadhaarCertificateRaw } from "../src/types";

let aadhaarCSR: AadhaarCSRData = {
    name: "Aryan Kumar",
    lastFourAadhaar: "1234"
}

let govPrivateKeyString = await fetch("https://kavach-s3.ba3a.tech/gov.pem").then(res => res.text());
let govPublicKeyString = await fetch("https://kavach-s3.ba3a.tech/gov_pub.pem").then(res => res.text());

console.log(govPrivateKeyString);
console.log(govPublicKeyString);

// This is how the government CA will generate a certificate for a user after verifying their identity

const ca = new CA(govPrivateKeyString);

const generatedKeys = ed25519.keygen();
const userPublicKeyBytes = generatedKeys.publicKey;
const userPrivateKeyBytes = generatedKeys.secretKey;

let rawCertificate: AadhaarCertificateRaw = ca.generateAadhaarCertificate(aadhaarCSR, userPublicKeyBytes);
let PemCertificate = ca.encodeAadhaarCertificateToPEM(rawCertificate);

console.log(PemCertificate);
console.log("User Private Key: ", userPrivateKeyBytes.toBase64());
console.log("User Public Key: ", userPublicKeyBytes.toBase64());


// The users will securely store their private keys and the PEM certificate issued to them

// ========================================== //

// This is how the KYC verifier will verify the certificate and the signature on the data

const isCertValid = CA.verifyAadhaarCertificate(ca.decodeAadhaarCertificateFromPEM(PemCertificate), govPublicKeyString)
console.log("Is Certificate Valid?", isCertValid);


