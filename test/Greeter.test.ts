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
    Greeter: await ethers.getContract("Greeter"),
  };
  const { deployer } = await getNamedAccounts();
  const users = await setupUsers(await getUnnamedAccounts(), contracts);
  return {
    ...contracts,
    users,
    deployer: await setupUser(deployer, contracts),
  };
}

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const { Greeter } = await setup();
    expect(await Greeter.greet()).to.equal("Hello, world!");
    await Greeter.setGreeting("Hello, Hardhat!");
    expect(await Greeter.greet()).to.equal("Hello, Hardhat!");
  });
});
