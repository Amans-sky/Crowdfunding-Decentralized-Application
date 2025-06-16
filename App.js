import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import CrowdFundingABI from "./CrowdFundingABI.json";
import './App.css';

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update if redeployed

function App() {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [goal, setGoal] = useState("");
  const [raised, setRaised] = useState("");
  const [deadline, setDeadline] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [amount, setAmount] = useState("");
  const [createGoal, setCreateGoal] = useState("");
  const [createDuration, setCreateDuration] = useState("");
  const [showCongrats, setShowCongrats] = useState(false);
  const [popupShown, setPopupShown] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== 31337n) {
        alert("Please switch to the Hardhat local network (Chain ID 31337)");
        return;
      }

      const signer = await provider.getSigner();
      const crowdfundingContract = new ethers.Contract(CONTRACT_ADDRESS, CrowdFundingABI, signer);
      setSigner(signer);
      setContract(crowdfundingContract);
      alert("Wallet connected!");
    } else {
      alert("Please install MetaMask");
    }
  };

  const fetchContractData = async () => {
    if (!contract) return;

    try {
      const goalAmount = await contract.goalAmount();
      const totalRaised = await contract.totalRaised();
      const deadlineTimestamp = await contract.deadline();
      const timeLeft = await contract.getTimeLeft();
      const reached = await contract.goalReached();

      const goalInEth = ethers.formatEther(goalAmount);
      const raisedInEth = ethers.formatEther(totalRaised);

      setGoal(goalInEth);
      setRaised(raisedInEth);
      setDeadline(new Date(Number(deadlineTimestamp) * 1000).toLocaleString());
      setTimeLeft(`${timeLeft} seconds`);

      if (reached && !popupShown) {
        setPopupShown(true);
        setShowCongrats(true);
      }

    } catch (err) {
      console.error("Error fetching contract data:", err);
    }
  };

  const contribute = async () => {
    if (!contract || !amount) return;
    try {
      const tx = await contract.contribute({ value: ethers.parseEther(amount) });
      await tx.wait();
      alert(`Contributed ${amount} ETH`);
      setAmount("");
      await fetchContractData();
    } catch (err) {
      alert("Contribution failed");
      console.error(err);
    }
  };

  const createCampaign = async () => {
    if (!contract || !createGoal || !createDuration) return;
    try {
      const tx = await contract.createCampaign(
        ethers.parseEther(createGoal),
        Number(createDuration)
      );
      await tx.wait();
      alert("Campaign created!");
      setCreateGoal("");
      setCreateDuration("");
      setShowCongrats(false);
      setPopupShown(false);
      fetchContractData();
    } catch (err) {
      alert("Failed to create campaign");
      console.error(err);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchContractData();
      const interval = setInterval(fetchContractData, 15000);
      return () => clearInterval(interval);
    }
  }, [contract]);

  return (
    <div className="App">
      <header className="App-header">
        <h2>🚀 Decentralized Crowdfunding DApp</h2>
        <button onClick={connectWallet}>🔌 Connect Wallet</button>

        {contract && (
          <div className="info-box">
            <p>🎯 Goal Amount: {goal} ETH</p>
            <p>💰 Total Raised: {raised} ETH</p>
            <p>⏳ Deadline: {deadline}</p>
            <p>🕒 Time Left: {timeLeft}</p>

            <input
              type="text"
              placeholder="Enter ETH amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
            />
            <button onClick={contribute}>💸 Contribute</button>

            <div className="create-box">
              <h3>🎯 Create a New Campaign</h3>
              <input
                type="text"
                placeholder="Goal in ETH"
                value={createGoal}
                onChange={(e) => setCreateGoal(e.target.value)}
                className="input"
              />
              <input
                type="text"
                placeholder="Duration in minutes"
                value={createDuration}
                onChange={(e) => setCreateDuration(e.target.value)}
                className="input"
              />
              <button onClick={createCampaign}>🚀 Create Campaign</button>
            </div>
          </div>
        )}

        {showCongrats && (
          <div className="popup">
            <div className="popup-content">
              <h2>🎉 Congratulations!</h2>
              <p>Your campaign goal has been reached!</p>
              <button onClick={() => setShowCongrats(false)}>Close</button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
