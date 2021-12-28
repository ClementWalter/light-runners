//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./RLE.sol";

contract LightRunner {
    bytes public content;

    function setContent(bytes calldata _content) public {
        content = RLE.decode(_content);
    }
}
