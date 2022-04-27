import CircularProgress from "@mui/material/CircularProgress";
import useResult from "hooks/useResult";
import { memo, useMemo } from "react";
import DependenciesList from "./DependenciesList";
import VersionSelect from "./VersionSelect";

interface Props {
  packageName: string;
  showDifferentVersion: boolean;
}

const Result = ({ packageName, showDifferentVersion }: Props) => {
  const {
    versions,
    dependencies,
    selectedVersion,
    setSelectedVersion,
    selectedIndex,
  } = useResult(packageName, showDifferentVersion);
  const decodedPackageName = useMemo(
    () => decodeURIComponent(packageName),
    [packageName],
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
  return (
    <>
      <VersionSelect
        {...{
          versionsCompleted,
          versionsData,
          selectedVersion,
          setSelectedVersion,
          selectedIndex,
        }}
      />
      {!dependenciesCompleted && <CircularProgress className="my-2" />}
      {dependenciesData && (
        <>
          <div>
            Found {dependenciesData.length} dependencies for{" "}
            {`${decodedPackageName}@${selectedVersion?.label ?? ""}`}
          </div>
          <DependenciesList data={dependenciesData} />
        </>
      )}
      {dependenciesCompleted && !dependenciesData && <div>No dependencies</div>}
    </>
  );
};

export default memo(Result);
