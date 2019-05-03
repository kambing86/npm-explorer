import React from "react";
import { useConcurrency } from "./UseConcurrency";
import { FormControl, InputLabel, Input, withStyles } from "@material-ui/core";
import { PositionProperty, TextAlignProperty } from "csstype";

const styles = () => ({
  inputLabel: {
    position: "static" as PositionProperty
  },
  input: {
    textAlign: "center" as TextAlignProperty
  }
});

interface IConcurrencyInputProps {
  classes: { [key: string]: string };
}

const ConcurrencyInput = (props: IConcurrencyInputProps) => {
  const [state, dispatch] = useConcurrency();
  const { classes } = props;
  return (
    <FormControl>
      <InputLabel classes={{ root: classes.inputLabel }}>
        Concurrency
      </InputLabel>
      <Input
        classes={{ input: classes.input }}
        value={state.concurrency}
        onChange={event =>
          dispatch({ type: "set", payload: Number(event.target.value) })
        }
        type="number"
        inputProps={{ min: 1, max: 10 }}
      />
    </FormControl>
  );
};

export default withStyles(styles)(ConcurrencyInput);
