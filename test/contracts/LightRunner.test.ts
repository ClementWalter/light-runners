import { setupUser, setupUsers } from "./utils";
import { expect } from "chai";
import {
  deployments,
  ethers,
  getNamedAccounts,
  getUnnamedAccounts,
} from "hardhat";

async function setup() {
  await deployments.fixture(["Greeter"]);
  const contracts = {
    LightRunner: await ethers.getContract("LightRunner"),
  };
  const { deployer } = await getNamedAccounts();
  const users = await setupUsers(await getUnnamedAccounts(), contracts);
  return {
    ...contracts,
    users,
    deployer: await setupUser(deployer, contracts),
  };
}

describe("LightRunner", function () {
  it("Should return empty string after deployment", async function () {
    const { LightRunner } = await setup();
    expect(await LightRunner.content()).to.equal("0x");
  });
  it("Should set a one byte length string", async function () {
    const { LightRunner } = await setup();
    await LightRunner.setContent("0xff");
    expect(await LightRunner.content()).to.equal("0xff");
  });
});
