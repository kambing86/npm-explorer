import React from "react";
import { useConcurrency } from "./UseConcurrency";
import { FormControl, InputLabel, Input } from "@material-ui/core";

export default () => {
  const [state, dispatch] = useConcurrency();
  return (
    <FormControl>
      <InputLabel>Concurrency</InputLabel>
      <Input
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
