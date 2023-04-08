import { utils, BigNumber } from "ethers";
import { getProviderOrSigner } from "@/utils/providerSigner";
import { removeLiquidity } from "@/utils/Exchange/removeLiquidity";
import React, { useState } from "react";

interface Props {
  setRemoveLPTokens: (value: string) => void;
  removeLPTokens: any;
  removeCD: BigNumber;
  removeEther: BigNumber;
  _getTokensAfterRemove: (removeLPTokens: string) => Promise<void>;
  web3modalRef: any;
  getAmounts: () => void;
  setRemoveCD: (value: BigNumber) => void;
  setRemoveEther: (value: BigNumber) => void;
}

const RemoveLiquidity = (props: Props) => {
  const {
    setRemoveLPTokens,
    web3modalRef,
    removeCD,
    removeEther,
    _getTokensAfterRemove,
    removeLPTokens,
    getAmounts,
    setRemoveCD,
    setRemoveEther,
  } = props;

  const [loading, setLoading] = useState(false);

  const _removeLiquidity = async () => {
    const zero = BigNumber.from("0");
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
      getAmounts();
      setRemoveCD(zero);
      setRemoveEther(zero);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center gap-2 col-start-2 justify-self-center self-center">
      <input
        type="number"
        placeholder="Amount of LP Tokens"
        onChange={async (e) => {
          setRemoveLPTokens(e.target.value || "0");
          // Calculate the amount of Ether and CD tokens that the user would receive
          // After he removes `e.target.value` amount of `LP` tokens
          await _getTokensAfterRemove(e.target.value || "0");
        }}
        className="p-2 rounded"
      />
      <div className="flex flex-col justify-center items-center">
        {/* Convert the BigNumber to string using the formatEther function from ethers.js */}
        <span>You will get ${utils.formatEther(removeCD)} CD Tokens</span>
        <span>and ${utils.formatEther(removeEther)} Eth</span>
      </div>
      {loading ? (
        <button className="btn loading">Loading ...</button>
      ) : (
        <button className="btn" onClick={() => _removeLiquidity()}>
          Remove
        </button>
      )}
    </div>
  );
};

export default RemoveLiquidity;
