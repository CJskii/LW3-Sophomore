import getExchangeContractInstance from "../contract/getExchangecontract";
import getTokenContractInstance from "../contract/getTokencontract";
import { EXCHANGE_CONTRACT_ADDRESS } from "@/constants/Exchange";

/*
    getAmountOfTokensReceivedFromSwap:  Returns the number of Eth/Crypto Dev tokens that can be received 
    when the user swaps `_swapAmountWei` amount of Eth/Crypto Dev tokens.
*/

export const getAmountOfTokensReceivedFromSwap = async (
  _swapAmountWei: any,
  provider: any,
  ethSelected: boolean,
  ethBalance: any,
  reservedCD: any
) => {
  const exchangeContract = await getExchangeContractInstance(provider);
  let amountOfTokens;
  if (ethSelected) {
    amountOfTokens = await exchangeContract.getAmountOfTokens(
      _swapAmountWei,
      ethBalance,
      reservedCD
    );
  } else {
    amountOfTokens = await exchangeContract.getAmountOfTokens(
      _swapAmountWei,
      reservedCD,
      ethBalance
    );
  }
  return amountOfTokens;
};

/*
  swapTokens: Swaps `swapAmountWei` of Eth/Crypto Dev tokens with `tokenToBeReceivedAfterSwap` amount of Eth/Crypto Dev tokens.
*/

export const swapTokens = async (
  signer: any,
  swapAmountWei: string,
  tokenToBeReceivedAfterSwap: string,
  ethSelected: boolean
) => {
  // If Eth is selected call the `ethToCryptoDevToken` function else
  // call the `cryptoDevTokenToEth` function from the contract
  // As you can see you need to pass the `swapAmount` as a value to the function because
  // it is the ether we are paying to the contract, instead of a value we are passing to the function
  const exchangeContract = await getExchangeContractInstance(signer);
  const tokenContract = getTokenContractInstance(signer);
  let tx;
  if (ethSelected) {
    tx = await exchangeContract.ethToCryptoDevToken(
      tokenToBeReceivedAfterSwap,
      { value: swapAmountWei }
    );
  } else {
    // user has to approve the contract to take the CD tokens from his account
    tx = await tokenContract.approve(
      EXCHANGE_CONTRACT_ADDRESS,
      swapAmountWei.toString()
    );
    await tx.wait();
    // call cryptoDevTokenToEth function which would take in `swapAmountWei` of `Crypto Dev` tokens and would
    // send back `tokenToBeReceivedAfterSwap` amount of `Eth` to the user
    tx = await exchangeContract.cryptoDevTokenToEth(
      swapAmountWei,
      tokenToBeReceivedAfterSwap
    );
  }
  await tx.wait();
};
