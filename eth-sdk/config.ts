import { defineConfig } from "@dethcrypto/eth-sdk";

export default defineConfig({
  contracts: {
    mainnet: {
      chainRunnersBaseRenderer: "0xfDac77881ff861fF76a83cc43a1be3C317c6A1cC",
    },
  },
  etherscanKey: process.env.ETHERSCAN_API_KEY,
});
