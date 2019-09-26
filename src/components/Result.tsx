import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React, { useCallback, useEffect, useState, PureComponent } from "react";
import { useSelector } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
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

class RowRenderer extends PureComponent<ListChildComponentProps> {
  render() {
    const { data, index, style } = this.props;
    const dependency = (data as string[])[index];
    return (
      <div className="text-center" style={style}>
        {dependency}
      </div>
    );
  }
}

function itemKey(index: number, data: string[]) {
  return data[index];
}

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
          <div className="flex-grow-1 flex-shrink-1 align-self-stretch">
            <AutoSizer>
              {({ height, width }) => (
                <List
                  width={width}
                  height={height}
                  itemCount={dependenciesData.length}
                  itemSize={30}
                  itemData={dependenciesData}
                  itemKey={itemKey}
                >
                  {RowRenderer}
                </List>
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
