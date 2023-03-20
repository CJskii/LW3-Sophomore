import { motion } from "framer-motion";

const Hero = () => {
  const variantsHero = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  return (
    <div className="flex flex-col w-full justify-center items-center gap-8 pt-8">
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
        className="text-xl text-center text-[#753140ff]"
      >
        Unlock the power of Web3 with this extensive library of dApps. <br></br>
        Discover the potential of decentralised applications and take your
        skills to the next level. <br></br> 🤓
      </motion.div>
    </div>
  );
};

export default Hero;
