import getTokenContractInstance from "../contract/getTokencontract";
import getExchangeContractInstance from "../contract/getExchangecontract";
import { EXCHANGE_CONTRACT_ADDRESS } from "@/constants/Exchange";

// retrieves ether balance of the user or contract

export const getEtherBalance = async (
  providerOrSigner: any,
  address: string,
  contract = false
) => {
  try {
    // if the caller has set contract to true, then we will use the contract instance to get the balance
    // if contract is set to false then we will use the providerOrSigner to get the balance
    if (contract) {
      const balance = await providerOrSigner.getBalance(
        EXCHANGE_CONTRACT_ADDRESS
      );
      return balance;
    } else {
      const balance = await providerOrSigner.getBalance(address);
      return balance;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// retrieves crypto dev token balance in the account of provided address

export const getCDTokensBalance = async (
  providerOrSigner: any,
  address: string
) => {
  try {
    const tokenContract = getTokenContractInstance(providerOrSigner);
    const balanceOfCryptoDevTokens = await tokenContract.balanceOf(address);
    return balanceOfCryptoDevTokens;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// retrieves the amount of LP tokens in the account of provided address

export const getLPTokensBalance = async (
  providerOrSigner: any,
  address: string
) => {
  try {
    const exchangeContract = await getExchangeContractInstance(
      providerOrSigner
    );
    const balanceOfLPTokens = await exchangeContract.balanceOf(address);
    return balanceOfLPTokens;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// retrieves the amount of CD tokens in the exchange contract address

export const getReserveOfCDTokens = async (providerOrSigner: any) => {
  try {
    const exchangeContract = await getExchangeContractInstance(
      providerOrSigner
    );
    const reserve = await exchangeContract.getReserve();
    return reserve;
  } catch (error) {
    console.log(error);
    return error;
  }
};
