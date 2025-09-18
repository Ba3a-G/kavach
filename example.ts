/*
This is an example file to demonstrate how to use the Encoder class to encode data, generate a QR code, decode the QR code, and then decode the data back to its original form.
I have encoded the base64 version of of the ArrayBuffer but ideally they should be encoded in byte mode.
Use suitable library for your platform and environment.
This library only exports the Encoder (which also includes the decoder lol) and Signer modules.
*/


import { Encoder } from "@/encoder";
import QRCode from "qrcode";
import QRCodeReader from 'qrcode-reader';
import { Jimp } from 'jimp';

import type { DecodedGender, DecodedVersion } from "@/types";

let version = 1 as DecodedVersion; // three bits, use 1 for now, see type def for allowed values
let gender = "Male" as DecodedGender; // See type def for allowed values
let aadhaar = 123456789012; // 12 digit number
let dob = { day: 1, month: 1, year: 2000 }; // Date of Birth
let name = "Aryan Kumar"; // Will be truncated to 19 chars

const encoder = new Encoder()
let encoded = encoder.encodeData(
    version,
    gender,
    aadhaar,
    dob,
    name
) // this returns ArrayBuffer

console.log(encoded);

// QR in base64/DataURL
const base64URL = await QRCode.toDataURL(Buffer.from(encoded).toBase64());

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

// Finally decoding data from QRBuffer
console.log(encoder.decodeData(qrBuffer.buffer.slice(qrBuffer.byteOffset, qrBuffer.byteOffset + qrBuffer.byteLength)));
