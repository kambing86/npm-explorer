import Box from "@mui/material/Box";
import Dependency from "components/dependency";
import Version from "components/version";
import { useUpdateTitle } from "hooks/useUpdateTitle";
import { memo } from "react";
import { useParams } from "react-router-dom";

const Package = () => {
  const params = useParams<"packageName">();
  const { packageName = "" } = params;
  const decodedPackageName = decodeURIComponent(packageName);
  useUpdateTitle(decodedPackageName);
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexFlow: "column",
        alignItems: "center",
      }}
    >
      <h2>{decodedPackageName}</h2>
      <Version packageName={packageName} />
      <Dependency packageName={packageName} />
    </Box>
  );
};

export default memo(Package);
