import { utils, BigNumber } from "ethers";
import React, { useState, useEffect } from "react";
import { getProviderOrSigner } from "@/utils/providerSigner";
import {
  getEtherBalance,
  getReserveOfCDTokens,
} from "@/utils/Exchange/getAmounts";
import { addLiquidity, calculateCD } from "@/utils/Exchange/addLiquidity";
import {
  removeLiquidity,
  getTokensAfterRemove,
} from "@/utils/Exchange/removeLiquidity";
import AddLiquidty from "./AddLiquidity";
import RemoveLiquidity from "./RemoveLiquidity";

interface Props {
  setSelectedTab: (tab: string) => void;
  web3modalRef: any;
  getAmounts: () => void;
  ethBalance: BigNumber;
  cdBalance: BigNumber;
  lpBalance: BigNumber;
  reservedCD: BigNumber;
  etherBalanceContract: BigNumber;
}

const Liquidity = (props: Props) => {
  const {
    setSelectedTab,
    web3modalRef,
    getAmounts,
    ethBalance,
    cdBalance,
    lpBalance,
    reservedCD,
    etherBalanceContract,
  } = props;
  const zero = BigNumber.from(0);
  const [loading, setLoading] = useState(false);

  // ___ VARIBALES FOR KEEPING TRACK OF LIQUIDITY ___

  const [addEther, setAddEther] = useState<BigNumber | string>(zero);
  // addCDTokens keeps track of the amount of CD tokens to be added to the liquidity pool
  const [addCDTokens, setAddCDTokens] = useState(zero);
  // removeEther is the amount of ether that would be send back to user based on the amount of LP tokens he/she wants to remove
  const [removeEther, setRemoveEther] = useState(zero);
  // removeCD is the amount of tokens that would be send back to user based on the amount of LP tokens he/she wants to remove
  const [removeCD, setRemoveCD] = useState(zero);
  // amount of LP tokens that user wants to remove
  const [removeLPTokens, setRemoveLPTokens] = useState("0");

  // ___ ADD LIQUIDITY FUNCTIONS ___

  /**
   * _addLiquidity helps add liquidity to the exchange,
   * If the user is adding initial liquidity, user decides the ether and CD tokens he wants to add
   * to the exchange. If he is adding the liquidity after the initial liquidity has already been added
   * then we calculate the crypto dev tokens he can add, given the Eth he wants to add by keeping the ratios
   * constant
   */

  useEffect(() => {
    getAmounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
        getAmounts();
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

  const _getTokensAfterRemove = async (_removeLPTokens: string) => {
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

  const addLiquidityProps = {
    reservedCD,
    setAddEther,
    setAddCDTokens,
    _addLiquidity,
    addCDTokens,
    etherBalanceContract,
  };

  const removeLiquidityProps = {
    setRemoveLPTokens,
    _getTokensAfterRemove,
    removeCD,
    removeEther,
    removeLPTokens,
    web3modalRef,
    getAmounts,
    setRemoveCD,
    setRemoveEther,
  };

  return (
    <div className="flex flex-col justify-start items-center">
      {loading ? (
        <button className="btn loading">Loading...</button>
      ) : (
        <>
          <div className="tabs w-full">
            <a
              className="tab tab-lifted text-slate-400 hover:text-slate-200"
              onClick={() => setSelectedTab("")}
            >
              DAO
            </a>
            <a
              className="tab tab-lifted text-slate-400 hover:text-slate-200"
              onClick={() => setSelectedTab("Swap")}
            >
              Swap
            </a>
            <a className="tab tab-lifted tab-active text-white">
              Add liquidity
            </a>
          </div>

          <div className="text-white w-full grid grid-flow-row grid-cols-2 grid-rows-2 items-center gap-8">
            <div className="w-full text-center col-span-2">
              You have:
              <br />
              {/* Convert the BigNumber to string using the formatEther function from ethers.js */}
              {utils.formatEther(ethBalance)} Ether
              <br />
              {utils.formatEther(cdBalance)} Crypto Dev Tokens
              <br />
              {utils.formatEther(lpBalance)} Crypto Dev LP tokens
            </div>
            <div className="grid grid-cols-2 col-span-2">
              <AddLiquidty {...addLiquidityProps} />
              <RemoveLiquidity {...removeLiquidityProps} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Liquidity;
