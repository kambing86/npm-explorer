import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Result from "components/Result";
import { memo, useCallback, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { themeSlice } from "store/slices/theme";

const Package = () => {
  const params = useParams<"packageName">();
  const { packageName = "" } = params;
  const [diffVersion, setDiffVersion] = useState(true);
  const decodedPackageName = decodeURIComponent(packageName);
  const onChangeHandler = useCallback(() => {
    setDiffVersion((prevState) => !prevState);
  }, []);

  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(themeSlice.actions.setTitle(decodedPackageName));
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
      <Link to="/">Dependency Explorer</Link>
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
