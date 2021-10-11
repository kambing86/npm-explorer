import { TextField } from "@mui/material";
import { ChangeEvent, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_CONCURRENCY } from "store/actions";
import { getConcurrencyCount } from "store/selectors/concurrency";

const ConcurrencyInput = () => {
  const dispatch = useDispatch();
  const concurrency = useSelector(getConcurrencyCount);
  const onChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(SET_CONCURRENCY(Number(event.target.value)));
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
