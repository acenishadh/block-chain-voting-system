const hre = require("hardhat");

async function main() {
  const parties = ["Party A", "Party B", "Party C"]; // all parties
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(parties);
  await voting.deployed();
  console.log("Voting contract deployed to:", voting.address); //prints the contract adress, paste this in app.js
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
