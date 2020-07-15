import CircularProgress from "@material-ui/core/CircularProgress";
import useResult from "hooks/useResult";
import React from "react";
import DependenciesList from "./DependenciesList";
import VersionSelect from "./VersionSelect";

interface Props {
  packageName: string;
  showDifferentVersion: boolean;
}

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
