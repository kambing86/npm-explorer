import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Link,
} from "@mui/material";
import Result from "components/Result";
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useParams } from "react-router-dom";
import { titleActions } from "store/slices/title.slice";

const Package = () => {
  const params = useParams<"packageName">();
  const { packageName = "" } = params;
  const [diffVersion, setDiffVersion] = useState(true);
  const decodedPackageName = decodeURIComponent(packageName);
  const onChangeHandler = useCallback(() => {
    setDiffVersion((prevState) => !prevState);
  }, []);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(titleActions.setTitle(decodedPackageName));
  }, [dispatch, decodedPackageName]);

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
