// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract CrowdFunding {

    error NotCorrectDeadline();
    error FailedToSendEther();
    error OnlyCampaignOwner();

    event CampaignCreated(
        address indexed owner, 
        uint256 indexed id, 
        string title, 
        uint256 targetAmount, 
        uint256 deadline
    );

    event DonationReceived(
        address indexed donator, 
        uint256 indexed id, 
        uint256 amount
    );

    event WithdrawFunds(
        address indexed owner,
        address indexed to,
        uint256 amount
    );

    struct Campaign {
        address payable owner;
        string title;
        string description;
        uint256 targetAmount;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping (uint256 => Campaign) public campaigns;

    mapping (address => uint256) public campaignOwners;

    uint256 public campaignCount = 0;

    address public moderator;

    constructor(address _moderator) {
        moderator = _moderator;
    }

    function createCampaign(
        address _owner, 
        string memory _title, 
        string memory _description, 
        uint256 _target, 
        uint256 _deadline, 
        string memory _image
        ) public returns (uint256) {
        Campaign storage newCampaign = campaigns[campaignCount];

        if(newCampaign.deadline > block.timestamp){
            revert NotCorrectDeadline();
        }
        
        newCampaign.owner = payable(_owner);
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.targetAmount = _target;
        newCampaign.deadline = _deadline;
        newCampaign.image = _image;

        campaignCount++;

        emit CampaignCreated(
            _owner, 
            campaignCount, 
            _title, 
            _target, 
            _deadline
        );

        return campaignCount - 1; 
    }

    ///@dev donate to a selected campaign  id
    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;
        Campaign storage selectedCampaign = campaigns[_id];
        selectedCampaign.donators.push(msg.sender);
        selectedCampaign.donations.push(amount);

        (bool sent,) = payable(selectedCampaign.owner).call{value: amount}("");

        if(sent){
            selectedCampaign.amountCollected += amount;
            campaignOwners[selectedCampaign.owner] += amount;
        }else{
            revert FailedToSendEther();
        }
        emit DonationReceived(msg.sender, _id, amount);
    }

    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);

        for(uint i = 0; i < campaignCount; i++){
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

    function withdrawFunds(uint256 _id, address _to, uint256 _amount) public payable {
        Campaign storage selectedCampaign = campaigns[_id];
        if(selectedCampaign.owner != msg.sender){
            revert OnlyCampaignOwner();
        }
        require(campaignOwners[_to] <= selectedCampaign.amountCollected, "Insufficient funds to withdraw");

        campaignOwners[_to] -= _amount;
        selectedCampaign.amountCollected -= _amount;

        (bool sent,) = payable(_to).call{value: _amount}("");
        if(!sent){
            revert FailedToSendEther();
        }
        emit WithdrawFunds(msg.sender, _to, _amount);
    }

}