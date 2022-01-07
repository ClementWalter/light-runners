import { task } from "hardhat/config";
import fs from "fs";
import { encode } from "../utils/rle";
import { LayerConcat } from "../utils/types";

task("concat-rle-layers", "RLE encode the runners traits to a JSON file")
  .addOptionalParam("input", "The output file", "runners-concat.json")
  .addOptionalParam("output", "The output file", "runners-concat-rle.json")
  .setAction(async ({ input, output }) => {
    const traits: LayerConcat[] = JSON.parse(
      fs.readFileSync(input, { encoding: "utf-8" })
    );
    const lightTraits = traits.map((trait) => {
      const encodedBytes = encode(trait.hexString.slice(2));
      const encodedLayerIndex = encode(trait.layerIndex.slice(2));

      return {
        ...trait,
        hexString: "0x" + encodedBytes,
        layerIndex: "0x" + encodedLayerIndex,
      };
    });

    fs.writeFileSync(output, JSON.stringify(lightTraits, null, 2));
  });
