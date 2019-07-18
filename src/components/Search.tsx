import { makeStyles, Button, Icon, Theme } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreatableSelect from "react-select/creatable";
import { InputActionMeta, ValueType } from "react-select/src/types";
import { useObservable } from "../hooks";
import { getQueryObservable$, QueryResult } from "../observables/queryPackage";
import { SET_SEARCH_HISTORY } from "../state/actions";
import { getSearchHistory } from "../state/selectors/search";
import { isArray } from "../utils/typescriptHelpers";
import ConcurrencyInput from "./ConcurrencyInput";

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

interface OptionType {
  label: string;
  value: string;
}

interface SearchState {
  readonly isLoading: boolean;
  readonly isMenuOpen: boolean;
  readonly options: OptionType[];
  readonly searchString: string;
}

interface SearchProps {
  onClickSearch?: (value: string) => void;
}

function getInitialState(): SearchState {
  return {
    isLoading: false,
    isMenuOpen: false,
    options: [],
    searchString: "",
  };
}

const useSearch = () => {
  const [state, setState] = useState<SearchState>(getInitialState);
  const searchHistory = useSelector(getSearchHistory);
  const [observerState, setObservable] = useObservable<QueryResult>();

  // componentDidMount effect
  useEffect(() => {
    if (searchHistory !== "") {
      setState(prevState => ({
        ...prevState,
        isLoading: true,
        isMenuOpen: true,
        options: [],
        searchString: searchHistory,
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // check for searchString and do query
  useEffect(() => {
    setObservable(getQueryObservable$(state.searchString));
  }, [setObservable, state.searchString]);
  useEffect(() => {
    const { data, error, completed } = observerState;
    if (data && !error && completed) {
      setState(state => {
        const allOptions: OptionType[] = data.map(packageInfo => ({
          label: packageInfo.name,
          value: packageInfo.name,
        }));
        const { searchString } = state;
        const sortedOption = [
          ...allOptions.filter(option => option.value === searchString),
          ...allOptions.filter(option => option.value !== searchString),
        ];
        return {
          ...state,
          isLoading: false,
          options: sortedOption,
        };
      });
    }
  }, [observerState]);

  // callbacks for Search component
  const setSearchString = useCallback((value: string) => {
    setState(prevState => ({
      ...prevState,
      isLoading: true,
      options: [],
      searchString: value,
    }));
  }, []);
  const setMenuOpen = useCallback((value: boolean) => {
    setState(prevState => ({
      ...prevState,
      isMenuOpen: value,
    }));
  }, []);

  return { state, setSearchString, setMenuOpen, searchHistory };
};

const Search: React.FC<SearchProps> = ({ onClickSearch }) => {
  const classes = useStyles();
  const { state, setSearchString, setMenuOpen, searchHistory } = useSearch();
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const onInputChangeHandler = useCallback(
    (value: string, event: InputActionMeta) => {
      if (event.action === "input-change") {
        setSearchString(value);
      }
    },
    [setSearchString]
  );
  const onChangeHandler = useCallback((input: ValueType<OptionType>) => {
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
