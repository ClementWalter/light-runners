//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

//import "contracts/RLE.sol";

contract LightRunner {
    bytes public content;

    function setContent(bytes calldata _content) public {
        console.log("Setting content to: '%s'", string(_content));
        content = _content;
        //        content = RLE.decode(_content);
        console.log("Received content with '%s' bytes", _content.length);
        console.log("Content changed to '%s' bytes", content.length);
    }
}
