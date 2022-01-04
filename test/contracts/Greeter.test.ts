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
  it("Should return the new greeting once it's changed 2", async function () {
    const { Greeter } = await setup();
    expect(await Greeter.greet()).to.equal("Hello, world!");
    await Greeter.setGreeting("Hello, Hardhat!");
    expect(await Greeter.greet()).to.equal("Hello, Hardhat!");
  });
  it("Should set the greetings to the new value", async function () {
    const { Greeter } = await setup();
    await Greeter.setGreetings([[0, "Hello, Hardhat!"]]);
    expect(await Greeter.greetings()).to.equal({
      id: 0,
      text: "Hello, Hardhat!",
    });
  });
  it("Should add one Greeting", async function () {
    const { Greeter } = await setup();
    await Greeter.addGreeting(0, "Hello, Hardhat!");
    expect(await Greeter.greetings()).to.equal({
      id: 0,
      text: "Hello, Hardhat!",
    });
  });
  it("Should add one Greeting", async function () {
    const { Greeter } = await setup();
    await Greeter.addGreeting(0);
    expect(await Greeter.greetings()).to.equal({
      id: 0,
      text: "test",
    });
  });
});
