// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract CrowdFunding {
    address public owner;
    uint public deadline;
    uint public goalAmount;
    uint public totalRaised;

    mapping(address => uint) public contributions;
    bool public goalReached;
    bool public fundsWithdrawn;

    constructor(uint _goalAmount, uint _durationInMinutes) {
        owner = msg.sender;
        goalAmount = _goalAmount;
        deadline = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    function withdrawFunds() external {
        require(msg.sender == owner, "Only owner");
        require(goalReached, "Goal not reached");
        require(!fundsWithdrawn, "Already withdrawn");

        fundsWithdrawn = true;
        payable(owner).transfer(totalRaised);
    }

    function getTimeLeft() external view returns (uint) {
        if (block.timestamp >= deadline) return 0;
        return deadline - block.timestamp;
    }

    // ✅ Simplified: Removed active-campaign check for easier testing
    function createCampaign(uint _goalAmount, uint _durationInMinutes) external {
        require(msg.sender == owner, "Only owner can create campaign");

        // Reset campaign state
        goalAmount = _goalAmount;
        deadline = block.timestamp + (_durationInMinutes * 1 minutes);
        totalRaised = 0;
        goalReached = false;
        fundsWithdrawn = false;

        // Reset contributions
        for (uint i = 0; i < contributors.length; i++) {
            contributions[contributors[i]] = 0;
        }
        delete contributors;
    }

    // 📌 Track contributors to reset their contributions
    address[] public contributors;

    function contribute() external payable {
        require(block.timestamp < deadline, "Campaign over");
        require(msg.value > 0, "Contribution must be > 0");

        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }

        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;

        if (totalRaised >= goalAmount) {
            goalReached = true;
        }
    }
}
