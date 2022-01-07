// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./ChainRunnersBaseRenderer.sol";
import "@0xsequence/sstore2/contracts/SSTORE2.sol";

contract ChainRunnersSStoreConcatRenderer is ChainRunnersBaseRenderer {
    address[] layerHexStrings;
    address[] layerLayerIndexes;
    address[] layerItemIndexes;
    string[] layerNames;

    struct LayerInputConcat {
        string[] name;
        bytes hexString;
        bytes layerIndex;
        bytes itemIndex;
    }

    function setLayers(LayerInputConcat[] calldata toSet) external onlyOwner {
        for (uint8 i = 0; i < toSet.length; i++) {
            for (uint8 j = 0; j < toSet[i].name.length; j++) {
                layerNames.push(toSet[i].name[j]);
            }
            layerHexStrings.push(SSTORE2.write(toSet[i].hexString));
            layerLayerIndexes.push(SSTORE2.write(toSet[i].layerIndex));
            layerItemIndexes.push(SSTORE2.write(toSet[i].itemIndex));
        }
    }

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
        uint8 lastLayerIndex = uint8(layerIndexes[layerIndexes.length - 1]);

        // Since layerIndexes are sorted, we only look at the last byte to check if this storageIndex
        // is the one we are looking for
        while (lastLayerIndex < layerIndex) {
            storageIndex++;
            layerIndexes = SSTORE2.read(layerLayerIndexes[storageIndex]);
            lastLayerIndex = uint8(layerIndexes[layerIndexes.length - 1]);
        }

        // Load the corresponding item indexes for the given storageIndex
        bytes memory itemIndexes = SSTORE2.read(layerItemIndexes[storageIndex]);

        // Actually the items for this layerIndex may be split between this storageIndex and the one after
        // So we check if the itemIndex is in the range of the itemIndexes for this storageIndex
        if (lastLayerIndex == layerIndex) {
            if (itemIndex > uint8(itemIndexes[itemIndexes.length - 1])) {
                storageIndex++;
                layerIndexes = SSTORE2.read(layerLayerIndexes[storageIndex]);
                itemIndexes = SSTORE2.read(layerItemIndexes[storageIndex]);
            }
        }

        uint8 currentStorageShiftCount = 0;
        while (uint8(layerIndexes[currentStorageShiftCount]) < layerIndex) {
            currentStorageShiftCount++;
        }
        while (
            (uint8(itemIndexes[currentStorageShiftCount]) < itemIndex) &&
            (uint8(layerIndexes[currentStorageShiftCount]) == layerIndex)
        ) {
            currentStorageShiftCount++;
        }
        if (uint8(itemIndexes[currentStorageShiftCount]) < itemIndex) {
            // Layer not found, return empty layer to match ChainRunnersBaseRenderer empty layer with mapping
            return Layer("", "");
        }

        bytes memory storageHexStrings = SSTORE2.read(
            layerHexStrings[storageIndex]
        );
        bytes memory hexString = new bytes(416);
        for (uint16 i = 0; i < 416; i++) {
            hexString[i] = storageHexStrings[
                i + 416 * currentStorageShiftCount
            ];
        }

        uint16 nameIndex = uint16(storageIndex) *
            57 +
            uint16(currentStorageShiftCount);
        string memory name = layerNames[nameIndex];
        return Layer(name, hexString);
    }
}
