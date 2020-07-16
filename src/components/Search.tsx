import { makeStyles } from "@material-ui/core/styles";
import useStateWithRef from "hooks/helpers/useStateWithRef";
import useSearch from "hooks/useSearch";
import React, { useCallback } from "react";
import { RouteChildrenProps } from "react-router-dom";
import { InputActionMeta, ValueType } from "react-select";
import CreatableSelect from "react-select/creatable";
import { isArray } from "utils/typescriptHelpers";
import ButtonWithIcon from "./ButtonWithIcon";
import ConcurrencyInput from "./ConcurrencyInput";
import ReactVersion from "./ReactVersion";

const useStyles = makeStyles((theme) => ({
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

interface SearchProps {
  onClickSearch?: (value: string) => void;
}

const Search: React.FC<SearchProps> = React.memo(({ onClickSearch }) => {
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
    (input: ValueType<OptionType>) => {
      if (input) {
        if (isArray(input)) {
          setSearchValue(input[0].value);
        } else {
          setSearchValue(input.value);
        }
      } else {
        setSearchValue("");
      }
    },
    [setSearchValue],
  );
  const onSearchHandler = useCallback(() => {
    setSearchHistory(searchValue.current);
    if (onClickSearch) {
      onClickSearch(searchValue.current);
    }
  }, [setSearchHistory, onClickSearch, searchValue]);
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
    isMenuOpen.current = true;
  }, [isMenuOpen]);
  const onMenuCloseHandler = useCallback(() => {
    isMenuOpen.current = false;
  }, [isMenuOpen]);
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
        disabled={searchValue.current === ""}
        iconClassName={classes.icon}
      />
      <ConcurrencyInput />
      <ReactVersion />
    </>
  );
});

export default (props: RouteChildrenProps) => {
  const { history } = props;
  const clickSearchHandler = useCallback(
    (value) => {
      if (value) {
        history.push(`/${encodeURIComponent(value)}`);
      }
    },
    [history],
  );
  return (
    <>
      <h1 className="flex-grow-1">Dependency Explorer</h1>
      <Search onClickSearch={clickSearchHandler} />
    </>
  );
};
