import React from "react";
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
  const [state, dispatch] = useGlobalState();
  const concurrency = getConcurrencyCount(state);
  return (
    <FormControl>
      <InputLabel classes={{ root: classes.inputLabel }}>
        Concurrency
      </InputLabel>
      <Input
        classes={{ input: classes.input }}
        value={concurrency}
        onChange={event =>
          dispatch(SET_CONCURRENCY(Number(event.target.value)))
        }
        type="number"
        inputProps={{ min: 1, max: 10 }}
      />
    </FormControl>
  );
};

export default withStyles(styles)(ConcurrencyInput);
