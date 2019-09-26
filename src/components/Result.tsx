import { CircularProgress } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AutoSizer, List, ListRowProps } from "react-virtualized";
import { useObservable } from "../hooks";
import {
  getAllDependencies$,
  getAllVersions$,
  PackageVersionInfo,
} from "../observables/getDependencies";
import { getConcurrencyCount } from "../store/selectors/concurrency";

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
  const [versions, setVersions] = useObservable<
    PackageVersionInfo | undefined
  >();
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
  const rowRenderer = useCallback(
    ({ index, key, style }: ListRowProps) => {
      if (dependenciesData === undefined) {
        return null;
      }
      const dependency = dependenciesData[index];
      return (
        <div className="text-center" key={key} style={style}>
          {dependency}
        </div>
      );
    },
    [dependenciesData]
  );
  const selectOnChangedHandler = useCallback(
    (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      setSelectedVersion(event.target.value as string);
    },
    [setSelectedVersion]
  );
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
          <div className="flex-grow-1 flex-shrink-1 align-self-stretch">
            <AutoSizer>
              {({ height, width }) => (
                <List
                  width={width}
                  height={height}
                  rowCount={dependenciesData.length}
                  rowHeight={30}
                  rowRenderer={rowRenderer}
                />
              )}
            </AutoSizer>
          </div>
        </>
      )}
      {dependenciesCompleted && !dependenciesData && <div>No dependencies</div>}
    </>
  );
};

export default Result;
