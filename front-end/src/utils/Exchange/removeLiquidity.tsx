import { utils, BigNumber } from "ethers";
import getExchangeContractInstance from "../contract/getExchangecontract";

/**
 * removeLiquidity: Removes the `removeLPTokensWei` amount of LP tokens from
 * liquidity and also the calculated amount of `ether` and `CD` tokens
 */

export const removeLiquidity = async (
  signer: any,
  removeLPTokensWei: BigNumber
) => {
  const exchangeContract = await getExchangeContractInstance(signer);
  const tx = await exchangeContract.removeLiquidity(removeLPTokensWei);
  await tx.wait();
};

/**
 * getTokensAfterRemove: Calculates the amount of `Eth` and `CD` tokens
 * that would be returned back to user after he removes `removeLPTokenWei` amount
 * of LP tokens from the contract
 */

export const getTokensAfterRemove = async (
  providerOrSigner: any,
  removeLPTokenWei: any,
  _ethBalance: any,
  cryptoDevTokenReserve: any
) => {
  try {
    const exchangeContract = await getExchangeContractInstance(
      providerOrSigner
    );
    // get total supply of LP tokens
    const _totalSupply = await exchangeContract.totalSupply();
    // Here we are using the BigNumber methods of multiplication and division
    // The amount of Eth that would be sent back to the user after he withdraws the LP token
    // is calculated based on a ratio,
    // Ratio is -> (amount of Eth that would be sent back to the user / Eth reserve) = (LP tokens withdrawn) / (total supply of LP tokens)
    // By some maths we get -> (amount of Eth that would be sent back to the user) = (Eth Reserve * LP tokens withdrawn) / (total supply of LP tokens)
    // Similarly we also maintain a ratio for the `CD` tokens, so here in our case
    // Ratio is -> (amount of CD tokens sent back to the user / CD Token reserve) = (LP tokens withdrawn) / (total supply of LP tokens)
    // Then (amount of CD tokens sent back to the user) = (CD token reserve * LP tokens withdrawn) / (total supply of LP tokens)
    const _removeEther = _ethBalance.mul(removeLPTokenWei).div(_totalSupply);
    const _removeCD = cryptoDevTokenReserve
      .mul(removeLPTokenWei)
      .div(_totalSupply);
    return {
      _removeEther,
      _removeCD,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};
