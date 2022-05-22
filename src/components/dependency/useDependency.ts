import useObservable from "hooks/helpers/useObservable";
import { getAllDependencies$ } from "observables/getDependencies";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";

export default function useDependency(
  packageName: string,
  diffVersion: boolean,
) {
  const concurrency = useSelector(
    (state: RootState) => state.search.concurrency,
  );
  const version = useSelector((state: RootState) => state.search.version);
  const [dependencies, setDependencies] = useObservable<string[]>();

  useEffect(() => {
    if (version == null) return;
    setDependencies(
      getAllDependencies$(packageName, diffVersion, concurrency, version),
    );
  }, [version, setDependencies, packageName, diffVersion, concurrency]);

  return {
    dependencies,
  };
}
