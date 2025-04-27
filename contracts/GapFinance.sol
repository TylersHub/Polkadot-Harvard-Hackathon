// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GapFinance is Ownable, ReentrancyGuard {
    struct Project {
        uint256 id;
        address creator;
        string title;
        string description;
        string documentCID; // IPFS CID for documents
        uint256 targetAmount;
        uint256 raisedAmount;
        uint256 interestRate; // in basis points (1% = 100)
        uint256 duration; // in days
        bool isValidated;
        bool isFunded;
        bool isCompleted;
        mapping(address => uint256) investments;
        address[] investors;
    }

    uint256 private _projectCount;
    mapping(uint256 => Project) public projects;
    mapping(address => bool) public validators;
    
    event ProjectCreated(uint256 indexed projectId, address indexed creator, string title, uint256 targetAmount);
    event ProjectValidated(uint256 indexed projectId, address validator);
    event InvestmentMade(uint256 indexed projectId, address indexed investor, uint256 amount);
    event ProjectFunded(uint256 indexed projectId);
    event ProjectCompleted(uint256 indexed projectId);
    
    modifier onlyValidator() {
        require(validators[msg.sender], "Not a validator");
        _;
    }
    
    constructor() {
        validators[msg.sender] = true;
    }
    
    function addValidator(address validator) external onlyOwner {
        validators[validator] = true;
    }
    
    function removeValidator(address validator) external onlyOwner {
        validators[validator] = false;
    }
    
    function createProject(
        string calldata title,
        string calldata description,
        string calldata documentCID,
        uint256 targetAmount,
        uint256 interestRate,
        uint256 duration
    ) external returns (uint256) {
        require(targetAmount > 0, "Target amount must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");
        
        uint256 projectId = _projectCount++;
        Project storage project = projects[projectId];
        project.id = projectId;
        project.creator = msg.sender;
        project.title = title;
        project.description = description;
        project.documentCID = documentCID;
        project.targetAmount = targetAmount;
        project.interestRate = interestRate;
        project.duration = duration;
        
        emit ProjectCreated(projectId, msg.sender, title, targetAmount);
        return projectId;
    }
    
    function validateProject(uint256 projectId) external onlyValidator {
        Project storage project = projects[projectId];
        require(!project.isValidated, "Project already validated");
        
        project.isValidated = true;
        emit ProjectValidated(projectId, msg.sender);
    }
    
    function invest(uint256 projectId, address tokenAddress, uint256 amount) external nonReentrant {
        Project storage project = projects[projectId];
        require(project.isValidated, "Project not validated");
        require(!project.isFunded, "Project already funded");
        require(!project.isCompleted, "Project already completed");
        
        IERC20 token = IERC20(tokenAddress);
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        if (project.investments[msg.sender] == 0) {
            project.investors.push(msg.sender);
        }
        project.investments[msg.sender] += amount;
        project.raisedAmount += amount;
        
        if (project.raisedAmount >= project.targetAmount) {
            project.isFunded = true;
            emit ProjectFunded(projectId);
        }
        
        emit InvestmentMade(projectId, msg.sender, amount);
    }
    
    function completeProject(uint256 projectId) external onlyOwner {
        Project storage project = projects[projectId];
        require(project.isFunded, "Project not fully funded");
        require(!project.isCompleted, "Project already completed");
        
        project.isCompleted = true;
        emit ProjectCompleted(projectId);
    }
    
    function getInvestmentAmount(uint256 projectId, address investor) external view returns (uint256) {
        return projects[projectId].investments[investor];
    }
    
    function getInvestors(uint256 projectId) external view returns (address[] memory) {
        return projects[projectId].investors;
    }
}