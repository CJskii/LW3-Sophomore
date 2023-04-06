import React, { useEffect, useContext, useState } from "react";
import { walletContext } from "@/pages/_app";
import { web3ModalContext } from "@/pages/_app";
import getTokenContractInstance from "@/utils/contract/getTokencontract";
import getExchangeContractInstance from "@/utils/contract/getExchangecontract";
import currentAddress from "@/utils/getAddress";
import { getProviderOrSigner } from "@/utils/providerSigner";
import { BigNumber, utils } from "ethers";
import { addLiquidity, calculateCD } from "@/utils/Exchange/addLiquidity";
import {
  getCDTokensBalance,
  getEtherBalance,
  getLPTokensBalance,
  getReserveOfCDTokens,
} from "@/utils/Exchange/getAmounts";
import {
  getTokensAfterRemove,
  removeLiquidity,
} from "@/utils/Exchange/removeLiquidity";
import {
  swapTokens,
  getAmountOfTokensReceivedFromSwap,
} from "@/utils/Exchange/swap";
import Liquidity from "./Liquidity";

const DEX = () => {
  const [walletConnected, setWalletConnected] = useContext(walletContext);
  const [web3modalRef, setWeb3modalRef] = useContext(web3ModalContext);
  const [liquidityTab, setLiquidityTab] = useState(true);
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

  // ___ VARIBALES FOR KEEPING TRACK OF LIQUIDITY ___

  const [addEther, setAddEther] = useState(zero);
  // addCDTokens keeps track of the amount of CD tokens to be added to the liquidity pool
  const [addCDTokens, setAddCDTokens] = useState(zero);
  // removeEther is the amount of ether that would be send back to user based on the amount of LP tokens he/she wants to remove
  const [removeEther, setRemoveEther] = useState(zero);
  // removeCD is the amount of tokens that would be send back to user based on the amount of LP tokens he/she wants to remove
  const [removeCD, setRemoveCD] = useState(zero);
  // amount of LP tokens that user wants to remove
  const [removeLPTokens, setRemoveLPTokens] = useState("0");

  // ___ VARIABLES FOR KEEPING TRACK OF SWAP ___

  // amount user wants to swap
  const [swapAmount, setSwapAmount] = useState("");
  // This keeps track of the number of tokens that the user would receive after the swap
  const [tokenToBeReceivedAfterSwap, setTokenToBeReceivedAfterSwap] =
    useState(zero);
  // keeps track of whether eth or cd is selected for swap
  const [ethSelected, setEthSelected] = useState(true);

  const liquidityProps = {
    cdBalance,
    ethBalance,
    lpBalance,
    reservedCD,
    addCDTokens,
    setAddEther,
    setAddCDTokens,
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

  // ___ SWAP FUNCTIONS ___

  // Swaps 'swapAmountWei' of Eth/CD tokens with 'tokenToBeReceivedAfterSwap' amount of CD/Eth tokens

  const _swapTokens = async () => {
    try {
      // convert the amount entered by user to BigNumber using parseEther
      const swapAmountWei = utils.parseEther(swapAmount);
      // check if user entered 0
      if (!swapAmountWei.eq(zero)) {
        const signer = await getProviderOrSigner({
          needSigner: true,
          web3modalRef,
        });
        setLoading(true);
        // call the swaptokens function from utils
        await swapTokens(
          signer,
          swapAmountWei,
          tokenToBeReceivedAfterSwap,
          ethSelected
        );
        setLoading(false);
        // update the balances
        await getAmounts();
        setSwapAmount("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // get the amount of tokens that the user would receive after the swap
  const _getAmountOfTokensReceivedFromSwap = async (_swapAmount: number) => {
    try {
      // convert the amount entered by user to BigNumber using parseEther
      const _swapAmountWEI = utils.parseEther(_swapAmount.toString());
      // check if user entered 0
      if (!_swapAmountWEI.eq(zero)) {
        const provider = await getProviderOrSigner({
          needSigner: false,
          web3modalRef,
        });
        const _ethBalance = await getEtherBalance(provider, null, true);
        // call the getAmountOfTokensReceivedFromSwap function from utils
        const amountOfTokens = await getAmountOfTokensReceivedFromSwap(
          _swapAmountWEI,
          provider,
          ethSelected,
          _ethBalance,
          reservedCD
        );
        setTokenToBeReceivedAfterSwap(amountOfTokens);
      } else {
        setTokenToBeReceivedAfterSwap(zero);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ___ ADD LIQUIDITY FUNCTIONS ___

  /**
   * _addLiquidity helps add liquidity to the exchange,
   * If the user is adding initial liquidity, user decides the ether and CD tokens he wants to add
   * to the exchange. If he is adding the liquidity after the initial liquidity has already been added
   * then we calculate the crypto dev tokens he can add, given the Eth he wants to add by keeping the ratios
   * constant
   */

  const _addLiquidity = async () => {
    try {
      // convert the amount entered by user to BigNumber using parseEther
      const addEtherWei = utils.parseEther(addEther.toString());
      // check if user entered 0
      if (!addEtherWei.eq(zero)) {
        const signer = await getProviderOrSigner({
          needSigner: true,
          web3modalRef,
        });
        setLoading(true);
        // call the addLiquidity function from utils
        await addLiquidity(signer, addEtherWei, addCDTokens);
        setLoading(false);
        // reinitialize CD tokens
        setAddCDTokens(zero);
        // update the balances
        await getAmounts();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // ___ REMOVE LIQUIDITY FUNCTIONS ___

  /**
   * _removeLiquidity: Removes the `removeLPTokensWei` amount of LP tokens from
   * liquidity and also the calculated amount of `ether` and `CD` tokens
   */

  const _removeLiquidity = async () => {
    try {
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });
      setLoading(true);
      // convert the amount entered by user to BigNumber using parseEther
      const removeLPTokensWei = utils.parseEther(removeLPTokens.toString());
      await removeLiquidity(signer, removeLPTokensWei);
      setLoading(false);
      // update the balances
      await getAmounts();
      setRemoveCD(zero);
      setRemoveEther(zero);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const _getTokensAfterRemove = async () => {
    try {
      const provider = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });
      const removeLPTokensWei = utils.parseEther(removeLPTokens);
      const _ethBalance = await getEtherBalance(provider, null, true);
      const cryptoDevTokenReserve = await getReserveOfCDTokens(provider);

      const { _removeEther, _removeCD }: any = await getTokensAfterRemove(
        provider,
        removeLPTokensWei,
        _ethBalance,
        cryptoDevTokenReserve
      );
      setRemoveEther(_removeEther);
      setRemoveCD(_removeCD);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center grow pt-8">
      <h1 className="text-5xl">DEX app</h1>
      <Liquidity />
    </div>
  );
};

export default DEX;
