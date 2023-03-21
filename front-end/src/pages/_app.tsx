import "@/styles/globals.css";
import type { AppProps } from "next/app";
import styles from "../styles/Home.module.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Links from "@/Components/Links";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div
      className={`${styles.background} min-h-screen flex flex-col justify-between items-center`}
    >
      <div className="w-full">
        {currentPath == "/" ? <Navbar /> : null}
        {/* <Navbar /> */}
        <Links currentPath={currentPath} />
      </div>
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}
