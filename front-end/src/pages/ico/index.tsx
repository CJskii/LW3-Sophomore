import Head from "next/head";
import { Inter } from "next/font/google";
import ICO from "@/Components/ICO/ICO";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>ICO dApp</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/rocket.svg" />
      </Head>
      <main className="w-full h-full grow">
        <ICO />
      </main>
    </>
  );
}
