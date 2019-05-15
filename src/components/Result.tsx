import React, { useEffect } from "react";
import { useConcurrency, useObservable } from "../hooks";
import { getAllDependencies$ } from "../observables/getDependencies";
import { CircularProgress } from "@material-ui/core";

interface IProps {
  packageName: string;
  showDifferentVersion: boolean;
}

const Result: React.FC<IProps> = ({ packageName, showDifferentVersion }) => {
  const [concurrency] = useConcurrency();
  const [observableState, setObservable] = useObservable<string[]>();
  useEffect(() => {
    setObservable(
      getAllDependencies$(packageName, showDifferentVersion, concurrency)
    );
  }, [setObservable, packageName, showDifferentVersion, concurrency]);
  const { data, error, completed } = observableState;
  if (error) {
    console.error(error);
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
