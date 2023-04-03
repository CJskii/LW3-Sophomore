import { getProviderOrSigner } from "../providerSigner";
import { CRYPTODEVS_DAO_CONTRACT_ADDRESS } from "@/constants/DAO";
import { BigNumber } from "ethers";
// Read ETH balance from the DAO contract address and set it to state
export const getDAOTreasuryBalance = async (web3modalRef: any) => {
  let balance = BigNumber.from(0);
  try {
    const provider = await getProviderOrSigner({
      needSigner: false,
      web3modalRef,
    });
    balance = await provider.getBalance(CRYPTODEVS_DAO_CONTRACT_ADDRESS);
  } catch (err) {
    console.log(err);
  }
  return balance;
};
