import { QueryResult, getQueryObservable$ } from "observables/queryPackage";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { searchSlice } from "store/slices/search.slice";
import useObservable from "./helpers/useObservable";

interface SearchState {
  readonly isLoading: boolean;
  readonly options: OptionType[];
  readonly searchString: string;
}

function getInitialState(searchHistory: string): SearchState {
  if (searchHistory !== "") {
    return { isLoading: true, options: [], searchString: searchHistory };
  }
  return {
    isLoading: false,
    options: [],
    searchString: "",
  };
}

export default function useSearch() {
  const searchHistory = useSelector((state: RootState) => state.search.history);
  const [searchState, setSearchState] = useState(() =>
    getInitialState(searchHistory),
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [queryState, setQuery] = useObservable<QueryResult>();
  const dispatch = useDispatch();

  // componentDidMount effect
  // should not trigger useEffect when searchHistory changed
  const searchHistoryRef = useRef(searchHistory);
  useEffect(() => {
    const searchString = searchHistoryRef.current;
    if (searchString !== "") {
      setSearchState((prevState) => ({
        ...prevState,
        isLoading: true,
        options: [],
        searchString,
      }));
    }
  }, []);

  // callbacks for Search component
  const setSearchString = useCallback((value: string) => {
    setSearchState((prevState) => ({
      ...prevState,
      isLoading: true,
      options: [],
      searchString: value,
    }));
  }, []);

  // check for searchString and do query
  // triggered by componentDidMount or setSearchString
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

  const setSearchHistory = useCallback(
    (searchString: string) => {
      dispatch(searchSlice.actions.setSearchHistory(searchString));
    },
    [dispatch],
  );

  return {
    searchState,
    setSearchString,
    isMenuOpen,
    setIsMenuOpen,
    searchHistory,
    setSearchHistory,
  };
}
