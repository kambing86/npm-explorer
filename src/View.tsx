import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  CircularProgress
} from "@material-ui/core";
import LoaderWithConcurrency from "./LoaderWithConcurrency";

interface IViewProps {
  packageName: string;
}

interface IViewState {
  showDifferentVersion: boolean;
}

class View extends Component<IViewProps, IViewState> {
  constructor(props: IViewProps) {
    super(props);
    this.state = {
      showDifferentVersion: true
    };
  }
  changeDifferentVersion = () => {
    this.setState({
      showDifferentVersion: !this.state.showDifferentVersion
    });
  };
  render() {
    const { packageName } = this.props;
    const { showDifferentVersion } = this.state;
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
                checked={showDifferentVersion}
                onChange={this.changeDifferentVersion}
                value="showDifferentVersion"
                color="primary"
              />
            }
            label="Show Different Version"
          />
        </FormGroup>
        <LoaderWithConcurrency
          packageName={decodedPackageName}
          showDifferentVersion={showDifferentVersion}
        >
          {({ data, error, completed }) => {
            if (error) {
              console.error(error);
              return <div>Error: {error.message}</div>;
            }
            if (data) {
              return (
                <>
                  {!completed && <CircularProgress />}
                  <div>
                    Found {data.length} dependencies for {decodedPackageName}
                  </div>
                  <ul>
                    {data.sort().map(dependency => (
                      <li key={dependency}>{dependency}</li>
                    ))}
                  </ul>
                </>
              );
            }
          }}
        </LoaderWithConcurrency>
      </>
    );
  }
}

export default View;
