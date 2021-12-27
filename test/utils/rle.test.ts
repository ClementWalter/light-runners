// See https://stackoverflow.com/a/61155795/4444546
import { expect } from "chai";
import { decode, encode } from "../../utils/rle";

describe("rle", function () {
  let hexString: string, rleString: string;
  beforeEach(() => {
    hexString =
      "abab" + "cccccc" + "cd" + "dddd" + "ab" + "bc" + "cc" + "dddd" + "ff";
    rleString =
      "2ab" + "3cc" + "1cd" + "2dd" + "1ab" + "1bc" + "1cc" + "2dd" + "1ff";
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
});
