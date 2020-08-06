import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import React, { useCallback, useState } from "react";
import { Link, RouteChildrenProps } from "react-router-dom";
import Result from "./Result";

const View = (
  props: RouteChildrenProps<{
    packageName: string;
  }>,
): JSX.Element => {
  const packageName = props.match?.params.packageName ?? "";
  const [diffVersion, setDiffVersion] = useState(true);
  const decodedPackageName = decodeURIComponent(packageName);
  const onChangeHandler = useCallback(() => {
    setDiffVersion((prevState) => !prevState);
  }, []);
  return (
    <>
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
    </>
  );
};

export default React.memo(View);
