import { TextField } from "@mui/material";
import { ChangeEvent, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "store";
import { concurrencySlice } from "store/slices/concurrency";

const ConcurrencyInput = () => {
  const dispatch = useDispatch();
  const concurrency = useSelector((state: State) => state.concurrency.count);
  const onChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        concurrencySlice.actions.setConcurrency(Number(event.target.value)),
      );
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
