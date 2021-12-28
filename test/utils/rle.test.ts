// See https://stackoverflow.com/a/61155795/4444546
import { expect } from "chai";
import { decode, encode, intToHex } from "../../utils/rle";

describe("rle", function () {
  let hexString: string, rleString: string;
  beforeEach(() => {
    hexString =
      "ab".repeat(2) +
      "cc".repeat(3) +
      "cd".repeat(1) +
      "dd".repeat(2) +
      "ab".repeat(1) +
      "bc".repeat(1) +
      "cc".repeat(1) +
      "dd".repeat(2) +
      "ff".repeat(1);
    rleString =
      intToHex(2) +
      "ab" +
      intToHex(3) +
      "cc" +
      intToHex(1) +
      "cd" +
      intToHex(2) +
      "dd" +
      intToHex(1) +
      "ab" +
      intToHex(1) +
      "bc" +
      intToHex(1) +
      "cc" +
      intToHex(2) +
      "dd" +
      intToHex(1) +
      "ff";
  });
  describe("encode", () => {
    it("should return encoded hexString", () => {
      expect(encode(hexString)).to.equal(rleString);
    });
  });
  describe("decode", () => {
    it("should return decoded hexString", () => {
      expect(decode(rleString)).to.equal(hexString);
    });
  });
  describe("encode/decode", () => {
    it("should return same hexString", () => {
      expect(decode(encode(hexString))).to.equal(hexString);
    });
  });
  describe("decode/encode", () => {
    it("should return same rleString", () => {
      expect(encode(decode(rleString))).to.equal(rleString);
    });
  });
  describe("intToHex", () => {
    it("should write number as hex string", () => {
      expect(intToHex(0)).to.equal("00");
      expect(intToHex(2)).to.equal("02");
      expect(intToHex(10)).to.equal("0a");
      expect(intToHex(10)).to.equal("0a");
      expect(intToHex(16)).to.equal("10");
    });
    it("should return original number", () => {
      expect(parseInt(intToHex(0), 16)).to.equal(0);
      expect(parseInt(intToHex(2), 16)).to.equal(2);
      expect(parseInt(intToHex(10), 16)).to.equal(10);
      expect(parseInt(intToHex(10), 16)).to.equal(10);
      expect(parseInt(intToHex(16), 16)).to.equal(16);
    });
  });
});
