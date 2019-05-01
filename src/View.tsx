import React, { Component } from "react";
import { Link } from "react-router-dom";
import { DataLoader } from "./DataLoader";
import { getAllDependencies$ } from "./Observable/getDependencies";
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  CircularProgress
} from "@material-ui/core";

type ViewProps = { packageName: string };

class View extends Component<ViewProps, { showDifferentVersion: boolean }> {
  constructor(props: ViewProps) {
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
    return (
      <>
        <Link to="/">Dependency Explorer</Link>
        <h1>PACKAGE OVERVIEW</h1>
        <h2>{packageName}</h2>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.showDifferentVersion}
                onChange={this.changeDifferentVersion}
                value="showDifferentVersion"
                color="primary"
              />
            }
            label="Show Different Version"
          />
        </FormGroup>
        <DataLoader
          createPromise={() => {
            return getAllDependencies$(
              packageName,
              showDifferentVersion
            ).toPromise();
          }}
          // generate unique cacheKey so that DataLoader will refresh
          // if packageName or showDifferentVersion change
          cacheKey={packageName + showDifferentVersion.toString()}
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
                  <div>Total packages: {data.length}</div>
                  <ul>
                    {data.sort().map(dependency => (
                      <li key={dependency}>{dependency}</li>
                    ))}
                  </ul>
                </>
              );
            }
          }}
        </DataLoader>
      </>
    );
  }
}

export default View;
