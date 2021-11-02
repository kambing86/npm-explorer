import { PaletteMode, ThemeOptions, createTheme } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "store";
import { DARK, LIGHT, themeSlice } from "store/slices/theme";
import { useMediaQuery } from "./helpers/useMediaQuery";

// set it here https://material-ui.com/customization/default-theme/
const getTheme = (themeMode: PaletteMode | null) => {
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

export const useThemeType = () => {
  return useSelector((state: State) => state.theme.themeType);
};

// if user change the theme, it should save to localStorage and use it
// else will change the theme based on the machine dark mode
export const useAppTheme = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const initThemeType = useThemeType();
  const themeType = initThemeType ?? (prefersDarkMode ? DARK : LIGHT);

  const [theme, setTheme] = useState(getTheme(themeType));
  useEffect(() => {
    if (themeType === DARK) {
      setTheme(getTheme(DARK));
    } else {
      setTheme(getTheme(LIGHT));
    }
  }, [themeType]);

  const initThemeTypeRef = useRef(initThemeType);
  initThemeTypeRef.current = initThemeType;
  const prefersDarkModeRef = useRef(prefersDarkMode);
  prefersDarkModeRef.current = prefersDarkMode;
  const dispatch = useDispatch();
  const toggleDarkMode = useCallback(() => {
    if (initThemeTypeRef.current === null) {
      dispatch(
        themeSlice.actions.initThemeMode(
          prefersDarkModeRef.current ? DARK : LIGHT,
        ),
      );
    }
    dispatch(themeSlice.actions.toggleTheme());
  }, [dispatch]);
  return { theme, toggleDarkMode };
};
