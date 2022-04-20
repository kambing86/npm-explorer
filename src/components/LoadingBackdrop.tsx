import { Backdrop, CircularProgress, Typography } from "@mui/material";
import React from "react";

const LoadingBackdrop = () => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (t) => t.zIndex.drawer + 1,
        flexDirection: "column",
      }}
      open={true}
    >
      <Typography>Loading...</Typography>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default React.memo(LoadingBackdrop);
