import { task } from "hardhat/config";
import fs from "fs";
import { Layers } from "../../utils/types";
import { getMainnetSdk } from "@dethcrypto/eth-sdk-client";

task("extract-colors", "Export global palette used for the runners")
  .addOptionalParam(
    "input",
    "The output file of the get-layers task",
    "runners.json"
  )
  .addOptionalParam(
    "output",
    "The output file containing the palette",
    "palette.json"
  )
  .setAction(async ({ input }, { ethers, getNamedAccounts }) => {
    const layers: Layers = JSON.parse(fs.readFileSync(input, "utf8"));
    const { deployer } = await getNamedAccounts();
    const signer = await ethers.getSigner(deployer);
    const sdk = getMainnetSdk(signer);
    const numColors = await sdk.chainRunnersBaseRenderer.NUM_COLORS();

    // each color is 4 bytes, R, G, B, A
    const numBytes = numColors.toNumber() * 4;
    const colors = layers
      .map(
        (layer) =>
          layer.hexString
            .slice(2)
            .slice(0, numBytes * 2)
            .match(/.{8}/g) || []
      )
      .reduce((acc, cur) => [...acc, ...cur], []);
    const palette = Array.from(new Set(colors));

    console.log(palette);
    console.log(
      `${palette.length} colors extracted from ${layers.length} layers`
    );
    fs.writeFileSync(
      "./palette.json",
      JSON.stringify(palette, null, 2),
      "utf8"
    );
  });
