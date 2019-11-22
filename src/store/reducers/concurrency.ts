import { SET_CONCURRENCY } from "store/actions";
import { Action } from "store/types";
import { getType } from "typesafe-actions";

type State = Readonly<{
  count: number;
}>;

const initialState: State = {
  count: 2,
};

export function concurrency(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case getType(SET_CONCURRENCY):
      return {
        ...state,
        count: action.payload,
      };
    default:
      return state;
  }
}
