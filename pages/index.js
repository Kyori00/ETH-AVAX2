import {useState, useEffect} from "react";
import {ethers} from "ethers";
import voting_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [voting, setVoting] = useState(undefined);
  const [proposalDescription , setProposalDescription] = useState("");
  const [proposalId, setProposalId] = useState("");
  const [status, setStatus] = useState("");
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const votingABI = voting_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getVotingContract();
  };

  const getVotingContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const votingContract = new ethers.Contract(contractAddress, votingABI, signer);
 
    setVoting(votingContract);
  }

  const createProposal = async () => {
    if(voting && proposalDescription){
      const description = String(proposalDescription);
      let tx = await voting.createProposal(description);
      await tx.wait();
      setStatus("Proposal Created");
      console.log ("Proposal Created");
    }
  }

  const castVote = async (proposalId) => {
    if (voting && proposalId){
      let tx = await voting.castVote(proposalId);
      await tx.wait();
      setStatus("1 Vote Casted");
      console.log("Vote casted");
    }
  }

  const refundVotes = async (proposalId) => {
    if (voting && proposalId){
      let tx = await voting.refundVotes(proposalId);
      await tx.wait();
      setStatus("All votes have been refunded");
      console.log("Votes refunded");
    }
  }

  const endProposal = async (proposalId) => {
    if (voting && proposalId){
      let tx = await voting.endProposal(proposalId);
      await tx.wait();
      setStatus("Votes have been ended");
      console.log("Proposal ended");
  }
}

  const reactivateProposal = async (proposalId) => {
    if (voting && proposalId){
      let tx = await voting.reactivateProposal(proposalId);
      await tx.wait();
      setStatus("Proposal has been reactivated");
      console.log("Proposal reactivated");
  }
}

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <input
          value={proposalDescription}
          onChange={(e) => setProposalDescription(e.target.value)}
          placeholder="Proposal Description"
        />
        <button onClick={createProposal}>Create Proposal</button>
        <input
          input type ="number"
          id = "proposalId"
          value={proposalId}
          onChange={(e) => setProposalId(e.target.value)}
          placeholder="Proposal ID"
        />
        <button onClick={() =>castVote(document.getElementById("proposalId").value)}>Vote in favor</button>
        <button onClick={() =>endProposal(document.getElementById("proposalId").value)}>End Voting</button>
        <button onClick={() =>refundVotes(document.getElementById("proposalId").value)}>Refund all votes</button>
        <button onClick={() =>reactivateProposal(document.getElementById("proposalId").value)}>Restart the voting</button>
        <p>Status: {status}</p>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Voting System</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
