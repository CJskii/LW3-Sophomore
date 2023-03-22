import { walletContext } from "@/pages/_app";
import { getProviderOrSigner } from "@/helpers/providerSigner";
import React, { useContext, useEffect, useState, useRef } from "react";
import Web3Modal from "web3modal";

const ConnectButton = () => {
  const [walletConnected, setWalletConnected] = useContext(walletContext);
  const [loading, setLoading] = useState<boolean>(false);

  const web3modalRef = useRef<Web3Modal>();

  useEffect(() => {
    if (!walletConnected) {
      web3modalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletConnected]);

  const connectWallet = async () => {
    try {
      await getProviderOrSigner({ needSigner: false, web3modalRef });
      setWalletConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center grow pt-2">
      <button className="btn">Connect</button>
    </div>
  );
};

export default ConnectButton;
