import { motion } from "framer-motion";

const Divider = () => {
  const variantsHero = {
    hidden: { y: 200, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  return (
    <motion.div
      variants={variantsHero}
      initial="hidden"
      animate="visible"
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 1.2,
      }}
      className="divider divider-horizontal before:bg-base-300 after:bg-base-300 before:opacity-30 after:opacity-30"
    ></motion.div>
  );
};

export default Divider;
