import { JsonRpcSigner } from "@ethersproject/providers";

const getAddress = async (signer: object) => {
  const address = await (signer as JsonRpcSigner).getAddress();
  return address;
};
