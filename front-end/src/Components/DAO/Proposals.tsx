import { useState, useContext, useEffect } from "react";
import { getProviderOrSigner } from "@/utils/providerSigner";
import getDaoContractInstance from "@/utils/contract/getDAOcontract";
import { web3ModalContext } from "@/pages/_app";
import { motion } from "framer-motion";
import { fetchAllProposals } from "@/utils/DAO/getProposals";

interface Props {
  numProposals: number;
  getTreasuryBalance: () => void;
  setSelectedTab: (tab: string) => void;
}

const Proposals = (props: Props) => {
  const { numProposals, getTreasuryBalance, setSelectedTab } = props;
  const [web3modalRef, setWeb3ModalRef] = useContext(web3ModalContext);
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState<any>([]);

  useEffect(() => {
    fetchProposals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const proposals = await fetchAllProposals(web3modalRef, numProposals);
      setProposals(proposals);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  // calls the 'voteOnProposal' function in the DAO contract
  // given the proposal ID and vote type
  const voteOnProposal = async (id: number, _vote: string) => {
    try {
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });
      let vote = _vote === "YAY" ? 1 : 0;
      const contract = await getDaoContractInstance(signer);
      console.log({ id, vote });
      const tx = await contract.voteOnProposal(id, vote);
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await fetchProposals();
    } catch (err) {
      console.log(err);
    }
  };

  // calls the 'executeProposal' function in the DAO contract
  // given the proposal ID
  const executeProposal = async (proposalId: number) => {
    try {
      const signer = await getProviderOrSigner({
        needSigner: true,
        web3modalRef,
      });
      const contract = await getDaoContractInstance(signer);
      const tx = await contract.executeProposal(proposalId);
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await fetchProposals();
      await getTreasuryBalance();
    } catch (err: any) {
      console.log(err);
      window.alert(err.reason);
    }
  };

  const renderProposals = () => {
    if (loading) {
      return (
        <div className="btn loading col-span-2 self-center place-self-center">
          Loading...
        </div>
      );
    } else if (proposals.length === 0) {
      return (
        <div className="col-span-2 self-center place-self-center mb-4 text-xl text-rose-600 bg-slate-800 p-4 rounded">
          No proposals have been created
        </div>
      );
    } else {
      return (
        <motion.div className="m-2 flex flex-col justify-center items-start w-full overflow-x-auto">
          <>
            <div className="tabs">
              <a
                className="tab tab-lifted text-slate-400 hover:text-slate-200"
                onClick={() => setSelectedTab("")}
              >
                DAO
              </a>
              <a className="tab tab-lifted tab-active text-white">Proposals</a>
              <a
                className="tab tab-lifted text-slate-400 hover:text-slate-200"
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
              className="overflow-x-auto h-[350px] overflow-y-auto w-full"
            >
              <table className="table w-full">
                {/* head */}
                <thead>
                  <tr className="text-white">
                    <th>ID</th>
                    <th>NFT ID</th>
                    <th>Deadline</th>
                    <th>YAY</th>
                    <th>NAY</th>
                    <th>Executed?</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  {proposals.map((p: any, index: number) => (
                    <tr key={index}>
                      <th className="text-blue-300">{p.proposalId}</th>
                      <td className="text-blue-200"># {p.nftTokenId}</td>
                      <td className="text-blue-200">
                        {p.deadline.toLocaleString()}
                      </td>
                      <td className="text-green-500">{p.yayVotes}</td>
                      <td className="text-red-500">{p.nayVotes}</td>
                      <td className="font-bold text-blue-200">
                        {p.executed.toString()}
                      </td>
                      <td className="flex justify-end">
                        {p.deadline.getTime() > Date.now() && !p.executed ? (
                          <div className="">
                            <button
                              className="btn"
                              onClick={() =>
                                voteOnProposal(p.proposalId, "YAY")
                              }
                            >
                              Vote YAY
                            </button>
                            <button
                              className="btn ml-2"
                              onClick={() =>
                                voteOnProposal(p.proposalId, "NAY")
                              }
                            >
                              Vote NAY
                            </button>
                          </div>
                        ) : p.deadline.getTime() < Date.now() && !p.executed ? (
                          <button
                            className="btn"
                            onClick={() => executeProposal(p.proposalId)}
                          >
                            Execute Proposal{" "}
                            {p.yayVotes > p.nayVotes ? "(YAY)" : "(NAY)"}
                          </button>
                        ) : (
                          <div className="text-blue-200 ">
                            Proposal Executed
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </>
        </motion.div>
      );
    }
  };

  return <>{renderProposals()}</>;
};

export default Proposals;
