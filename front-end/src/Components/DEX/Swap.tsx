import { utils, BigNumber } from "ethers";
import React, { useState } from "react";
import { getProviderOrSigner } from "@/utils/providerSigner";
import { getEtherBalance } from "@/utils/Exchange/getAmounts";
import {
  swapTokens,
  getAmountOfTokensReceivedFromSwap,
} from "@/utils/Exchange/swap";

interface Props {
  setSelectedTab: (tab: string) => void;
  web3modalRef: any;
  getAmounts: () => void;
  reservedCD: BigNumber;
}

const Swap = (props: Props) => {
  const { setSelectedTab, web3modalRef, getAmounts, reservedCD } = props;

  const zero = BigNumber.from(0);
  const [loading, setLoading] = useState(false);

  // ___ VARIABLES FOR KEEPING TRACK OF SWAP ___

  // amount user wants to swap
  const [swapAmount, setSwapAmount] = useState("");
  // This keeps track of the number of tokens that the user would receive after the swap
  const [tokenToBeReceivedAfterSwap, setTokenToBeReceivedAfterSwap] =
    useState(zero);
  // keeps track of whether eth or cd is selected for swap
  const [ethSelected, setEthSelected] = useState(true);

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
        getAmounts();
        setSwapAmount("");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // get the amount of tokens that the user would receive after the swap
  const _getAmountOfTokensReceivedFromSwap = async (
    _swapAmount: number | string
  ) => {
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
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col justify-start items-center w-full">
      <div className="tabs w-full">
        <a
          className="tab tab-lifted text-slate-400 hover:text-slate-200"
          onClick={() => setSelectedTab("")}
        >
          DAO
        </a>
        <a className="tab tab-lifted tab-active text-white">Swap</a>
        <a
          className="tab tab-lifted text-slate-400 hover:text-slate-200"
          onClick={() => setSelectedTab("Liquidity")}
        >
          Add liquidity
        </a>
      </div>
      <div className="flex flex-col justify-center items-center gap-4 mt-8 p-8 rounded min-w-[300px] bg-slate-800">
        <input
          type="number"
          placeholder="Amount"
          onChange={async (e) => {
            setSwapAmount(e.target.value || "");
            // Calculate the amount of tokens user would receive after the swap
            await _getAmountOfTokensReceivedFromSwap(e.target.value || "0");
          }}
          className="text-white p-[5px] text-md"
          value={swapAmount}
        />
        <select
          className="text-slate-300 p-[5px] text-md"
          name="dropdown"
          id="dropdown"
          onChange={async () => {
            setEthSelected(!ethSelected);
            // Initialize the values back to zero
            await _getAmountOfTokensReceivedFromSwap(0);
            setSwapAmount("");
          }}
        >
          <option value="eth">Ethereum</option>
          <option value="cryptoDevToken">Crypto Dev Token</option>
        </select>
        <br />
        <div className="text-blue-200 text-xl">
          {/* Convert the BigNumber to string using the formatEther function from ethers.js */}
          {ethSelected
            ? `You will get ${parseFloat(
                utils.formatEther(tokenToBeReceivedAfterSwap)
              ).toFixed(2)} Crypto Dev Tokens`
            : `You will get ${parseFloat(
                utils.formatEther(tokenToBeReceivedAfterSwap)
              ).toFixed(2)} ETH`}
        </div>
        {loading ? (
          <button className="btn loading">Loading</button>
        ) : (
          <button className="btn" onClick={_swapTokens}>
            Swap
          </button>
        )}
      </div>
    </div>
  );
};

export default Swap;
