import Divider from "./Divider";
import { motion } from "framer-motion";

const Home = () => {
  const variantsLinks = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <div className="flex w-full h-full pt-4">
        <motion.div
          variants={variantsLinks}
          initial="hidden"
          animate="visible"
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="grid h-20 flex-grow card bg-transparent rounded-box place-items-center"
        >
          WL
        </motion.div>
        <Divider />
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
          className="grid h-20 flex-grow card bg-transparent rounded-box place-items-center"
        >
          NFT
        </motion.div>
        <Divider />
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
          className="grid h-20 flex-grow card bg-transparent rounded-box place-items-center"
        >
          ICO
        </motion.div>
        <Divider />
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
          className="grid h-20 flex-grow card bg-transparent rounded-box place-items-center"
        >
          DAO
        </motion.div>
        <Divider />
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
          className="grid h-20 flex-grow card bg-transparent rounded-box place-items-center"
        >
          DEX
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
