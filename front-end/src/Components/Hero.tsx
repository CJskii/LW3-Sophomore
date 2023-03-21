import { motion } from "framer-motion";

const Hero = () => {
  const variantsHero = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const variantsBtn = {
    hover: { scale: 1.1, boxShadow: "0px 0px 12px rgb(192, 41, 38,0.8)" },
    tap: { scale: 0.9 },
    animate: {
      y: [-50, 0, 50],
      transition: { duration: 2, repeat: Infinity },
    },
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
      <motion.button
        variants={variantsBtn}
        whileHover="hover"
        whileTap="tap"
        animate="animate"
        className="btn px-8 hover:text-yellow-400 mt-12"
      >
        Get started
      </motion.button>
    </div>
  );
};

export default Hero;
