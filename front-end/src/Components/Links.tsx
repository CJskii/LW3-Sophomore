import Divider from "./Divider";
import { motion } from "framer-motion";
import Link from "next/link";

const Home = ({ currentPath }: { currentPath: string }) => {
  const variantsLinks = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8 w-full">
      <div className="flex justify-evenly items-center w-full h-full pt-4">
        {/* WL */}
        <Link
          href="/whitelist"
          className="grid h-20 flex-grow card bg-transparent rounded-box place-items-center font-nunito hover:font-bold hover:text-blue-500"
        >
          <motion.div
            variants={variantsLinks}
            initial="hidden"
            animate="visible"
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            WL
          </motion.div>
        </Link>

        <Divider />
        {/* NFT */}
        <Link
          href="/nftcollection"
          className="grid h-20 flex-grow card bg-transparent rounded-box place-items-center font-nunito hover:font-bold hover:text-blue-500"
        >
          <motion.div
            variants={variantsLinks}
            initial="hidden"
            animate="visible"
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
          >
            NFT
          </motion.div>
        </Link>
        <Divider />
        {/* ICO */}
        <Link
          href="/ico"
          className="grid h-20 flex-grow card bg-transparent rounded-box place-items-center font-nunito hover:font-bold hover:text-blue-500"
        >
          <motion.div
            variants={variantsLinks}
            initial="hidden"
            animate="visible"
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.4,
            }}
          >
            ICO
          </motion.div>
        </Link>
        <Divider />
        <Link
          href="/dao"
          className="grid h-20 flex-grow card bg-transparent rounded-box place-items-center font-nunito hover:font-bold hover:text-blue-500"
        >
          <motion.div
            variants={variantsLinks}
            initial="hidden"
            animate="visible"
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.6,
            }}
          >
            DAO
          </motion.div>
        </Link>
        <Divider />
        <Link
          href="/dex"
          className="grid h-20 flex-grow card bg-transparent rounded-box place-items-center font-nunito hover:font-bold hover:text-blue-500"
        >
          <motion.div
            variants={variantsLinks}
            initial="hidden"
            animate="visible"
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.8,
            }}
          >
            DEX
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
