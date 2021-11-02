import { useEffect, useState } from "react";

export const useMediaQuery = (mediaQuery: string) => {
  const [isMatches, setIsMatches] = useState(
    () => window.matchMedia && window.matchMedia(mediaQuery).matches,
  );

  useEffect(() => {
    if (window.matchMedia) {
      const matcher = window.matchMedia(mediaQuery);
      const onChange = ({ matches }: { matches: boolean }) =>
        setIsMatches(matches);
      matcher.addEventListener("change", onChange);
      return () => {
        matcher.removeEventListener("change", onChange);
      };
    }
  }, [mediaQuery]);

  return isMatches;
};
