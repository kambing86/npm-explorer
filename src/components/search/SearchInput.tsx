import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import {
  KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "store";
import { searchActions } from "store/slices/search.slice";
import useSearch from "./useSearch";

const SearchInput = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { searchState, setSearchString, searchHistory } = useSearch();

  const packageString = useSelector(
    (state: RootState) => state.search.packageString,
  );

  // auto focus input when search history is not empty
  const inputRef = useRef<HTMLInputElement>(null);
  const searchHistoryRef = useRef(searchHistory);
  useEffect(() => {
    if (searchHistoryRef.current !== "") {
      inputRef.current?.focus();
    }
  }, []);

  const onInputChangeHandler = useCallback(
    (_event: unknown, value: string, reason: string) => {
      if (reason === "input") {
        setSearchString(value);
      }
    },
    [setSearchString],
  );

  const onChangeHandler = useCallback(
    (_event: unknown, option: string | OptionType | null) => {
      if (option == null) {
        dispatch(searchActions.setPackageString(""));
      } else if (typeof option === "string") {
        dispatch(searchActions.setPackageString(option));
      } else {
        dispatch(searchActions.setPackageString(option.value));
      }
    },
    [dispatch],
  );
  const onSearchHandler = useCallback(() => {
    dispatch(searchActions.setHistory(packageString));
    navigate(`/package/${encodeURIComponent(packageString)}`);
  }, [dispatch, packageString, navigate]);
  const isMenuOpenRef = useRef(isMenuOpen);
  isMenuOpenRef.current = isMenuOpen;
  const onKeyDownHandler = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter" && !isMenuOpenRef.current) {
        onSearchHandler();
        event.preventDefault();
      }
    },
    [onSearchHandler],
  );
  const onMenuOpenHandler = useCallback(() => {
    setIsMenuOpen(true);
  }, [setIsMenuOpen]);
  const onMenuCloseHandler = useCallback(() => {
    setIsMenuOpen(false);
  }, [setIsMenuOpen]);

  const filterOptions = useCallback((options: OptionType[]) => options, []);
  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField inputRef={inputRef} {...params} label="Search package" />
    ),
    [],
  );

  return (
    <>
      <Box color="black" sx={{ width: "100%" }}>
        <Autocomplete
          freeSolo
          options={searchState.options}
          loading={searchState.isLoading}
          onInputChange={onInputChangeHandler}
          onChange={onChangeHandler}
          onKeyDown={onKeyDownHandler}
          onOpen={onMenuOpenHandler}
          onClose={onMenuCloseHandler}
          open={isMenuOpen}
          defaultValue={searchHistory}
          filterOptions={filterOptions}
          renderInput={renderInput}
        />
      </Box>
      <Button
        sx={{ marginTop: 1 }}
        variant="contained"
        color="primary"
        onClick={onSearchHandler}
        disabled={packageString === ""}
        startIcon={<Icon>search</Icon>}
      >
        Search
      </Button>
    </>
  );
};

export default memo(SearchInput);
