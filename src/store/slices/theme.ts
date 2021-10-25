import { PaletteMode } from "@mui/material";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const THEME_KEY = "theme";
export const LIGHT = "light";
export const DARK = "dark";

function getSavedType() {
  return localStorage.getItem(THEME_KEY) as PaletteMode | null;
}

type State = Readonly<{
  title: string;
  themeType: PaletteMode | null;
}>;

const initialState: State = { title: "", themeType: getSavedType() };

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    initThemeMode(state, action: PayloadAction<PaletteMode>) {
      const newVal = action.payload;
      localStorage.setItem(THEME_KEY, newVal);
      state.themeType = newVal;
    },
    toggleTheme(state) {
      const cur = state.themeType;
      const newVal = cur === DARK ? LIGHT : DARK;
      localStorage.setItem(THEME_KEY, newVal);
      state.themeType = newVal;
    },
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
  },
});

export default themeSlice.reducer;
