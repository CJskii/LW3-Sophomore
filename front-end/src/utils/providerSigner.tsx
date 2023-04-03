import { providers } from "ethers";
import Web3Modal from "web3modal";

interface Props {
  needSigner: boolean;
  web3modalRef: React.MutableRefObject<Web3Modal | null>;
}

export const getProviderOrSigner = async ({
  needSigner = false,
  web3modalRef,
}: Props) => {
  const provider = await web3modalRef.current?.connect();
  const web3Provider = new providers.Web3Provider(provider);

  // if user is not connected to Sepolia, let them know and throw an error
  const { chainId } = await web3Provider.getNetwork();

  // check if user is connected to Sepolia
  if (chainId !== 11155111) {
    window.alert("Change network to Sepolia");
    throw new Error("Change network to Sepolia");
  }

  // get signer
  if (needSigner) {
    const signer = web3Provider.getSigner();
    return signer;
  }
  return web3Provider;
};
