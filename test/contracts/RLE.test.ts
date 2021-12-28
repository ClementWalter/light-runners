import { setupUser, setupUsers } from "./utils";
import { expect } from "chai";
import {
  deployments,
  ethers,
  getNamedAccounts,
  getUnnamedAccounts,
} from "hardhat";

async function setup() {
  await deployments.fixture(["LightRunner"]);
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
  it("Should decode RLE encoded bytes", async function () {
    const { RLE } = await setup();
    const rleString = "0x03ff10aa0100";
    const decodedString =
      "0x" +
      "ff".repeat(parseInt("03", 16)) +
      "aa".repeat(parseInt("10", 16)) +
      "00".repeat(parseInt("01", 16));
    expect(await RLE.decode(rleString)).to.equal(decodedString);
  });
});
