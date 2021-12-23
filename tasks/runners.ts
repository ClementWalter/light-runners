import { task } from "hardhat/config";
import fs from "fs";
import { decode } from "../utils/base64";

task("runners", "Export the runners traits to a JSON file")
  .addOptionalParam("output", "The output file", "runners.json")
  .setAction(async ({ output }, { ethers, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts();
    const signer = await ethers.getSigner(deployer);
    const runnersRendererAddress = "0xfDac77881ff861fF76a83cc43a1be3C317c6A1cC";
    const runnersAbi = [
      "function getLayer(uint8 layerIndex, uint8 itemIndex) view returns (tuple(string,bytes))",
    ];
    const runnersContract = await new ethers.Contract(
      runnersRendererAddress,
      runnersAbi,
      signer
    );

    type Layer = {
      [key: string]: string;
    };
    type Layers = {
      [key: string]: Layer;
    };

    const layers: Layers = {};

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

    for (let i = 0; i < traits.length; i++) {
      const traitName = traits[i];
      console.log(`${traitName}`);
      layers[traitName] = {} as Layer;
      for (let j = 0; j < 2; j++) {
        const [name, data] = await runnersContract.getLayer(i, j);
        const layerName = decode(name);
        console.log(`  ${layerName}`);
        if (layerName.replace(/' '/g, "") === "") {
          break;
        }
        layers[traitName][layerName] = data as string;
      }
    }

    fs.writeFileSync(output, JSON.stringify(layers, null, 2));
  });
