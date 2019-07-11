import { ActionType } from "typesafe-actions";
import { getInitialState } from ".";
import * as actions from "./actions";

export type GlobalState = ReturnType<typeof getInitialState>;
export type Action = ActionType<typeof actions>;
