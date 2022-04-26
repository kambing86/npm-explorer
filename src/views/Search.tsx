import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  TextField,
} from "@mui/material";
import ButtonWithIcon from "components/ButtonWithIcon";
import ConcurrencyInput from "components/ConcurrencyInput";
import ReactVersion from "components/ReactVersion";
import useStateWithRef from "hooks/helpers/useStateWithRef";
import useSearch from "hooks/useSearch";
import { KeyboardEvent, memo, useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { titleActions } from "store/slices/title.slice";

const Search = () => {
  const navigate = useNavigate();

  const {
    searchState,
    setSearchString,
    isMenuOpen,
    setIsMenuOpen,
    searchHistory,
    setSearchHistory,
  } = useSearch();
  const [searchValue, setSearchValue] = useStateWithRef(searchHistory);

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
        setSearchValue("");
      } else if (typeof option === "string") {
        setSearchValue(option);
      } else {
        setSearchValue(option.value);
      }
    },
    [setSearchValue],
  );
  const onSearchHandler = useCallback(() => {
    const val = searchValue.current;
    setSearchHistory(val);
    navigate(`/${encodeURIComponent(val)}`);
  }, [setSearchHistory, searchValue, navigate]);
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

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(titleActions.setTitle("Dependency Explorer"));
  }, [dispatch]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexFlow: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ flexGrow: 1 }} />
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
      <ButtonWithIcon
        label="Search"
        icon="search"
        variant="contained"
        color="primary"
        onClick={onSearchHandler}
        disabled={searchValue.current === ""}
      />
      <ConcurrencyInput />
      <ReactVersion />
    </Box>
  );
};

export default memo(Search);
