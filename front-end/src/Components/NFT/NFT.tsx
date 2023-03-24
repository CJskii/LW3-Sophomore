import { walletContext, web3ModalContext } from "@/pages/_app";
import React, { useContext, useEffect, useState } from "react";
import { Contract, utils } from "ethers";
import { NFT_CONTRACT_ADDRESS, abi } from "../../constants/NFTcollection";
import { getProviderOrSigner } from "../../helpers/providerSigner";
import { JsonRpcSigner } from "@ethersproject/providers";
import Web3Modal from "web3modal";

const NFT = () => {
  const [web3modalRef, setWeb3modalRef] = useContext(web3ModalContext);
  const [walletConnected, setWalletConnected] = useContext(walletContext);

  const [presaleStarted, setPresaleStarted] = useState<boolean>(false);
  const [presaleEnded, setPresaleEnded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [tokenIdsMinted, setTokenIdsMinted] = useState<number>(0);

  // ___ ON COMPONENT RENDER ___

  useEffect(() => {
    if (!walletConnected) {
      web3modalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, []);

  useEffect(() => {
    // Check if presale has started
    // const checkPresale = async () => {
    //   const _presaleStarted = await checkIfPresaleStarted();
    //   if (_presaleStarted) {
    //     checkIfPresaleEnded();
    //   }
    // };

    // checkPresale();
    getTokenIdsMinted();

    // Interval to call and check every 5 seconds if presale has ended
    const _presaleEndedInterval = setInterval(async function () {
      const _presaleStarted = await checkIfPresaleStarted();
      if (_presaleStarted) {
        const _presaleEnded = await checkIfPresaleEnded();
        if (_presaleEnded) {
          clearInterval(_presaleEndedInterval);
        }
      }
    }, 5 * 1000);

    setInterval(async function () {
      await getTokenIdsMinted();
    }, 5 * 1000);
  }, [walletConnected]);

  const connectWallet = async () => {
    try {
      await getProviderOrSigner({ needSigner: false, web3modalRef });
      setWalletConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  // ___ MINT NFT DURING PRESALE ___

  const presaleMint = async () => {
    try {
      // initiate signer - we will write into the contract
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });

      // initiate instance of NFT contract
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

      // on the instance of our contract initiate presaleMint function call
      const tx = await nftContract.presaleMint({
        // we using using.parseEther from ethers library to change our human readable number to EVM number
        value: utils.parseEther("0.01"),
      });
      // display loading message
      setLoading(true);
      // we are waiting for the mint to be completed
      await tx.wait();
      // set loading to false and remove loading message
      setLoading(false);
      // you have succesfully minted NFT from presale - display message for the user
    } catch (err) {
      console.log(err);
    }
  };

  // ___ MINT NFT DURING PUBLIC SALE ___

  const publicMint = async () => {
    try {
      // initiate signer - we will write into the contract
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });

      // initiate instance of NFT contract
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      // on the instance of our contract initiate presaleMint function call
      const tx = await nftContract.mint({
        // we using using.parseEther from ethers library to change our human readable number to EVM number
        value: utils.parseEther("0.01"),
      });

      // display loading message
      setLoading(true);
      // we are waiting for the mint to be completed
      await tx.wait();
      // set loading to false and remove loading message
      setLoading(false);
      // you have succesfully minted NFT from public - display message for the user
    } catch (err) {
      console.log(err);
    }
  };

  // __ START PRESALE - executalbe only by the contract owner __

  const startPresale = async () => {
    try {
      // initiate signer - we will write into the contract
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });

      // initiate instance of our contract
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      // on instance of our contract initiate presale by calling startPresale function
      const tx = nftContract.startPresale();

      // display loading message
      setLoading(true);
      // we are waiting for presale to start
      await tx.wait();
      // set loading to false and remove loading message
      setLoading(false);
      await checkIfPresaleStarted();
    } catch (err) {
      console.log(err);
    }
  };

  // ___ CHECKING FOR PRESALE START/END ___

  const checkIfPresaleStarted = async () => {
    try {
      // initiate provider - we will only read from the contract
      const provider = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });

      // initiate instance of NFT contract
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      // on instance of our contract initiate reading of presaleStarted boolean
      const _presaleStarted = await nftContract.presaleStarted();

      if (!_presaleStarted) {
        await getOwner();
      }
      setPresaleStarted(_presaleStarted);
      return _presaleStarted;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const checkIfPresaleEnded = async () => {
    try {
      // initiate provider - we will only read from the contract
      const provider = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });

      // initiate instance of NFT contract
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      // on instance of our contract initiate reading of presaleEnded boolean
      const _presaleEnded = await nftContract.presaleEnded();

      // presaleEnded is BIG NUMBER, so we are using lt(less than function)
      // Date.now() / 1000 is a current time in seconds
      // We compare if _presaleEnded timestamp is < less then current time
      const hasEnded = _presaleEnded.lt(Math.floor(Date.now() / 1000));
      if (hasEnded) {
        setPresaleEnded(true);
      } else {
        setPresaleEnded(false);
      }
      return hasEnded;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  // ___ GET OWNER OF THE CONTRACT ___

  const getOwner = async () => {
    try {
      // initiate provider - we will only read from the contract
      const provider = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });

      // initiate instance of NFT contract
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      // on instance of our contract initiate call to owner() function
      const _owner = await nftContract.owner();

      // initiate signer - we will use this to read wallet address from the current Metamask account
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });
      // read address from metamask
      const address = await (signer as JsonRpcSigner).getAddress();
      // if metamask address is same as _owner returned from our contract set owner to true
      if (address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ___ GET NUMBER OF MINTED TOKEN IDS ___

  const getTokenIdsMinted = async () => {
    // initiate provider - we will only read from the contract
    const provider = await getProviderOrSigner({
      needSigner: false,
      web3modalRef,
    });

    // initiate instance of NFT contract
    const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
    // on instance of our contract initiate call to tokenIds() variable
    // when calling tokenIds() function, it returns an array of BigNumber objects
    const _tokenIds = await nftContract.tokenIds();

    // since _tokenIds is a BIG NUMBER we are using .toString() method to convert it
    setTokenIdsMinted(_tokenIds.toString());
  };

  return (
    <div className="w-full h-full flex justify-center items-center grow pt-8">
      <h1 className="text-5xl">NFT app</h1>
    </div>
  );
};

export default NFT;
