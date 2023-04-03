import { useState, useContext, useEffect } from "react";
import { getProviderOrSigner } from "@/helpers/providerSigner";
import getDaoContractInstance from "@/helpers/getDAOcontract";
import { web3ModalContext } from "@/pages/_app";

interface Props {
  numProposals: number;
  getDAOTreasuryBalance: () => void;
  setSelectedTab: (tab: string) => void;
}

const Proposals = (props: Props) => {
  const { numProposals, getDAOTreasuryBalance, setSelectedTab } = props;
  const [web3modalRef, setWeb3ModalRef] = useContext(web3ModalContext);
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState<any>([]);

  useEffect(() => {
    fetchAllProposals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helper function to fetch and parse one proposal from the DAO contract
  // given the proposal ID
  // converts returned data into a javascript object with values we can use
  const fetchProposalById = async (id: number) => {
    try {
      const provider = await getProviderOrSigner({
        needSigner: false,
        web3modalRef,
      });
      const contract = await getDaoContractInstance(provider);
      const proposal = await contract.proposals(id);
      const parsedProposal = {
        proposalId: id,
        nftTokenId: proposal.nftTokenId.toString(),
        deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
        yayVotes: proposal.yayVotes.toString(),
        nayVotes: proposal.nayVotes.toString(),
        executed: proposal.executed,
      };
      return parsedProposal;
    } catch (err) {
      console.log(err);
    }
  };

  // runs a loop to fetch all proposals from the DAO contract
  // and sets the proposals state to an array of all proposals
  const fetchAllProposals = async () => {
    try {
      const proposals = [];
      setLoading(true);
      for (let i = 0; i < numProposals; i++) {
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }
      setProposals(proposals);
      setLoading(false);
      return proposals;
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
      const tx = await contract.voteOnProposal(id, vote);
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await fetchAllProposals();
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
      await fetchAllProposals();
      await getDAOTreasuryBalance();
    } catch (err: any) {
      console.log(err);
      window.alert(err.reason);
    }
  };

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
      <div className="m-2">
        <>
          <div className="tabs">
            <a className="tab tab-lifted text-slate-400 hover:text-slate-200">
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
          <div className="overflow-x-auto w-full">
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
                            onClick={() => voteOnProposal(p.proposalId, "YAY")}
                          >
                            Vote YAY
                          </button>
                          <button
                            className="btn"
                            onClick={() => voteOnProposal(p.proposalId, "NAY")}
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
                        <div className="">Proposal Executed</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
        {/* // <div key={index} className=" bg-slate-700 rounded text-white">
          //   <p>Proposal ID: {p.proposalId.toString()}</p>
          //   <p>Fake NFT to Purchase: {p.nftTokenId}</p>
          //   <p>Deadline: {p.deadline.toLocaleString()}</p>
          //   <p>Yay Votes: {p.yayVotes}</p>
          //   <p>Nay Votes: {p.nayVotes}</p>
          //   <p>Executed?: {p.executed.toString()}</p>
          //   {p.deadline.getTime() > Date.now() && !p.executed ? (
          //     <div className="">
          //       <button
          //         className="btn"
          //         onClick={() => voteOnProposal(p.proposalId, "YAY")}
          //       >
          //         Vote YAY
          //       </button>
          //       <button
          //         className="btn"
          //         onClick={() => voteOnProposal(p.proposalId, "NAY")}
          //       >
          //         Vote NAY
          //       </button>
          //     </div>
          //   ) : p.deadline.getTime() < Date.now() && !p.executed ? (
          //     <div className="">
          //       <button
          //         className="btn"
          //         onClick={() => executeProposal(p.proposalId)}
          //       >
          //         Execute Proposal {p.yayVotes > p.nayVotes ? "(YAY)" : "(NAY)"}
          //       </button>
          //     </div>
          //   ) : (
          //     <div className="">Proposal Executed</div>
          //   )}
          // </div> */}
      </div>
    );
  }
};

export default Proposals;
