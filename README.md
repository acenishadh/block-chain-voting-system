Blockchain Voting System
=========================

A decentralized voting application built using Solidity, deployed on the Ethereum blockchain, and tested with Hardhat. This project allows registered voters to cast their votes securely and ensures transparency with immutable vote records.  

Features  
--------  
- Create and manage parties dynamically  
- Secure voting (each address can only vote once)  
- Real-time vote count  
- Transparent and tamper-proof records  
- Owner privileges for setting up parties  

Tech Stack  
----------  
- Solidity (Smart Contracts)  
- Hardhat (Development & Testing Environment)  
- Ethers.js (Interaction with blockchain)  
- MetaMask (Wallet integration)  
- Node.js & npm (Runtime & package manager)  

Project Structure  
-----------------  
```
blockchain-voting/
│-- contracts/
│   └── Voting.sol       # Smart contract
│-- scripts/
│   └── deploy.js        # Deployment script
│-- test/
│   └── voting.js        # Tests for smart contract
│-- hardhat.config.js    # Hardhat configuration
│-- package.json
│-- README.md
```

Installation and Setup  
----------------------  

1. Clone the repository  
```
git clone https://github.com/your-username/blockchain-voting.git
cd blockchain-voting
```

2. Install dependencies  
```
npm install
```

3. Install Hardhat (if not already installed)  
```
npm install --save-dev hardhat
```

4. Initialize Hardhat project  
```
npx hardhat
```
Choose "Create a basic sample project" and confirm all prompts.  

5. Compile smart contracts  
```
npx hardhat compile
```

6. Start local Hardhat blockchain  
```
npx hardhat node
```

Deployment  
----------  

1. Deploy contract locally (in another terminal)  
```
npx hardhat run scripts/deploy.js --network localhost
```

2. Connect MetaMask to Hardhat Network  
- Open MetaMask → Networks → Add Network Manually  
- Network Name: Hardhat Localhost  
- RPC URL: http://127.0.0.1:8545/  
- Chain ID: 31337  
- Currency Symbol: ETH  

3. Import accounts into MetaMask  
- Copy private keys from Hardhat node terminal  
- Import them into MetaMask to use test accounts  

Running Tests  
-------------  
```
npx hardhat test
```

Example Usage  
-------------  

Deploying and Voting via Hardhat Console:  
1. Open console  
```
npx hardhat console --network localhost
```

2. Interact with contract  
```javascript
const Voting = await ethers.getContractFactory("Voting");
const voting = await Voting.attach("DEPLOYED_CONTRACT_ADDRESS");

// Add a party
await voting.addParty("Party A");

// Cast a vote
await voting.vote(0);

// Get results
(await voting.parties(0)).voteCount.toString();
```

Smart Contract Overview  
-----------------------  
Voting.sol contains the following key functions:  
- addParty(string memory name) → Add a new party  
- vote(uint partyIndex) → Cast a vote for a party (only once per address)  
- getParties() → Get list of all parties  
- getWinner() → Returns the party with the most votes  

Future Improvements  
-------------------  
- Frontend integration with React.js and Ethers.js  
- Voter registration system  
- Role-based access for admins  
- Deployment to public testnet (Goerli or Sepolia)  

License  
-------  
This project is licensed under the MIT License.  
