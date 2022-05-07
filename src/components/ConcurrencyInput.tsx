import TextField from "@mui/material/TextField";
import { ChangeEvent, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { searchActions } from "store/slices/search.slice";

const ConcurrencyInput = () => {
  const dispatch = useDispatch();
  const concurrency = useSelector(
    (state: RootState) => state.search.concurrency,
  );
  const onChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(searchActions.setConcurrency(Number(event.target.value)));
    },
    [dispatch],
  );
  return (
    <TextField
      margin="normal"
      sx={{ minWidth: 100 }}
      label="Concurrency"
      type="number"
      value={concurrency}
      onChange={onChangeHandler}
      inputProps={{ min: 1, max: 10, style: { textAlign: "center" } }}
    />
  );
};

export default memo(ConcurrencyInput);
