// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {

    address public cryptoDevTokenAddress;

    constructor(address _CryptoDevtoken) ERC20("CryptoDevToken", "CDLP") {
        require(_CryptoDevtoken != address(0), "Invalid address");
        cryptoDevTokenAddress = _CryptoDevtoken;
    }

    function getReserve() public view returns (uint256) {
        return ERC20(cryptoDevTokenAddress).balanceOf(address(this));
    }

    function addLiquidity(uint _amount) public payable returns (uint) {
        uint liquidity;
        uint ethBalance = address(this).balance;
        uint cryptoDevTokenReserve = getReserve();
        ERC20 cryptoDevToken = ERC20(cryptoDevTokenAddress);

        // if the reserver is empty, take any user supplied value for 'ether' and 'cryptoDevToken' because there's no ratio
        if (cryptoDevTokenReserve == 0) {
            // transfer the cryptoDevToken from the user to the contract
            cryptoDevToken.transferFrom(msg.sender, address(this), _amount);
            // because this is first deposit into the liquidity pool the ratio is 1:1
            // we mint the same amount of liquidity tokens as the amount of ether/cryptoDevTokens deposited
            liquidity = ethBalance;
            _mint(msg.sender, liquidity);
        }  else {
            // if the reserve is not empty, calculate the ratio of ether/cryptoDevToken

            // EthReserve should be the current ethBalance substracted by the value of ether sent by the user
            uint ethReserve = ethBalance - msg.value;
            // calculate the ratio of ether/cryptoDevToken
            // ratio should be the amount of ether sent by the user divided by the current ethReserve
            // ratio should be maintained so that there are no major price impacts when adding liquidity
            uint cryptoDevTokenAmount = (msg.value * cryptoDevTokenReserve) / ethReserve;
            require(_amount >= cryptoDevTokenAmount, "Amount of tokens sent is less than minimum required");

            // transfer the cryptoDevToken from the user to the contract
            cryptoDevToken.transferFrom(msg.sender, address(this), cryptoDevTokenAmount);
            // calculate the amount of liquidity tokens to mint
            // liquidity tokens should be minted in the same ratio as the amount of ether/cryptoDevTokens deposited
            liquidity = (totalSupply() * msg.value) / ethReserve;
            _mint(msg.sender, liquidity);
        }
        return liquidity;
    } 

    // returns the amount of ether and cryptoDevToken that the user will receive when removing liquidity

    function removeLiquidity(uint _amount) public returns (uint, uint) {
        require(_amount > 0, "Amount must be greater than 0");
        uint ethReserve = address(this).balance;
        uint _totalSupply = totalSupply();

        // calculate the amount of ether to send to the user based on ratio of liquidity tokens to total supply
        uint ethAmount = (ethReserve * _amount) / _totalSupply;
        // calculate the amount of cryptoDevToken to send to the user based on ratio of liquidity tokens to total supply
        uint cryptoDevTokenAmount = (getReserve() * _amount) / _totalSupply;
        // burn the liquidity tokens
        _burn(msg.sender, _amount);
        // send ether to the user
        payable(msg.sender).transfer(ethAmount);
        // send cryptoDevToken to the user
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, cryptoDevTokenAmount);
        return (ethAmount, cryptoDevTokenAmount);
    }


    // return amount of eth/cryptoDevtokens that would be returned to user in swap
    function getAmountOfTokens(uint256 inputAmount, uint256 inputReserve, uint256 outputReserve) public pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "Reserves must be greater than 0");
        //we are charging a 1% fee on every swap
        // Input amount with fee = (input amount - (1*(input amount)/100)) = ((input amount)*99)/100
        uint256 inputAmountWithFee = inputAmount * 99;
        // Because we need to follow the concept of `XY = K` curve
        // We need to make sure (x + Δx) * (y - Δy) = x * y
        // So the final formula is Δy = (y * Δx) / (x + Δx)
        // Δy in our case is `tokens to be received`
        // Δx = ((input amount)*99)/100, x = inputReserve, y = outputReserve
        // So by putting the values in the formulae you can get the numerator and denominator
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountWithFee;
        return numerator / denominator;
    }

    // swap ether for cryptoDevToken

    function ethToCryptoDevToken(uint _minTokens) public payable {
        uint256 tokenReserve = getReserve();
        // call the `getAmountOfTokens` to get the amount of Crypto Dev tokens
        // that would be returned to the user after the swap
        // Notice that the `inputReserve` we are sending is equal to
        // `address(this).balance - msg.value` instead of just `address(this).balance`
        // because `address(this).balance` already contains the `msg.value` user has sent in the given call
        // so we need to subtract it to get the actual input reserve

        uint256 tokensBought = getAmountOfTokens(msg.value, address(this).balance - msg.value, tokenReserve);
        require(tokensBought >= _minTokens, "Insufficient output amount");
        // Transfer the tokens to the user
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, tokensBought);
    }

    // swap cryptoDevToken for ether

    function cryptoDevTokenToEth(uint _tokensSold, uint _minEth) public {
        uint256 tokenReserve = getReserve();
        // call getAmountOfTokens to get the amount of ether
        // that would be returned to the user after the swap
        uint256 ethBought = getAmountOfTokens(_tokensSold, tokenReserve, address(this).balance);
        require(ethBought >= _minEth, "Insufficient output amount");
        // Transfer the tokens to the contract
        ERC20(cryptoDevTokenAddress).transferFrom(msg.sender, address(this), _tokensSold);
        // Transfer the ether to the user
        payable(msg.sender).transfer(ethBought);
    }

}