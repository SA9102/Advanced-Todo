import { createTheme, virtualColor } from "@mantine/core";

const theme = createTheme({
  primaryColor: "primary",

  defaultRadius: "sm",
  cursorType: "pointer",
  colors: {
    primary: virtualColor({
      name: "primary",
      dark: "cyan",
      light: "red",
    }),
  },
});

export default theme;
