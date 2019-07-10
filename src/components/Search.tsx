import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, Theme, makeStyles } from "@material-ui/core";
import CreatableSelect from "react-select/creatable";
import { ValueType, InputActionMeta } from "react-select/src/types";
import { getQueryObservable$ } from "../observables/queryPackage";
import ConcurrencyInput from "./ConcurrencyInput";
import { useObservable } from "../hooks";
import { isArray } from "../utils/typescriptHelpers";
import { getSearchHistory } from "../state/selectors/search";
import { SET_SEARCH_HISTORY } from "../state/actions";

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  icon: {
    marginLeft: theme.spacing(1),
  },
  reactSelect: {
    width: "100%",
  },
}));

export interface IOptionType {
  label: string;
  value: string;
}

interface ISearchState {
  isLoading: boolean;
  isMenuOpen: boolean;
  options: IOptionType[];
  inputValue: string;
}

interface ISearchProps {
  onClickSearch?: (value: string) => void;
}

function getInitialState(): ISearchState {
  return {
    isLoading: false,
    isMenuOpen: false,
    options: [],
    inputValue: "",
  };
}

const useQuery = () => {
  const [state, setState] = useState<ISearchState>(getInitialState);
  const searchHistory = useSelector(getSearchHistory);
  const [observerState, setObservable] = useObservable<any>();

  // componentDidMount effect
  useEffect(() => {
    if (searchHistory !== "") {
      setState(prevState => ({
        ...prevState,
        isLoading: true,
        isMenuOpen: true,
        options: [],
        inputValue: searchHistory,
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // check for input value and do query
  useEffect(() => {
    setObservable(getQueryObservable$(state.inputValue));
  }, [setObservable, state.inputValue]);
  useEffect(() => {
    const { data, error, completed } = observerState;
    if (data && !error && completed) {
      setState(state => {
        const allOptions: IOptionType[] = data.map((packageInfo: any) => ({
          label: packageInfo.name,
          value: packageInfo.name,
        }));
        const { inputValue } = state;
        const sortedOption = [
          ...allOptions.filter(option => option.value === inputValue),
          ...allOptions.filter(option => option.value !== inputValue),
        ];
        return {
          ...state,
          isLoading: false,
          options: sortedOption,
        };
      });
    }
  }, [observerState, setState]);

  // callbacks for Search component
  const setQuery = useCallback((value: string) => {
    setState(prevState => ({
      ...prevState,
      isLoading: true,
      options: [],
      inputValue: value,
    }));
  }, []);
  const setMenuOpen = useCallback((value: boolean) => {
    setState(prevState => ({
      ...prevState,
      isMenuOpen: value,
    }));
  }, []);

  return { state, setQuery, setMenuOpen, searchHistory };
};

const Search: React.FC<ISearchProps> = ({ onClickSearch }) => {
  const classes = useStyles();
  const { state, setQuery, setMenuOpen, searchHistory } = useQuery();
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const onInputChangeHandler = useCallback(
    (value: string, event: InputActionMeta) => {
      if (event.action === "input-change") {
        setQuery(value);
      }
    },
    [setQuery]
  );
  const onChangeHandler = useCallback((input: ValueType<IOptionType>) => {
    if (input) {
      if (isArray(input)) {
        setValue(input[0].value);
      } else {
        setValue(input.value);
      }
    } else {
      setValue("");
    }
  }, []);
  const onSearchHandler = useCallback(() => {
    dispatch(SET_SEARCH_HISTORY(value));
    if (onClickSearch) {
      onClickSearch(value);
    }
  }, [dispatch, onClickSearch, value]);
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
    setMenuOpen(true);
  }, [setMenuOpen]);
  const onMenuCloseHandler = useCallback(() => {
    setMenuOpen(false);
  }, [setMenuOpen]);
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
        defaultInputValue={searchHistory}
        defaultMenuIsOpen={searchHistory !== ""}
        autoFocus={searchHistory !== ""}
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

export default Search;
