import { motion } from "framer-motion";
import Image from "next/image";
import { BigNumber } from "ethers";

interface Props {
  setSelectedTab: (tab: string) => void;
  renderButton: () => JSX.Element | undefined;
  ethBalance: BigNumber;
  cdBalance: BigNumber;
}

const OverviewDEX = (props: Props) => {
  const { setSelectedTab, renderButton, ethBalance, cdBalance } = props;
  return (
    <>
      <motion.div
        initial="initialState"
        animate="animateState"
        exit="exitState"
        transition={{
          duration: 1,
        }}
        variants={{
          initialState: {
            opacity: 0,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
            y: 50,
          },
          animateState: {
            opacity: 1,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
            y: 0,
          },
          exitState: {
            clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
            y: -50,
          },
        }}
        className="w-fit h-full font-roboto flex flex-col justify-center items-center gap-4 xl:items-start text-yellow-400 self-center place-self-center p-8 max-sm:px-0 text-center"
      >
        <h1 className="text-3xl lg:text-4xl text-blue-200 text-center">
          Welcome to the Exchange!
        </h1>
        <div className="text-xl text-blue-200 text-left max-sm:hidden">
          Exchange Ethereum &#60;&#62; Crypto Dev Tokens
        </div>
        <div className="italic text-lg text-wine max-sm:px-2 flex flex-col items-start">
          <p>
            Your balance of ETH:{" "}
            <span className="font-bold">
              {(parseInt(ethBalance.toString()) / 10 ** 18).toFixed(2)}
            </span>
          </p>
          {cdBalance.toString() == "0" ? null : (
            <p>
              Your balance of CD:{" "}
              <span className="font-bold">
                {(parseInt(cdBalance.toString()) / 10 ** 18).toFixed(2)}
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex justify-center items-center gap-2 max-md:flex-col">
            <button
              className="btn"
              onClick={() => {
                setSelectedTab("Swap");
              }}
            >
              Swap
            </button>
            <button
              className="btn"
              onClick={() => {
                setSelectedTab("Liquidity");
              }}
            >
              Liquidity
            </button>
          </div>

          <div>{renderButton()}</div>
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1,
        }}
        className="p-8 max-lg:w-[300px] max-lg:h-[300px] lg:w-[400px] lg:h-[400px] w-[500px] h-[500px] flex justify-center items-center col-start-2 max-sm:hidden"
      >
        <Image
          src={`./cryptodevs/${Math.floor(Math.random() * 20)}.svg`}
          alt="0"
          width={250}
          height={250}
        />
      </motion.div>
    </>
  );
};

export default OverviewDEX;
