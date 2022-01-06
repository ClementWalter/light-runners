// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./ChainRunnersSStoreRenderer.sol";
import "@0xsequence/sstore2/contracts/SSTORE2.sol";
import "../lib/RLE.sol";

contract ChainRunnersSStoreRLERenderer is ChainRunnersSStoreRenderer {
    function getLayer(uint8 layerIndex, uint8 itemIndex)
        public
        view
        override
        returns (Layer memory)
    {
        return
            Layer(
                layerNames[layerIndex][itemIndex],
                RLE.decode(SSTORE2.read(layerAddresses[layerIndex][itemIndex]))
            );
    }
}
