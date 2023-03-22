import { walletContext } from "@/pages/_app";
import React, { useContext, useEffect, useState, useRef } from "react";
import Web3Modal from "web3modal";
import { IProviderOptions } from "web3modal/dist/helpers";

const Whitelist = () => {
  const [walletConnected, setWalletConnected] = useContext(walletContext);
  const [joinedWhitelist, setJoinedWhitelist] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState<number>(0);

  return (
    <div className="w-full h-full flex justify-center items-center grow pt-2">
      <h1 className="text-4xl">Whitelist dApp</h1>
    </div>
  );
};

export default Whitelist;
