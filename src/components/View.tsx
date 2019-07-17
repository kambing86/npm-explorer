import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import Result from "./Result";

interface Props {
  packageName: string;
}

const View: React.FC<Props> = ({ packageName }) => {
  const [diffVersion, setDiffVersion] = useState(true);
  const decodedPackageName = decodeURIComponent(packageName);
  const onChangeHandler = useCallback(() => {
    setDiffVersion(prevState => !prevState);
  }, [setDiffVersion]);
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

export default View;
