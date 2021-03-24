import usePromiseWithSuspense from "hooks/helpers/usePromiseWithSuspense";
import { getAllVersionsAsync } from "observables/getDependencies";
import { Suspense } from "react";

function ReactVersionContent() {
  const [reactPackages] = usePromiseWithSuspense(() =>
    getAllVersionsAsync("react"),
  );
  return (
    <>
      <div>React</div>
      <div>latest version: {reactPackages.data?.latest}</div>
    </>
  );
}

const ReactVersion = () => (
  <div className="flex-grow-1 d-flex flex-column justify-content-end align-self-end align-items-end">
    <Suspense fallback={<>Loading...</>}>
      <ReactVersionContent />
    </Suspense>
  </div>
);

export default ReactVersion;
