import useObservable from "hooks/helpers/useObservable";
import { MapPriceSession, getPriceSession$ } from "observables/price";
import { memo } from "react";
import { Chart } from "react-google-charts";

type GoogleDataType = [string, number, number, number, number];

function mapDataFunc(data: MapPriceSession<GoogleDataType>): GoogleDataType {
  const { key, open, close, min, max } = data;
  return [key, min, open, close, max];
}

interface Props {
  name: string;
}

const CandlestickChart = (props: Props) => {
  const [price] = useObservable(getPriceSession$(props.name, 10, mapDataFunc));
  const { data, error } = price;
  if (error) {
    return <>{error.toString()}</>;
  }
  if (data === undefined) {
    return null;
  }
  const values = data.map((d) => d.mapData);
  return (
    <Chart
      width={"100%"}
      height={"100%"}
      chartType="CandlestickChart"
      loader={<div>Loading Chart</div>}
      data={[["minute", "a", "b", "c", "d"], ...values]}
      options={{
        legend: "none",
      }}
      rootProps={{ "data-testid": "1" }}
    />
  );
};

export default memo(CandlestickChart);
