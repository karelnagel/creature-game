// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155Pausable.sol";

contract CreatureToken is ERC1155Pausable {
    mapping(address => uint256) public userBalance;
    uint256 public maxBalance = 20;
    address public deployer;

    modifier onlyOwner() {
        require(msg.sender == deployer, "You are not the deployer");
        _;
    }

    constructor() public ERC1155("https://game.example/api/item/{id}.json") {
        deployer = msg.sender;
    }

    function mint(uint256 id) public {
        //check if id in range
        require(0 < id && id <= maxBalance, "Wrong token id");

        //check if user already has this id
        require(balanceOf(msg.sender, id) == 0, "You already have this token");
        _mint(msg.sender, id, 1, "");
        userBalance[msg.sender]++;

        if (userBalance[msg.sender] == maxBalance)
            _mint(msg.sender, 0, 1, "");
    }

    function setMaxBalance(uint256 _maxBalance) public onlyOwner {
        maxBalance = _maxBalance;
    }

    function setBaseUri(string memory _uri) public onlyOwner {
        _setURI(_uri);
    }
}
