// noinspection JSUnusedGlobalSymbols

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import fs from "fs";
import { Layers, LayerInput } from "../utils/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("ChainRunnersBaseRenderer", {
    from: deployer,
    log: true,
  });
  const layers = (
    JSON.parse(fs.readFileSync("runners.json", { encoding: "utf-8" })) as Layers
  ).map((layer): LayerInput => {
    return {
      name: layer.itemName,
      hexString: layer.hexString,
      layerIndex: layer.layerIndex,
      itemIndex: layer.itemIndex,
    };
  });

  await execute(
    "ChainRunnersBaseRenderer",
    { from: deployer, log: true },
    "setLayers",
    layers
  );
  const layer00 = await read("ChainRunnersBaseRenderer", "getLayer", 0, 0);
  console.log(layer00.hexString);
};
export default func;
func.tags = ["ChainRunners"];
