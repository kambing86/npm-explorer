import { memo } from "react";
import CandlestickChart from "./CandlestickChart";

const Dashboard = () => {
  return <CandlestickChart name="Coin A" />;
};

export default memo(Dashboard);
