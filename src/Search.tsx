import React from "react";
import { Subject } from "rxjs";
import { Button, Icon, Theme, withStyles } from "@material-ui/core";
import CreatableSelect from "react-select/lib/Creatable";
import { ValueType, InputActionMeta } from "react-select/lib/types";
import { StateManager } from "react-select/lib/stateManager";
import { isArray } from "lodash";
import { queryPackage$ } from "./utils/queryPackage";
import ConcurrencyInput from "./ConcurrencyInput";

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

export interface IOptionType {
  label: string;
  value: string;
}

interface ISearchState {
  isLoading: boolean;
  options: IOptionType[];
  inputValue: string;
  value: string | null;
}

interface ISearchProps {
  classes: { [key: string]: string };
  onClickSearch?: (value: string | null) => void;
}

class Search extends React.Component<ISearchProps, ISearchState> {
  constructor(props: ISearchProps) {
    super(props);
    this.state = {
      isLoading: false,
      options: [],
      inputValue: "",
      value: null
    };
  }
  reactSelectRef = React.createRef<StateManager<IOptionType>>();
  onQuery = (data: any) => {
    const allOptions: IOptionType[] = data.map((packageInfo: any) => ({
      label: packageInfo.name,
      value: packageInfo.name
    }));
    const { inputValue } = this.state;
    const sortedOption = [
      ...allOptions.filter(option => option.value === inputValue),
      ...allOptions.filter(option => option.value !== inputValue)
    ];
    this.setState({
      isLoading: false,
      options: sortedOption
    });
  };
  subject = new Subject<string>();
  subscription = queryPackage$(this.subject).subscribe(this.onQuery);
  inputChange = (value: string, event: InputActionMeta) => {
    if (event.action === "input-change") {
      this.setState({ isLoading: true, options: [], inputValue: value });
      this.subject.next(value);
    }
  };
  changeValue = (input: ValueType<IOptionType>) => {
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
  onInputKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.keyCode === 13) {
      const stateManager = this.reactSelectRef.current;
      if (stateManager && !stateManager.state.menuIsOpen) {
        this.onClickSearch();
        event.preventDefault();
      }
    }
  };
  componentWillUnmount = () => {
    this.subscription.unsubscribe();
  };
  render() {
    const { classes } = this.props;
    const { isLoading, options } = this.state;
    return (
      <>
        <CreatableSelect
          options={options}
          isLoading={isLoading}
          onInputChange={this.inputChange}
          onChange={this.changeValue}
          className={classes.reactSelect}
          // remove default filterOption
          filterOption={null}
          createOptionPosition="first"
          onKeyDown={this.onInputKeyDown}
          // @ts-ignore
          ref={this.reactSelectRef}
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
        <ConcurrencyInput />
      </>
    );
  }
}

export default withStyles(styles)(Search);
