import "@/styles/globals.css";
import type { AppProps } from "next/app";
import styles from "../styles/Home.module.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Links from "@/Components/Links";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPath}
        initial="initialState"
        animate="animateState"
        exit="exitState"
        transition={{
          duration: 0.75,
        }}
        variants={{
          initialState: {
            opacity: 0,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          },
          animateState: {
            opacity: 1,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          },
          exitState: {
            clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
          },
        }}
      >
        <div
          className={`${
            currentPath !== "/" ? styles.background : null
          } min-h-screen flex flex-col justify-between items-center`}
        >
          <div className="w-full">
            {currentPath == "/home" ? <Navbar /> : null}
            {/* <Navbar /> */}
            {currentPath !== "/" ? <Links currentPath={currentPath} /> : null}
          </div>
          <motion.div
            className="w-full h-full grow"
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.75,
            }}
          >
            <Component {...pageProps} />
          </motion.div>
          {currentPath !== "/" ? <Footer /> : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
