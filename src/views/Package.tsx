import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Icon from "@mui/material/Icon";
import Result from "components/Result";
import { useUpdateTitle } from "hooks/useUpdateTitle";
import { memo, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Package = () => {
  const navigate = useNavigate();
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
      <Button
        variant="outlined"
        startIcon={<Icon>home</Icon>}
        onClick={() => navigate("/")}
      >
        Dependency Explorer
      </Button>
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
