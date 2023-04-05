import { Contract } from "ethers";
import {
  EXCHANGE_CONTRACT_ADDRESS,
  EXCHANGE_CONTRACT_ABI,
} from "@/constants/Exchange";

const getExchangeContractInstance = async (providerOrSigner: any) => {
  return new Contract(
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    providerOrSigner
  );
};

export default getExchangeContractInstance;
