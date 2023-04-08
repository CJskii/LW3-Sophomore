import { motion } from "framer-motion";
import { useContext, useEffect } from "react";
import { walletContext } from "@/pages/_app";
import { web3ModalContext } from "@/pages/_app";
import { getProviderOrSigner } from "@/utils/providerSigner";
import Web3Modal from "web3modal";

const Hero = () => {
  const variantsHero = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const [walletConnected, setWalletConnected] = useContext(walletContext);
  const [web3modalRef, setWeb3modalRef] = useContext(web3ModalContext);

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting its `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3modalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWallet = async () => {
    try {
      await getProviderOrSigner({ needSigner: false, web3modalRef });
      setWalletConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col w-full h-full justify-center items-center gap-8 pt-8 flex-grow">
      <motion.div
        variants={variantsHero}
        initial="hidden"
        animate="visible"
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 40,
          delay: 1,
        }}
        className="text-5xl text-accent"
      >
        Dive into Sophomore
      </motion.div>
      <motion.div
        variants={variantsHero}
        initial="hidden"
        animate="visible"
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1.2,
        }}
        className="text-xl text-center text-[#b79ded]"
      >
        Unlock the power of Web3 with this extensive library of dApps. <br></br>
        Discover the potential of decentralised applications and take your
        skills to the next level. <br></br> 🤓
      </motion.div>
    </div>
  );
};

export default Hero;
