import React, { useState, useEffect, useCallback } from "react";
import { Button, Icon, Theme, withStyles } from "@material-ui/core";
// @ts-ignore pending update from @types/react-select
import CreatableSelect from "react-select/creatable";
import { ValueType, InputActionMeta } from "react-select/lib/types";
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
  isMenuOpen: boolean;
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
    isMenuOpen: false,
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

  const onInputChangeHandler = useCallback(
    (value: string, event: InputActionMeta) => {
      if (event.action === "input-change") {
        setState(prevState => ({
          ...prevState,
          isLoading: true,
          options: [],
          inputValue: value
        }));
      }
    },
    [setState]
  );
  const onChangeHandler = useCallback(
    (input: ValueType<IOptionType>) => {
      if (input) {
        if (isArray(input)) {
          setState(prevState => ({ ...prevState, value: input[0].value }));
        } else {
          setState(prevState => ({ ...prevState, value: input.value }));
        }
      } else {
        setState(prevState => ({ ...prevState, value: null }));
      }
    },
    [setState]
  );
  const onSearchHandler = useCallback(() => {
    if (onClickSearch) {
      onClickSearch(state.value);
    }
  }, [onClickSearch, state.value]);
  const onKeyDownHandler = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.keyCode === 13) {
        if (!state.isMenuOpen) {
          onSearchHandler();
          event.preventDefault();
        }
      }
    },
    [state.isMenuOpen, onSearchHandler]
  );
  const onMenuOpenHandler = useCallback(() => {
    setState(prevState => ({ ...prevState, isMenuOpen: true }));
  }, [setState]);
  const onMenuCloseHandler = useCallback(() => {
    setState(prevState => ({ ...prevState, isMenuOpen: false }));
  }, [setState]);
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
        onMenuOpen={onMenuOpenHandler}
        onMenuClose={onMenuCloseHandler}
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
