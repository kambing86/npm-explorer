import React from "react";
import { useConcurrency } from "../hooks";
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

interface IProps {
  classes: { [key: string]: string };
}

const ConcurrencyInput: React.FC<IProps> = ({ classes }) => {
  const [concurrency, setConcurrency] = useConcurrency();
  return (
    <FormControl>
      <InputLabel classes={{ root: classes.inputLabel }}>
        Concurrency
      </InputLabel>
      <Input
        classes={{ input: classes.input }}
        value={concurrency}
        onChange={event => setConcurrency(Number(event.target.value))}
        type="number"
        inputProps={{ min: 1, max: 10 }}
      />
    </FormControl>
  );
};

export default withStyles(styles)(ConcurrencyInput);
