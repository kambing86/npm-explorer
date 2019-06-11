import React, { useCallback } from "react";
import { FormControl, InputLabel, Input, withStyles } from "@material-ui/core";
import { PositionProperty, TextAlignProperty } from "csstype";
import { useGlobalState } from "../hooks";
import { SET_CONCURRENCY } from "../state/actions";
import { getConcurrencyCount } from "../state/selectors/concurrency";

const styles = () => ({
  inputLabel: {
    position: "static" as PositionProperty
  },
  input: {
    textAlign: "center" as TextAlignProperty
  }
});

interface IProps {
  classes: { [key: string]: string };
}

const ConcurrencyInput: React.FC<IProps> = ({ classes }) => {
  const [globalState, dispatch] = useGlobalState();
  const concurrency = getConcurrencyCount(globalState);
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

export default withStyles(styles)(ConcurrencyInput);
