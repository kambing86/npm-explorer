import React, { useState, useRef, useEffect } from "react";
import { Button, Icon, Theme, withStyles } from "@material-ui/core";
import CreatableSelect from "react-select/lib/Creatable";
import { ValueType, InputActionMeta } from "react-select/lib/types";
import { StateManager } from "react-select/lib/stateManager";
import { getQueryObservable$ } from "../observables/queryPackage";
import ConcurrencyInput from "./ConcurrencyInput";
import { useObservable } from "../hooks";
import { isArray } from "../utils/typescriptHelpers";

const styles = (theme: Theme) => ({
  button: {
    padding: theme.spacing(1),
    margin: theme.spacing(1)
  },
  icon: {
    marginLeft: theme.spacing(1)
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

function getInitialState(): ISearchState {
  return {
    isLoading: false,
    options: [],
    inputValue: "",
    value: null
  };
}

const useQuery = () => {
  const searchState = useState<ISearchState>(getInitialState);
  const [state, setState] = searchState;
  const [observerState, setObservable] = useObservable<any>();
  useEffect(() => {
    setObservable(getQueryObservable$(state.inputValue));
  }, [setObservable, state.inputValue]);
  useEffect(() => {
    const { data, error, completed } = observerState;
    if (data && !error && completed) {
      setState(state => {
        const allOptions: IOptionType[] = data.map((packageInfo: any) => ({
          label: packageInfo.name,
          value: packageInfo.name
        }));
        const { inputValue } = state;
        const sortedOption = [
          ...allOptions.filter(option => option.value === inputValue),
          ...allOptions.filter(option => option.value !== inputValue)
        ];
        return {
          ...state,
          isLoading: false,
          options: sortedOption
        };
      });
    }
  }, [observerState, setState]);
  return searchState;
};

const Search: React.FC<ISearchProps> = ({ classes, onClickSearch }) => {
  const [state, setState] = useQuery();
  const reactSelectRef = useRef<StateManager<IOptionType>>(null);

  const onInputChangeHandler = (value: string, event: InputActionMeta) => {
    if (event.action === "input-change") {
      setState({ ...state, isLoading: true, options: [], inputValue: value });
    }
  };
  const onChangeHandler = (input: ValueType<IOptionType>) => {
    if (input) {
      if (isArray(input)) {
        setState({ ...state, value: input[0].value });
      } else {
        setState({ ...state, value: input.value });
      }
    } else {
      setState({ ...state, value: null });
    }
  };
  const onSearchHandler = () => {
    if (onClickSearch) {
      onClickSearch(state.value);
    }
  };
  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.keyCode === 13) {
      const stateManager = reactSelectRef.current;
      if (stateManager && !stateManager.state.menuIsOpen) {
        onSearchHandler();
        event.preventDefault();
      }
    }
  };
  return (
    <>
      <CreatableSelect
        options={state.options}
        isLoading={state.isLoading}
        onInputChange={onInputChangeHandler}
        onChange={onChangeHandler}
        className={classes.reactSelect}
        // remove default filterOption
        filterOption={null}
        createOptionPosition="first"
        onKeyDown={onKeyDownHandler}
        // @ts-ignore
        ref={reactSelectRef}
      />
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={onSearchHandler}
      >
        Search
        <Icon className={classes.icon}>search</Icon>
      </Button>
      <ConcurrencyInput />
    </>
  );
};

export default withStyles(styles)(Search);
