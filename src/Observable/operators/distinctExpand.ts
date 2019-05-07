import { expand } from "rxjs/operators";
import { Observable, EMPTY, SchedulerLike } from "rxjs";

// custom operator that only expand if the value is distinct from previous values
export const distinctExpand = <T>(
  fn: (value: T) => Observable<T>,
  concurrent?: number,
  scheduler?: SchedulerLike
) => {
  const set = new Set<T>();
  return expand(
    (value: T) => {
      if (set.has(value)) {
        console.debug("duplicate", value);
        return EMPTY;
      }
      set.add(value);
      return fn(value);
    },
    concurrent,
    scheduler
  );
};
