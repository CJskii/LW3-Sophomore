import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { getProviderOrSigner } from "@/utils/providerSigner";
import getDaoContractInstance from "@/utils/getDAOcontract";
import { web3ModalContext } from "@/pages/_app";

interface Props {
  setSelectedTab: (tab: string) => void;
  getNumProposal: () => void;
  nftBalance: number;
}

const CreateProposal = (props: Props) => {
  const { setSelectedTab, getNumProposal, nftBalance } = props;
  const [fakeNftTokenId, setFakeNftTokenId] = useState<string>("0");
  const [web3modalRef, setWeb3ModalRef] = useContext(web3ModalContext);
  const [loading, setLoading] = useState<boolean>(false);

  // Calls the `createProposal` function in the contract, using the tokenId from `fakeNftTokenId`
  const createProposal = async () => {
    try {
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });
      const daoContract = await getDaoContractInstance(signer);
      const txn = await daoContract.createProposal(fakeNftTokenId);
      setLoading(true);
      await txn.wait();
      await getNumProposal();
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  function renderCreateProposalTab() {
    if (loading) {
      return <div className="btn loading col-span-2">Waiting for txn...</div>;
    } else if (nftBalance == 0) {
      return (
        <div className="bg-slate-800 place-self-center col-span-2 mb-2 p-2 flex flex-col justify-center items-center text-rose-600 rounded">
          You do not own any CryptoDevs NFTs. <br />
          <b>You cannot create or vote on proposals</b>
        </div>
      );
    } else {
      return (
        <div className="flex justify-center max-sm:flex-col items-center gap-2 md:col-span-2 mb-4 bg-slate-800 w-fit place-self-center p-2 rounded">
          <div className="flex flex-col justify-start items-center">
            <label className="text-white">
              Fake NFT Token ID to Purchase:{" "}
            </label>
            <input
              placeholder="0"
              type="number"
              onChange={(e) => setFakeNftTokenId(e.target.value)}
            />
          </div>

          <button className="btn" onClick={createProposal}>
            Create
          </button>
        </div>
      );
    }
  }

  return (
    <motion.div className="m-2">
      <div className="tabs">
        <a
          className="tab tab-lifted text-slate-400 hover:text-slate-200"
          onClick={() => setSelectedTab("")}
        >
          DAO
        </a>
        <a
          className="tab tab-lifted  text-slate-400 hover:text-slate-200"
          onClick={() => setSelectedTab("View Proposals")}
        >
          Proposals
        </a>
        <a
          className="tab tab-lifted tab-active text-white "
          onClick={() => setSelectedTab("Create Proposal")}
        >
          Create proposal
        </a>
      </div>
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
        className="flex justify-center max-sm:flex-col items-center gap-2 md:col-span-2 mb-4 bg-slate-800 w-fit place-self-center p-2 rounded"
      >
        {renderCreateProposalTab()}
      </motion.div>
    </motion.div>
  );
};

export default CreateProposal;
