//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract LightRunner {
    bytes public content;

    function setContent(bytes calldata _content) public {
        content = _content;
        console.log("Content changed to '%s' bytes", content.length);
    }
}
