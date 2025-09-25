import { expect, it, describe } from "bun:test";

import { Encoder } from "../src/encoder";
import type { DecodedVersion, EncodedGender } from "../src/types";

describe("Encoder", () => {
  describe("String encoding/decoding", () => {
    const testStrings = [
      "Hello World",
      "This is test string",
      "Short",
      "Longer string",
      "Even longer string",
      "Shortest",
      "Longest string poss",
      "Another test string",
    ];

    const negativeTestStrings = ["With \x00 Byte"];

    testStrings.forEach((testString) => {
      it(`should encode and decode "${testString}" correctly`, () => {
        const encoded = Encoder.encodeString(testString);
        const decoded = Encoder.decodeString(encoded);

        expect(decoded.data.toUpperCase()).toBe(testString.toUpperCase());
      });
    });

    it("should handle edge cases for string encoding", () => {
      const edgeCases = ["", " ", "A", "ABCDEFGHIJKLMNOPQRS"]; // Empty, space, single char, max length

      edgeCases.forEach((testString) => {
        const encoded = Encoder.encodeString(testString);
        const decoded = Encoder.decodeString(encoded);
        expect(decoded.data.toUpperCase()).toBe(testString.toUpperCase());
      });
    });

    negativeTestStrings.forEach((testString) => {
      const encoded = Encoder.encodeString(testString);
      const decoded = Encoder.decodeString(encoded);
      expect(decoded.data.toUpperCase()).not.toBe(testString.toUpperCase());
    });
  });

  describe("Version encoding/decoding", () => {
    const validVersions: DecodedVersion[] = [0, 1, 2, 3, 4, 5, 6, 7];

    validVersions.forEach((version) => {
      it(`should encode and decode version ${version} correctly`, () => {
        const encoded = Encoder.encodeVersion(version);
        const decoded = Encoder.decodeVersion(encoded);

        expect(decoded).toBe(version);
      });
    });
  });

  describe("Gender encoding/decoding", () => {
    const genderCodes = ["00", "01", "10", "11"];

    genderCodes.forEach((genderCode) => {
      it(`should encode and decode gender code "${genderCode}" correctly`, () => {
        const decoded = Encoder.decodeGender(genderCode as EncodedGender);
        const encoded = Encoder.encodeGender(decoded);

        expect(encoded).toBe(genderCode as EncodedGender);
      });
    });
  });

  describe("Date of birth encoding/decoding", () => {
    it("should handle sample dates correctly", () => {
      const sampleDates = [
        { day: 1, month: 1, year: 2000 },
        { day: 29, month: 2, year: 2000 }, // Leap year
        { day: 28, month: 2, year: 2001 }, // Non-leap year
        { day: 31, month: 12, year: 1999 },
        { day: 15, month: 8, year: 1947 },
        { day: 4, month: 7, year: 1900 },
      ];

      sampleDates.forEach((date) => {
        const encoded = Encoder.encodeDOB(date);
        const decoded = Encoder.decodeDOB(encoded);

        expect(decoded).toEqual(date);
      });
    });
  });

  // Aadhaar card encoding and decoding tests
  describe("Aadhaar Encoding Tests", () => {
    it("should encode and decode Aadhaar card numbers", () => {
      const AadhaarNumbers = [
        "123456789012",
        "987654321098",
        "111111111111",
        "222222222222",
        "999999999999",
        "100000000000",
        "000000000000",
        "000000000001",
      ];

      AadhaarNumbers.forEach((number) => {
        const encoded = Encoder.encodeAadhaarNumber(parseInt(number));
        const decoded = Encoder.decodeAadhaar(encoded);

        expect(decoded).toBe(parseInt(number));
      });
    });
  });

  describe("Integration tests", () => {
    it("should handle complete encoding/decoding cycle", () => {
      const testData = {
        string: "Hello World",
        version: 3 as DecodedVersion,
        gender: "01" as EncodedGender,
        dob: { day: 15, month: 8, year: 1947 },
      };

      // Encode all
      const encodedString = Encoder.encodeString(testData.string);
      const encodedVersion = Encoder.encodeVersion(testData.version);
      const encodedGender = Encoder.encodeGender(
        Encoder.decodeGender(testData.gender),
      );
      const encodedDOB = Encoder.encodeDOB(testData.dob);

      // Decode all
      const decodedString = Encoder.decodeString(encodedString);
      const decodedVersion = Encoder.decodeVersion(encodedVersion);
      const decodedGender = Encoder.decodeGender(testData.gender);
      const decodedDOB = Encoder.decodeDOB(encodedDOB);

      // Assert all
      expect(decodedString.data.toUpperCase()).toBe(testData.string.toUpperCase());
      expect(decodedVersion).toBe(testData.version);
      expect(encodedGender).toBe(testData.gender);
      expect(decodedDOB).toEqual(testData.dob);
    });
  });
});
