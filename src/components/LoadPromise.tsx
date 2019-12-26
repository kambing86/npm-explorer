import { usePromiseWithSuspense } from "hooks";
import { getAllVersionsAsync } from "observables/getDependencies";
import React, { Suspense } from "react";

function LoadPromise() {
  const [data] = usePromiseWithSuspense(() => getAllVersionsAsync("react"));
  return (
    <>
      <div>React</div>
      <div>latest version: {data.data?.latest}</div>
    </>
  );
}

export default () => (
  <div className="flex-grow-1 d-flex flex-column justify-content-end align-self-end align-items-end">
    <Suspense fallback={<>Loading</>}>
      <LoadPromise />
    </Suspense>
  </div>
);
