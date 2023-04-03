import { NFT_CONTRACT_ADDRESS, abi } from "@/constants/NFTcollection";
import {
  CRYPTODEVS_DAO_CONTRACT_ADDRESS,
  CRYPTODEVS_DAO_CONTRACT_ABI,
} from "@/constants/DAO";
import { formatEther } from "ethers/lib/utils";
import { web3ModalContext } from "@/pages/_app";
import Web3Modal from "web3modal";
import { walletContext } from "@/pages/_app";
import { getProviderOrSigner } from "@/helpers/providerSigner";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
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
      fetchAllProposals();
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

  // Render the contents of the appropriate tab based on `selectedTab`
  function renderTabs() {
    if (selectedTab === "Create Proposal") {
      return renderCreateProposalTab();
    } else if (selectedTab === "View Proposals") {
      return renderViewProposalsTab();
    }
    return null;
  }

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

          <button className="btn" onClick={createProposal}>
            Create
          </button>
        </div>
      );
    }
  }

  // Renders the 'View Proposals' tab content
  function renderViewProposalsTab() {
    if (loading) {
      return (
        <div className="btn loading col-span-2 self-center place-self-center">
          Waiting for txn...
        </div>
      );
    } else if (proposals.length === 0) {
      return (
        <div className="col-span-2 self-center place-self-center mb-4 text-xl text-rose-600 bg-slate-800 p-4 rounded">
          No proposals have been created
        </div>
      );
    } else {
      console.log(proposals);
      return (
        <div className="">
          {proposals.map((p: any, index: number) => (
            <div key={index} className="">
              <p>Proposal ID: {p.proposalId.toString()}</p>
              <p>Fake NFT to Purchase: {p.nftTokenId}</p>
              <p>Deadline: {p.deadline.toLocaleString()}</p>
              <p>Yay Votes: {p.yayVotes}</p>
              <p>Nay Votes: {p.nayVotes}</p>
              <p>Executed?: {p.executed.toString()}</p>
              {p.deadline.getTime() > Date.now() && !p.executed ? (
                <div className="">
                  <button
                    className="btn"
                    onClick={() => voteOnProposal(p.proposalId, "YAY")}
                  >
                    Vote YAY
                  </button>
                  <button
                    className="btn"
                    onClick={() => voteOnProposal(p.proposalId, "NAY")}
                  >
                    Vote NAY
                  </button>
                </div>
              ) : p.deadline.getTime() < Date.now() && !p.executed ? (
                <div className="">
                  <button
                    className="btn"
                    onClick={() => executeProposal(p.proposalId)}
                  >
                    Execute Proposal{" "}
                    {p.yayVotes > p.nayVotes ? "(YAY)" : "(NAY)"}
                  </button>
                </div>
              ) : (
                <div className="">Proposal Executed</div>
              )}
            </div>
          ))}
        </div>
      );
    }
  }

  return (
    <div className="w-full h-full grid grid-rows-4 md:grid-rows-6 max-sm:grid-rows-8 grid-cols-12 grid-flow-rows pt-2 gap-8">
      <h1 className="text-5xl font-montserrat font-bold self-center place-self-center col-start-1 col-span-12 max-lg:row-span-1 max-sm:row-span-1 text-center max-sm:col-start-1 max-sm:text-4xl">
        DAO dApp
      </h1>
      <div className="row-start-2 row-span-4 col-start-2 xl:col-start-3 col-span-10 xl:col-span-8 max-lg:row-start-2 max-sm:row-start-2 max-lg:col-start-1 max-lg:col-span-12 max-sm:col-span-12 max-[320px]:col-span-11 max-lg:m-2 grid grid-flow-row gap-8 bg-indigo-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-100">
        <div className="w-fit h-full font-roboto flex flex-col justify-center items-center gap-4 xl:items-start text-yellow-400 self-center place-self-center p-8 max-sm:px-0 text-center">
          <h1 className="text-3xl lg:text-4xl text-blue-200 text-center">
            Welcome to Crypto Devs DAO!
          </h1>
          <div className="text-xl text-blue-200 text-left">
            Your CryptoDevs NFT Balance: {nftBalance}
            <br></br>
            Total Number of Proposals: {numProposals}
          </div>
          <div className="italic text-lg text-wine max-sm:px-2">
            Treasury Balance: {formatEther(treasuryBalance)} ETH
          </div>

          <div className="flex flex-col justify-center items-center gap-4">
            <div className="flex justify-center items-center gap-2 max-md:flex-col">
              <button
                className="btn"
                onClick={() => setSelectedTab("Create Proposal")}
              >
                Create Proposal
              </button>
              <button
                className="btn"
                onClick={() => setSelectedTab("View Proposals")}
              >
                View Proposals
              </button>
            </div>

            <div>
              {isOwner ? (
                <div>
                  {loading ? (
                    <button className="btn loading">Loading...</button>
                  ) : (
                    <button className="btn" onClick={withdrawDAOEther}>
                      Withdraw DAO ETH
                    </button>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="p-8 max-lg:w-[300px] max-lg:h-[300px] lg:w-[400px] lg:h-[400px] w-[500px] h-[500px] flex justify-center items-center col-start-2 max-sm:hidden">
          <Image
            src={`./cryptodevs/${Math.floor(Math.random() * 20)}.svg`}
            alt="0"
            width={250}
            height={250}
          />
        </div>
        {renderTabs()}
      </div>
    </div>
  );
};

export default DAO;
