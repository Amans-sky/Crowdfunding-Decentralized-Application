const hre = require("hardhat");

async function main() {
  const goalAmount = hre.ethers.parseEther("0"); // Example goal: 5 ETH
  const durationInMinutes = 0 // Example duration: 60 minutes

  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  const contract = await CrowdFunding.deploy(goalAmount, durationInMinutes);
  await contract.waitForDeployment();

  console.log("Contract deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
