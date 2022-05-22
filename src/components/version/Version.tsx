import { memo } from "react";
import VersionSelect from "./VersionSelect";
import useVersion from "./useVersion";

interface Props {
  packageName: string;
}

const Version = ({ packageName }: Props) => {
  const { versions, selectedVersion, setSelectedVersion, selectedIndex } =
    useVersion(packageName);
  const { data, error, completed } = versions;
  if (error) {
    console.error(error); // eslint-disable-line no-console
    return <div>Error: {error.message}</div>;
  }
  if (selectedVersion == null) return null;
  return (
    <VersionSelect
      {...{
        versionsCompleted: completed,
        versionsData: data,
        selectedVersion,
        setSelectedVersion,
        selectedIndex,
      }}
    />
  );
};

export default memo(Version);
