//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

library RLE {
    function decode(bytes calldata _rleBytes)
        public
        pure
        returns (bytes memory)
    {
        bytes memory decodedBytes;
        for (uint256 i = 0; i < _rleBytes.length; i += 2) {
            uint8 count = uint8(_rleBytes[i]);
            bytes1 current = _rleBytes[i + 1];
            for (uint8 j = 0; j < count; j++) {
                decodedBytes = bytes.concat(decodedBytes, current);
            }
        }
        return decodedBytes;
    }
}
