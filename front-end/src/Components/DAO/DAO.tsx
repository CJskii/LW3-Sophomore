import { NFT_CONTRACT_ADDRESS, abi } from "@/constants/NFTcollection";
import {
  CRYPTODEVS_DAO_CONTRACT_ADDRESS,
  CRYPTODEVS_DAO_CONTRACT_ABI,
} from "@/constants/DAO";
import { Contract } from "ethers";
import { web3ModalContext } from "@/pages/_app";
import Web3Modal from "web3modal";
import { walletContext } from "@/pages/_app";
import { getProviderOrSigner } from "@/helpers/providerSigner";
import { useContext, useEffect, useState } from "react";
import getDaoContractInstance from "@/helpers/getDAOcontract";
import getNFTContractInstance from "@/helpers/getNFTcontract";
import currentAddress from "@/helpers/getAddress";

const DAO = () => {
  const [web3modalRef, setWeb3ModalRef] = useContext(web3ModalContext);
  const [walletConected, setWalletConnected] = useContext(walletContext);
  // ETH Balance of contract
  const [treasuryBalance, setTreasuryBalance] = useState("0");
  // Number of proposals
  const [numProposals, setNumProposals] = useState(0);
  // array of all proposals created in the DAO
  const [proposals, setProposals] = useState<any>([]);
  // user's balance of NFT
  const [nftBalance, setNftBalance] = useState(0);
  // Fake NFT token id to purchase. Used when creating a proposal
  const [fakeNftTokenId, setFakeNftTokenId] = useState("");
  // One of "Create Proposal", or "Vieve Proposal"
  const [selectedTab, setSelectedTab] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!walletConected) {
      web3modalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }

    connectWallet().then(() => {
      getDAOTreasuryBalance();
      getNumProposals();
      getUserNFTBalance();
      getDAOOwner();
    });
  }, [walletConected]);

  useEffect(() => {
    if (selectedTab === "View Proposals") {
      fetchAllProposals(); // fetch all proposals from the DAO
    }
  }, [selectedTab]);

  const connectWallet = async () => {
    try {
      await getProviderOrSigner({ needSigner: false, web3modalRef });
      setWalletConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  const getDAOOwner = async () => {
    try {
      // initiate signer - we will write into the contract
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });
      // contract instance
      const contract = await getDaoContractInstance(signer);
      // get owner of DAO
      const _owner = await contract.owner();
      // get current wallet address
      const address = await currentAddress(signer);
      if (address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const withdrawDAOEther = async () => {
    try {
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });
      const contract = await getDaoContractInstance(signer);
      const tx = await contract.withdrawEther();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      getDAOTreasuryBalance();
    } catch (err) {
      console.log(err);
    }
  };

  // Read ETH balance from the DAO contract address and set it to state
  const getDAOTreasuryBalance = async () => {
    try {
      const provider = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });
      const balance = await provider.getBalance(
        CRYPTODEVS_DAO_CONTRACT_ADDRESS
      );
      setTreasuryBalance(balance.toString());
    } catch (err) {
      console.log(err);
    }
  };

  // Read number of proposals from the DAO contract and set it to state
  const getNumProposals = async () => {
    try {
      const provider = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });
      const contract = await getDaoContractInstance(provider);
      const daoNumProposals = await contract.numProposals();
      setNumProposals(daoNumProposals.toString());
    } catch (err) {
      console.log(err);
    }
  };

  // Read the balance of user's NFT and set to state
  const getUserNFTBalance = async () => {
    try {
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });
      const contract = await getNFTContractInstance(signer);
      const address = await currentAddress(signer);
      const balance = await contract.balanceOf(address);
      setNftBalance(balance.toString());
    } catch (err) {
      console.log(err);
    }
  };

  // Calls the 'createProposal' function in the DAO contract using tokenID from fakeNFTTokenID state
  const createProposal = async () => {
    try {
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });
      const contract = await getDaoContractInstance(signer);
      const tx = await contract.createProposal(fakeNftTokenId);
      setLoading(true);
      await tx.wait();
      getNumProposals();
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  // helper function to fetch and parse one proposal from the DAO contract
  // given the proposal ID
  // converts returned data into a javascript object with values we can use
  const fetchProposalById = async (id: number) => {
    try {
      const provider = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });
      const contract = await getDaoContractInstance(provider);
      const proposal = await contract.proposals(id);
      const parsedProposal = {
        proposalId: id,
        nftTokenId: proposal.nftTokenId.toString(),
        deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
        yayVotes: proposal.yayVotes.toString(),
        nayVotes: proposal.nayVotes.toString(),
        executed: proposal.executed,
      };
      return parsedProposal;
    } catch (err) {
      console.log(err);
    }
  };

  // runs a loop to fetch all proposals from the DAO contract
  // and sets the proposals state to an array of all proposals
  const fetchAllProposals = async () => {
    try {
      const proposals = [];
      for (let i = 0; i < numProposals; i++) {
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }
      setProposals(proposals);
      return proposals;
    } catch (err) {
      console.log(err);
    }
  };

  // calls the 'voteOnProposal' function in the DAO contract
  // given the proposal ID and vote type
  const voteOnProposal = async (id: number, _vote: string) => {
    try {
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });
      let vote = _vote === "YAY" ? 1 : 0;
      const contract = await getDaoContractInstance(signer);
      const tx = await contract.voteOnProposal(id, vote);
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await fetchAllProposals();
    } catch (err) {
      console.log(err);
    }
  };

  // calls the 'executeProposal' function in the DAO contract
  // given the proposal ID
  const executeProposal = async (proposalId: number) => {
    try {
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });
      const contract = await getDaoContractInstance(signer);
      const tx = await contract.executeProposal(proposalId);
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await fetchAllProposals();
      await getDAOTreasuryBalance();
    } catch (err: any) {
      console.log(err);
      window.alert(err.reason);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center grow pt-8">
      <h1 className="text-5xl">DAO app</h1>
    </div>
  );
};

export default DAO;
