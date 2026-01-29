import TextField from "@mui/material/TextField";
import { memo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "store";
import { searchActions } from "store/slices/search.slice";

const FilterInput = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state: RootState) => state.search.filter);
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(searchActions.setFilter(event.target.value));
    },
    [dispatch],
  );
  useEffect(() => {
    return () => {
      dispatch(searchActions.setFilter(""));
    };
  }, [dispatch]);
  return (
    <TextField
      margin="normal"
      fullWidth={true}
      label="Filter"
      value={filter}
      onChange={onChange}
      inputProps={{
        style: { textAlign: "center" },
      }}
    />
  );
};

export default memo(FilterInput);
