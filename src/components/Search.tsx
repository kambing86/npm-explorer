import { makeStyles } from "@material-ui/core/styles";
import { useObservable, useStateWithRef } from "hooks";
import { QueryResult, getQueryObservable$ } from "observables/queryPackage";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputActionMeta, ValueType } from "react-select";
import CreatableSelect from "react-select/creatable";
import { SET_SEARCH_HISTORY } from "store/actions";
import { getSearchHistory } from "store/selectors/search";
import { isArray } from "utils/typescriptHelpers";
import ButtonWithIcon from "./ButtonWithIcon";
import ConcurrencyInput from "./ConcurrencyInput";
import LoadPromise from "./LoadPromise";

const useStyles = makeStyles(theme => ({
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

interface SearchState {
  readonly isLoading: boolean;
  readonly options: OptionType[];
  readonly searchString: string;
}

interface SearchProps {
  onClickSearch?: (value: string) => void;
}

function getInitialState(): SearchState {
  return {
    isLoading: false,
    options: [],
    searchString: "",
  };
}

const useSearch = () => {
  const [searchState, setSearchState] = useState(getInitialState);
  const [isMenuOpen, setIsMenuOpen] = useStateWithRef(false);
  const searchHistory = useSelector(getSearchHistory);
  const [observerState, setObservable] = useObservable<QueryResult>();

  // componentDidMount effect
  useEffect(() => {
    if (searchHistory !== "") {
      setSearchState(prevState => ({
        ...prevState,
        isLoading: true,
        options: [],
        searchString: searchHistory,
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // check for searchString and do query
  useEffect(() => {
    setObservable(getQueryObservable$(searchState.searchString));
  }, [setObservable, searchState.searchString]);
  useEffect(() => {
    const { data, completed } = observerState;
    if (completed) {
      if (data) {
        setSearchState(prevState => {
          const allOptions: OptionType[] = data.map(packageInfo => ({
            label: packageInfo.name,
            value: packageInfo.name,
          }));
          const { searchString } = prevState;
          const sortedOption = [
            ...allOptions.filter(option => option.value === searchString),
            ...allOptions.filter(option => option.value !== searchString),
          ];
          return {
            ...prevState,
            isLoading: false,
            options: sortedOption,
          };
        });
      } else {
        setSearchState(prevState => ({
          ...prevState,
          isLoading: false,
          options: [],
        }));
      }
    }
  }, [observerState]);

  // callbacks for Search component
  const setSearchString = useCallback((value: string) => {
    setSearchState(prevState => ({
      ...prevState,
      isLoading: true,
      options: [],
      searchString: value,
    }));
  }, []);

  return {
    searchState,
    setSearchString,
    isMenuOpen,
    setIsMenuOpen,
    searchHistory,
  };
};

const Search: React.FC<SearchProps> = ({ onClickSearch }) => {
  const classes = useStyles();
  const {
    searchState,
    setSearchString,
    isMenuOpen,
    setIsMenuOpen,
    searchHistory,
  } = useSearch();
  const [value, setValue] = useStateWithRef("");
  const dispatch = useDispatch();

  const onInputChangeHandler = useCallback(
    (inputValue: string, event: InputActionMeta) => {
      if (event.action === "input-change") {
        setSearchString(inputValue);
      }
    },
    [setSearchString],
  );
  const onChangeHandler = useCallback(
    (input: ValueType<OptionType>) => {
      if (input) {
        if (isArray(input)) {
          setValue(input[0].value);
        } else {
          setValue(input.value);
        }
      } else {
        setValue("");
      }
    },
    [setValue],
  );
  const onSearchHandler = useCallback(() => {
    dispatch(SET_SEARCH_HISTORY(value.current));
    if (onClickSearch) {
      onClickSearch(value.current);
    }
  }, [dispatch, onClickSearch, value]);
  const onKeyDownHandler = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.keyCode === 13 && !isMenuOpen.current) {
        onSearchHandler();
        event.preventDefault();
      }
    },
    [isMenuOpen, onSearchHandler],
  );
  const onMenuOpenHandler = useCallback(() => {
    setIsMenuOpen(true);
  }, [setIsMenuOpen]);
  const onMenuCloseHandler = useCallback(() => {
    setIsMenuOpen(false);
  }, [setIsMenuOpen]);
  return (
    <>
      <CreatableSelect
        options={searchState.options}
        isLoading={searchState.isLoading}
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
      <ButtonWithIcon
        label="Search"
        icon="search"
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={onSearchHandler}
        disabled={value.current === ""}
        iconClassName={classes.icon}
      />
      <ConcurrencyInput />
      <LoadPromise />
    </>
  );
};

export default React.memo(Search);
