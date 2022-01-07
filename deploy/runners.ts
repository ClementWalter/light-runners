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

type Renderer = {
  name: string;
  contract: string;
  traits: string;
  setLayers: string;
};

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy, execute, read } = deployments;
  const RLE = await deployments.get("RLE");

  const { deployer } = await getNamedAccounts();
  const renderers: Renderer[] = [
    // {
    //   name: "Base",
    //   contract: "ChainRunnersBaseRenderer",
    //   traits: "runners-base.json",
    //   setLayers: "setLayers((string,bytes,uint8,uint8)[])",
    // },
    // {
    //   name: "RLE",
    //   contract: "ChainRunnersRLERenderer",
    //   traits: "runners-rle.json",
    //   setLayers: "setLayers((string,bytes,uint8,uint8)[])",
    // },
    // {
    //   name: "SStore",
    //   contract: "ChainRunnersSStoreRenderer",
    //   traits: "runners-base.json",
    //   setLayers: "setLayers((string,bytes,uint8,uint8)[])",
    // },
    // {
    //   name: "SStore-RLE",
    //   contract: "ChainRunnersSStoreRLERenderer",
    //   traits: "runners-rle.json",
    //   setLayers: "setLayers((string,bytes,uint8,uint8)[])",
    // },
    // {
    //   name: "SStore-Concat",
    //   contract: "ChainRunnersSStoreConcatRenderer",
    //   traits: "runners-concat.json",
    //   setLayers: "setLayers((string[],bytes,bytes,bytes)[])",
    // },
    {
      name: "SStore-Concat-RLE",
      contract: "ChainRunnersSStoreConcatRLERenderer",
      traits: "runners-concat-rle.json",
      setLayers: "setLayers((string[],bytes,bytes,bytes)[])",
    },
  ];
  const gas: Record<string, DeployCost> = {};
  for (const renderer of renderers) {
    const deployTx = await deploy(renderer.contract, {
      from: deployer,
      log: true,
      libraries: { RLE: RLE.address },
    });

    const layers = (
      JSON.parse(
        fs.readFileSync(renderer.traits, { encoding: "utf-8" })
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
      renderer.contract,
      { from: deployer, log: true },
      renderer.setLayers,
      layers
    );
    gas[renderer.name] = {
      deploy: deployTx,
      setLayers: setLayersTx,
    };
    const runner1SVG = await read(
      renderer.contract,
      "tokenSVG",
      ethers.BigNumber.from(
        "103081089982373387917516143957755319387957419765940801994810980124138188719328"
      )
    );
    fs.writeFileSync(`runner1-${renderer.name}.svg`, decode(runner1SVG));
  }

  for (const [rendererName, { deploy, setLayers }] of Object.entries(gas)) {
    const totalCost = deploy.receipt
      ? BigNumber.from(deploy.receipt.gasUsed).add(
          BigNumber.from(setLayers.gasUsed)
        )
      : BigNumber.from(setLayers.gasUsed);
    console.log(`${rendererName} deploy cost: ${totalCost.toString()} gas`);
  }
};
export default func;
func.tags = ["ChainRunners"];
func.dependencies = ["RLE"];
