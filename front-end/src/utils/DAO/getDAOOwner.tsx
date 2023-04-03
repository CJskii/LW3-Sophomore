import { getProviderOrSigner } from "../providerSigner";
import getDaoContractInstance from "../getDAOcontract";
import currentAddress from "../getAddress";

export const getDAOOwner = async (web3modalRef: any) => {
  let isOwner = false;
  try {
    // initiate signer - we will write into the contract
    const signer = await getProviderOrSigner({
      needSigner: true,
      web3modalRef,
    });
    // contract instance
    const contract = await getDaoContractInstance(signer);
    // get owner of DAO
    const _owner = await contract.owner();
    // get current wallet address
    const address = await currentAddress(signer);
    if (address.toLowerCase() === _owner.toLowerCase()) {
      isOwner = true;
    }
  } catch (err) {
    console.log(err);
  }
  return isOwner;
};
