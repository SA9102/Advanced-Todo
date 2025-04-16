import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import theme from "./theme/customTheme.ts";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <App />
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>
);
