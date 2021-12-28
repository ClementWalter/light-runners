//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

//import "contracts/RLE.sol";

contract LightRunner {
    bytes public content;

    function setContent(bytes calldata _content) public {
        content = _content;
        //        content = RLE.decode(_content);
        console.log("Received content with '%s' bytes", _content.length);
        console.log("Content changed to '%s' bytes", content.length);
    }
}
