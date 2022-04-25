import { Palette, ThemeOptions, createTheme } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "store";
import { DARK, LIGHT, themeSlice } from "store/slices/theme.slice";
import { useMediaQuery } from "./helpers/useMediaQuery";

// set it here https://material-ui.com/customization/default-theme/
const getTheme = (themeMode: Palette["mode"] | null) => {
  const mode = themeMode === DARK ? DARK : LIGHT;
  const options: ThemeOptions =
    mode === DARK
      ? {
          palette: {
            mode,
            background: {
              default: "#121212",
            },
            primary: {
              contrastText: "rgba(0, 0, 0, 0.87)",
              dark: "rgb(100, 141, 174)",
              light: "rgb(166, 212, 250)",
              main: "#90caf9",
            },
            secondary: {
              contrastText: "rgba(0, 0, 0, 0.87)",
              dark: "rgb(170, 100, 123)",
              light: "rgb(246, 165, 192)",
              main: "#f48fb1",
            },
          },
        }
      : {
          palette: {
            mode,
            action: {
              hover: "rgba(0, 0, 0, 0.1)",
              hoverOpacity: 0.1,
              selected: "rgba(0, 0, 0, 0.2)",
              selectedOpacity: 0.2,
            },
          },
        };
  return createTheme(options);
};

// if user change the theme, it should save to localStorage and use it
// else will change the theme based on the machine dark mode
export const useAppTheme = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const themeMode = useSelector((state: State) => state.theme);
  const [theme, setTheme] = useState(getTheme(themeMode));
  const dispatch = useDispatch();
  const toggleDarkMode = useCallback(() => {
    dispatch(themeSlice.actions.toggleTheme());
  }, [dispatch]);
  // if localStorage has no saved theme type, then set using media query
  useEffect(() => {
    if (!prefersDarkMode || themeMode !== null) return;
    toggleDarkMode();
  }, [prefersDarkMode, themeMode, toggleDarkMode]);
  useEffect(() => {
    if (themeMode === DARK) {
      setTheme(getTheme(DARK));
    } else {
      setTheme(getTheme(LIGHT));
    }
  }, [themeMode]);
  return { theme, toggleDarkMode };
};
