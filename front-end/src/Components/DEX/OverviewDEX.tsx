interface Props {
  setSelectedTab: (tab: string) => void;
}

const OverviewDEX = (props: Props) => {
  const { setSelectedTab } = props;
  return (
    <div>
      <h1>Overview DEX</h1>
      <button className="btn" onClick={() => setSelectedTab("Swap")}>
        Swap
      </button>
      <button className="btn" onClick={() => setSelectedTab("Liquidity")}>
        Liquidity
      </button>
    </div>
  );
};

export default OverviewDEX;
