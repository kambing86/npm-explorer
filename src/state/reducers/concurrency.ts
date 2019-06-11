import { ActionType, getType } from "typesafe-actions";
import * as actions from "../actions";

type State = Readonly<{
  count: number;
}>;

const initialState: State = {
  count: 2
};

export default function(
  state: State = initialState,
  action: ActionType<typeof actions>
): State {
  switch (action.type) {
    case getType(actions.SET_CONCURRENCY):
      return {
        ...state,
        count: Number(action.payload)
      };
    default:
      return state;
  }
}
