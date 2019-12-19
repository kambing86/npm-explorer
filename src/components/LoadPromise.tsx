import { usePromiseWithSuspense } from "hooks";
import { getAllVersionsAsync } from "observables/getDependencies";
import React, { Suspense } from "react";

function LoadPromise() {
  const [data] = usePromiseWithSuspense(() => getAllVersionsAsync("react"));
  return (
    <div className="flex-grow-1 d-flex flex-column justify-content-end align-self-end align-items-end">
      <div>React</div>
      <div>latest version: {data.data?.latest}</div>
    </div>
  );
}

export default () => (
  <Suspense fallback={<div>Loading</div>}>
    <LoadPromise />
  </Suspense>
);
