import { concurrency } from "./concurrency";
import { search } from "./search";

export function getReducersMap() {
  return {
    concurrency,
    search,
  };
}
