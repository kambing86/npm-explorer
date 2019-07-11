import { CircularProgress } from "@material-ui/core";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useObservable } from "../hooks";
import { getAllDependencies$ } from "../observables/getDependencies";
import { getConcurrencyCount } from "../state/selectors/concurrency";

interface IProps {
  packageName: string;
  showDifferentVersion: boolean;
}

const Result: React.FC<IProps> = ({ packageName, showDifferentVersion }) => {
  const [observerState, setObservable] = useObservable<string[]>();
  const concurrency = useSelector(getConcurrencyCount);

  useEffect(() => {
    setObservable(
      getAllDependencies$(packageName, showDifferentVersion, concurrency)
    );
  }, [setObservable, packageName, showDifferentVersion, concurrency]);
  const { data, error, completed } = observerState;
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
          <ul>
            {data.sort().map(dependency => (
              <li key={dependency}>{dependency}</li>
            ))}
          </ul>
        </>
      )}
      {completed && !data && <div>No dependencies</div>}
    </>
  );
};

export default Result;
