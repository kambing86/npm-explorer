import { usePromiseWithSuspense } from "hooks";
import { getAllVersionsAsync } from "observables/getDependencies";
import React, { Suspense } from "react";

function ReactVersion() {
  const [data] = usePromiseWithSuspense(() => getAllVersionsAsync("react"));
  return (
    <>
      <div>React</div>
      <div>latest version: {data.data?.latest}</div>
    </>
  );
}

const wrapper = () => (
  <div className="flex-grow-1 d-flex flex-column justify-content-end align-self-end align-items-end">
    <Suspense fallback={<>Loading</>}>
      <ReactVersion />
    </Suspense>
  </div>
);

export default wrapper;
