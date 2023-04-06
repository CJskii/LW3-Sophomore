import { utils, BigNumber } from "ethers";

interface Props {
  setSelectedTab: (tab: string) => void;
}

const Liquidity = (props: Props) => {
  const { setSelectedTab } = props;
  const zero = BigNumber.from(0);
  return (
    <>
      <div className="tabs">
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
        <a className="tab tab-lifted tab-active text-white">Add liquidity</a>
      </div>
    </>
    // <div>
    //   <div className="">
    //     You have:
    //     <br />
    //     {/* Convert the BigNumber to string using the formatEther function from ethers.js */}
    //     {utils.formatEther(cdBalance)} Crypto Dev Tokens
    //     <br />
    //     {utils.formatEther(ethBalance)} Ether
    //     <br />
    //     {utils.formatEther(lpBalance)} Crypto Dev LP tokens
    //   </div>
    //   <div>
    //     {/* If reserved CD is zero, render the state for liquidity zero where we ask the user
    //         how much initial liquidity he wants to add else just render the state where liquidity is not zero and
    //         we calculate based on the `Eth` amount specified by the user how much `CD` tokens can be added */}
    //     {utils.parseEther(reservedCD.toString()).eq(zero) ? (
    //       <div>
    //         <input
    //           type="number"
    //           placeholder="Amount of Ether"
    //           onChange={(e) => setAddEther(e.target.value || "0")}
    //           className=""
    //         />
    //         <input
    //           type="number"
    //           placeholder="Amount of CryptoDev tokens"
    //           onChange={(e) =>
    //             setAddCDTokens(
    //               BigNumber.from(utils.parseEther(e.target.value || "0"))
    //             )
    //           }
    //           className=""
    //         />
    //         <button className="btn" onClick={_addLiquidity}>
    //           Add
    //         </button>
    //       </div>
    //     ) : (
    //       <div>
    //         <input
    //           type="number"
    //           placeholder="Amount of Ether"
    //           onChange={async (e) => {
    //             setAddEther(e.target.value || "0");
    //             // calculate the number of CD tokens that
    //             // can be added given  `e.target.value` amount of Eth
    //             const _addCDTokens = await calculateCD(
    //               e.target.value || "0",
    //               etherBalanceContract,
    //               reservedCD
    //             );
    //             setAddCDTokens(_addCDTokens);
    //           }}
    //           className=""
    //         />
    //         <div className="">
    //           {/* Convert the BigNumber to string using the formatEther function from ethers.js */}
    //           {`You will need ${utils.formatEther(addCDTokens)} Crypto Dev
    //               Tokens`}
    //         </div>
    //         <button className="" onClick={_addLiquidity}>
    //           Add
    //         </button>
    //       </div>
    //     )}
    //     <div>
    //       <input
    //         type="number"
    //         placeholder="Amount of LP Tokens"
    //         onChange={async (e) => {
    //           setRemoveLPTokens(e.target.value || "0");
    //           // Calculate the amount of Ether and CD tokens that the user would receive
    //           // After he removes `e.target.value` amount of `LP` tokens
    //           await _getTokensAfterRemove(e.target.value || "0");
    //         }}
    //         className=""
    //       />
    //       <div className="">
    //         {/* Convert the BigNumber to string using the formatEther function from ethers.js */}
    //         {`You will get ${utils.formatEther(removeCD)} Crypto
    //           Dev Tokens and ${utils.formatEther(removeEther)} Eth`}
    //       </div>
    //       <button className="btn" onClick={_removeLiquidity}>
    //         Remove
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Liquidity;
