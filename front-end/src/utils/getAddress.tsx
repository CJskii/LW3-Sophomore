import { JsonRpcSigner } from "@ethersproject/providers";

const currentAddress = async (signer: object) => {
  const address = await (signer as JsonRpcSigner).getAddress();
  return address;
};

export default currentAddress;
