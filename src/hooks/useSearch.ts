import { QueryResult, getQueryObservable$ } from "observables/queryPackage";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_SEARCH_HISTORY } from "store/actions";
import { getSearchHistory } from "store/selectors/search";
import useObservable from "./helpers/useObservable";

interface SearchState {
  readonly isLoading: boolean;
  readonly options: OptionType[];
  readonly searchString: string;
}

function getInitialState(): SearchState {
  return {
    isLoading: false,
    options: [],
    searchString: "",
  };
}

export default function useSearch() {
  const [searchState, setSearchState] = useState(getInitialState);
  const isMenuOpen = useRef(false);
  const searchHistory = useSelector(getSearchHistory);
  const [queryState, setQuery] = useObservable<QueryResult>();
  const dispatch = useDispatch();

  // componentDidMount effect
  // should not trigger useEffect when searchHistory changed
  useEffect(() => {
    if (searchHistory !== "") {
      setSearchState((prevState) => ({
        ...prevState,
        isLoading: true,
        options: [],
        searchString: searchHistory,
      }));
      isMenuOpen.current = true;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setSearchHistory = useCallback(
    (searchString: string) => {
      dispatch(SET_SEARCH_HISTORY(searchString));
    },
    [dispatch],
  );

  // check for searchString and do query
  useEffect(() => {
    setQuery(getQueryObservable$(searchState.searchString));
  }, [setQuery, searchState.searchString]);

  // monitor query and set search state when query is done
  useEffect(() => {
    const { data, completed } = queryState;
    if (completed) {
      if (data) {
        setSearchState((prevState) => {
          const allOptions: OptionType[] = data.map((packageInfo) => ({
            label: packageInfo.name,
            value: packageInfo.name,
          }));
          const { searchString } = prevState;
          const sortedOption = [
            ...allOptions.filter((option) => option.value === searchString),
            ...allOptions.filter((option) => option.value !== searchString),
          ];
          return {
            ...prevState,
            isLoading: false,
            options: sortedOption,
          };
        });
      } else {
        setSearchState((prevState) => ({
          ...prevState,
          isLoading: false,
          options: [],
        }));
      }
    }
  }, [queryState]);

  // callbacks for Search component
  const setSearchString = useCallback((value: string) => {
    setSearchState((prevState) => ({
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
    searchHistory,
    setSearchHistory,
  };
}
