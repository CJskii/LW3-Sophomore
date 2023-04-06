import { utils } from "ethers";

interface Props {
  setSelectedTab: (tab: string) => void;
}

const Swap = (props: Props) => {
  const { setSelectedTab } = props;
  return (
    <>
      <div className="tabs">
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
    </>
    // <div>
    //   <input
    //     type="number"
    //     placeholder="Amount"
    //     onChange={async (e) => {
    //       setSwapAmount(e.target.value || "");
    //       // Calculate the amount of tokens user would receive after the swap
    //       await _getAmountOfTokensReceivedFromSwap(e.target.value || "0");
    //     }}
    //     className=""
    //     value={swapAmount}
    //   />
    //   <select
    //     className=""
    //     name="dropdown"
    //     id="dropdown"
    //     onChange={async () => {
    //       setEthSelected(!ethSelected);
    //       // Initialize the values back to zero
    //       await _getAmountOfTokensReceivedFromSwap(0);
    //       setSwapAmount("");
    //     }}
    //   >
    //     <option value="eth">Ethereum</option>
    //     <option value="cryptoDevToken">Crypto Dev Token</option>
    //   </select>
    //   <br />
    //   <div className="">
    //     {/* Convert the BigNumber to string using the formatEther function from ethers.js */}
    //     {ethSelected
    //       ? `You will get ${utils.formatEther(
    //           tokenToBeReceivedAfterSwap
    //         )} Crypto Dev Tokens`
    //       : `You will get ${utils.formatEther(tokenToBeReceivedAfterSwap)} Eth`}
    //   </div>
    //   <button className="btn" onClick={_swapTokens}>
    //     Swap
    //   </button>
    // </div>
  );
};

export default Swap;
