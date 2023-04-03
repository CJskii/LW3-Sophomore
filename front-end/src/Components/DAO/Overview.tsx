import Image from "next/image";
import { formatEther } from "ethers/lib/utils";
import { motion } from "framer-motion";

interface Props {
  nftBalance: number;
  numProposals: number;
  treasuryBalance: string;
  isOwner: boolean;
  loading: boolean;
  withdrawDAOEther: () => void;
  setSelectedTab: (tab: string) => void;
}

const Overview = (props: Props) => {
  const {
    isOwner,
    loading,
    withdrawDAOEther,
    nftBalance,
    numProposals,
    treasuryBalance,
    setSelectedTab,
  } = props;
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
          Welcome to Crypto Devs DAO!
        </h1>
        <div className="text-xl text-blue-200 text-left">
          Your CryptoDevs NFT Balance: {nftBalance}
          <br></br>
          Total Number of Proposals: {numProposals}
        </div>
        <div className="italic text-lg text-wine max-sm:px-2">
          Treasury Balance: {formatEther(treasuryBalance)} ETH
        </div>

        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex justify-center items-center gap-2 max-md:flex-col">
            <button
              className="btn"
              onClick={() => setSelectedTab("Create Proposal")}
            >
              Create Proposal
            </button>
            <button
              className="btn"
              onClick={() => setSelectedTab("View Proposals")}
            >
              View Proposals
            </button>
          </div>

          <div>
            {isOwner ? (
              <div>
                {loading ? (
                  <button className="btn loading">Loading...</button>
                ) : (
                  <button className="btn" onClick={withdrawDAOEther}>
                    Withdraw DAO ETH
                  </button>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
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

export default Overview;
