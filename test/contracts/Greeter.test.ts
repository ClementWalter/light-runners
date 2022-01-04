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
  describe("setGreeting", function () {
    it("Should return the new greeting once it's changed", async function () {
      const { Greeter } = await setup();
      await Greeter.setGreeting("Hello, Hardhat!");
      expect(await Greeter.greet()).to.equal("Hello, Hardhat!");
      await Greeter.setGreeting("Hello, Hardhat! Again!");
      expect(await Greeter.greet()).to.equal("Hello, Hardhat! Again!");
    });
  });
  describe("setGreetings", function () {
    it("Should set the greetings to the new value", async function () {
      const { Greeter } = await setup();
      const greetings = {
        id: 0,
        text: "Hello, Hardhat!",
      };
      await Greeter.setGreetings([greetings]);
      expect(await Greeter.greetings(0)).to.eql(Object.values(greetings));
    });
  });
  // describe("addGreeting", function () {
  //   it("Should add one Greeting", async function () {
  //     const { Greeter } = await setup();
  //     await Greeter.addGreeting(0, "Hello, Hardhat!");
  //     expect(await Greeter.greetings()).to.equal({
  //       id: 0,
  //       text: "Hello, Hardhat!",
  //     });
  //   });
  //   it("Should add one Greeting with id", async function () {
  //     const { Greeter } = await setup();
  //     await Greeter.addGreeting(0);
  //     expect(await Greeter.greetings()).to.equal({
  //       id: 0,
  //       text: "test",
  //     });
  //   });
  //   it("Should add one Greeting with text", async function () {
  //     const { Greeter } = await setup();
  //     await Greeter.addGreeting(0);
  //     expect(await Greeter.greetings()).to.equal({
  //       id: 0,
  //       text: "test",
  //     });
  //   });
  // });
});
