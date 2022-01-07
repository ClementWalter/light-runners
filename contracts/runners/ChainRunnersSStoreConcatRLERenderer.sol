// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@0xsequence/sstore2/contracts/SSTORE2.sol";
import "./ChainRunnersSStoreConcatRenderer.sol";
import "../lib/RLE.sol";

contract ChainRunnersSStoreConcatRLERenderer is
    ChainRunnersSStoreConcatRenderer
{
    uint16 private immutable TRAIT_LENGTH = 416;
    uint16 private immutable TRAITS_PER_STORAGE = 57;

    function getLayer(uint8 layerIndex, uint8 itemIndex)
        public
        view
        virtual
        override
        returns (Layer memory)
    {
        // storageIndex is the index of the SSTORE2 containing the data
        uint8 storageIndex = 0;
        bytes memory layerIndexes = SSTORE2.read(
            layerLayerIndexes[storageIndex]
        );

        // Since layerIndexes are sorted, we only look at the last byte to check if this storageIndex
        // is the one we are looking for
        while (uint8(layerIndexes[layerIndexes.length - 1]) < layerIndex) {
            storageIndex++;
            layerIndexes = SSTORE2.read(layerLayerIndexes[storageIndex]);
        }

        // Actually the items for this layerIndex may be split between this storageIndex and the one after
        // So we check if the itemIndex is in the range of the itemIndexes for this storageIndex
        uint8 startItemIndex = 0;
        if (uint8(layerIndexes[layerIndexes.length - 1]) == layerIndex) {
            if (itemIndex > uint8(layerIndexes[layerIndexes.length - 2])) {
                storageIndex++;
                startItemIndex = uint8(layerIndexes[layerIndexes.length - 2]);
                layerIndexes = SSTORE2.read(layerLayerIndexes[storageIndex]);
            }
        }

        // Get the shift for the beginning of this layerIndex slots
        uint8 currentStorageShiftCount = 0;
        uint16 cumSum = 0;
        while (
            uint8(layerIndexes[currentStorageShiftCount * 2 + 1]) < layerIndex
        ) {
            cumSum += uint16(uint8(layerIndexes[currentStorageShiftCount * 2]));
            currentStorageShiftCount++;
        }

        // Move towards the slots to get max theoretical itemIndex
        uint16 layerCount = uint16(
            uint8(layerIndexes[currentStorageShiftCount * 2])
        ) + startItemIndex;
        while (
            (layerCount < itemIndex) &&
            (uint8(layerIndexes[currentStorageShiftCount * 2 + 3]) ==
                layerIndex)
        ) {
            currentStorageShiftCount++;
            layerCount += uint16(
                uint8(layerIndexes[currentStorageShiftCount * 2])
            );
            if (currentStorageShiftCount * 2 + 3 >= layerIndexes.length) {
                break;
            }
        }
        // Layer not found, return empty layer to match ChainRunnersBaseRenderer empty layer with mapping
        if (layerCount <= itemIndex) {
            return Layer("", "");
        }

        cumSum = cumSum + itemIndex - startItemIndex;
        // Decode only the right RLE data
        bytes memory hexString = RLE.decode(
            SSTORE2.read(layerHexStrings[storageIndex]),
            TRAIT_LENGTH * cumSum,
            TRAIT_LENGTH
        );

        // Retrieve trait name given storageIndex and storage shift
        string memory name = layerNames[
            uint16(storageIndex) * TRAITS_PER_STORAGE + cumSum
        ];

        return Layer(name, hexString);
    }
}
