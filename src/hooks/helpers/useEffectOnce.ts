import { useEffect, useState } from "react";

export const useEffectOnce = (
  callback: () => void | (() => void),
  deps?: ReadonlyArray<unknown>,
) => {
  const [ready, setReady] = useState(false);
  const depsArray = deps ?? [];
  useEffect(() => {
    if (!ready) {
      setReady(true);
      return;
    }
    return callback();
  }, [ready, ...depsArray]); // eslint-disable-line react-hooks/exhaustive-deps
};
