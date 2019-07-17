import React from "react";
import { getAllDependencies$ } from "../observables/getDependencies";
import { useConcurrency } from "./useConcurrency";
import ObservableLoader, { ObservableLoaderProps } from "./ObservableLoader";

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
        concurrency
      )}
    >
      {children}
    </ObservableLoader>
  );
};
