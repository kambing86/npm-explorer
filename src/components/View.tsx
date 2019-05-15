import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Checkbox, FormGroup, FormControlLabel } from "@material-ui/core";
import Result from "./Result";

interface IProps {
  packageName: string;
}

const View: React.FC<IProps> = ({ packageName }) => {
  const [diffVersion, setDiffVersion] = useState(true);
  const decodedPackageName = decodeURIComponent(packageName);
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
              onChange={() => setDiffVersion(!diffVersion)}
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
