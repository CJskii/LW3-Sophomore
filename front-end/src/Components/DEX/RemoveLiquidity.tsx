import { utils, BigNumber } from "ethers";

interface Props {
  setRemoveLPTokens: (value: string) => void;
  _removeLiquidity: () => void;
  removeLPTokens: any;
  removeCD: BigNumber;
  removeEther: BigNumber;
  _getTokensAfterRemove: (removeLPTokens: string) => Promise<void>;
}

const RemoveLiquidity = (props: Props) => {
  const {
    setRemoveLPTokens,
    _removeLiquidity,
    removeCD,
    removeEther,
    _getTokensAfterRemove,
  } = props;
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
      <button className="btn" onClick={() => _removeLiquidity}>
        Remove
      </button>
    </div>
  );
};

export default RemoveLiquidity;
