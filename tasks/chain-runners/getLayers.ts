import { getMainnetSdk } from "@dethcrypto/eth-sdk-client";

import { task } from "hardhat/config";
import fs from "fs";
import { decode } from "../../utils/base64";
import { Layers } from "../../utils/types";

task("get-layers", "Export the runners traits to a JSON file")
  .addOptionalParam("output", "The output file", "runners-base.json")
  .setAction(async ({ output }, { ethers, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts();
    const signer = await ethers.getSigner(deployer);
    const sdk = getMainnetSdk(signer);

    const traits = [
      "Background",
      "Race",
      "Face",
      "Mouth",
      "Nose",
      "Eyes",
      "Ear Accessory",
      "Face Accessory",
      "Mask",
      "Head Below",
      "Eye Accessory",
      "Head Above",
      "Mouth Accessory",
    ];

    const layers: Layers = [];
    for (let i = 0; i < traits.length; i++) {
      const traitName = traits[i];
      console.log(`${traitName}`);
      let j = 0;
      let itemName;
      let isItem;
      do {
        const [name, data] = await sdk.chainRunnersBaseRenderer.getLayer(i, j);
        itemName = decode(name);
        isItem = itemName.replace(/' '/g, "") !== "";
        if (isItem) {
          console.log(`  ${itemName}`);
          layers.push({
            traitName,
            itemName,
            hexString: data,
            layerIndex: i,
            itemIndex: j,
          });
          j++;
        }
      } while (isItem);
      console.log(" * Number of items:", j);
    }
    console.log(" * Total number of layers:", layers.length);

    fs.writeFileSync(output, JSON.stringify(layers, null, 2));
  });
