import { Contract } from "ethers";
import {
  WHITELIST_CONTRACT_ADDRESS,
  abi as WHITELIST_CONTRACT_ABI,
} from "@/constants/whitelist";

const getWhitelistContractInstance = (providerOrSigner: any) => {
  return new Contract(
    WHITELIST_CONTRACT_ADDRESS,
    WHITELIST_CONTRACT_ABI,
    providerOrSigner
  );
};

export default getWhitelistContractInstance;
