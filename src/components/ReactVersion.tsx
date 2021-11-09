import { Backdrop, CircularProgress, Typography } from "@mui/material";
import usePromiseWithSuspense from "hooks/helpers/usePromiseWithSuspense";
import { getAllVersionsAsync } from "observables/getDependencies";
import { Suspense, version } from "react";

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
    <Suspense
      fallback={
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            flexDirection: "column",
          }}
          open={true}
        >
          <Typography>Starting server...</Typography>
          <CircularProgress color="inherit" />
        </Backdrop>
      }
    >
      <ReactVersionContent />
    </Suspense>
  </div>
);

export default ReactVersion;
