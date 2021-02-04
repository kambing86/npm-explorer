import { Models } from "@rematch/core";
import { concurrency } from "./concurrency";
import { search } from "./search";

export interface RootModel extends Models<RootModel> {
  concurrency: typeof concurrency;
  search: typeof search;
}

export const models: RootModel = { concurrency, search };
