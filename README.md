# Decentralized Crowdfunding DApp

## Project Overview

This repository contains a decentralized crowdfunding platform built using Ethereum smart contracts. The application allows users to create and contribute to crowdfunding campaigns with transparency and immutability provided by blockchain technology.

## Features

- Connect MetaMask wallet
- Create a crowdfunding campaign by setting a funding goal and deadline
- Contribute ETH to active campaigns
- View campaign progress: goal, total raised, deadline, and time left
- Popup notification when the campaign goal is reached

## Technology Stack

### Blockchain & Smart Contracts

- Solidity – Smart contract development
- Hardhat – Ethereum development environment
- Ethers.js – Blockchain interaction
- MetaMask – Wallet integration

### Frontend

- React.js – User interface
- JavaScript – Application logic
- CSS – Styling

## Getting Started

Follow the steps below to set up the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/crowdfunding-dapp.git
cd crowdfunding-dapp
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Compile Smart Contracts

```bash
npx hardhat compile
```

### 4. Deploy to Local Hardhat Network

Start the local Hardhat node:

```bash
npx hardhat node
```

In a new terminal window, deploy the contract:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Start the Frontend

```bash
npm start
```

## Smart Contract Overview

The smart contract includes the following key functions:

* `createCampaign(uint _goalAmount, uint _durationInMinutes)`
  Create a new crowdfunding campaign.

* `contribute()`
  Contribute ETH to an active campaign.

* `withdrawFunds()`
  Withdraw raised funds after campaign success (only by campaign owner).

* `getTimeLeft()`
  Returns the remaining time for a campaign.

## Screenshots
 Please look at the BCT Project ss word document attached.
## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.

## Author

**Aman N Shah**

For any inquiries or suggestions, feel free to connect via LinkedIn or raise an issue in this repository.

