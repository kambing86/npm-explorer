import usePromiseWithSuspense from "hooks/helpers/usePromiseWithSuspense";
import { getAllVersionsAsync } from "observables/getDependencies";
import { Suspense, version } from "react";
import LoadingBackdrop from "./LoadingBackdrop";

function ReactVersionContent() {
  const [reactPackages] = usePromiseWithSuspense(() =>
    getAllVersionsAsync("react"),
  );
  return (
    <>
      <div>React</div>
      <div>latest stable version: {reactPackages.data?.latest}</div>
      <div>using version: {version}</div>
    </>
  );
}

const ReactVersion = () => (
  <div className="flex-grow-1 d-flex flex-column justify-content-end align-self-end align-items-end">
    <Suspense fallback={<LoadingBackdrop loadingText="Starting server..." />}>
      <ReactVersionContent />
    </Suspense>
  </div>
);

export default ReactVersion;
