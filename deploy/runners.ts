// noinspection JSUnusedGlobalSymbols

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import fs from "fs";
import { Layers } from "../utils/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("ChainRunnersBaseRenderer", {
    from: deployer,
    log: true,
  });
  const runners: Layers = JSON.parse(
    fs.readFileSync("runners.json", { encoding: "utf-8" })
  );
  const layers = [];
  // iterate over runners object
  for (const [layerName, layerTraits] of Object.entries(runners)) {
    for (const [traitName, traitHexString] of Object.entries(layerTraits)) {
      layers.push({
        name: traitName,
        hexString: traitHexString,
        layerIndex: Object.keys(runners).indexOf(layerName),
        itemIndex: Object.keys(layerTraits).indexOf(traitName),
      });
    }
  }

  await execute(
    "ChainRunnersBaseRenderer",
    { from: deployer, log: true },
    "setLayers",
    layers.slice(0, 3)
  );
};
export default func;
func.tags = ["ChainRunners"];
