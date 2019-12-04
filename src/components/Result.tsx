import CircularProgress from "@material-ui/core/CircularProgress";
import { useObservable } from "hooks";
import {
  getAllDependencies$,
  getAllVersions$,
  PackageVersionInfo,
} from "observables/getDependencies";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { map } from "rxjs/operators";
import { getConcurrencyCount } from "store/selectors/concurrency";
import DependenciesList from "./DependenciesList";
import VersionSelect from "./VersionSelect";

interface Props {
  packageName: string;
  showDifferentVersion: boolean;
}

function convertData(data: PackageVersionInfo): VersionInfoWithOptions {
  return {
    latest: data.latest,
    options: data.versions.map(value => ({
      label: value,
      value,
    })),
  };
}

const useResult = (packageName: string, showDifferentVersion: boolean) => {
  const concurrency = useSelector(getConcurrencyCount);
  const [selectedVersion, setSelectedVersion] = useState<OptionType>();
  const [versions, setVersions] = useObservable<VersionInfoWithOptions>();
  const [dependencies, setDependencies] = useObservable<string[]>();
  useEffect(() => {
    setVersions(
      getAllVersions$(packageName).pipe(map(data => convertData(data))),
    );
  }, [packageName, setVersions]);
  useEffect(() => {
    if (versions.completed && versions.data) {
      const latestVersion = versions.data.latest;
      setSelectedVersion({ label: latestVersion, value: latestVersion });
    }
  }, [versions]);
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
};

const Result: React.FC<Props> = ({ packageName, showDifferentVersion }) => {
  const {
    versions,
    dependencies,
    selectedVersion,
    setSelectedVersion,
  } = useResult(packageName, showDifferentVersion);
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
      <VersionSelect
        {...{
          versionsCompleted,
          versionsData,
          selectedVersion,
          setSelectedVersion,
        }}
      />
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

export default React.memo(Result);
