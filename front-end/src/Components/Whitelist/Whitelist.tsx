import { walletContext } from "@/pages/_app";
import React, { useContext, useEffect, useState } from "react";
import { getProviderOrSigner } from "../../utils/providerSigner";
import { web3ModalContext } from "@/pages/_app";
import currentAddress from "@/utils/getAddress";
import WhitelistHeader from "./Header";
import Image from "next/image";
import getWhitelistContractInstance from "@/utils/contract/getWhitelistcontract";

const Whitelist = () => {
  const [walletConnected, setWalletConnected] = useContext(walletContext);
  const [joinedWhitelist, setJoinedWhitelist] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState<number>(0);
  const [web3modalRef, setWeb3modalRef] = useContext(web3ModalContext);

  useEffect(() => {
    getNumberOfWhitelisted();
    checkIfAddressInWhitelist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletConnected]);

  const addAddressToWhitelist = async () => {
    try {
      // signer - we will write into the contract
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });

      // initiate contract instance
      const whitelistContract = getWhitelistContractInstance(signer);

      // initiate adding address to whitelist on contract
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);

      // await until promise resolve and address is added into the whitelist
      await tx.wait();
      setLoading(false);

      // update number of whitelisted addresses
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.log(err);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      // provider - we don't need signer as we will only read from the contract
      const provider = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });

      //initiate contract instance - gas free
      const whitelistContract = getWhitelistContractInstance(provider);

      // read from the contract number of whitelisted addresses
      const _numberOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();

      // set resolved number to frontend state
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });
      const whitelistContract = getWhitelistContractInstance(signer);

      const address = await currentAddress(signer);

      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );

      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner({ needSigner: false, web3modalRef });
      setWalletConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return <div>Thanks for joining the Whitelist!</div>;
      } else if (loading) {
        return <button className="btn loading">Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className="btn">
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className="btn">
          Connect your wallet
        </button>
      );
    }
  };

  return (
    <div className="w-full h-full grid grid-rows-4 md:grid-rows-6 max-sm:grid-rows-8 grid-cols-12 grid-flow-rows pt-2 gap-8">
      <h1 className="text-5xl font-montserrat font-bold self-center place-self-center col-start-1 col-span-12 max-lg:row-span-2 max-sm:row-span-1 text-center max-sm:col-start-1 max-sm:text-4xl">
        Whitelist dApp
      </h1>

      <div className="row-start-2 row-span-4 col-start-2 xl:col-start-3 col-span-10 xl:col-span-8 max-lg:row-start-3 max-sm:row-start-2 max-lg:col-start-1 max-lg:col-span-12 max-sm:col-span-12 max-[320px]:col-span-11 max-lg:m-2 grid grid-flow-row gap-8 bg-indigo-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-100">
        <div className="w-fit h-full font-roboto flex flex-col justify-center items-center gap-4 xl:items-start text-yellow-400 self-center place-self-center p-8 max-sm:px-0 text-center">
          <WhitelistHeader />
          <div className="text-xl text-blue-200">
            It&#39;s an NFT collection for developers in Crypto.
          </div>
          <div className="italic text-lg text-wine max-sm:px-2">
            {numberOfWhitelisted} user has joined the Whitelist already
          </div>
          <div className="text-md text-gray-200">{renderButton()}</div>
        </div>
        <div className="p-8 max-lg:w-[300px] max-lg:h-[300px] lg:w-[400px] lg:h-[400px] w-[500px] h-[500px] flex justify-center items-center col-start-2 max-sm:hidden">
          <Image
            src="./crypto-devs.svg"
            alt="whitelist"
            width={400}
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default Whitelist;
