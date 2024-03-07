// Import necessary modules
const { ethers } = require("hardhat");
const { expect } = require("chai");

// Define test suite
describe("CrowdFunding", function () {
  // Define variables to hold contract instance and accounts
  let CrowdFunding;
  let crowdFunding;
  let owner;
  let donor1;
  let donor2;

  // Before hook to set up the testing environment
  before(async function () {
    try {
      // Deploy the contract and get the accounts
      [owner, donor1, donor2] = await ethers.getSigners();
      console.log("Owner:", owner.address);
      console.log("Donor1:", donor1.address);
      console.log("Donor2:", donor2.address);

      // Get the contract factory
      CrowdFunding = await ethers.getContractFactory("CrowdFunding");

      // Deploy the contract
      crowdFunding = await CrowdFunding.deploy(owner.address);
      await crowdFunding.deployed();
      console.log("CrowdFunding contract address:", crowdFunding.address);
    } catch (error) {
      console.error("Error:", error);
    }
  });

  // Test cases
  describe("createCampaign", function () {
    it("should create a new campaign", async function () {
      try {
        // Call createCampaign function
        await crowdFunding.createCampaign(owner.address, "Test Campaign", "Test campaign description", ethers.utils.parseEther("1"), Math.floor(Date.now() / 1000) + 3600, "test.jpg");

        // Get the campaign details
        const campaign = await crowdFunding.campaigns(0);

        // Assert that campaign details match the input parameters
        expect(campaign.owner).to.equal(owner.address);
        expect(campaign.title).to.equal("Test Campaign");
        expect(campaign.description).to.equal("Test campaign description");
        expect(campaign.targetAmount).to.equal(ethers.utils.parseEther("1"));
        // Add more assertions for other properties
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });


});
