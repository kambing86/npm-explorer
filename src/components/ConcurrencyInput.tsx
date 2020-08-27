import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_CONCURRENCY } from "store/actions";
import { getConcurrencyCount } from "store/selectors/concurrency";

const useStyles = makeStyles({
  inputLabel: {
    position: "static",
  },
  input: {
    textAlign: "center",
  },
});

const ConcurrencyInput = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const concurrency = useSelector(getConcurrencyCount);
  const onChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(SET_CONCURRENCY(Number(event.target.value)));
    },
    [dispatch],
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

export default React.memo(ConcurrencyInput);
