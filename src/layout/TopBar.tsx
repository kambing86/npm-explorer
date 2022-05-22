import Typography from "@mui/material/Typography";
import { memo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";

const TopBar = () => {
  const title = useSelector((state: RootState) => state.title);
  return (
    <Typography
      component="h1"
      variant="h6"
      color="inherit"
      noWrap
      sx={{ flexGrow: 1 }}
    >
      {title}
    </Typography>
  );
};

export default memo(TopBar);
