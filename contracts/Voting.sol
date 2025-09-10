// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    struct Party {
        string name;
        uint256 voteCount;
    }

    Party[] public parties;
    mapping(address => bool) public hasVoted;
    address public owner;

    event Voted(address indexed voter, uint indexed partyIndex);
    event PartyAdded(string name);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(string[] memory _partyNames) {
        owner = msg.sender;
        for (uint i = 0; i < _partyNames.length; i++) {
            parties.push(Party({name: _partyNames[i], voteCount: 0}));
            emit PartyAdded(_partyNames[i]);
        }
    }

    function vote(uint256 partyIndex) external {
        require(!hasVoted[msg.sender], "Already voted");
        require(partyIndex < parties.length, "Invalid party index");
        hasVoted[msg.sender] = true;
        parties[partyIndex].voteCount += 1;
        emit Voted(msg.sender, partyIndex);
    }

    function getParties() external view returns (string[] memory names, uint256[] memory counts) {
        uint len = parties.length;
        names = new string[](len);
        counts = new uint256[](len);
        for (uint i = 0; i < len; i++) {
            names[i] = parties[i].name;
            counts[i] = parties[i].voteCount;
        }
    }

    function addParty(string memory name) external onlyOwner {
        parties.push(Party({name: name, voteCount: 0}));
        emit PartyAdded(name);
    }

    function partyCount() external view returns (uint) {
        return parties.length;
    }
}
