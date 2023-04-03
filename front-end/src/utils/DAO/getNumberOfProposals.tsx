import { getProviderOrSigner } from "../providerSigner";
import getDaoContractInstance from "../getDAOcontract";
// Read number of proposals from the DAO contract and set it to state
export const getNumProposals = async (web3modalRef: any) => {
  let number;
  try {
    const provider = await getProviderOrSigner({
      needSigner: false,
      web3modalRef,
    });
    const contract = await getDaoContractInstance(provider);
    number = await contract.numProposals();
    //setNumProposals(daoNumProposals.toString());
  } catch (err) {
    console.log(err);
  }
  return number;
};
