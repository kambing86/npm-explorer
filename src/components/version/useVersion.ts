import useObservable from "hooks/helpers/useObservable";
import { getAllVersions$ } from "observables/getDependencies";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { map } from "rxjs/operators";
import { searchActions } from "store/slices/search.slice";

function convertData(data: PackageVersionInfo): VersionInfoWithOptions {
  return {
    latest: data.latest,
    options: data.versions.map((value) => ({
      label: value,
      value,
    })),
  };
}

export default function useVersion(packageName: string) {
  const dispatch = useDispatch();
  const [selectedVersion, setSelectedVersion] = useState<OptionType>();
  const [versions, setVersions] = useObservable<VersionInfoWithOptions>();

  useEffect(() => {
    setVersions(
      getAllVersions$(packageName).pipe(map((data) => convertData(data))),
    );
  }, [packageName, setVersions]);

  useEffect(() => {
    if (versions.completed && versions.data) {
      const latestVersion = versions.data.latest;
      const latestOption = versions.data.options.find(
        (option) => option.value === latestVersion,
      );
      setSelectedVersion(latestOption);
    }
  }, [versions]);

  const selectedIndex = useMemo(() => {
    const options = versions.data?.options;
    return options == null || selectedVersion == null
      ? -1
      : options.indexOf(selectedVersion);
  }, [versions.data, selectedVersion]);

  useEffect(() => {
    if (selectedVersion != null)
      dispatch(searchActions.setVersion(selectedVersion.value));
  }, [dispatch, selectedVersion]);

  useEffect(() => {
    return () => {
      dispatch(searchActions.setVersion(null));
    };
  }, [dispatch]);

  return {
    versions,
    selectedVersion,
    setSelectedVersion,
    selectedIndex,
  };
}
