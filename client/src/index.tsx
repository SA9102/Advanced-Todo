import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import theme from "./theme/customTheme.ts";
import { BrowserRouter } from "react-router";
import "@mantine/dates/styles.css";
import { AuthProvider } from "./context/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <MantineProvider theme={theme}>
          <App />
        </MantineProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
