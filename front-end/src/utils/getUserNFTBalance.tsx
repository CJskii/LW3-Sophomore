import { getProviderOrSigner } from "./providerSigner";
import getNFTContractInstance from "./getNFTcontract";
import currentAddress from "@/utils/getAddress";
// Read the balance of user's NFT and set to state
export const getUserNFTBalance = async (web3modalRef: any) => {
  let balance;
  try {
    const signer = await getProviderOrSigner({
      needSigner: true,
      web3modalRef,
    });
    const contract = await getNFTContractInstance(signer);
    const address = await currentAddress(signer);
    balance = await contract.balanceOf(address);
  } catch (err) {
    console.log(err);
  }
  return balance;
};
