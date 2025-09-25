/*
This is an example file to demonstrate how to use the Encoder class to encode data, generate a QR code, decode the QR code, and then decode the data back to its original form.
I have encoded the base64 version of of the ArrayBuffer but ideally they should be encoded in byte mode.
Use suitable library for your platform and environment.
This library only exports the Encoder (which also includes the decoder lol) and Signer modules.
*/


import { Encoder } from ".././src/encoder";
import { Signer } from ".././src/signer";
import fs from "fs";
import QRCode from "qrcode";
import QRCodeReader from 'qrcode-reader';
import { Jimp } from 'jimp';

import type { DecodedVersion } from ".././src/types";

let version = 1 as DecodedVersion; // three bits, use 1 for now, see type def for allowed values
let dob = { day: 1, month: 1, year: 2000 }; // Date of Birth
let name = "Aryan Kumar"; // Will be truncated to 19 chars
let pan = "ABCDE1234F"; // 10 char PAN
let fathersName = "Lorem Ipsum"; // Will be truncated to 19 chars

const encoder = new Encoder()
let encoded = encoder.encodePANData(
    version,
    name,
    dob,
    pan,
    fathersName
) // this returns ArrayBuffer

console.log(encoded);

// Signing the data
const signer = new Signer(fs.readFileSync("./.keys/gov.pem", "utf-8"));
const signature = signer.sign(Buffer.from(encoded).toString('base64')); // Returns 64 byte signature
console.log('Signature:', Buffer.from(signature).toString('base64'));

// Signature + Data
let signatureWithEncodedData = new Uint8Array(signature.byteLength + encoded.byteLength);
signatureWithEncodedData.set(new Uint8Array(signature), 0);
signatureWithEncodedData.set(new Uint8Array(encoded), signature.byteLength);
console.log(signatureWithEncodedData);

// QR in base64/DataURL
const base64URL = await QRCode.toDataURL(Buffer.from(signatureWithEncodedData).toBase64());

console.log(base64URL);

async function decodeQRFromDataURL(dataUrl: string) {
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const image = await Jimp.read(imageBuffer);
    return new Promise<string>((resolve, reject) => {
        const qr = new QRCodeReader();
        qr.callback = (err: any, value: any) => {
            if (err) return reject(err);
            resolve(value.result);
        };
        qr.decode(image.bitmap);
    });
}

const qrPayload = await decodeQRFromDataURL(base64URL);
console.log('QR Decoded Payload:', qrPayload);
const qrBuffer = Buffer.from(qrPayload, 'base64');

// First 64 bytes is signature, rest is data
const qrSignature = qrBuffer.slice(0, 64);
const qrData = qrBuffer.slice(64);

// Verifying signature
const isValid = Signer.verify(qrData.toString('base64'), new Uint8Array(qrSignature), fs.readFileSync("./.keys/gov_pub.pem", "utf-8"));
console.log('Is signature valid?', isValid);

// Finally decoding data from QRBuffer
console.log(encoder.decodePANData(new Uint8Array(qrData).buffer));
