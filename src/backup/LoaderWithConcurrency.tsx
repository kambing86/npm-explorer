import React from "react";
import ObservableLoader, { IObservableLoaderProps } from "./ObservableLoader";
import { getAllDependencies$ } from "../observables/getDependencies";
import { useConcurrency } from "./useConcurrency";

export default ({
  packageName,
  showDifferentVersion,
  children
}: {
  packageName: string;
  showDifferentVersion: boolean;
  children: IObservableLoaderProps<string[]>["children"];
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
