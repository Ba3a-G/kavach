import type { DecodedVersion, EncodedChar, EncodedVersion, EncodedGender, DecodedGender, EncodedDOB, DecodedDOB, EncodedAadhaar, DecodedAadhaar } from "./types";
export declare class Encoder {
    static encodeString(input: string): EncodedChar[];
    static decodeString(input: EncodedChar[]): string;
    static encodeVersion(input: DecodedVersion): EncodedVersion;
    static decodeVersion(input: EncodedVersion): DecodedVersion;
    static encodeGender(input: DecodedGender): EncodedGender;
    static decodeGender(input: EncodedGender): DecodedGender;
    static encodeDOB(input: DecodedDOB): EncodedDOB;
    static decodeDOB(input: EncodedDOB): DecodedDOB;
    static encodeAadhaar(input: DecodedAadhaar): EncodedAadhaar;
    static decodeAadhaar(input: EncodedAadhaar): DecodedAadhaar;
    encodeData(version: DecodedVersion, gender: DecodedGender, aadhaar: DecodedAadhaar, dob: DecodedDOB, name: string): ArrayBuffer;
    decodeData(data: ArrayBuffer): {
        version: DecodedVersion;
        gender: DecodedGender;
        aadhaar: DecodedAadhaar;
        dob: DecodedDOB;
        name: string;
    };
}
