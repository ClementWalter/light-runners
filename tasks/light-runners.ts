import { task } from "hardhat/config";
import fs from "fs";
import { decode, encode } from "../utils/rle";

type Traits = Record<string, Record<string, string>>;

task("light-runners", "RLE encode the runners traits to a JSON file")
  .addOptionalParam("input", "The output file", "runners.json")
  .addOptionalParam("output", "The output file", "light-runners.json")
  .setAction(async ({ input, output }) => {
    const traits: Traits = JSON.parse(
      fs.readFileSync(input, { encoding: "utf-8" })
    );
    const lightTraits: Traits = JSON.parse(JSON.stringify(traits));
    const bytesCount = [];
    const lightBytesCount = [];
    for (const trait of Object.entries(lightTraits)) {
      for (const design of Object.entries(trait[1])) {
        const originalString = design[1].slice(2);
        const encodedString = encode(originalString);
        bytesCount.push(originalString.length / 2);
        lightBytesCount.push(encodedString.length / 2);

        if (decode(encodedString) !== originalString) {
          console.log(originalString);
          console.log(encodedString);
          console.log(decode(encodedString));
          break;
        }
        lightTraits[trait[0]][design[0]] = "0x" + encode(design[1].slice(2));
      }
    }

    fs.writeFileSync(output, JSON.stringify(traits, null, 2));

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
