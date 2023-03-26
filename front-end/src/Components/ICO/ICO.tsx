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

  return (
    <div className="w-full h-full flex justify-center items-center grow pt-8">
      <h1 className="text-5xl">ICO app</h1>
    </div>
  );
};

export default ICO;
