// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./ChainRunnersBaseRenderer.sol";
import "@0xsequence/sstore2/contracts/SSTORE2.sol";

contract ChainRunnersSStoreRenderer is ChainRunnersBaseRenderer {
    mapping(uint256 => address)[NUM_LAYERS] layerAddresses;
    mapping(uint256 => string)[NUM_LAYERS] layerNames;

    function setLayers(LayerInput[] calldata toSet)
        external
        override
        onlyOwner
    {
        for (uint16 i = 0; i < toSet.length; i++) {
            layerAddresses[toSet[i].layerIndex][toSet[i].itemIndex] = SSTORE2
                .write(toSet[i].hexString);
            layerNames[toSet[i].layerIndex][toSet[i].itemIndex] = toSet[i].name;
        }
    }

    function getLayer(uint8 layerIndex, uint8 itemIndex)
        public
        view
        virtual
        override
        returns (Layer memory)
    {
        return
            Layer(
                layerNames[layerIndex][itemIndex],
                SSTORE2.read(layerAddresses[layerIndex][itemIndex])
            );
    }
}
