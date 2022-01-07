import { task } from "hardhat/config";
import fs from "fs";
import { encode } from "../utils/rle";
import { Layer } from "../utils/types";

task("rle-layers", "RLE encode the runners traits to a JSON file")
  .addOptionalParam("input", "The output file", "runners-base.json")
  .addOptionalParam("output", "The output file", "runners-rle.json")
  .setAction(async ({ input, output }) => {
    const traits: Layer[] = JSON.parse(
      fs.readFileSync(input, { encoding: "utf-8" })
    );
    const bytesCount: number[] = [];
    const lightBytesCount: number[] = [];
    const lightTraits = traits.map((trait) => {
      const originalBytes = trait.hexString.slice(2);
      const encodedBytes = encode(originalBytes);
      bytesCount.push(originalBytes.length / 2);
      lightBytesCount.push(encodedBytes.length / 2);
      return { ...trait, hexString: "0x" + encodedBytes };
    });

    fs.writeFileSync(output, JSON.stringify(lightTraits, null, 2));

    console.log(`Original bytes count: ${bytesCount.reduce((p, c) => p + c)}`);
    console.log(
      `Light bytes count: ${lightBytesCount.reduce((p, c) => p + c)}`
    );
    console.log(
      `Ratio: ${Math.round(
        (lightBytesCount.reduce((p, c) => p + c) /
          bytesCount.reduce((p, c) => p + c)) *
          100
      )}%`
    );
    console.log(
      `Average light bytes length: ${Math.round(
        lightBytesCount.reduce((p, c) => p + c) / lightBytesCount.length
      )} VS ${Math.round(
        bytesCount.reduce((p, c) => p + c) / bytesCount.length
      )}`
    );
    console.log(
      `Max light bytes length: ${lightBytesCount.reduce((p, c) =>
        p > c ? p : c
      )} VS ${bytesCount.reduce((p, c) => (p > c ? p : c))}`
    );
  });
