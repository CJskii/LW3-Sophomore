import { web3ModalContext } from "@/pages/_app";
import Web3Modal from "web3modal";
import { walletContext } from "@/pages/_app";
import { getProviderOrSigner } from "@/utils/providerSigner";
import { useContext, useEffect, useState } from "react";
import getDaoContractInstance from "@/utils/getDAOcontract";
import { getUserNFTBalance } from "@/utils/getUserNFTBalance";
import { getNumProposals } from "@/utils/DAO/getNumberOfProposals";
import { getDAOTreasuryBalance } from "@/utils/DAO/getDAOTreasuryBalance";
import { getDAOOwner } from "@/utils/DAO/getDAOOwner";
import Proposals from "./Proposals";
import Overview from "./Overview";
import CreateProposal from "./CreateProposal";

const DAO = () => {
  const [web3modalRef, setWeb3ModalRef] = useContext(web3ModalContext);
  const [walletConected, setWalletConnected] = useContext(walletContext);
  // ETH Balance of contract
  const [treasuryBalance, setTreasuryBalance] = useState("0");
  // Number of proposals
  const [numProposals, setNumProposals] = useState(0);
  // user's balance of NFT
  const [nftBalance, setNftBalance] = useState(0);
  // One of "Create Proposal", or "Vieve Proposal"
  const [selectedTab, setSelectedTab] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // ___ useEffects ___
  useEffect(() => {
    if (!walletConected) {
      web3modalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }

    connectWallet().then(() => {
      fetchDaoData();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletConected]);

  const fetchDaoData = async () => {
    setLoading(true);
    getTreasuryBalance();
    getNumProposal();
    getNFTbalance();
    getOwner();
    setLoading(false);
  };

  // ___ Utils ___

  const connectWallet = async () => {
    try {
      await getProviderOrSigner({ needSigner: false, web3modalRef });
      setWalletConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  const getNFTbalance = async () => {
    try {
      const balance = await getUserNFTBalance(web3modalRef);
      setNftBalance(balance.toString());
    } catch (err) {
      console.log(err);
    }
  };

  const getOwner = async () => {
    try {
      const isOwner = await getDAOOwner(web3modalRef);
      setIsOwner(isOwner);
    } catch (err) {
      console.log(err);
    }
  };

  const getTreasuryBalance = async () => {
    try {
      const balance = await getDAOTreasuryBalance(web3modalRef);
      setTreasuryBalance(balance.toString());
    } catch (err) {
      console.log(err);
    }
  };

  const getNumProposal = async () => {
    try {
      const number = await getNumProposals(web3modalRef);
      setNumProposals(number.toString());
    } catch (err) {
      console.log(err);
    }
  };

  // ___ Withdraw ___

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
      getTreasuryBalance();
    } catch (err) {
      console.log(err);
    }
  };

  // ___ Render ___

  const renderDAOContent = () => {
    if (selectedTab === "Create Proposal") {
      return (
        <CreateProposal
          setSelectedTab={setSelectedTab}
          getNumProposal={getNumProposal}
          nftBalance={nftBalance}
        />
      );
    } else if (selectedTab == "View Proposals") {
      return (
        <Proposals
          getTreasuryBalance={getTreasuryBalance}
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
        {renderDAOContent()}
      </div>
    </div>
  );
};

export default DAO;
