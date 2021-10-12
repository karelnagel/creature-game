// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155Burnable.sol";

contract CreatureToken is ERC1155Burnable {
    mapping(address => uint256) public userBalance;
    mapping(address => bool) public userLeftReview;
    uint256 public maxBalance = 11;
    address public deployer;
    string[] public reviews;
    uint256 public reviewCount = 0;
    bool public active=true;
    string public contractUri =
        "https://creature-4c69f.web.app/json/contract.json";

    modifier onlyOwner() {
        require(msg.sender == deployer, "You are not the deployer");
        _;
    }

    constructor()
        public
        ERC1155("https://creature-4c69f.web.app/json/{id}.json")
    {
        deployer = msg.sender;
    }

    function mint(uint256 id) public {
        require(active,'Minting is stopped right now');
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

    //For opensea
    function isApprovedForAll(address _owner, address _operator)
        public
        view
        override
        returns (bool isOperator)
    {
        if (_operator == address(0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101)) {
            return true;
        }
        return ERC1155.isApprovedForAll(_owner, _operator);
    }

    function contractURI() public view returns (string memory) {
        return contractUri;
    }

    function setContractUri(string memory _contractUri) public onlyOwner {
        contractUri = _contractUri;
    }

    function setActiveStatus(bool _active) public onlyOwner {
        active = _active;
    }
    
}
