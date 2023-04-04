import { Contract } from "ethers";
import { NFT_CONTRACT_ADDRESS } from "@/constants/NFTcollection";
import { abi as NFT_CONTRACT_ABI } from "@/constants/NFTcollection";

const getNFTContractInstance = (providerOrSigner: any) => {
  return new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, providerOrSigner);
};

export default getNFTContractInstance;
