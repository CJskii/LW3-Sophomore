import { getProviderOrSigner } from "../providerSigner";
import getDaoContractInstance from "../contract/getDAOcontract";
// helper function to fetch and parse one proposal from the DAO contract
// given the proposal ID
// converts returned data into a javascript object with values we can use
const fetchProposalById = async (id: number, web3modalRef: any) => {
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
export const fetchAllProposals = async (
  web3modalRef: any,
  numProposals: number
) => {
  const proposals: any = [];
  try {
    for (let i = 0; i < numProposals; i++) {
      const proposal = await fetchProposalById(i, web3modalRef);
      proposals.push(proposal);
    }
  } catch (err) {
    console.log(err);
  }
  return proposals;
};
