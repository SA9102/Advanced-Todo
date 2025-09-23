import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// import theme from "./theme/customTheme.ts";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { blue, lightBlue, red, teal } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: teal,
    secondary: lightBlue,
    background: {
      default: "#192422",
      paper: "#212e2c",
      // 181C14
      // 3C3D37
      // 697565
      // ECDFCC
    },
    text: {
      primary: "#ffffff",
      secondary: "#aaaaaa",
    },
  },
  typography: {
    fontFamily: "Nunito Sans",
  },
  shape: {
    borderRadius: "0.5rem",
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </CssBaseline>
    </ThemeProvider>
  </StrictMode>
);
