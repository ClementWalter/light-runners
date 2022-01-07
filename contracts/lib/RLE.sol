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

    function decode(
        bytes calldata _rleBytes,
        uint256 _offset,
        uint256 _length
    ) public pure returns (bytes memory) {
        uint16 start = 0;
        uint16 skipped = 0;

        while (skipped < _offset) {
            skipped += uint16(uint8(_rleBytes[start]));
            start += 2;
        }
        if (skipped > _offset) {
            start -= 2;
            skipped -= uint16(uint8(_rleBytes[start]));
        }

        bytes memory decodedBytes;
        for (
            uint8 j = 0;
            j < uint8(_rleBytes[start]) - uint8(_offset - skipped);
            j++
        ) {
            decodedBytes = bytes.concat(decodedBytes, _rleBytes[start + 1]);
            if (decodedBytes.length == _length) {
                break;
            }
        }
        while (decodedBytes.length < _length) {
            start += 2;
            if (start >= _rleBytes.length) {
                revert("RLE decode error: end of data reached");
            }
            for (uint8 j = 0; j < uint8(_rleBytes[start]); j++) {
                if (decodedBytes.length >= _length) {
                    break;
                }
                decodedBytes = bytes.concat(decodedBytes, _rleBytes[start + 1]);
            }
        }
        if (decodedBytes.length > _length) {
            revert("RLE decode error: unknown error");
        }
        return decodedBytes;
    }
}
