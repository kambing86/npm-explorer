import { Link, Typography } from "@mui/material";
import React, { ComponentProps } from "react";

const Copyright = (props: ComponentProps<typeof Typography>) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/kambing86">
        kambing86
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default React.memo(Copyright);
