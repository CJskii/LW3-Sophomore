import { Contract, BigNumber, utils } from "ethers";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  NFT_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
  NFT_CONTRACT_ABI,
  TOKEN_CONTRACT_ABI,
} from "@/constants/DevToken";
import { walletContext, web3ModalContext } from "@/pages/_app";
import { getProviderOrSigner } from "@/helpers/providerSigner";
import { JsonRpcSigner } from "@ethersproject/providers";
import Web3Modal from "web3modal";

const ICO = () => {
  // Create a big number '0'
  const zero = BigNumber.from(0);

  // Context states
  const [walletConnected, setWalletConnected] = useContext(walletContext);
  const [web3modalRef, setWeb3modalRef] = useContext(web3ModalContext);

  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // keeps track of tokens to be claimed by user holding NFT
  const [tokensToBeClaimed, setTokensToBeClaimed] = useState(zero);
  // balance of tokens in the currently connected wallet
  const [balanceOfTokens, setBalanceOfTokens] = useState(zero);
  // amount of tokens that user wants to mint
  const [tokenAmount, setTokenAmount] = useState(zero);
  // amount of minted tokens until now
  const [tokensMinted, setTokensMinted] = useState(zero);

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3modalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getTotalTokensMinted();
    getBalanceOfTokens();
    getTokensToBeClaimed();
    getOwner();
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

  // ___ CHECK TOKENS TO BE CLAIMED FOR CURRENT USER ___

  const getTokensToBeClaimed = async () => {
    try {
      // get provider - we will be reading from the contract
      const provider = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });

      // create instance of NFT contract
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      );

      // create instance of Token contract
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );

      // get signer - we use this to extract currently connected wallet address
      const signer = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });
      // get current address
      const address = await (signer as JsonRpcSigner).getAddress();
      // check NFT balance of current address in NFT contract
      const balance = await nftContract.balanceOf(address);
      if (balance === zero) {
        setTokensToBeClaimed(zero);
      } else {
        // amount keeps track of the unclaimed tokens number
        let amount = 0;
        // for all NFTs check if the tokens have already been claimed
        // only increase the amount if the tokens have not been claimed
        // for NFT(tokenID)
        for (let i = 0; i < balance; i++) {
          const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
          const claimed = await tokenContract.tokenIdsClaimed(tokenId);
          if (!claimed) {
            amount++;
          }
        }
        // since tokens are initialized to Big number
        // we need to change amount to big number
        setTokensToBeClaimed(BigNumber.from(amount));
      }
    } catch (err) {
      console.log(err);
      setTokensToBeClaimed(zero);
    }
  };

  // ___ CHECK BALANCE OF TOKENS HELD BY THE ADDRESS ___

  const getBalanceOfTokens = async () => {
    try {
      // get provider - we will be reading from the contract
      const provider = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });

      // create token contract instance
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );

      // get signer - we use this to extract currently connected wallet address
      const signer = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });
      // get address
      const address = await (signer as JsonRpcSigner).getAddress();

      // call balance from the contract
      const balance = tokenContract.balanceOf(address);

      // balance is already a big number so we don't need to convert it
      setBalanceOfTokens(balance);
    } catch (err) {
      console.log(err);
      setBalanceOfTokens(zero);
    }
  };

  // ___ MINT 'amount' OF TOKENS TO GIVEN ADDRESS ___

  const mintTokens = async (amount: number) => {
    try {
      // initiate signer instance - we will be writing to the contract
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });

      // create token contract instance
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );
      // each token value is 0.001 ether
      const value = amount * 0.001;
      // mint 'amount' of tokens
      const tx = await tokenContract.mint(amount, {
        // value = ether we pay for minting
        // we are parsing value to string using utils from ethers library
        value: utils.parseEther(value.toString()),
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert(`Succesfully minted ${amount} Crypto Dev Tokens`);
      await getBalanceOfTokens();

      //await getTotalTokensMinted() _________________________________
      await getTokensToBeClaimed();
    } catch (err) {
      console.log(err);
    }
  };

  // ___ CLAIM TOKENS ___
  const claimTokens = async () => {
    try {
      // initiate signer instance - we will be writing to the contract
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });

      // create token contract instance
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );

      const tx = await tokenContract.claim();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      window.alert("Sucessfully claimed Crypto Dev Tokens");
      await getBalanceOfTokens();
      await getTotalTokensMinted();
      await getTokensToBeClaimed();
    } catch (err) {
      console.error(err);
    }
  };

  // ___ CHECK HOW MANY TOKENS HAVE BEEN MINTED OUT OF TOTAL SUPPLY ___

  const getTotalTokensMinted = async () => {
    try {
      // get provider - we will be reading from the contract
      const provider = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });

      // create token contract instance
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );

      // retrieve total supply from the contract
      const _tokensMinted = tokenContract.totalSupply();
      setTokensMinted(_tokensMinted);
    } catch (err) {
      console.log(err);
      setTokensMinted(zero);
    }
  };

  // ___ CHECK IF CURRENT ADDRESS IS THE OWNER ___

  const getOwner = async () => {
    try {
      // get provider - we will be reading from the contract
      const provider = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });

      // create token contract instance
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );

      // call owner instance
      const _owner = await tokenContract.owner();

      // get signer - we use this to extract currently connected wallet address
      const signer = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });

      // get current address
      const address = await (signer as JsonRpcSigner).getAddress();

      // compare current address with contract owner
      if (address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const withdrawCoins = async () => {
    try {
      // get signer - we use this to extract currently connected wallet address
      const signer = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });

      // create token contract instance
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );

      // call withdraw function
      const tx = tokenContract.withdraw();

      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getOwner();
    } catch (err) {
      console.log(err);
    }
  };

  // returns a button based on the state of app

  const renderButton = () => {
    // If we are currently waiting for something, return a loading button
    if (loading) {
      return (
        <div>
          <button className="btn loading">Loading...</button>
        </div>
      );
    }
    // If tokens to be claimed are greater than 0, Return a claim button
    if (tokensToBeClaimed > 0) {
      return (
        <div>
          <div className="">
            {tokensToBeClaimed * 10} Tokens can be claimed!
          </div>
          <button className="btn" onClick={claimTokens}>
            Claim Tokens
          </button>
        </div>
      );
    }
    // If user doesn't have any tokens to claim, show the mint button
    return (
      <div style={{ display: "flex-col" }}>
        <div>
          <input
            type="number"
            placeholder="Amount of Tokens"
            // BigNumber.from converts the `e.target.value` to a BigNumber
            onChange={(e) => setTokenAmount(BigNumber.from(e.target.value))}
            className=""
          />
        </div>

        <button
          className=""
          disabled={!(tokenAmount > 0)}
          onClick={() => mintTokens(tokenAmount)}
        >
          Mint Tokens
        </button>
      </div>
    );
  };

  return (
    <div className="w-full h-full grid grid-rows-4 md:grid-rows-6 max-sm:grid-rows-8 grid-cols-12 grid-flow-rows pt-2 gap-8">
      <h1 className="text-5xl font-montserrat font-bold self-center place-self-center col-start-1 col-span-12 max-lg:row-span-2 max-sm:row-span-1 text-center max-sm:col-start-1 max-sm:text-4xl">
        ICO dApp
      </h1>
      <div className="row-start-2 row-span-4 col-start-2 xl:col-start-3 col-span-10 xl:col-span-8 max-lg:row-start-3 max-sm:row-start-2 max-lg:col-start-1 max-lg:col-span-12 max-sm:col-span-12 max-[320px]:col-span-11 max-lg:m-2 grid grid-flow-row gap-8 bg-indigo-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-100">
        <div className="w-fit h-full font-roboto flex flex-col justify-center items-center gap-4 xl:items-start text-yellow-400 self-center place-self-center p-8 max-sm:px-0 text-center">
          <h1 className="text-3xl lg:text-4xl text-blue-200 text-center">
            Welcome to Crypto Devs!
          </h1>
          <div className="text-xl text-blue-200">
            It&#39;s an NFT collection for developers in Crypto.
          </div>
          <div className="italic text-lg text-wine max-sm:px-2">
            {tokenIdsMinted}/20 have been minted
          </div>
          <div className="text-md text-gray-200">{renderButton()}</div>
        </div>
        <div className="p-8 max-lg:w-[300px] max-lg:h-[300px] lg:w-[400px] lg:h-[400px] w-[500px] h-[500px] flex justify-center items-center col-start-2 max-sm:hidden">
          {/* image */}
        </div>
      </div>
    </div>
  );
};

export default ICO;
