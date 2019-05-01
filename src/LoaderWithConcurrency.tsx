import React from "react";
import { DataLoader, IDataLoaderProps } from "./DataLoader";
import { getAllDependencies$ } from "./Observable/getDependencies";
import { useConcurrency } from "./UseConcurrency";

export default ({
  packageName,
  showDifferentVersion,
  children
}: {
  packageName: string;
  showDifferentVersion: boolean;
  children: IDataLoaderProps<string[]>["children"];
}) => {
  const [state] = useConcurrency();
  return (
    <DataLoader
      createPromise={() => {
        return getAllDependencies$(
          packageName,
          showDifferentVersion,
          state.concurrency
        ).toPromise();
      }}
      // generate unique cacheKey so that DataLoader will refresh
      // if packageName or showDifferentVersion change
      cacheKey={packageName + showDifferentVersion.toString()}
    >
      {children}
    </DataLoader>
  );
};
