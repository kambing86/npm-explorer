import { Observable } from "rxjs";

export const completeIfIdle = <T>(timeoutInMs: number) => (
  source: Observable<T>,
) => {
  return new Observable<T>((subscriber) => {
    let completed = false;
    let timeout = setTimeout(onTimeout, timeoutInMs);
    const subscription = source.subscribe(
      (v) => {
        if (completed) return;
        clearTimeout(timeout);
        timeout = setTimeout(onTimeout, timeoutInMs);
        subscriber.next(v);
      },
      (error) => {
        subscriber.error(error);
      },
      () => {
        completed = true;
        subscriber.complete();
      },
    );
    function onTimeout() {
      completed = true;
      subscriber.complete();
      subscription.unsubscribe();
    }
  });
};
