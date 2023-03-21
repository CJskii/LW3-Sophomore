import { motion } from "framer-motion";
import Link from "next/link";

const Start = () => {
  const variantsBtn = {
    hover: { scale: 1.1, boxShadow: "0px 0px 12px rgb(192, 41, 38,0.8)" },
    tap: { scale: 0.9 },
    animate: {
      y: [-25, 0, 25],
      transition: { duration: 2, repeat: Infinity },
    },
  };
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center grow pt-8 bg-indigo-900 gap-16">
      <h1 className="text-5xl text-white">This is where it all begins...</h1>
      <Link href="/home">
        <motion.button
          variants={variantsBtn}
          whileHover="hover"
          whileTap="tap"
          animate="animate"
          className="btn px-8 hover:text-yellow-400 mt-12"
        >
          Get started
        </motion.button>
      </Link>
    </div>
  );
};

export default Start;
