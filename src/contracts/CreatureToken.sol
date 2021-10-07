// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155Burnable.sol";

contract CreatureToken is ERC1155Burnable {
    mapping(address => uint256) public userBalance;
    mapping(address => bool) public userLeftReview;
    uint256 public maxBalance = 20;
    address public deployer;
    string[] public reviews;
    uint256 public reviewCount = 0;

    modifier onlyOwner() {
        require(msg.sender == deployer, "You are not the deployer");
        _;
    }

    constructor() public ERC1155("http://localhost:3000/json/{id}.json") {
        deployer = msg.sender;
    }

    function mint(uint256 id) public {
        //check if id in range
        require(0 < id && id <= maxBalance, "Wrong token id");

        //check if user already has this id
        require(balanceOf(msg.sender, id) == 0, "You already have this token");
        _mint(msg.sender, id, 1, "");
        userBalance[msg.sender]++;

        if (userBalance[msg.sender] == maxBalance) _mint(msg.sender, 0, 1, "");
    }

    function setMaxBalance(uint256 _maxBalance) public onlyOwner {
        maxBalance = _maxBalance;
    }

    function setBaseUri(string memory _uri) public onlyOwner {
        _setURI(_uri);
    }

    function leaveReview(string memory _review) public {
        require(balanceOf(msg.sender, 0) == 1, "You haven't finished the game");
        require(!userLeftReview[msg.sender], "You already left a review");
        reviews.push(_review);
        reviewCount++;
        userLeftReview[msg.sender] = true;
    }

    function burnTokens() public {
        uint256[] memory ids;
        uint256[] memory values;
        uint256 counter = 0;
        for (uint256 i = 1; i <= maxBalance; i++) {
            uint256 balance = balanceOf(msg.sender, i);
            if (balance > 0) {
                ids[counter] = i;
                values[counter] = balance;
                counter++;
            }
        }

        burnBatch(msg.sender, ids, values);
    }
}
