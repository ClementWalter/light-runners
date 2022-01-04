//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Greeter {
    struct Greeting {
        uint8 id;
        string text;
    }

    Greeting[] public greetings;

    string private greeting;

    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) external {
        greeting = _greeting;
    }

    function setGreetings(Greeting[] calldata _greetings) external {
        for (uint16 i = 0; i < _greetings.length; i++) {
            greetings.push(_greetings[i]);
        }
    }

    function addGreeting(uint256 _id, string calldata _text) external {
        greetings.push(Greeting(uint8(_id), _text));
    }

    function addGreeting(uint256 _id) external {
        greetings.push(Greeting(uint8(_id), "test"));
    }
}
