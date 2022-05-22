import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { memo } from "react";

interface Props {
  loadingText?: string;
}

const LoadingBackdrop = ({ loadingText = "Loading..." }: Props) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (t) => t.zIndex.drawer + 1,
        flexDirection: "column",
      }}
      open={true}
    >
      <Typography>{loadingText}</Typography>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default memo(LoadingBackdrop);
