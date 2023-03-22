import { walletContext } from "@/pages/_app";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Contract } from "ethers";
import { getProviderOrSigner } from "../../helpers/providerSigner";
import { web3ModalContext } from "@/pages/_app";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../../constants/whitelist";
import { JsonRpcSigner } from "@ethersproject/providers";

const Whitelist = () => {
  const [walletConnected, setWalletConnected] = useContext(walletContext);
  const [joinedWhitelist, setJoinedWhitelist] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState<number>(0);
  const [web3modalRef, setWeb3modalRef] = useContext(web3ModalContext);

  const addAddressToWhitelist = async () => {
    try {
      // signer - we will write into the contract
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });

      // initiate contract instance
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

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
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );

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
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const address = await (signer as JsonRpcSigner).getAddress();

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
        return <button className="btn">Loading...</button>;
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
    <div className="w-full h-full flex flex-col justify-center items-center grow pt-2 gap-8">
      <h1 className="text-4xl">Whitelist dApp</h1>
      <div className="w-full h-full flex flex-col justify-center items-center gap-4">
        <h1>Welcome to crypto devs!</h1>
        <div>It's an NFT collection for developers in Crypto.</div>
        <div>{numberOfWhitelisted} have already joined the Whitelist</div>
        {renderButton()}
      </div>
    </div>
  );
};

export default Whitelist;
