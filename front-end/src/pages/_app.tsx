import "@/styles/globals.css";
import type { AppProps } from "next/app";
import styles from "../styles/Home.module.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Links from "@/Components/Links";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import {
  useState,
  createContext,
  useRef,
  MutableRefObject,
  useEffect,
} from "react";
import ConnectButton from "@/Components/ConnectButton";
import Web3Modal from "web3modal";

export const walletContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}]);

export const web3ModalContext = createContext<
  [
    MutableRefObject<Web3Modal | null>,
    React.Dispatch<React.SetStateAction<MutableRefObject<Web3Modal | null>>>
  ]
>([null as any, () => {}]);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currentPath = router.pathname;
  const [walletConnected, setWalletConnected] = useState(false);
  const modalRef = useRef<Web3Modal | null>(null);
  const [web3modalRef, setWeb3modalRef] = useState(modalRef);
  const [imageLoaded, setImageLoaded] = useState("");

  const handleImageLoad = () => {
    setImageLoaded(styles.background);
  };

  useEffect(() => {
    const img = new Image();
    img.src = "/bg.png";
    img.addEventListener("load", handleImageLoad);
    return () => {
      img.removeEventListener("load", handleImageLoad);
    };
  }, []);

  return (
    <web3ModalContext.Provider value={[web3modalRef, setWeb3modalRef]}>
      <walletContext.Provider value={[walletConnected, setWalletConnected]}>
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
                currentPath !== "/" ? imageLoaded : null
              } min-h-screen flex flex-col justify-between items-center`}
            >
              <div className="w-full">
                {currentPath == "/home" ? <Navbar /> : null}
                {/* <ConnectButton /> */}
                {currentPath !== "/" &&
                currentPath !== "/home" &&
                !walletConnected ? (
                  <ConnectButton />
                ) : null}
                {/* <Navbar /> */}
                {currentPath !== "/" ? (
                  <Links currentPath={currentPath} />
                ) : null}
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
      </walletContext.Provider>
    </web3ModalContext.Provider>
  );
}
