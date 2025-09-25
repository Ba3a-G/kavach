import { Charset, ReverseCharset } from "./mappings";
export class Encoder {
    static encodeString(input) {
        let charArray = [];
        // Max 19 chars allowed, last is null byte, so total 20
        input = input.slice(0, 19);
        input = input.toUpperCase();
        for (const char of input) {
            if (char === " ") {
                charArray.push(Charset["\x20"]);
                continue;
            }
            charArray.push(Charset[char]);
        }
        charArray.push(Charset["\x00"]);
        return charArray;
    }
    static decodeString(input) {
        let output = "";
        for (const char of input) {
            if (char == Charset["\x00"]) {
                break;
            }
            output += ReverseCharset[char];
        }
        return output;
    }
    static encodeVersion(input) {
        return input.toString(2).padStart(3, "0");
    }
    static decodeVersion(input) {
        if (input.length !== 3) {
            throw new Error("Invalid version length");
        }
        return parseInt(input, 2);
    }
    static encodeGender(input) {
        let genderEnum = {
            Male: "00",
            Female: "01",
            Other: "10",
            Unknown: "11",
        };
        return genderEnum[input];
    }
    static decodeGender(input) {
        if (input.length !== 2) {
            throw new Error();
        }
        let genderEnum = {
            "00": "Male",
            "01": "Female",
            "10": "Other",
            "11": "Unknown",
        };
        return genderEnum[input];
    }
    static encodeDOB(input) {
        const year = input.year - 1900;
        return (input.day.toString(2).padStart(5, "0") +
            input.month.toString(2).padStart(4, "0") +
            year.toString(2).padStart(9, "0")).split("");
    }
    static decodeDOB(input) {
        if (input.length !== 18) {
            throw new Error("Invalid DOB length");
        }
        let day = parseInt(input.slice(0, 5).join(""), 2);
        let month = parseInt(input.slice(5, 9).join(""), 2);
        let year = parseInt(input.slice(9).join(""), 2) + 1900;
        return { day, month, year };
    }
    static encodeAadhaar(input) {
        return input.toString(2).padStart(40, "0").split("");
    }
    static decodeAadhaar(input) {
        if (input.length !== 40) {
            throw new Error("Invalid Aadhaar length");
        }
        return parseInt(input.join(""), 2);
    }
    encodeData(version, gender, aadhaar, dob, name) {
        let encodedData = [];
        encodedData.push(...Encoder.encodeVersion(version));
        encodedData.push(...Encoder.encodeGender(gender));
        encodedData.push(...Encoder.encodeAadhaar(aadhaar));
        encodedData.push(...Encoder.encodeDOB(dob));
        encodedData.push(...Encoder.encodeString(name).join(""));
        let byteArray = new Uint8Array(Math.ceil(encodedData.length / 8));
        for (let i = 0; i < encodedData.length; i++) {
            if (encodedData[i] === "1") {
                byteArray[Math.floor(i / 8)] |= 1 << (7 - (i % 8));
            }
        }
        return byteArray.buffer;
    }
    ;
    decodeData(data) {
        // array buffer to bit string
        let bitString = "";
        const byteArray = new Uint8Array(data);
        for (let i = 0; i < byteArray.length; i++) {
            bitString += byteArray[i].toString(2).padStart(8, "0");
        }
        let version = Encoder.decodeVersion(bitString.slice(0, 3));
        let gender = Encoder.decodeGender(bitString.slice(3, 5));
        let aadhaar = Encoder.decodeAadhaar(bitString.slice(5, 45).split(""));
        let dob = Encoder.decodeDOB(bitString.slice(45, 63).split(""));
        let nameBits = [];
        for (let i = 63; i < bitString.length; i += 5) {
            nameBits.push(bitString.slice(i, i + 5));
        }
        let name = Encoder.decodeString(nameBits);
        return {
            version,
            gender,
            aadhaar,
            dob,
            name
        };
    }
}
