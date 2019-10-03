import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ValueType } from "react-select/src/types";
import { map } from "rxjs/operators";
import { useObservable } from "../hooks";
import {
  getAllDependencies$,
  getAllVersions$,
  PackageVersionInfo,
} from "../observables/getDependencies";
import { getConcurrencyCount } from "../store/selectors/concurrency";
import { isArray } from "../utils/typescriptHelpers";
import DependenciesList from "./DependenciesList";
import Select from "./ReactWindowSelect";

interface Props {
  packageName: string;
  showDifferentVersion: boolean;
}

const useStyles = makeStyles(() => ({
  reactSelect: {
    width: "100%",
  },
}));

interface VersionInfoWithOptions {
  options: OptionType[];
  latest: string;
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

const useResult = (
  packageName: string,
  showDifferentVersion: boolean,
  concurrency: number
) => {
  const [selectedVersion, setSelectedVersion] = useState<OptionType>();
  const [versions, setVersions] = useObservable<VersionInfoWithOptions>();
  const [dependencies, setDependencies] = useObservable<string[]>();
  useEffect(() => {
    setVersions(
      getAllVersions$(packageName).pipe(map(data => convertData(data)))
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
        selectedVersion.value
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
  const classes = useStyles();
  const concurrency = useSelector(getConcurrencyCount);
  const {
    versions,
    dependencies,
    selectedVersion,
    setSelectedVersion,
  } = useResult(packageName, showDifferentVersion, concurrency);
  const selectOnChangedHandler = useCallback(
    (input: ValueType<OptionType>) => {
      if (input) {
        if (isArray(input)) {
          setSelectedVersion(input[0]);
        } else {
          setSelectedVersion(input);
        }
      } else {
        setSelectedVersion(undefined);
      }
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
        <Select
          className={classes.reactSelect}
          options={versionsData.options}
          value={selectedVersion}
          onChange={selectOnChangedHandler}
        />
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
