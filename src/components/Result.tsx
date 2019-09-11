import { CircularProgress } from "@material-ui/core";
import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { AutoSizer, List } from "react-virtualized";
import { useObservable } from "../hooks";
import { getAllDependencies$ } from "../observables/getDependencies";
import { getConcurrencyCount } from "../store/selectors/concurrency";

interface Props {
  packageName: string;
  showDifferentVersion: boolean;
}

const Result: React.FC<Props> = ({ packageName, showDifferentVersion }) => {
  const [observerState, setObservable] = useObservable<string[]>();
  const concurrency = useSelector(getConcurrencyCount);

  useEffect(() => {
    setObservable(
      getAllDependencies$(packageName, showDifferentVersion, concurrency)
    );
  }, [setObservable, packageName, showDifferentVersion, concurrency]);
  const { data, error, completed } = observerState;
  const rowRenderer = useCallback(
    ({ index, key, style }: any) => {
      if (data === undefined) {
        return null;
      }
      const dependency = data[index];
      return (
        <div className="text-center" key={key} style={style}>
          {dependency}
        </div>
      );
    },
    [data]
  );
  if (error) {
    console.error(error); // eslint-disable-line no-console
    return <div>Error: {error.message}</div>;
  }
  const decodedPackageName = decodeURIComponent(packageName);
  return (
    <>
      {!completed && <CircularProgress />}
      {data && (
        <>
          <div>
            Found {data.length} dependencies for {decodedPackageName}
          </div>
          <div
            className="flex-grow-1 flex-shrink-1"
            style={{ alignSelf: "normal" }}
          >
            <AutoSizer>
              {({ height, width }) => (
                <List
                  width={width}
                  height={height}
                  rowCount={data.length}
                  rowHeight={30}
                  rowRenderer={rowRenderer}
                />
              )}
            </AutoSizer>
          </div>
        </>
      )}
      {completed && !data && <div>No dependencies</div>}
    </>
  );
};

export default Result;
