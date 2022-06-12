import usePromiseWithSuspense from "hooks/helpers/usePromiseWithSuspense";
import { getAllVersionsAsync } from "observables/getDependencies";
import { memo, version } from "react";

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
    <ReactVersionContent />
  </div>
);

export default memo(ReactVersion);
