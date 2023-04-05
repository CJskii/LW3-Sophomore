import React, { useEffect, useContext, useState } from "react";
import getTokenContractInstance from "@/utils/contract/getTokencontract";
import getExchangeContractInstance from "@/utils/contract/getExchangecontract";

const DEX = () => {
  return (
    <div className="w-full h-full flex justify-center items-center grow pt-8">
      <h1 className="text-5xl">DEX app</h1>
    </div>
  );
};

export default DEX;
