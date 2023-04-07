import React, { useEffect, useContext, useState } from "react";
import { walletContext } from "@/pages/_app";
import { web3ModalContext } from "@/pages/_app";
import currentAddress from "@/utils/getAddress";
import { getProviderOrSigner } from "@/utils/providerSigner";
import { BigNumber } from "ethers";
import Web3Modal from "web3modal";
import {
  getCDTokensBalance,
  getEtherBalance,
  getLPTokensBalance,
  getReserveOfCDTokens,
} from "@/utils/Exchange/getAmounts";
import Liquidity from "./Liquidity";
import Swap from "./Swap";
import OverviewDEX from "./OverviewDEX";

const DEX = () => {
  const [walletConnected, setWalletConnected] = useContext(walletContext);
  const [web3modalRef, setWeb3modalRef] = useContext(web3ModalContext);
  const [liquidityTab, setLiquidityTab] = useState(true);
  const [selectedTab, setSelectedTab] = useState("");
  const [loading, setLoading] = useState(false);
  const zero = BigNumber.from(0);

  // ___ VARIABLES FOR KEEPING TRACK OF BALANCES ___

  // amount of eth holding by the user
  const [ethBalance, setEthBalance] = useState(zero);
  // keeps track of the ether balance in the contract
  const [reservedCD, setReservedCD] = useState(zero);
  // keeps track of the ether balance in the contract
  const [etherBalanceContract, setEtherBalanceContract] = useState(zero);
  // cdBalance is the amount of 'CD' tokens in the user's account
  const [cdBalance, setCDBalance] = useState(zero);
  // lpBalance is the amount of LP tokens in the user's account
  const [lpBalance, setLPBalance] = useState(zero);

  // ___ CONNECT WALLET ___

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting its `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3modalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getAmounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWallet = async () => {
    try {
      await getProviderOrSigner({ needSigner: false, web3modalRef });
      setWalletConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  // ___ RETRIEVE AMOUNTS FOR ETH BALANCE AND LP TOKENS ETC ___

  const getAmounts = async () => {
    const provider = await getProviderOrSigner({
      needSigner: false,
      web3modalRef,
    });
    const signer = await getProviderOrSigner({
      needSigner: true,
      web3modalRef,
    });
    const address = await currentAddress(signer);

    const _ethBalance = await getEtherBalance(provider, address);
    const _cdBalance = await getCDTokensBalance(provider, address);
    const _lpBalance = await getLPTokensBalance(provider, address);
    const _reservedCD = await getReserveOfCDTokens(provider);

    const _ethBalanceContract = await getEtherBalance(provider, address);
    setEthBalance(_ethBalance);
    setCDBalance(_cdBalance);
    setLPBalance(_lpBalance);
    setReservedCD(_reservedCD);
    setEtherBalanceContract(_ethBalanceContract);
  };

  const renderButton = () => {
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className="btn">
          Connect your wallet
        </button>
      );
    }

    if (loading) {
      return <button className="btn loading">Loading...</button>;
    }
  };

  const renderDEXContent = () => {
    if (selectedTab === "Liquidity") {
      const liquidityProps = {
        // enter props here
        setSelectedTab,
        web3modalRef,
        getAmounts,
        ethBalance,
        cdBalance,
        lpBalance,
        reservedCD,
        etherBalanceContract,
        setEtherBalanceContract,
      };
      return <Liquidity {...liquidityProps} />;
    } else if (selectedTab == "Swap") {
      const swapProps = {
        // enter props here
        setSelectedTab,
        web3modalRef,
        getAmounts,
        reservedCD,
      };
      return <Swap {...swapProps} />;
    } else {
      const overviewProps = {
        renderButton,
        setSelectedTab,
        ethBalance,
        cdBalance,
      };
      return <OverviewDEX {...overviewProps} />;
    }
  };

  return (
    <div className="w-full h-full grid grid-rows-4 md:grid-rows-6 max-sm:grid-rows-8 grid-cols-12 grid-flow-rows pt-2 gap-8">
      <h1 className="text-5xl font-montserrat font-bold self-center place-self-center col-start-1 col-span-12 max-lg:row-span-1 max-sm:row-span-1 text-center max-sm:col-start-1 max-sm:text-4xl">
        DEX dApp
      </h1>
      <div className="h-full min-h-[400px] row-start-2 row-span-4 col-start-2 xl:col-start-3 col-span-10 xl:col-span-8 max-lg:row-start-2 max-sm:row-start-2 max-lg:col-start-1 max-lg:col-span-12 max-sm:col-span-12 max-[320px]:col-span-11 max-lg:m-2 grid grid-flow-row gap-8 bg-indigo-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-100">
        {renderDEXContent()}
      </div>
    </div>
  );
};

export default DEX;
