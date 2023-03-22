import { walletContext } from "@/pages/_app";
import { getProviderOrSigner } from "@/helpers/providerSigner";
import React, { useContext, useEffect, useState, useRef } from "react";
import Web3Modal from "web3modal";
import { web3ModalContext } from "@/pages/_app";

const ConnectButton = () => {
  const [walletConnected, setWalletConnected] = useContext(walletContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [web3modalRef, setWeb3modalRef] = useContext(web3ModalContext);
  const [pendingRequest, setPendingRequest] = useState(false);

  useEffect(() => {
    if (!walletConnected && !pendingRequest) {
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
      setPendingRequest(true);
      await getProviderOrSigner({ needSigner: false, web3modalRef });
      setWalletConnected(true);
      setPendingRequest(false);
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
