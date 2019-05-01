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
          {({ loading, error, data }) => {
            if (loading) {
              return <CircularProgress />;
            }
            if (error) {
              console.error(error);
              return <div>Got error</div>;
            }
            if (data) {
              return (
                <>
                  <div>
                    Found {data.length} dependencies for {packageName}
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
