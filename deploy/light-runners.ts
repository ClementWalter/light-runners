// noinspection JSUnusedGlobalSymbols

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import fs from "fs";
import { LayerInput, Layers } from "../utils/types";
import { decode } from "../utils/base64";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy, execute, read } = deployments;

  const RLE = await deployments.get("RLE");

  const { deployer } = await getNamedAccounts();
  await deploy("ChainRunnersRLERenderer", {
    from: deployer,
    log: true,
    libraries: { RLE: RLE.address },
  });
  const layers = (
    JSON.parse(
      fs.readFileSync("light-runners.json", { encoding: "utf-8" })
    ) as Layers
  ).map((layer): LayerInput => {
    return {
      name: layer.itemName,
      hexString: layer.hexString,
      layerIndex: layer.layerIndex,
      itemIndex: layer.itemIndex,
    };
  });

  await execute(
    "ChainRunnersRLERenderer",
    { from: deployer, log: true },
    "setLayers",
    layers
  );
  const runner1SVG = await read(
    "ChainRunnersRLERenderer",
    "tokenSVG",
    ethers.BigNumber.from(
      "103081089982373387917516143957755319387957419765940801994810980124138188719328"
    )
  );
  fs.writeFileSync("runner1-light.svg", decode(runner1SVG));
};
export default func;
func.tags = ["LightRunners"];
func.dependencies = ["RLE"];
