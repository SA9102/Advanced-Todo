import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Advanced-Todo",
  build: { outDir: "dist" },
  resolve: {
    alias: {
      "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs", // Tabler icons causes slow refresh, so this makes it faster.
    },
  },
});
