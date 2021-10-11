import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useStateWithRef from "hooks/helpers/useStateWithRef";
import useSearch from "hooks/useSearch";
import { KeyboardEvent, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { InputActionMeta, SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import ButtonWithIcon from "./ButtonWithIcon";
import ConcurrencyInput from "./ConcurrencyInput";
import ReactVersion from "./ReactVersion";

const useStyles = makeStyles<Theme>((theme) => ({
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

const Search = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  const {
    searchState,
    setSearchString,
    isMenuOpen,
    searchHistory,
    setSearchHistory,
  } = useSearch();
  const [searchValue, setSearchValue] = useStateWithRef("");

  const onInputChangeHandler = useCallback(
    (inputValue: string, event: InputActionMeta) => {
      if (event.action === "input-change") {
        setSearchString(inputValue);
      }
    },
    [setSearchString],
  );
  const onChangeHandler = useCallback(
    (input: SingleValue<OptionType>) => {
      if (input) {
        setSearchValue(input.value);
      } else {
        setSearchValue("");
      }
    },
    [setSearchValue],
  );
  const onSearchHandler = useCallback(() => {
    const val = searchValue.current;
    setSearchHistory(val);
    navigate(`/${encodeURIComponent(val)}`);
  }, [setSearchHistory, searchValue, navigate]);
  const onKeyDownHandler = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter" && !isMenuOpen.current) {
        onSearchHandler();
        event.preventDefault();
      }
    },
    [isMenuOpen, onSearchHandler],
  );
  const onMenuOpenHandler = useCallback(() => {
    isMenuOpen.current = true;
  }, [isMenuOpen]);
  const onMenuCloseHandler = useCallback(() => {
    isMenuOpen.current = false;
  }, [isMenuOpen]);
  return (
    <>
      <h1 className="flex-grow-1">Dependency Explorer</h1>
      <CreatableSelect
        isMulti={false}
        styles={{ menu: (base) => ({ ...base, zIndex: 10 }) }}
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
        disabled={searchValue.current === ""}
        iconClassName={classes.icon}
      />
      <ConcurrencyInput />
      <ReactVersion />
    </>
  );
};

export default memo(Search);
