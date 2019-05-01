import React from "react";
import AsyncCreatable from "react-select/lib/AsyncCreatable";
import queryPackage from "./utils/queryPackage";
import { Button, Icon, Theme, withStyles } from "@material-ui/core";
import { ValueType } from "react-select/lib/types";
import { isArray } from "lodash";

const styles = (theme: Theme) => ({
  button: {
    padding: theme.spacing.unit,
    margin: theme.spacing.unit
  },
  icon: {
    marginLeft: theme.spacing.unit
  },
  reactSelect: {
    width: "100%"
  }
});

export type OptionType = { label: string; value: string };

type SearchProps = {
  classes: any;
  onClickSearch?: (value: string | null) => void;
};

class Search extends React.Component<SearchProps, { value: string | null }> {
  constructor(props: SearchProps) {
    super(props);
    this.state = {
      value: null
    };
  }
  changeValue = (input: ValueType<OptionType>) => {
    if (input) {
      if (isArray(input)) {
        this.setState({ value: input[0].value });
      } else {
        this.setState({ value: input.value });
      }
    } else {
      this.setState({ value: null });
    }
  };
  onClickSearch = () => {
    const { onClickSearch } = this.props;
    if (onClickSearch) {
      onClickSearch(this.state.value);
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <>
        <AsyncCreatable
          cacheOptions
          defaultOptions
          loadOptions={queryPackage}
          onChange={this.changeValue}
          className={classes.reactSelect}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.onClickSearch}
        >
          Search
          <Icon className={classes.icon}>search</Icon>
        </Button>
      </>
    );
  }
}

export default withStyles(styles)(Search);
