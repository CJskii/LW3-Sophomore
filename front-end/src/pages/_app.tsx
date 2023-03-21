import "@/styles/globals.css";
import type { AppProps } from "next/app";
import styles from "../styles/Home.module.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Links from "@/Components/Links";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${styles.background} min-h-screen flex flex-col justify-between items-center`}
    >
      <div className="w-full">
        <Navbar />
        <Links />
      </div>
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}
