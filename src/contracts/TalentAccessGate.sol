// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract TalentAccessGate {
    address public owner;
    mapping(address => bool) public paid;
    
    // Celo Mainnet cUSD address
    IERC20 public constant cUSD = IERC20(0x765DE816845861e75A25fCA122bb6898B8B1282a);
    uint256 public constant ACCESS_FEE = 1e18; // 1 cUSD (18 decimals)

    event AccessUnlocked(address indexed user);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function payAccess() external {
        require(!paid[msg.sender], "Access already granted");
        
        // Transfer 1 cUSD from user to this contract
        bool success = cUSD.transferFrom(msg.sender, address(this), ACCESS_FEE);
        require(success, "cUSD transfer failed");
        
        paid[msg.sender] = true;
        emit AccessUnlocked(msg.sender);
    }

    function hasAccess(address user) external view returns (bool) {
        return paid[user];
    }

    function withdraw() external onlyOwner {
        uint256 balance = cUSD.balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");
        
        bool success = cUSD.transfer(owner, balance);
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner, balance);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
