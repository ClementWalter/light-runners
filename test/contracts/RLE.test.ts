import { setupUser, setupUsers } from "./utils";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const { expect } = chai;
import {
  deployments,
  ethers,
  getNamedAccounts,
  getUnnamedAccounts,
} from "hardhat";

async function setup() {
  await deployments.fixture(["RLE"]);
  const contracts = {
    RLE: await ethers.getContract("RLE"),
  };
  const { deployer } = await getNamedAccounts();
  const users = await setupUsers(await getUnnamedAccounts(), contracts);
  return {
    ...contracts,
    users,
    deployer: await setupUser(deployer, contracts),
  };
}

describe("RLE", function () {
  describe("decode(bytes)", () => {
    it("Should decode RLE encoded bytes", async function () {
      const { RLE } = await setup();
      const rleString = "0x03ff10aa0100";
      const decodedString =
        "0x" +
        "ff".repeat(parseInt("03", 16)) +
        "aa".repeat(parseInt("10", 16)) +
        "00".repeat(parseInt("01", 16));
      const res = await RLE.functions["decode(bytes)"](rleString);
      expect(res[0]).to.equal(decodedString);
    });
  });
  describe("decode(bytes,uint256,uint256)", () => {
    it("Should decode and return all bytes", async function () {
      const { RLE } = await setup();
      const rleString = "0x03ff10aa0100";
      const decodedString =
        "0x" +
        "ff".repeat(parseInt("03", 16)) +
        "aa".repeat(parseInt("10", 16)) +
        "00".repeat(parseInt("01", 16));
      const res = await RLE.functions["decode(bytes,uint256,uint256)"](
        rleString,
        0,
        20
      );
      expect(res[0]).to.equal(decodedString);
    });
    it("Should skip bytes in the first group", async function () {
      const { RLE } = await setup();
      const rleString = "0x03ff10aa0100";
      const decodedString =
        "0x" +
        "ff".repeat(parseInt("01", 16)) +
        "aa".repeat(parseInt("10", 16)) +
        "00".repeat(parseInt("01", 16));
      const res = await RLE.functions["decode(bytes,uint256,uint256)"](
        rleString,
        2,
        18
      );
      expect(res[0]).to.equal(decodedString);
    });
    it("Should return bytes from second group only", async function () {
      const { RLE } = await setup();
      const rleString = "0x03ff10aa0100";
      const decodedString = "0x" + "aa".repeat(10);
      const res = await RLE.functions["decode(bytes,uint256,uint256)"](
        rleString,
        5,
        10
      );
      expect(res[0]).to.equal(decodedString);
    });
    it("Should return bytes from second and third group", async function () {
      const { RLE } = await setup();
      const rleString = "0x03ff10aa0100";
      const decodedString = "0x" + "aa".repeat(14) + "00";
      const res = await RLE.functions["decode(bytes,uint256,uint256)"](
        rleString,
        5,
        15
      );
      expect(res[0]).to.equal(decodedString);
    });
    it("Should revert when there is not enough bytes", async function () {
      const { RLE } = await setup();
      const rleString = "0x03ff10aa0100";
      expect(RLE.functions["decode(bytes,uint256,uint256)"](rleString, 2, 19))
        .to.be.reverted;
    });
  });
});
