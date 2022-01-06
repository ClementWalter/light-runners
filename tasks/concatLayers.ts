import { task } from "hardhat/config";
import fs from "fs";
import { Layer } from "../utils/types";
import { BytesLike } from "@ethersproject/bytes";
import { chunk } from "lodash";

type LayerBytes = {
  layerIndex: BytesLike;
  itemIndex: BytesLike;
  hexString: BytesLike;
  itemName: string;
};

task("concat-layers", "RLE encode the runners traits to a JSON file")
  .addOptionalParam("input", "The output file", "runners-base.json")
  .addOptionalParam("output", "The output file", "runners-concat.json")
  .setAction(async ({ input, output }, { ethers }) => {
    const {
      utils: { hexlify, hexDataLength, hexConcat },
    } = ethers;

    const traits: LayerBytes[] = JSON.parse(
      fs.readFileSync(input, { encoding: "utf-8" })
    ).map((layer: Layer) => ({
      ...layer,
      layerIndex: hexlify(layer.layerIndex),
      itemIndex: hexlify(layer.itemIndex),
      hexString: hexlify(layer.hexString),
    }));
    const traitBytes = hexDataLength(traits[0].hexString);

    const MAX_CONTRACT_SIZE = 24_000;
    const traitsPerStorage = Math.floor(MAX_CONTRACT_SIZE / traitBytes);
    const traitsConcat = chunk(traits, traitsPerStorage).map((traitsChunk) =>
      traitsChunk.reduce((acc, trait) => ({
        layerIndex: hexConcat([acc.layerIndex, hexlify(trait.layerIndex)]),
        itemIndex: hexConcat([acc.itemIndex, hexlify(trait.itemIndex)]),
        hexString: hexConcat([acc.hexString, hexlify(trait.hexString)]),
        itemName: acc.itemName + "|" + trait.itemName,
      }))
    );

    fs.writeFileSync(output, JSON.stringify(traitsConcat, null, 2));
  });
