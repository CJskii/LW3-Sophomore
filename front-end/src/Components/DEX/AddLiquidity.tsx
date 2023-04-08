import { BigNumber, utils } from "ethers";
import { calculateCD } from "@/utils/Exchange/addLiquidity";

interface Props {
  reservedCD: BigNumber;
  setAddEther: (value: string) => void;
  setAddCDTokens: (value: BigNumber) => void;
  _addLiquidity: () => void;
  addCDTokens: BigNumber;
  etherBalanceContract: BigNumber;
}

const AddLiquidty = (props: Props) => {
  const {
    reservedCD,
    setAddEther,
    setAddCDTokens,
    _addLiquidity,
    addCDTokens,
    etherBalanceContract,
  } = props;
  const zero = BigNumber.from("0");

  const renderAddLiquidity = () => {
    {
      /* If reserved CD is zero, render the state for liquidity zero where we ask the user
            how much initial liquidity he wants to add else just render the state where liquidity is not zero and
            we calculate based on the `Eth` amount specified by the user how much `CD` tokens can be added */
    }
    if (utils.parseEther(reservedCD.toString()).eq(zero)) {
      return (
        <div className="flex justify-center items-center gap-2 mb-2 col-start-1 justify-self-center self-center">
          <div className="flex flex-col justify-center items-center">
            <input
              type="number"
              placeholder="Amount of Ether"
              onChange={(e) => setAddEther(e.target.value || "0")}
              className="mb-2 rounded pl-2"
            />
            <input
              type="number"
              placeholder="Amount of CD tokens"
              onChange={(e) =>
                setAddCDTokens(
                  BigNumber.from(utils.parseEther(e.target.value || "0"))
                )
              }
              className="rounded pl-2"
            />
          </div>

          <button className="btn" onClick={() => _addLiquidity}>
            Add
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col justify-center items-center gap-2">
          <input
            type="number"
            placeholder="Amount of Ether"
            onChange={async (e) => {
              setAddEther(e.target.value || "0");
              // calculate the number of CD tokens that
              // can be added given  `e.target.value` amount of Eth
              const _addCDTokens = await calculateCD(
                e.target.value || "0",
                etherBalanceContract,
                reservedCD
              );
              setAddCDTokens(_addCDTokens);
            }}
            className="p-2 rounded"
          />
          <div className="">
            {/* Convert the BigNumber to string using the formatEther function from ethers.js */}
            {`You will need ${utils.formatEther(addCDTokens)} Crypto Dev
                Tokens`}
          </div>
          <button className="btn" onClick={() => _addLiquidity()}>
            Add
          </button>
        </div>
      );
    }
  };

  return <>{renderAddLiquidity()}</>;
};

export default AddLiquidty;
