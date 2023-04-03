import { CRYPTODEVS_DAO_CONTRACT_ADDRESS } from "@/constants/DAO";
import { web3ModalContext } from "@/pages/_app";
import Web3Modal from "web3modal";
import { walletContext } from "@/pages/_app";
import { getProviderOrSigner } from "@/helpers/providerSigner";
import { useContext, useEffect, useState } from "react";
import getDaoContractInstance from "@/helpers/getDAOcontract";
import getNFTContractInstance from "@/helpers/getNFTcontract";
import currentAddress from "@/helpers/getAddress";
import Proposals from "./Proposals";
import Overview from "./Overview";

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
      fetchAllProposals();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletConected]);

  useEffect(() => {
    if (selectedTab === "View Proposals") {
      fetchAllProposals(); // fetch all proposals from the DAO
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
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
      const tx = await contract.withdraw();
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

  // Renders the 'Create Proposal' tab content
  function renderCreateProposalTab() {
    if (loading) {
      return <div className="btn loading col-span-2">Waiting for txn...</div>;
    } else if (nftBalance == 0) {
      return (
        <div className="bg-slate-800 place-self-center col-span-2 mb-2 p-2 flex flex-col justify-center items-center text-rose-600 rounded">
          You do not own any CryptoDevs NFTs. <br />
          <b>You cannot create or vote on proposals</b>
        </div>
      );
    } else {
      return (
        <div className="flex justify-center max-sm:flex-col items-center gap-2 md:col-span-2 mb-4 bg-slate-800 w-fit place-self-center p-2 rounded">
          <div className="flex flex-col justify-start items-center">
            <label className="text-white">
              Fake NFT Token ID to Purchase:{" "}
            </label>
            <input
              placeholder="0"
              type="number"
              onChange={(e) => setFakeNftTokenId(e.target.value)}
            />
          </div>

          {/* <button className="btn" onClick={createProposal}>
            Create
          </button> */}
        </div>
      );
    }
  }

  const renderDAOContent = () => {
    console.log(selectedTab);
    if (selectedTab === "Create Proposal") {
      // create proposal
    } else if (selectedTab == "View Proposals") {
      // view proposals
      return (
        <Proposals
          getDAOTreasuryBalance={getDAOTreasuryBalance}
          numProposals={numProposals}
          setSelectedTab={setSelectedTab}
        />
      );
    } else {
      const overviewProps = {
        nftBalance,
        numProposals,
        treasuryBalance,
        isOwner,
        loading,
        withdrawDAOEther,
        setSelectedTab,
      };
      return <Overview {...overviewProps} />;
    }
  };

  return (
    <div className="w-full h-full grid grid-rows-4 md:grid-rows-6 max-sm:grid-rows-8 grid-cols-12 grid-flow-rows pt-2 gap-8">
      <h1 className="text-5xl font-montserrat font-bold self-center place-self-center col-start-1 col-span-12 max-lg:row-span-1 max-sm:row-span-1 text-center max-sm:col-start-1 max-sm:text-4xl">
        DAO dApp
      </h1>
      <div className="h-full min-h-[400px] row-start-2 row-span-4 col-start-2 xl:col-start-3 col-span-10 xl:col-span-8 max-lg:row-start-2 max-sm:row-start-2 max-lg:col-start-1 max-lg:col-span-12 max-sm:col-span-12 max-[320px]:col-span-11 max-lg:m-2 grid grid-flow-row gap-8 bg-indigo-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-100">
        {/* 
        {renderTabs()} */}
        {renderDAOContent()}
      </div>
    </div>
  );
};

export default DAO;
