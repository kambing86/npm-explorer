import { makeStyles, FormControl, Input, InputLabel } from "@material-ui/core";
import { PositionProperty, TextAlignProperty } from "csstype";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_CONCURRENCY } from "../state/actions";
import { getConcurrencyCount } from "../state/selectors/concurrency";

const useStyles = makeStyles({
  inputLabel: {
    position: "static" as PositionProperty,
  },
  input: {
    textAlign: "center" as TextAlignProperty,
  },
});

const ConcurrencyInput: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const concurrency = useSelector(getConcurrencyCount);
  const onChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(SET_CONCURRENCY(Number(event.target.value)));
    },
    [dispatch]
  );
  return (
    <FormControl>
      <InputLabel classes={{ root: classes.inputLabel }}>
        Concurrency
      </InputLabel>
      <Input
        classes={{ input: classes.input }}
        value={concurrency}
        onChange={onChangeHandler}
        type="number"
        inputProps={{ min: 1, max: 10 }}
      />
    </FormControl>
  );
};

export default ConcurrencyInput;
