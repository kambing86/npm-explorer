import useObservable from "hooks/helpers/useObservable";
import { StockPriceSession, getStockPriceInGroup$ } from "observables/stock";
import { memo } from "react";
import { Chart } from "react-google-charts";

function splitData(rawData: Required<StockPriceSession>[]) {
  const values: Array<[string, number, number, number, number]> = [];
  for (let i = 0; i < rawData.length; i++) {
    const { key, open, close, min, max } = rawData[i];
    if (open < close) {
      values.push([key, min, open, close, max]);
    } else {
      values.push([key, max, close, open, min]);
    }
  }
  return values;
}

const ChartPage = () => {
  const stockName = "Coin A";
  const [stockPrice] = useObservable(getStockPriceInGroup$(stockName, 10));
  const { data, error } = stockPrice;
  if (error) {
    console.error(error);
  }
  if (data === undefined) {
    return null;
  }
  const values = splitData(data);
  return (
    <>
      {JSON.stringify(data, undefined, 2)}
      <Chart
        width={"100%"}
        height={350}
        chartType="CandlestickChart"
        loader={<div>Loading Chart</div>}
        data={[["minute", "a", "b", "c", "d"], ...values]}
        options={{
          legend: "none",
        }}
        rootProps={{ "data-testid": "1" }}
      />
    </>
  );
};

export default memo(ChartPage);
