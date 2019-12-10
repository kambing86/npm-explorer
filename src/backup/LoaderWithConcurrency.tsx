import { getAllDependencies$ } from "observables/getDependencies";
import React from "react";
import ObservableLoader, { ObservableLoaderProps } from "./ObservableLoader";
import { useConcurrency } from "./useConcurrency";

export default ({
  packageName,
  showDifferentVersion,
  children,
}: {
  packageName: string;
  showDifferentVersion: boolean;
  children: ObservableLoaderProps<string[]>["children"];
}) => {
  const [concurrency] = useConcurrency();
  return (
    <ObservableLoader
      observable={getAllDependencies$(
        packageName,
        showDifferentVersion,
        concurrency,
      )}
    >
      {children}
    </ObservableLoader>
  );
};
