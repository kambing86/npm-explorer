import {
  getAllDependencies$,
  getAllVersions$,
} from "observables/getDependencies";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { map } from "rxjs/operators";
import { getConcurrencyCount } from "store/selectors/concurrency";
import useObservable from "./helpers/useObservable";

function convertData(data: PackageVersionInfo): VersionInfoWithOptions {
  return {
    latest: data.latest,
    options: data.versions.map((value) => ({
      label: value,
      value,
    })),
  };
}

export default function useResult(
  packageName: string,
  showDifferentVersion: boolean,
) {
  const concurrency = useSelector(getConcurrencyCount);
  const [selectedVersion, setSelectedVersion] = useState<OptionType>();
  const [versions, setVersions] = useObservable<VersionInfoWithOptions>();
  const [dependencies, setDependencies] = useObservable<string[]>();

  // step 1: get all versions based on package name
  useEffect(() => {
    setVersions(
      getAllVersions$(packageName).pipe(map((data) => convertData(data))),
    );
  }, [packageName, setVersions]);

  // step 2: after get all versions completed, set latest version by default
  useEffect(() => {
    if (versions.completed && versions.data) {
      const latestVersion = versions.data.latest;
      setSelectedVersion({ label: latestVersion, value: latestVersion });
    }
  }, [versions]);

  // step 3: get all dependencies based on selected version
  // can be triggered by step 2 or user through setSelectedVersion
  useEffect(() => {
    if (selectedVersion === undefined) return;
    setDependencies(
      getAllDependencies$(
        packageName,
        showDifferentVersion,
        concurrency,
        selectedVersion.value,
      ),
    );
  }, [
    selectedVersion,
    setDependencies,
    packageName,
    showDifferentVersion,
    concurrency,
  ]);

  return { versions, dependencies, selectedVersion, setSelectedVersion };
}
