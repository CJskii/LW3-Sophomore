import Divider from "./Divider";

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <div className="flex w-full h-full pt-4">
        <div className="grid h-20 flex-grow card bg-transparent rounded-box place-items-center">
          WL
        </div>
        <Divider />
        <div className="grid h-20 flex-grow card bg-transparent rounded-box place-items-center">
          NFT
        </div>
        <Divider />
        <div className="grid h-20 flex-grow card bg-transparent rounded-box place-items-center">
          ICO
        </div>
        <Divider />
        <div className="grid h-20 flex-grow card bg-transparent rounded-box place-items-center">
          DAO
        </div>
        <Divider />
        <div className="grid h-20 flex-grow card bg-transparent rounded-box place-items-center">
          DEX
        </div>
      </div>
      <h1 className="text-5xl text-accent">Dive into Sophomore</h1>
      <p className="text-xl text-center text-[#753140ff]">
        Unlock the power of Web3 with this extensive library of dApps. <br></br>
        Discover the potential of decentralised applications and take your
        skills to the next level. <br></br> 🤓
      </p>
    </div>
  );
};

export default Home;
