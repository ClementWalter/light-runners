// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./ChainRunnersBaseRenderer.sol";
import "../lib/RLE.sol";

contract ChainRunnersRLERenderer is ChainRunnersBaseRenderer {
    function getLayer(uint8 layerIndex, uint8 itemIndex)
        public
        view
        override
        returns (Layer memory)
    {
        Layer memory layer = layers[layerIndex][itemIndex];
        layer.hexString = RLE.decode(layer.hexString);
        return layer;
    }
}
