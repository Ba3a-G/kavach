import type { DecodedVersion, EncodedChar, EncodedVersion, EncodedGender, DecodedGender, EncodedDOB, DecodedDOB, EncodedAadhaar, DecodedAadhaar, EncodedPAN, DecodedPAN } from "./types";
export declare class Encoder {
    static encodeString(input: string): EncodedChar[];
    static decodeString(input: EncodedChar[]): {
        data: string;
        stopAtIndex: number;
    };
    static encodeVersion(input: DecodedVersion): EncodedVersion;
    static decodeVersion(input: EncodedVersion): DecodedVersion;
    static encodeGender(input: DecodedGender): EncodedGender;
    static decodeGender(input: EncodedGender): DecodedGender;
    static encodeDOB(input: DecodedDOB): EncodedDOB;
    static decodeDOB(input: EncodedDOB): DecodedDOB;
    static encodeAadhaarNumber(input: DecodedAadhaar): EncodedAadhaar;
    static decodeAadhaar(input: EncodedAadhaar): DecodedAadhaar;
    static encodePANNumber(input: DecodedPAN): EncodedPAN;
    static decodePANNumber(input: EncodedPAN): DecodedPAN;
    encodePANData(version: DecodedVersion, name: string, dob: DecodedDOB, pan: DecodedPAN, fathersName: string): ArrayBuffer;
    decodePANData(data: ArrayBuffer): {
        version: DecodedVersion;
        name: string;
        dob: DecodedDOB;
        pan: DecodedPAN;
        fathersName: string;
    };
    encodeAadhaarData(version: DecodedVersion, gender: DecodedGender, aadhaar: DecodedAadhaar, dob: DecodedDOB, name: string): ArrayBuffer;
    decodeAadhaarData(data: ArrayBuffer): {
        version: DecodedVersion;
        gender: DecodedGender;
        aadhaar: DecodedAadhaar;
        dob: DecodedDOB;
        name: string;
    };
}
