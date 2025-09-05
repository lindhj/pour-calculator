import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.js"],
    globals: true,
  },
});
