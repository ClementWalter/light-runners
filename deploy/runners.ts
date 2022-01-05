// noinspection JSUnusedGlobalSymbols

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, Receipt, DeployResult } from "hardhat-deploy/types";
import fs from "fs";
import { Layers, LayerInput } from "../utils/types";
import { decode } from "../utils/base64";
import { BigNumber } from "ethers";

type DeployCost = {
  deploy: DeployResult;
  setLayers: Receipt;
};
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy, execute, read } = deployments;
  const RLE = await deployments.get("RLE");

  const { deployer } = await getNamedAccounts();
  const renderers = ["Base", "RLE"];
  const gas: Record<string, DeployCost> = {};
  for (const renderer of renderers) {
    const contractRenderer = `ChainRunners${renderer}Renderer`;
    const deployTx = await deploy(contractRenderer, {
      from: deployer,
      log: true,
      libraries: { RLE: RLE.address },
    });

    const layers = (
      JSON.parse(
        fs.readFileSync(`runners-${renderer}.json`, { encoding: "utf-8" })
      ) as Layers
    ).map((layer): LayerInput => {
      return {
        name: layer.itemName,
        hexString: layer.hexString,
        layerIndex: layer.layerIndex,
        itemIndex: layer.itemIndex,
      };
    });
    const setLayersTx = await execute(
      contractRenderer,
      { from: deployer, log: true },
      "setLayers",
      layers
    );
    gas[renderer] = {
      deploy: deployTx,
      setLayers: setLayersTx,
    };
    const runner1SVG = await read(
      contractRenderer,
      "tokenSVG",
      ethers.BigNumber.from(
        "103081089982373387917516143957755319387957419765940801994810980124138188719328"
      )
    );
    fs.writeFileSync(`runner1-${renderer}.svg`, decode(runner1SVG));
  }

  for (const [renderer, { deploy, setLayers }] of Object.entries(gas)) {
    const totalCost = deploy.receipt
      ? BigNumber.from(deploy.receipt.gasUsed).add(
          BigNumber.from(setLayers.gasUsed)
        )
      : BigNumber.from(setLayers.gasUsed);
    console.log(`${renderer} deploy cost: ${totalCost.toString()} gas`);
  }
};
export default func;
func.tags = ["ChainRunners"];
