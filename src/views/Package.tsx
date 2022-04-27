import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Link from "@mui/material/Link";
import Result from "components/Result";
import { useUpdateTitle } from "hooks/useUpdateTitle";
import { memo, useCallback, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

const Package = () => {
  const params = useParams<"packageName">();
  const { packageName = "" } = params;
  const [diffVersion, setDiffVersion] = useState(true);
  const decodedPackageName = decodeURIComponent(packageName);
  const onChangeHandler = useCallback(() => {
    setDiffVersion((prevState) => !prevState);
  }, []);

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
      <Link component={RouterLink} to="/">
        Dependency Explorer
      </Link>
      <h1>PACKAGE OVERVIEW</h1>
      <h2>{decodedPackageName}</h2>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={diffVersion}
              onChange={onChangeHandler}
              value="showDifferentVersion"
              color="primary"
            />
          }
          label="Show Different Version"
        />
      </FormGroup>
      <Result
        packageName={decodedPackageName}
        showDifferentVersion={diffVersion}
      />
    </Box>
  );
};

export default memo(Package);
