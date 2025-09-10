import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import VotingABI from "./VotingABI.json";
import PartyAImg from "./assets/a.jpg";
import PartyBImg from "./assets/b.jpg";
import PartyCImg from "./assets/3.jpg";


// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Placeholder images for parties (you can replace these with actual URLs)
const PARTY_IMAGES = [PartyAImg, PartyBImg, PartyCImg];


const PARTY_DESCRIPTIONS = [
  "Party A focuses on education, healthcare, and social welfare.",
  "Party B aims for economic growth, infrastructure, and employment.",
  "Party C emphasizes environmental protection and sustainable development."
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txProcessing, setTxProcessing] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const prov = new ethers.BrowserProvider(window.ethereum);
      setProvider(prov);
    } else {
      alert("Install MetaMask to use this app!");
    }
  }, []);

  useEffect(() => {
    if (provider && CONTRACT_ADDRESS !== "REPLACE_WITH_YOUR_CONTRACT_ADDRESS") {
      const c = new ethers.Contract(CONTRACT_ADDRESS, VotingABI, provider);
      setContract(c);
      loadParties(c);
    }
  }, [provider]);

  async function connectWallet() {
    if (!window.ethereum) return alert("Install MetaMask");

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);

      const signer = await provider.getSigner();
      setSigner(signer);

      if (CONTRACT_ADDRESS && VotingABI) {
        const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, VotingABI, signer);
        setContract(contractWithSigner);
        await loadParties(contractWithSigner);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect wallet: " + (err.message || JSON.stringify(err)));
    }
  }

  async function loadParties(c) {
    try {
      setLoading(true);
      const res = await c.getParties();
      const names = res[0];
      const counts = res[1].map(n => n.toString());
      const arr = names.map((name, i) => ({
        name,
        count: counts[i],
        index: i,
        image: PARTY_IMAGES[i] || "https://via.placeholder.com/150?text=Party",
        description: PARTY_DESCRIPTIONS[i] || "This party represents the interests of the people."
      }));
      setParties(arr);
    } catch (err) {
      console.error(err);
      alert("Failed to load parties: " + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(index) {
    if (!signer) return alert("Connect wallet first");
    if (!contract) return alert("Contract not loaded");

    try {
      setTxProcessing(true);
      const c = contract.connect ? contract.connect(signer) : contract;
      const tx = await c.vote(index);
      await tx.wait();
      alert("Vote successful!");
      await loadParties(c);
    } catch (err) {
      console.error(err);
      const reason = err?.data?.message || err?.reason || err?.message || JSON.stringify(err);
      alert("Transaction failed: " + reason);
    } finally {
      setTxProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white flex flex-col font-inter">
      
      {/* Header */}
      <header className="bg-[#162447] py-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-3xl font-bold text-pink-500">Block-Chain Voting</h1>
          {!account ? (
            <button
              className="btn btn-primary transition-transform transform hover:scale-105"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          ) : (
            <span className="text-lg text-green-400">Connected: {account}</span>
          )}
        </div>
      </header>

      {/* Parties Container */}
      <main className="flex-grow container mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold mb-3 text-center">Vote for Your Party</h2>
        <p className="text-center text-gray-300 mb-6">
          Participate in the decentralized voting system. Choose your favorite party and make your voice count!
        </p>

        {loading && <p className="text-center">Loading parties...</p>}
        {!loading && parties.length === 0 && <p className="text-center">No parties available yet.</p>}

        <div className="flex justify-center flex-wrap gap-6">
          {parties.map((p) => (
            <div
              key={p.index}
              className="candidate-card w-64 p-6 rounded-xl shadow-2xl bg-[#2a3d5b] flex flex-col justify-between items-center transform hover:scale-105 transition-transform"
            >
              <img src={p.image} alt={p.name} className="w-32 h-32 rounded-full mb-4 shadow-lg" />
              <h3 className="text-xl font-bold mb-2">{p.name}</h3>
              <span className="text-lg font-medium mb-2">{p.count} Votes</span>
              <p className="text-center text-gray-300 mb-4">{p.description}</p>
              {!txProcessing && (
                <button
                  className="btn btn-outline hover:bg-[#e43f5a]/20 w-full"
                  onClick={() => handleVote(p.index)}
                >
                  Vote
                </button>
              )}
            </div>
          ))}
        </div>

        {txProcessing && (
          <p className="text-center text-yellow-400 mt-6 font-semibold">
            Transaction in progress...
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#162447] py-6 mt-auto shadow-inner">
        <div className="container mx-auto px-6 text-center text-gray-400">
          &copy; {new Date().getFullYear()} By Mohammed Nishadh
        </div>
      </footer>
    </div>
  );
}

export default App;
