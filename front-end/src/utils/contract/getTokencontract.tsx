import { Contract } from "ethers";
import {
  TOKEN_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
} from "@/constants/DevToken";

const getTokenContractInstance = (providerOrSigner: any) => {
  return new Contract(
    TOKEN_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI,
    providerOrSigner
  );
};

export default getTokenContractInstance;
