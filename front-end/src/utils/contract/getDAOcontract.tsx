import { Contract } from "ethers";
import {
  CRYPTODEVS_DAO_CONTRACT_ADDRESS,
  CRYPTODEVS_DAO_CONTRACT_ABI,
} from "@/constants/DAO";

const getDaoContractInstance = async (providerOrSigner: any) => {
  return new Contract(
    CRYPTODEVS_DAO_CONTRACT_ADDRESS,
    CRYPTODEVS_DAO_CONTRACT_ABI,
    providerOrSigner
  );
};

export default getDaoContractInstance;
