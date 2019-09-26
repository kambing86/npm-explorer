import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useObservable } from "../hooks";
import {
  getAllDependencies$,
  getAllVersions$,
  PackageVersionInfo,
} from "../observables/getDependencies";
import { getConcurrencyCount } from "../store/selectors/concurrency";
import DependenciesList from "./DependenciesList";

interface Props {
  packageName: string;
  showDifferentVersion: boolean;
}

const useResult = (
  packageName: string,
  showDifferentVersion: boolean,
  concurrency: number
) => {
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [versions, setVersions] = useObservable<PackageVersionInfo>();
  const [dependencies, setDependencies] = useObservable<string[]>();
  useEffect(() => {
    setVersions(getAllVersions$(packageName));
  }, [packageName, setVersions]);
  useEffect(() => {
    if (versions.completed && versions.data) {
      setSelectedVersion(versions.data.latest);
    }
  }, [versions]);
  useEffect(() => {
    if (selectedVersion === "") return;
    setDependencies(
      getAllDependencies$(
        packageName,
        showDifferentVersion,
        concurrency,
        selectedVersion
      )
    );
  }, [
    selectedVersion,
    setDependencies,
    packageName,
    showDifferentVersion,
    concurrency,
  ]);

  return { versions, dependencies, selectedVersion, setSelectedVersion };
};

const Result: React.FC<Props> = ({ packageName, showDifferentVersion }) => {
  const concurrency = useSelector(getConcurrencyCount);
  const {
    versions,
    dependencies,
    selectedVersion,
    setSelectedVersion,
  } = useResult(packageName, showDifferentVersion, concurrency);
  const selectOnChangedHandler = useCallback(
    (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      setSelectedVersion(event.target.value as string);
    },
    [setSelectedVersion]
  );

  const {
    data: versionsData,
    error: versionsError,
    completed: versionsCompleted,
  } = versions;
  const {
    data: dependenciesData,
    error: dependenciesError,
    completed: dependenciesCompleted,
  } = dependencies;
  if (versionsError) {
    console.error(versionsError); // eslint-disable-line no-console
    return <div>Error: {versionsError.message}</div>;
  }
  if (dependenciesError) {
    console.error(dependenciesError); // eslint-disable-line no-console
    return <div>Error: {dependenciesError.message}</div>;
  }
  const decodedPackageName = decodeURIComponent(packageName);
  return (
    <>
      {versionsCompleted && versionsData && (
        // TODO: use virtualized select
        <Select value={selectedVersion} onChange={selectOnChangedHandler}>
          {versionsData.versions.sort().map(version => (
            <MenuItem key={version} value={version}>
              {version}
            </MenuItem>
          ))}
        </Select>
      )}
      {!dependenciesCompleted && <CircularProgress className="my-2" />}
      {dependenciesData && (
        <>
          <div>
            Found {dependenciesData.length} dependencies for{" "}
            {decodedPackageName}
          </div>
          <DependenciesList data={dependenciesData} />
        </>
      )}
      {dependenciesCompleted && !dependenciesData && <div>No dependencies</div>}
    </>
  );
};

export default Result;
