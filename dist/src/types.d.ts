type Bit = "0" | "1";
export type EncodedChar = `${Bit}${Bit}${Bit}${Bit}${Bit}`;
export type EncodedGender = `${Bit}${Bit}`;
export type EncodedVersion = `${Bit}${Bit}${Bit}`;
export type EncodedAadhaar = Bit[];
export type EncodedDOB = Bit[];
export type EncodedPAN = Bit[];
export type EncodedSignature = Bit[];
export type DecodedGender = "Male" | "Female" | "Other" | "Unknown";
export type DecodedDOB = {
    day: number;
    month: number;
    year: number;
};
export type DecodedAadhaar = Number;
export type DecodedVersion = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type DecodedPAN = string;
export type DecodedSignature = ArrayBuffer;
export {};
