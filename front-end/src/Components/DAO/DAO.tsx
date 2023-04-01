import { NFT_CONTRACT_ADDRESS, abi } from "@/constants/NFTcollection";
import {
  CRYPTODEVS_DAO_CONTRACT_ADDRESS,
  CRYPTODEVS_DAO_CONTRACT_ABI,
} from "@/constants/DAO";
import { Contract } from "ethers";
import { web3ModalContext } from "@/pages/_app";
import { walletContext } from "@/pages/_app";
import { getProviderOrSigner } from "@/helpers/providerSigner";
import { useContext, useEffect, useState } from "react";

const DAO = () => {
  const [web3ModalRef, setWeb3ModalRef] = useContext(web3ModalContext);
  const [walletConected, setWalletConnected] = useContext(walletContext);
  // ETH Balance of contract
  const [treasuryBalance, setTreasuryBalance] = useState("0");
  // Number of proposals
  const [numProposals, setNumProposals] = useState("0");
  // array of all proposals created in the DAO
  const [proposals, setProposals] = useState([]);
  // user's balance of NFT
  const [nftBalance, setNftBalance] = useState(0);
  // Fake NFT token id to purchase. Used when creating a proposal
  const [fakeNftTokenId, setFakeNftTokenId] = useState("");
  // One of "Create Proposal", or "Vieve Proposal"
  const [selectedTab, setSelectedTab] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  return (
    <div className="w-full h-full flex justify-center items-center grow pt-8">
      <h1 className="text-5xl">DAO app</h1>
    </div>
  );
};

export default DAO;
