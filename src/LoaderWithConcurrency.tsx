import React from "react";
import ObservableLoader, { IObservableLoaderProps } from "./ObservableLoader";
import { getAllDependencies$ } from "./Observable/getDependencies";
import { useConcurrency } from "./UseConcurrency";

export default ({
  packageName,
  showDifferentVersion,
  children
}: {
  packageName: string;
  showDifferentVersion: boolean;
  children: IObservableLoaderProps<string[]>["children"];
}) => {
  const [state] = useConcurrency();
  return (
    <ObservableLoader
      observable={getAllDependencies$(
        packageName,
        showDifferentVersion,
        state.concurrency
      )}
    >
      {children}
    </ObservableLoader>
  );
};
