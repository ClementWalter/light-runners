import { setupUser, setupUsers } from "./utils";
import { expect } from "chai";
import {
  deployments,
  ethers,
  getNamedAccounts,
  getUnnamedAccounts,
} from "hardhat";

async function setup() {
  await deployments.fixture(["LightRunners"]);
  const contracts = {
    LightRunners: await ethers.getContract("LightRunners"),
  };
  const { deployer } = await getNamedAccounts();
  const users = await setupUsers(await getUnnamedAccounts(), contracts);
  return {
    ...contracts,
    users,
    deployer: await setupUser(deployer, contracts),
  };
}

describe("LightRunners", function () {
  it("Should return empty string after deployment", async function () {
    const { LightRunners } = await setup();
    expect(await LightRunners.content()).to.equal("0x");
  });
  it("Should set a one byte length string", async function () {
    const { LightRunners } = await setup();
    await LightRunners.setContent("0x0140");
    expect(await LightRunners.content()).to.equal("0x40");
  });
});
