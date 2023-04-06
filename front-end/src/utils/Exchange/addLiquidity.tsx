import getExchangeContractInstance from "../contract/getExchangecontract";
import getTokenContractInstance from "../contract/getTokencontract";
import { EXCHANGE_CONTRACT_ADDRESS } from "@/constants/Exchange";
import { utils } from "ethers";
import { BigNumber } from "ethers";

/**
 * addLiquidity helps add liquidity to the exchange,
 * If the user is adding initial liquidity, user decides the ether and CD tokens he wants to add
 * to the exchange. If he is adding the liquidity after the initial liquidity has already been added
 * then we calculate the Crypto Dev tokens he can add, given the Eth he wants to add by keeping the ratios
 * constant
 */

export const addLiquidity = async (
  providerOrSigner: any,
  addCDAmountWei: BigNumber,
  addETHAmountWei: BigNumber
) => {
  try {
    const tokenContract = getTokenContractInstance(providerOrSigner);
    const exchangeContract = await getExchangeContractInstance(
      providerOrSigner
    );
    // user needs to give the contract allowance to tkae the CD tokens from his account because it is a ERC20 token
    let tx = await tokenContract.approve(
      EXCHANGE_CONTRACT_ADDRESS,
      addCDAmountWei.toString()
    );
    await tx.wait();
    // user adds the liquidity to the exchange
    tx = await exchangeContract.addLiquidity(addCDAmountWei, {
      value: addETHAmountWei,
    });
    await tx.wait();
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const calculateCD = async (
  _addEther = "0",
  etherBalanceContract: string,
  cdTokenReserve: string
) => {
  // add ether is string, we need to convert it to BigNumber to perform calculations
  const _addEtherAmountWei = utils.parseEther(_addEther);
  // ratio needs to be maintained when adding liquidity
  // so we calculate the amount of CD tokens the user can add
  // The ratio we follow is (amount of Crypto Dev tokens to be added) / (Crypto Dev tokens balance) = (Eth that would be added) / (Eth reserve in the contract)
  // So by maths we get (amount of Crypto Dev tokens to be added) = (Eth that would be added * Crypto Dev tokens balance) / (Eth reserve in the contract)

  const cryptoDevTokenAmount = _addEtherAmountWei
    .mul(cdTokenReserve)
    .div(etherBalanceContract);
  return cryptoDevTokenAmount;
};
