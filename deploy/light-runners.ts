// noinspection JSUnusedGlobalSymbols

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const RLE = await deployments.get("RLE");
  await deploy("LightRunners", {
    from: deployer,
    log: true,
    libraries: { RLE: RLE.address },
  });
};
export default func;
func.tags = ["LightRunners"];
func.dependencies = ["RLE"];
