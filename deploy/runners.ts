// noinspection JSUnusedGlobalSymbols

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import fs from "fs";
import { Layers, LayerInput } from "../utils/types";
import { decode } from "../utils/base64";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
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
  const runner1SVG = await read(
    "ChainRunnersBaseRenderer",
    "tokenSVG",
    ethers.BigNumber.from(
      "103081089982373387917516143957755319387957419765940801994810980124138188719328"
    )
  );
  fs.writeFileSync("runner1.svg", decode(runner1SVG));
};
export default func;
func.tags = ["ChainRunners"];
